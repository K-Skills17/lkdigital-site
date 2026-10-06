// The blog admin end to end: real route handlers + real SQL on PGlite.
import { readFileSync } from "fs";
import path from "path";
import { PGlite } from "@electric-sql/pglite";
import { NextRequest } from "next/server";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { query, setQueryFnForTests } from "../db";
import { getPublishedPost, listPublishedPosts } from "./store";
// Plain ESM helpers shared with the node scripts in scripts/.
import { seedBlogOnce, splitStatements } from "../../../db/sql-utils.mjs";

const { revalidatePath, submitToIndexNow, complete } = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  submitToIndexNow: vi.fn(async () => ({ ok: true, status: 200, submitted: 1 })),
  complete: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/lib/indexnow", () => ({ submitToIndexNow }));
vi.mock("@/lib/backbone/llm", () => ({ complete }));

import * as listRoute from "@/app/api/painel/blog/route";
import * as postRoute from "@/app/api/painel/blog/[id]/route";
import * as statusRoute from "@/app/api/painel/blog/[id]/status/route";
import * as revisionsRoute from "@/app/api/painel/blog/[id]/revisions/route";
import * as aiRoute from "@/app/api/painel/blog/ai-draft/route";
import { middleware } from "@/middleware";

let pg: PGlite;
const SEED = JSON.parse(readFileSync(path.join(__dirname, "../../../db/seed/blog-posts.json"), "utf8"));

const req = (method: string, body?: unknown, user = "ana") =>
  new Request("http://localhost/api/painel/blog", {
    method,
    headers: { "content-type": "application/json", "x-painel-user": user },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
const json = async (res: Response) => ({ status: res.status, body: await res.json() });
const ctx = (id: string) => ({ params: { id } });

const words = (n: number) => "palavra ".repeat(n).trim();
const draftBody = {
  title: "Como reduzir faltas no consultório",
  excerpt: "Guia prático.",
  content: `<h2>Um</h2><p>${words(150)}</p><h2>Dois</h2><p>${words(150)}</p><h2>Três</h2><p>${words(100)} faltas no consultório</p>`,
  keywords: ["faltas no consultório"],
  category: "Gestão",
};

beforeAll(async () => {
  pg = new PGlite();
  for (const stmt of splitStatements(readFileSync(path.join(__dirname, "../../../db/schema.sql"), "utf8"))) await pg.exec(stmt);
  setQueryFnForTests(async (text, params = []) => (await pg.query(text, params)).rows as Record<string, unknown>[]);
  await seedBlogOnce((t: string, p: unknown[]) => query(t, p), SEED);
});

beforeEach(() => {
  revalidatePath.mockClear();
  submitToIndexNow.mockClear();
  vi.stubEnv("INDEXNOW_KEY", "k");
});
afterEach(() => vi.unstubAllEnvs());

describe("seeded posts", () => {
  it("are all live and readable", async () => {
    expect(await listPublishedPosts()).toHaveLength(75);
    const p = await getPublishedPost("regras-cfo-publicidade");
    expect(p?.content).toMatch(/^<h2>/);
    expect(p?.author.name).toBe("Stephen Domingos Komando");
    // Listings skip the body.
    expect((await listPublishedPosts(1))[0].content).toBe("");
  });
});

describe("editorial flow", () => {
  let id: string;
  let slug: string;

  it("creates a draft that visitors can't see", async () => {
    const { status, body } = await json(await listRoute.POST(req("POST", draftBody)));
    expect(status).toBe(201);
    ({ id, slug } = body.post);
    expect(slug).toBe("como-reduzir-faltas-no-consultorio");
    expect(body.post).toMatchObject({ status: "draft", createdBy: "ana", readingTime: 3 }); // ~407 words at 200/min
    expect(await getPublishedPost(slug)).toBeNull();
  });

  it("refuses a duplicate slug", async () => {
    const { status, body } = await json(await listRoute.POST(req("POST", draftBody)));
    expect(status).toBe(422);
    expect(body.error).toMatch(/slug/);
  });

  it("blocks publishing while the checklist has errors", async () => {
    await postRoute.PUT(req("PUT", { ...draftBody, slug, excerpt: "" }), ctx(id));
    const { status, body } = await json(await statusRoute.POST(req("POST", { action: "publish" }), ctx(id)));
    expect(status).toBe(422);
    expect(body.error).toMatch(/resumo/i);
    expect(await getPublishedPost(slug)).toBeNull();
  });

  it("publishes, refreshes the cached pages and pings IndexNow", async () => {
    await postRoute.PUT(req("PUT", { ...draftBody, slug, seoDescription: "Descrição." }, "bruno"), ctx(id));
    const { status, body } = await json(await statusRoute.POST(req("POST", { action: "publish" }, "bruno"), ctx(id)));
    expect(status).toBe(200);
    expect(body.post).toMatchObject({ status: "published", updatedBy: "bruno" });
    expect(await getPublishedPost(slug)).not.toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith(`/blog/${slug}`);
    expect(revalidatePath).toHaveBeenCalledWith("/blog");
    expect(submitToIndexNow).toHaveBeenCalledWith([`https://lkdigital.odo.br/blog/${slug}`]);
  });

  it("keeps a live post's URL fixed and applies the checklist to live edits", async () => {
    const renamed = await json(await postRoute.PUT(req("PUT", { ...draftBody, slug: "outro-slug" }), ctx(id)));
    expect(renamed.status).toBe(422);
    const broken = await json(await postRoute.PUT(req("PUT", { ...draftBody, slug, excerpt: "" }), ctx(id)));
    expect(broken.status).toBe(422);
    expect((await getPublishedPost(slug))?.excerpt).toBe("Guia prático.");
  });

  it("keeps every saved version and restores one", async () => {
    await postRoute.PUT(req("PUT", { ...draftBody, slug, excerpt: "Versão nova." }), ctx(id));
    const { body } = await json(await revisionsRoute.GET(req("GET"), ctx(id)));
    expect(body.revisions.length).toBeGreaterThanOrEqual(3);
    const oldest = body.revisions[body.revisions.length - 1];
    const restored = await json(await revisionsRoute.POST(req("POST", { revisionId: body.revisions[0].id }), ctx(id)));
    expect(restored.status).toBe(200);
    expect(restored.body.post.excerpt).toBe("Guia prático.");
    expect(oldest.savedBy).toBe("ana");
  });

  it("can't delete a live post; unpublish takes it off the site, then delete works", async () => {
    expect((await postRoute.DELETE(req("DELETE"), ctx(id))).status).toBe(422);
    await statusRoute.POST(req("POST", { action: "unpublish" }), ctx(id));
    expect(await getPublishedPost(slug)).toBeNull();
    expect((await postRoute.DELETE(req("DELETE"), ctx(id))).status).toBe(200);
    const rev = await query("select count(*)::int as n from blog_post_revisions where post_id = $1", [id]);
    expect(rev[0].n).toBe(0);
  });

  it("schedules: invisible until its time, then live without anyone pressing a button", async () => {
    const created = await json(await listRoute.POST(req("POST", { ...draftBody, title: "Artigo agendado", slug: "artigo-agendado", seoDescription: "x" })));
    const sid = created.body.post.id;
    const at = new Date(Date.now() + 3600_000).toISOString();
    const res = await json(await statusRoute.POST(req("POST", { action: "publish", at }), ctx(sid)));
    expect(res.body.post.publishedAt).toBe(at);
    expect(await getPublishedPost("artigo-agendado")).toBeNull();
    expect(submitToIndexNow).not.toHaveBeenCalled(); // not live yet
    await query("update blog_posts set published_at = now() - interval '1 minute' where id = $1", [sid]);
    expect(await getPublishedPost("artigo-agendado")).not.toBeNull();
  });
});

describe("AI draft (human in the loop)", () => {
  it("creates a draft flagged as AI that can't be published until an admin reviews it", async () => {
    complete.mockResolvedValue({
      text: JSON.stringify({
        title: "Faltas de pacientes: como reduzir",
        seoTitle: "Faltas de pacientes: como reduzir",
        seoDescription: "d".repeat(150),
        excerpt: "Resumo.",
        content: `<h2>A</h2><p>${words(200)}</p><h2>B</h2><p>${words(200)}</p><script>alert(1)</script>`,
        tags: ["gestão"],
        keywords: ["faltas de pacientes"],
        tldr: "TL;DR",
        faqItems: [{ question: "Q?", answer: "A." }],
      }),
      attempts: [{ provider: "anthropic", model: "claude-sonnet-4-6", ok: true, inputTokens: 1, outputTokens: 2, latencyMs: 3, error: null }],
    });
    const { status, body } = await json(await aiRoute.POST(req("POST", { topic: "Faltas", keyword: "faltas de pacientes", category: "Gestão" })));
    expect(status).toBe(201);
    const post = body.post;
    expect(post).toMatchObject({ status: "draft", aiGenerated: true, aiModel: "claude-sonnet-4-6", reviewedBy: null });
    expect(post.content).not.toMatch(/script/);
    expect(complete.mock.calls[0][0].prompt).toMatch(/faltas de pacientes/);

    const blocked = await json(await statusRoute.POST(req("POST", { action: "publish" }), ctx(post.id)));
    expect(blocked.status).toBe(422);
    expect(blocked.body.error).toMatch(/Revisei/);

    const reviewed = await json(await statusRoute.POST(req("POST", { action: "review" }, "carla"), ctx(post.id)));
    expect(reviewed.body.post.reviewedBy).toBe("carla");
    expect((await statusRoute.POST(req("POST", { action: "publish" }), ctx(post.id))).status).toBe(200);

    const logged = await query("select source, model from ai_calls where source = 'blog-draft'");
    expect(logged).toHaveLength(1);
  });

  it("gives a clear error when no AI key is configured", async () => {
    complete.mockResolvedValue({ text: null, attempts: [] });
    const { status, body } = await json(await aiRoute.POST(req("POST", { topic: "x", keyword: "y" })));
    expect(status).toBe(422);
    expect(body.error).toMatch(/ANTHROPIC_API_KEY ou OPENAI_API_KEY/);
  });
});

describe("middleware", () => {
  const basic = (u: string, p: string) => "Basic " + Buffer.from(`${u}:${p}`).toString("base64");
  const mreq = (url: string, init: { method?: string; headers?: Record<string, string> } = {}) =>
    new NextRequest(url, { method: init.method ?? "GET", headers: { host: "localhost:3000", ...init.headers } });

  it("requires a login and passes the admin's name to the app", async () => {
    vi.stubEnv("PAINEL_USERS", "ana:s1,bruno:s2");
    expect(middleware(mreq("http://localhost:3000/painel/blog")).status).toBe(401);
    const ok = middleware(mreq("http://localhost:3000/api/painel/blog", { headers: { authorization: basic("bruno", "s2"), "x-painel-user": "forjado" } }));
    expect(ok.status).toBe(200);
    expect(ok.headers.get("x-middleware-request-x-painel-user")).toBe("bruno");
  });

  it("rejects cross-site writes (CSRF) but allows same-origin ones", async () => {
    vi.stubEnv("PAINEL_USERS", "ana:s1");
    const auth = { authorization: basic("ana", "s1") };
    expect(middleware(mreq("http://localhost:3000/api/painel/blog", { method: "POST", headers: { ...auth, origin: "https://evil.example" } })).status).toBe(403);
    expect(middleware(mreq("http://localhost:3000/api/painel/blog", { method: "POST", headers: { ...auth, origin: "http://localhost:3000" } })).status).toBe(200);
  });
});
