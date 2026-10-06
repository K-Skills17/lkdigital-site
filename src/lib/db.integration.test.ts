// Runs the real SQL (db/schema.sql, rate limiter, backbone storage, dashboard,
// legacy lead tables → tool_leads) against an in-memory Postgres (PGlite) standing in for Neon.

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
import { migrateLegacyLeads, splitStatements } from "../../db/sql-utils.mjs";

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
    "truncate rate_limits, ai_calls, tool_leads cascade"
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
    expect((await hit(LIMITS.leadIpBurst, "x")).ok).toBe(true);
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
    await insertToolLead({
      tool: "raio-x", name: "Bia", phone: "5511999998888", email: null, clinic_name: "C", city: "SP", score: 42,
      headline: "42/100 · Sistema parcial", payload: {}, utm: null, report_url: null,
    });

    const [row] = await query<{ payload: unknown; utm: unknown; whatsapp_sent: boolean }>("select payload, utm, whatsapp_sent from tool_leads");
    expect(row).toMatchObject({ payload: { a: [1, 2] }, utm: { utm_source: "ig" }, whatsapp_sent: true });

    const d = await loadDashboard();
    expect(d.leads30d).toBe(2);
    expect(d.bySource.find((s) => s.source === "raio-x")?.count).toBe(1);
    // The RAIO-X lead has a phone but no delivery yet: 1 of 2 attempts delivered.
    expect(d.whatsappRate).toBe(0.5);
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

describe("legacy lead tables → tool_leads", () => {
  it("copies every legacy row once, keeping id, date and the full row, and leaves the tables in place", async () => {
    await pg.exec(`
      create table if not exists raiox_leads (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
        cohort text, status text not null default 'new', name text not null, clinic_name text not null, city text not null,
        whatsapp text not null, role text not null, procedures text[], lead_score int, lead_tier text, utm jsonb);
      create table if not exists unicornio_leads (id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
        nome text not null, clinica text not null, especialidade text, cidade text, whatsapp text not null, email text,
        total int, arquetipo text, scores jsonb, alavancas_fracas text[], respostas int[]);
      create table if not exists raio_x_scorecard_leads (id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
        name text not null, clinic_name text not null, whatsapp text, email text, vis_score numeric(4,3), op_score numeric(4,3),
        route text, answers jsonb);
      truncate raiox_leads, unicornio_leads, raio_x_scorecard_leads;
      insert into raiox_leads (created_at, status, name, clinic_name, city, whatsapp, role, procedures, lead_score, lead_tier, utm)
        values ('2026-06-01T10:00:00Z', 'contacted', 'Caio', 'Clin', 'SP', '11988887777', 'Gerente', '{Implantes,HOF}', 70, 'A', '{"utm_source":"ig"}');
      insert into unicornio_leads (nome, clinica, especialidade, cidade, whatsapp, total, arquetipo, scores, alavancas_fracas, respostas)
        values ('Bia', 'C', 'Orto', 'SP', '11999998888', 30, 'B', '{"oferta":3}', '{oferta,marca}', '{1,2,3}');
      insert into raio_x_scorecard_leads (name, clinic_name, email, vis_score, op_score, route, answers)
        values ('Davi', 'Clin D', 'd@x.com', 0.5, 0.7, 'lk', '{"q1":1}');
    `);
    const run = async (text: string, params: unknown[]) => (await pg.query(text, params)).rows as Record<string, unknown>[];
    const first = await migrateLegacyLeads(run);
    expect(first).toEqual({
      raiox_leads: { rows: 1, inserted: 1 },
      unicornio_leads: { rows: 1, inserted: 1 },
      raio_x_scorecard_leads: { rows: 1, inserted: 1 },
    });
    // Idempotent: a second migrate copies nothing.
    const second = await migrateLegacyLeads(run);
    expect(Object.values(second).every((r) => (r as { inserted: number }).inserted === 0)).toBe(true);

    const rows = await query<{ tool: string; name: string; phone: string; score: string | null; headline: string; status: string; payload: Record<string, unknown>; utm: unknown; created_at: Date }>(
      "select tool, name, phone, score, headline, status, payload, utm, created_at from tool_leads order by tool"
    );
    expect(rows.map((r) => r.tool)).toEqual(["raio-x-2026", "raio-x-scorecard", "unicornio"]);
    const [rx, sc, un] = rows;
    expect(rx).toMatchObject({ name: "Caio", phone: "11988887777", headline: "A · Gerente", status: "contacted", utm: { utm_source: "ig" } });
    expect(rx.payload.procedures).toEqual(["Implantes", "HOF"]);
    expect(new Date(rx.created_at).toISOString()).toBe("2026-06-01T10:00:00.000Z");
    expect(sc).toMatchObject({ name: "Davi", phone: "", headline: "rota: lk" });
    expect(Number(sc.score)).toBe(60);
    expect(un).toMatchObject({ name: "Bia", headline: "Arquétipo B · 30/42" });
    expect(un.payload).toMatchObject({ scores: { oferta: 3 }, respostas: [1, 2, 3] });

    const all = await query<{ source: string }>("select source from all_leads order by source");
    expect(all.map((r) => r.source)).toEqual(["raio-x-2026", "raio-x-scorecard", "unicornio"]);
    // Nothing is dropped automatically.
    expect((await query<{ n: number }>("select count(*)::int as n from unicornio_leads"))[0].n).toBe(1);
  });

  it("does nothing on a fresh database without legacy tables", async () => {
    await pg.exec("drop table if exists raiox_leads; drop table if exists unicornio_leads; drop table if exists raio_x_scorecard_leads;");
    expect(await migrateLegacyLeads(async (t: string, p: unknown[]) => (await pg.query(t, p)).rows as Record<string, unknown>[])).toEqual({});
  });
});
