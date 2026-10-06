// Tests for the shared lead backbone: phone normalization, every tool adapter,
// the end-to-end pipeline (with network mocked), and dashboard aggregation.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isValidBrPhone, normalizeBrPhone } from "./phone";
import { modelFor } from "./models";
import { runLeadPipeline } from "./pipeline";
import { TOOL_ADAPTERS } from "./tools";
import { aggregate, type LeadRow } from "./dashboard";

describe("normalizeBrPhone", () => {
  it.each([
    ["(11) 94685-1028", "5511946851028"],
    ["11946851028", "5511946851028"],
    ["1133334444", "551133334444"],
    ["+55 11 94685-1028", "5511946851028"],
    ["011946851028", "5511946851028"],
  ])("%s → %s", (raw, expected) => {
    expect(normalizeBrPhone(raw)).toBe(expected);
    expect(isValidBrPhone(normalizeBrPhone(raw))).toBe(true);
  });

  it("rejects short numbers", () => {
    expect(isValidBrPhone(normalizeBrPhone("94685-1028"))).toBe(false);
  });
});

describe("modelFor", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("uses the registry defaults", () => {
    expect(modelFor("fast")).toBe("claude-haiku-4-5-20251001");
    expect(modelFor("smart")).toBe("claude-sonnet-4-6");
  });
  it("can be overridden per environment", () => {
    vi.stubEnv("AI_MODEL_FAST", "claude-haiku-4-5");
    expect(modelFor("fast")).toBe("claude-haiku-4-5");
  });
});

// One realistic payload per tool, in the exact shape each frontend sends.
const PAYLOADS: Record<string, unknown> = {
  "calculadora-agenda": {
    name: "Ana", phone: "(11) 94685-1028", clinicName: "Sorriso", email: "a@x.com", city: "SP", score: 23,
    topIssues: ["Receita atual: R$ 40.000,00/mes"],
    agendaData: {
      receitaAtual: "R$ 40.000,00", receitaIdeal: "R$ 49.000,00", receitaExtra: "R$ 9.000,00",
      horaAtual: "R$ 250,00", horaIdeal: "R$ 310,00", horasEconomizadas: "3.5h/semana", worstMismatch: null,
      procedures: [{ nome: "Implante", receitaPorHora: 900, tempoMinutos: 90, quantidadeAtual: 2, quantidadeIdeal: 5 }],
    },
  },
  "calculadora-precificacao": {
    name: "Bruno", phone: "11946851028", clinicName: "OdontoB", email: "b@x.com", city: "Rio",
    reportUrl: "https://lkdigital.odo.br/ferramentas/calculadora-precificacao#results=abc",
    pricingData: {
      lucroHoraReal: 120.4, custoPorHora: 80, abaixoCusto: 1, totalProcedimentos: 4,
      topIssues: ["Limpeza esta abaixo do custo"],
      procedures: [{ nome: "Limpeza", precoAtual: 100, precoRecomendado: 180, custoTotal: 130, abaixoCusto: true }],
    },
  },
  "simulador-convenios": {
    name: "Carla", phone: "11946851028", clinicName: "Clin C", email: "", cidade: "BH", score: 48, receitaPrivada: 30000,
    planResults: [
      { nome: "Amil Dental", score: 50, classificacao: "vermelho", perdaTotal: 2100.5 },
      { nome: "SulAmerica", score: 70, classificacao: "verde", perdaTotal: 0 },
    ],
    reportUrl: "https://lkdigital.odo.br/ferramentas/simulador-convenios#results=x",
  },
  "diagnostico-clinica": {
    lead: { nome: "Davi", clinica: "Clin D", whatsapp: "11946851028", email: "d@x.com", cidade: "Recife" },
    inputs: { pacientesAgendados: 200, taxaFaltas: 15, ticketMedio: 350, taxaAceite: 50, gastoMarketing: 3000 },
    results: {
      perdaTotal: 25000, perdaAnual: 300000, perdaFaltas: 10500, perdaOrcamentos: 8000, perdaRetorno: 4000,
      desperdicioMarketing: 2500, receitaAtual: 60000, receitaPotencial: 85000, custoPorPaciente: 150,
      faltasPorMes: 30, orcamentosRecusados: 20, pacientesQueNaoVoltam: 12,
    },
    resultsUrl: "https://lkdigital.odo.br/ferramentas/diagnostico-clinica#abc",
  },
  "diagnostico-google": {
    name: "Eva", phone: "", clinicName: "Clin E", email: "e@x.com", city: "Natal",
    results: {
      totalScore: 42, gradeLabel: "Precisa de Atenção",
      sectionScores: [{ title: "Fotos e Visual", percent: 30 }, { title: "Avaliações", percent: 60 }],
      actionItems: [{ text: "Adicione pelo menos 15 fotos profissionais", impact: "Alto" }],
      answers: { verificado: "sim" },
    },
  },
  "auditoria-site": {
    name: "Fabio", phone: "11946851028", clinicName: "Clin F", siteUrl: "https://clinf.com.br", score: 61,
    topIssues: ["Formulario de contato"],
    checks: [
      { category: "SEO", name: "Titulo da Pagina", passed: true, severity: "critical", message: "ok", points: 10 },
      { category: "Leads", name: "Formulario de contato", passed: false, severity: "critical", message: "Sem formulario", points: 10 },
    ],
    reportUrl: "https://lkdigital.odo.br/ferramentas/auditoria-site/relatorio?url=x#data=y",
  },
};

describe("tool adapters", () => {
  it("every registered tool has a fixture", () => {
    expect(Object.keys(TOOL_ADAPTERS).sort()).toEqual(Object.keys(PAYLOADS).sort());
  });

  for (const [id, payload] of Object.entries(PAYLOADS)) {
    describe(id, () => {
      const adapter = TOOL_ADAPTERS[id];

      it("parses the frontend payload", () => {
        const r = adapter.parse(payload);
        expect(r.ok).toBe(true);
        if (!r.ok) return;
        expect(r.lead.name).toBeTruthy();
        expect(r.lead.headline).toBeTruthy();
        expect(r.lead.headline).not.toMatch(/undefined|NaN/);
      });

      it("builds a prompt and a WhatsApp message with no holes", () => {
        const r = adapter.parse(payload);
        if (!r.ok) throw new Error(r.error);
        const prompt = adapter.prompt(r.lead, r.data);
        expect(prompt).toBeTruthy();
        expect(prompt).not.toMatch(/undefined|NaN|\[object Object\]/);
        for (const plan of [null, "1. *Faça X*"]) {
          const msg = adapter.message(r.lead, r.data, plan);
          expect(msg).toContain(r.lead.name);
          expect(msg).not.toMatch(/undefined|NaN|\[object Object\]/);
          if (plan) expect(msg).toContain(plan);
        }
        const audit = adapter.auditData(r.lead, r.data);
        expect(audit.source).toMatch(/^[a-z_]+$/);
      });

      it("rejects an empty body", () => {
        expect(adapter.parse({}).ok).toBe(false);
      });
    });
  }
});

describe("runLeadPipeline", () => {
  const calls: Array<{ url: string; body: unknown }> = [];

  beforeEach(() => {
    calls.length = 0;
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("LK_CHATBOT_URL", "https://bot.example");
    vi.stubEnv("LK_CHATBOT_API_KEY", "k");
    vi.stubEnv("LK_CHATBOT_TENANT_ID", "t");
    vi.stubEnv("FB_PIXEL_ID", "123");
    vi.stubEnv("FB_ACCESS_TOKEN", "tok");
    vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url: String(url), body: init?.body ? JSON.parse(String(init.body)) : null });
      return new Response("{}", { status: 200 });
    }));
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends CAPI Lead (with shared event id) and the WhatsApp report via the chatbot", async () => {
    const res = await runLeadPipeline(TOOL_ADAPTERS["diagnostico-clinica"], PAYLOADS["diagnostico-clinica"], { eventId: "evt_1" });
    expect(res.status).toBe(200);
    expect(res.body.messageSent).toBe(true);

    const capi = calls.find((c) => c.url.includes("graph.facebook.com"));
    expect(capi).toBeDefined();
    const event = (capi!.body as { data: Array<Record<string, unknown>> }).data[0];
    expect(event.event_name).toBe("Lead");
    expect(event.event_id).toBe("evt_1");

    const bot = calls.find((c) => c.url === "https://bot.example/webhook/audit-lead");
    const botBody = bot!.body as { phone: string; auditData: { source: string }; reportMessage: string };
    expect(botBody.phone).toBe("5511946851028");
    // The old repo sent `diagnosticData`, which the chatbot ignored.
    expect(botBody.auditData.source).toBe("diagnostico_clinica");
    expect(botBody.reportMessage).toContain("Clin D");
  });

  it("falls back to Evolution when the chatbot fails", async () => {
    vi.stubEnv("EVOLUTION_API_URL", "https://evo.example");
    vi.stubEnv("EVOLUTION_API_KEY", "e");
    vi.stubEnv("EVOLUTION_INSTANCE", "lk");
    vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url: String(url), body: init?.body ? JSON.parse(String(init.body)) : null });
      return new Response("down", { status: String(url).includes("bot.example") ? 503 : 200 });
    }));
    const res = await runLeadPipeline(TOOL_ADAPTERS["calculadora-agenda"], PAYLOADS["calculadora-agenda"]);
    expect(res.body.messageSent).toBe(true);
    expect(calls.some((c) => c.url === "https://evo.example/message/sendText/lk")).toBe(true);
  });

  it("rejects an invalid phone for tools that require one", async () => {
    const res = await runLeadPipeline(TOOL_ADAPTERS["auditoria-site"], { ...(PAYLOADS["auditoria-site"] as object), phone: "123" });
    expect(res.status).toBe(400);
    expect(calls).toHaveLength(0);
  });

  it("accepts e-mail-only leads where the tool allows it, without a WhatsApp send", async () => {
    const res = await runLeadPipeline(TOOL_ADAPTERS["diagnostico-google"], PAYLOADS["diagnostico-google"]);
    expect(res.status).toBe(200);
    expect(res.body.messageSent).toBe(false);
    expect(calls.some((c) => c.url.includes("bot.example"))).toBe(false);
    const capi = calls.find((c) => c.url.includes("graph.facebook.com"));
    const userData = (capi!.body as { data: Array<{ user_data: Record<string, unknown> }> }).data[0].user_data;
    expect(userData.ph).toBeUndefined();
    expect(userData.em).toBeDefined();
  });
});

describe("dashboard aggregate", () => {
  const now = Date.parse("2026-10-02T15:00:00Z");
  const lead = (daysAgo: number, source: string, sent: boolean | null, whatsapp: string | null = "5511"): LeadRow => ({
    id: `${source}-${daysAgo}-${Math.random()}`,
    created_at: new Date(now - daysAgo * 86_400_000).toISOString(),
    source, name: "x", whatsapp, email: null, clinic_name: null, city: null, score: null, headline: null, whatsapp_sent: sent,
  });

  it("computes windows, delivery rate, per-source and per-day counts", () => {
    const leads = [
      lead(0, "calculadora-agenda", true),
      lead(1, "calculadora-agenda", false),
      lead(2, "unicornio", null),
      lead(9, "raio-x", null),
      lead(20, "diagnostico-google", false, null),
    ];
    const d = aggregate(leads, [
      { created_at: "", source: "calculadora-agenda", model: "claude-haiku-4-5-20251001", input_tokens: 1_000_000, output_tokens: 100_000, latency_ms: 2000, ok: true },
    ], now);

    expect(d.leads7d).toBe(3);
    expect(d.leadsPrev7d).toBe(1);
    expect(d.leads30d).toBe(5);
    // Only tool leads with a phone count as delivery attempts.
    expect(d.whatsappAttempted).toBe(2);
    expect(d.whatsappRate).toBe(0.5);
    expect(d.whatsappFailed).toHaveLength(1);
    expect(d.bySource[0]).toMatchObject({ source: "calculadora-agenda", count: 2 });
    expect(d.bySource.find((s) => s.source === "auditoria-site")?.count).toBe(0);
    expect(d.daily).toHaveLength(30);
    expect(d.daily.reduce((s, x) => s + x.count, 0)).toBe(5);
    expect(d.ai.costUsd).toBeCloseTo(1.5);
  });
});
