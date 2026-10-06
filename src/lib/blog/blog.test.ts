// Unit tests for the blog admin's building blocks.
import { readFileSync } from "fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { checkPost, hasBlockingIssues, readingTimeOf, slugify } from "./quality";
import { sanitizePostHtml } from "./sanitize";
import { cleanInput, ValidationError } from "./store";
import { buildSystemPrompt, buildUserPrompt, parseDraftJson } from "./ai-draft";
import { displayStatus, type PostInput } from "./types";
import { authenticate, parseUsers } from "../painel-auth";

const para = (n: number) => `<p>${"palavra ".repeat(n).trim()}.</p>`;

function goodPost(over: Partial<PostInput> = {}): PostInput {
  return cleanInput({
    title: "Como reduzir faltas no consultório",
    slug: "como-reduzir-faltas",
    excerpt: "Um guia prático para reduzir faltas.",
    content: `<h2>Um</h2>${para(150)}<h2>Dois</h2>${para(150)}<h2>Três</h2>${para(150)}<h2>Quatro</h2><p>faltas no consultório caem com confirmação.</p>`,
    seoTitle: "Como reduzir faltas no consultório",
    seoDescription: "x".repeat(150),
    category: "Gestão",
    keywords: ["faltas no consultório"],
    faqItems: [1, 2, 3].map((i) => ({ question: `P${i}?`, answer: `R${i}.` })),
    ...over,
  });
}

describe("quality checklist", () => {
  it("passes a well-formed post", () => {
    expect(checkPost(goodPost())).toEqual([]);
  });

  it("blocks invented sources, the banned stat, missing basics and <h1>", () => {
    const checks = checkPost(
      goodPost({ excerpt: "", content: `<h1>x</h1>${para(320)}<p>Segundo o Dental Growth Institute, 340% mais.</p>` })
    );
    // cleanInput demotes <h1>, so check the raw path separately below.
    const codes = checks.filter((c) => c.level === "error").map((c) => c.code);
    expect(codes).toEqual(expect.arrayContaining(["excerpt", "fake-source", "340"]));
    expect(hasBlockingIssues(checks)).toBe(true);
    const raw = { ...goodPost(), content: `<h1>Título</h1>${para(320)}` };
    expect(checkPost(raw).some((c) => c.code === "h1")).toBe(true);
  });

  it("only warns (doesn't block) on CFO phrases — articles that teach the rules quote them", () => {
    const checks = checkPost(goodPost({ content: goodPost().content + '<p>É proibido dizer "resultado garantido".</p>' }));
    expect(checks.find((c) => c.code === "cfo-promise")?.level).toBe("warning");
    expect(hasBlockingIssues(checks)).toBe(false);
  });

  it("flags AI phrases, keyword stuffing and SEO lengths as warnings", () => {
    const kw = "faltas no consultório";
    const checks = checkPost(
      goodPost({
        content: goodPost().content + `<p>Neste artigo, ${`${kw} `.repeat(5)}</p>`,
        seoTitle: "Um título SEO longo demais para caber no Google sem cortar",
        seoDescription: "curta",
      })
    );
    expect(checks.map((c) => c.code)).toEqual(expect.arrayContaining(["ai-phrases", "keyword-stuffing", "seo-title", "seo-description"]));
    expect(hasBlockingIssues(checks)).toBe(false);
  });

  it("slugify and reading time", () => {
    expect(slugify("Ação & Reação: Implantes em São Paulo!")).toBe("acao-reacao-implantes-em-sao-paulo");
    expect(readingTimeOf(para(450))).toBe(3);
    expect(readingTimeOf("")).toBe(1);
  });

  it("none of the 75 existing posts has a blocking issue (they stay editable while live)", () => {
    const posts = JSON.parse(readFileSync("db/seed/blog-posts.json", "utf8"));
    expect(posts).toHaveLength(75);
    const blocked = posts.filter((p: unknown) => hasBlockingIssues(checkPost(cleanInput(p))));
    expect(blocked.map((p: { slug: string }) => p.slug)).toEqual([]);
  });
});

describe("sanitizer", () => {
  it("removes scripts, event handlers and javascript: links", () => {
    const out = sanitizePostHtml(
      `<p onclick="x()">oi<script>alert(1)</script></p><a href="javascript:alert(1)">a</a><img src=x onerror=alert(1)><iframe src="//evil"></iframe>`
    );
    expect(out).not.toMatch(/script|onclick|onerror|javascript:|iframe|<img/i);
    expect(out).toContain("<p>oi</p>");
  });

  it("keeps the markup existing posts use", () => {
    const html = `<h2>T</h2><table><thead><tr><th>a</th></tr></thead><tbody><tr><td colspan="2">b</td></tr></tbody></table><blockquote><strong>c</strong></blockquote><div style="padding:8px"><a href="/contato" style="color:red">d</a></div>`;
    expect(sanitizePostHtml(html)).toBe(html);
  });

  it("demotes <h1> and secures external links", () => {
    expect(sanitizePostHtml("<h1>x</h1>")).toBe("<h2>x</h2>");
    expect(sanitizePostHtml('<a href="https://google.com">g</a>')).toBe('<a href="https://google.com" target="_blank" rel="noopener noreferrer">g</a>');
    expect(sanitizePostHtml('<a href="/blog/x">i</a>')).toBe('<a href="/blog/x">i</a>');
  });
});

describe("cleanInput", () => {
  it("requires a title and a valid slug, strips markup from plain fields", () => {
    expect(() => cleanInput({ title: "" })).toThrow(ValidationError);
    expect(() => cleanInput({ title: "x", slug: "Not Valid!" })).toThrow(/Slug/);
    const p = cleanInput({ title: "<b>Olá</b> mundo", excerpt: "<script>x</script>texto", tags: "a, b ,", faqItems: [{ question: "q" }] });
    expect(p.title).toBe("Olá mundo");
    expect(p.slug).toBe("ola-mundo");
    expect(p.excerpt).toBe("texto");
    expect(p.tags).toEqual(["a", "b"]);
    expect(p.faqItems).toEqual([]); // incomplete FAQ dropped
    expect(p.authorSlug).toBe("stephen-domingos-komando");
  });
});

describe("displayStatus", () => {
  it("derives scheduled from a future publish date", () => {
    const now = Date.parse("2026-10-06T12:00:00Z");
    expect(displayStatus({ status: "published", publishedAt: "2026-10-07T12:00:00Z" }, now)).toBe("scheduled");
    expect(displayStatus({ status: "published", publishedAt: "2026-10-05T12:00:00Z" }, now)).toBe("published");
    expect(displayStatus({ status: "draft", publishedAt: null }, now)).toBe("draft");
  });
});

describe("AI draft prompt + parsing", () => {
  it("carries the editorial rules and the editor's notes", () => {
    expect(buildSystemPrompt()).toMatch(/NEVER FABRICATE/);
    expect(buildSystemPrompt()).toMatch(/Dental Growth Institute/);
    const u = buildUserPrompt({ topic: "T", keyword: "k", category: "SEO", notes: "foque em X", framework: "Hormozi Value Equation", linkableSlugs: ["a-b"] });
    expect(u).toMatch(/foque em X/);
    expect(u).toMatch(/Equação de Valor/);
    expect(u).toMatch(/\/blog\/a-b/);
  });

  it("parses JSON wrapped in fences or stray text", () => {
    expect(parseDraftJson('Aqui está:\n```json\n{"title":"x"}\n```')).toEqual({ title: "x" });
    expect(() => parseDraftJson("sem json")).toThrow();
  });
});

describe("painel auth", () => {
  afterEach(() => vi.unstubAllEnvs());
  const basic = (u: string, p: string) => "Basic " + Buffer.from(`${u}:${p}`).toString("base64");

  it("supports one login per admin plus the legacy single login", () => {
    const env = { PAINEL_USERS: "ana:s3nha:com:dois-pontos, bruno:outra", PAINEL_USER: "lk", PAINEL_PASSWORD: "x" };
    expect(Array.from(parseUsers(env).keys())).toEqual(["ana", "bruno", "lk"]);
    expect(authenticate(basic("ana", "s3nha:com:dois-pontos"), env)).toBe("ana");
    expect(authenticate(basic("bruno", "outra"), env)).toBe("bruno");
    expect(authenticate(basic("lk", "x"), env)).toBe("lk");
    expect(authenticate(basic("ana", "errada"), env)).toBeNull();
    expect(authenticate(basic("ninguem", "x"), env)).toBeNull();
    expect(authenticate(null, env)).toBeNull();
    expect(authenticate("Basic !!!", env)).toBeNull();
  });

  it("is closed when nothing is configured", () => {
    expect(authenticate(basic("lk", ""), {})).toBeNull();
  });

  it("handles non-ASCII passwords", () => {
    const env = { PAINEL_USERS: "joão:ação" };
    const header = "Basic " + Buffer.from("joão:ação", "utf8").toString("base64");
    expect(authenticate(header, env)).toBe("joão");
  });
});
