// Runs the real SQL (db/schema.sql, rate limiter, backbone storage, dashboard,
// RAIO-X/Unicórnio routes, Supabase copy) against an in-memory Postgres (PGlite)
// standing in for Neon.

import { readFileSync } from "fs";
import path from "path";
import { PGlite } from "@electric-sql/pglite";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { query, setQueryFnForTests } from "./db";
import { hit, LIMITS } from "./ratelimit";
import { insertToolLead, logAiCall, updateToolLead } from "./backbone/store";
import { loadDashboard } from "./backbone/dashboard";
import { runLeadPipeline } from "./backbone/pipeline";
import { TOOL_ADAPTERS } from "./backbone/tools";
// Plain ESM helpers shared with the node scripts in scripts/.
import { buildInsert, splitStatements } from "../../db/sql-utils.mjs";

let pg: PGlite;

beforeAll(async () => {
  pg = new PGlite();
  const schema = readFileSync(path.join(__dirname, "../../db/schema.sql"), "utf8");
  for (const stmt of splitStatements(schema)) await pg.exec(stmt);
  // Applying twice must be a no-op (db:migrate runs on every deploy).
  for (const stmt of splitStatements(schema)) await pg.exec(stmt);
  setQueryFnForTests(async (text, params = []) => (await pg.query(text, params)).rows as Record<string, unknown>[]);
});

beforeEach(async () => {
  await pg.exec(
    "truncate rate_limits, ai_calls, tool_leads, raiox_leads, unicornio_leads, raio_x_scorecard_leads cascade"
  );
});

describe("rate limiter", () => {
  it("allows up to max per window, then blocks with a retry-after", async () => {
    const limit = { name: "t", max: 3, windowSec: 600 };
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await hit(limit, "1.2.3.4"));
    expect(results.map((r) => r.ok)).toEqual([true, true, true, false]);
    expect(results[3].retryAfter).toBeGreaterThan(0);
    expect(results[3].retryAfter).toBeLessThanOrEqual(600);
    // Other identities are counted separately, and keys are hashed.
    expect((await hit(limit, "5.6.7.8")).ok).toBe(true);
    const keys = await query<{ key: string }>("select key from rate_limits");
    expect(keys.every((k) => !k.key.includes("1.2.3.4"))).toBe(true);
  });

  it("fails open when the database errors", async () => {
    setQueryFnForTests(async () => {
      throw new Error("db down");
    });
    expect((await hit(LIMITS.formIp, "x")).ok).toBe(true);
    setQueryFnForTests(async (text, params = []) => (await pg.query(text, params)).rows as Record<string, unknown>[]);
  });
});

describe("backbone storage + dashboard", () => {
  it("stores a lead, updates delivery, logs AI usage and shows it all in the dashboard", async () => {
    const id = await insertToolLead({
      tool: "calculadora-agenda", name: "Ana", phone: "5511946851028", email: "a@x.com", clinic_name: "Sorriso",
      city: "SP", score: 23, headline: "Ganho +R$ 9.000", payload: { a: [1, 2] }, utm: { utm_source: "ig" }, report_url: null,
    });
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    await updateToolLead(id, { ai_plan: "1. faça X", whatsapp_sent: true, whatsapp_channel: "chatbot", capi_sent: true });
    await logAiCall({ source: "calculadora-agenda", lead_id: id, model: "claude-haiku-4-5-20251001", input_tokens: 500, output_tokens: 200, latency_ms: 1500, ok: true, error: null });
    await query(
      `insert into unicornio_leads (nome, clinica, especialidade, cidade, whatsapp, total, arquetipo, scores, alavancas_fracas, respostas)
       values ('Bia', 'C', 'orto', 'SP', '11999998888', 30, 'A', '{}', '{a,b}', '{1,2}')`
    );

    const [row] = await query<{ payload: unknown; utm: unknown; whatsapp_sent: boolean }>("select payload, utm, whatsapp_sent from tool_leads");
    expect(row).toMatchObject({ payload: { a: [1, 2] }, utm: { utm_source: "ig" }, whatsapp_sent: true });

    const d = await loadDashboard();
    expect(d.leads30d).toBe(2);
    expect(d.bySource.find((s) => s.source === "unicornio")?.count).toBe(1);
    expect(d.whatsappRate).toBe(1);
    expect(d.ai.calls).toBe(1);
    expect(d.recent[0].created_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe("pipeline per-number limit", () => {
  beforeEach(() => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("OPENAI_API_KEY", "");
    vi.stubEnv("LK_CHATBOT_URL", "https://bot.example");
    vi.stubEnv("LK_CHATBOT_API_KEY", "k");
    vi.stubEnv("LK_CHATBOT_TENANT_ID", "t");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("stops WhatsApp reports to the same number after the daily cap but still stores the lead", async () => {
    const body = {
      name: "Fabio", phone: "11946851028", clinicName: "Clin F", siteUrl: "https://x.com.br", score: 60,
      topIssues: [], checks: [], reportUrl: null,
    };
    const sent: boolean[] = [];
    for (let i = 0; i < LIMITS.leadPhoneDaily.max + 1; i++) {
      const r = await runLeadPipeline(TOOL_ADAPTERS["auditoria-site"], body);
      sent.push(!!r.body.messageSent);
    }
    expect(sent).toEqual([...Array(LIMITS.leadPhoneDaily.max).fill(true), false]);
    const rows = await query<{ whatsapp_error: string | null }>("select whatsapp_error from tool_leads order by created_at");
    expect(rows).toHaveLength(LIMITS.leadPhoneDaily.max + 1);
    expect(rows.filter((r) => r.whatsapp_error?.startsWith("rate limited")).length).toBe(1);
  });
});

describe("RAIO-X / Unicórnio routes on Neon", () => {
  const post = (body: unknown, ip = "9.9.9.9") =>
    new Request("http://x/api", { method: "POST", body: JSON.stringify(body), headers: { "x-real-ip": ip } });

  it("unicornio/lead inserts and rate-limits per IP", async () => {
    const { POST } = await import("@/app/api/unicornio/lead/route");
    const body = {
      timestamp: "now", nome: "Bia", clinica: "Clin", especialidade: "Orto", cidade: "SP", whatsapp: "(11) 99999-8888",
      email: "", total: 30, arquetipo: "A",
      scores: { posicionamento: 1, oferta: 2, modelo: 3, marca: 4, aquisicao: 5, experiencia: 6, sistemas: 0 },
      alavancas_fracas: ["oferta", "marca"], respostas: Array(14).fill(2), consent: true,
    };
    const statuses = [];
    for (let i = 0; i < LIMITS.formIp.max + 1; i++) statuses.push((await POST(post(body))).status);
    expect(statuses).toEqual([...Array(LIMITS.formIp.max).fill(200), 429]);
    const [row] = await query<{ respostas: number[]; alavancas_fracas: string[]; scores: Record<string, number> }>(
      "select respostas, alavancas_fracas, scores from unicornio_leads limit 1"
    );
    expect(row.respostas).toHaveLength(14);
    expect(row.alavancas_fracas).toEqual(["oferta", "marca"]);
    expect(row.scores.sistemas).toBe(0);
  });

  it("raiox/lead enforces duplicate + cohort waitlist; vagas counts spots", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
    const { POST } = await import("@/app/api/raiox/lead/route");
    const { GET } = await import("@/app/api/raiox/vagas/route");
    const body = {
      name: "Caio", clinic_name: "Clin", city: "SP", whatsapp: "11988887777", role: "Gerente", chairs: "2–3",
      procedures: ["Implantes", "HOF"], marketing_owner: "Agência", utm: { utm_source: "ig" },
    };
    expect((await POST(post(body, "1.1.1.1"))).status).toBe(200);
    expect((await POST(post(body, "1.1.1.2"))).status).toBe(409);
    expect(await (await GET()).json()).toEqual({ remaining: 49 });
    const [row] = await query<{ procedures: string[]; utm: unknown }>("select procedures, utm from raiox_leads");
    expect(row.procedures).toEqual(["Implantes", "HOF"]);
    expect(row.utm).toEqual({ utm_source: "ig" });
    vi.unstubAllGlobals();
  });

  it("raio-x/submit persists the scorecard lead", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
    const { POST } = await import("@/app/api/raio-x/submit/route");
    const { raioXConfig } = await import("@/lib/raio-x/config");
    const answers = Object.fromEntries(raioXConfig.questions.map((q) => [q.id, 1]));
    const res = await POST(post({ name: "Davi", clinic_name: "Clin D", whatsapp: "", email: "d@x.com", answers, consent: true }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toMatch(/^[0-9a-f-]{36}$/);
    const [row] = await query<{ answers: number[] }>("select answers from raio_x_scorecard_leads");
    expect(Array.isArray(row.answers)).toBe(true);
    vi.unstubAllGlobals();
  });
});

describe("Supabase → Neon copy", () => {
  it("inserts rows shaped like PostgREST output and is idempotent", async () => {
    const types = Object.fromEntries(
      (await query<{ column_name: string; data_type: string }>(
        "select column_name, data_type from information_schema.columns where table_name = 'unicornio_leads'"
      )).map((r) => [r.column_name, r.data_type])
    );
    const rows = [{
      id: "11111111-1111-1111-1111-111111111111", created_at: "2026-07-01T10:00:00+00:00", nome: "Eva", clinica: "C",
      especialidade: "Orto", cidade: "Natal", whatsapp: "84999990000", email: null, total: 20, arquetipo: "B",
      scores: { oferta: 3 }, alavancas_fracas: ["oferta", "marca"], respostas: [1, 2, 3], consent: true, source: "raio-x",
    }];
    for (let i = 0; i < 2; i++) {
      const { text, params } = buildInsert("unicornio_leads", rows, types);
      await query(text, params);
    }
    const copied = await query<{ n: number }>("select count(*)::int as n from unicornio_leads");
    expect(copied[0].n).toBe(1);
    const [r] = await query<{ scores: unknown; respostas: number[] }>("select scores, respostas from unicornio_leads");
    expect(r).toEqual({ scores: { oferta: 3 }, respostas: [1, 2, 3] });
  });
});
