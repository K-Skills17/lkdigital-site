// lib/backbone/dashboard.ts
// Data for /painel: one view over every lead source + AI usage.

import { getSupabase } from "@/lib/supabase-server";
import { MODEL_PRICING } from "./models";

export const SOURCE_LABELS: Record<string, string> = {
  "auditoria-site": "Auditoria de Site",
  "diagnostico-google": "Diagnóstico Google",
  "simulador-convenios": "Simulador de Convênios",
  "calculadora-precificacao": "Calculadora de Precificação",
  "diagnostico-clinica": "Diagnóstico de Clínica",
  "calculadora-agenda": "Calculadora de Agenda",
  "raio-x": "RAIO-X (auditoria manual)",
  "raio-x-scorecard": "RAIO-X Scorecard",
  unicornio: "Clínica Unicórnio",
};

export interface LeadRow {
  id: string;
  created_at: string;
  source: string;
  name: string;
  whatsapp: string | null;
  email: string | null;
  clinic_name: string | null;
  city: string | null;
  score: number | string | null;
  headline: string | null;
  whatsapp_sent: boolean | null;
}

export interface AiCallRow {
  created_at: string;
  source: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  ok: boolean;
}

export interface DashboardData {
  leads7d: number;
  leads30d: number;
  leadsPrev7d: number;
  /** Delivered / attempted, across tool leads that went through the WhatsApp pipeline. */
  whatsappRate: number | null;
  whatsappAttempted: number;
  whatsappFailed: LeadRow[];
  bySource: Array<{ source: string; label: string; count: number }>;
  daily: Array<{ day: string; count: number }>;
  recent: LeadRow[];
  ai: {
    calls: number;
    failed: number;
    costUsd: number;
    byModel: Array<{ model: string; calls: number; inputTokens: number; outputTokens: number; costUsd: number; avgLatencyMs: number }>;
    bySource: Array<{ source: string; calls: number }>;
  };
}

const DAY = 86_400_000;

function costOf(model: string, input: number, output: number): number {
  const [pin, pout] = MODEL_PRICING[model] ?? [0, 0];
  return (input * pin + output * pout) / 1_000_000;
}

/** Pure aggregation — exported for tests. `now` is injectable. */
export function aggregate(leads: LeadRow[], calls: AiCallRow[], now = Date.now()): DashboardData {
  const t = (iso: string) => new Date(iso).getTime();
  const in7 = leads.filter((l) => now - t(l.created_at) < 7 * DAY);
  const prev7 = leads.filter((l) => {
    const age = now - t(l.created_at);
    return age >= 7 * DAY && age < 14 * DAY;
  });
  const in30 = leads.filter((l) => now - t(l.created_at) < 30 * DAY);

  const attempted = in30.filter((l) => l.whatsapp_sent !== null && !!l.whatsapp);
  const delivered = attempted.filter((l) => l.whatsapp_sent).length;

  const counts = new Map<string, number>();
  for (const l of in30) counts.set(l.source, (counts.get(l.source) ?? 0) + 1);
  // Every known source appears, even at zero — a dead funnel should be visible.
  for (const s of Object.keys(SOURCE_LABELS)) if (!counts.has(s)) counts.set(s, 0);
  const bySource = Array.from(counts, ([source, count]) => ({
    source,
    label: SOURCE_LABELS[source] ?? source,
    count,
  })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const daily: DashboardData["daily"] = [];
  for (let i = 29; i >= 0; i--) {
    const day = new Date(now - i * DAY).toISOString().slice(0, 10);
    daily.push({ day, count: 0 });
  }
  const dayIndex = new Map(daily.map((d, i) => [d.day, i]));
  for (const l of in30) {
    const i = dayIndex.get(l.created_at.slice(0, 10));
    if (i !== undefined) daily[i].count++;
  }

  const models = new Map<string, DashboardData["ai"]["byModel"][number]>();
  const aiSources = new Map<string, number>();
  for (const c of calls) {
    const m = models.get(c.model) ?? { model: c.model, calls: 0, inputTokens: 0, outputTokens: 0, costUsd: 0, avgLatencyMs: 0 };
    m.avgLatencyMs = (m.avgLatencyMs * m.calls + c.latency_ms) / (m.calls + 1);
    m.calls++;
    m.inputTokens += c.input_tokens;
    m.outputTokens += c.output_tokens;
    m.costUsd += costOf(c.model, c.input_tokens, c.output_tokens);
    models.set(c.model, m);
    aiSources.set(c.source, (aiSources.get(c.source) ?? 0) + 1);
  }
  const byModel = Array.from(models.values()).sort((a, b) => b.calls - a.calls);

  return {
    leads7d: in7.length,
    leads30d: in30.length,
    leadsPrev7d: prev7.length,
    whatsappRate: attempted.length ? delivered / attempted.length : null,
    whatsappAttempted: attempted.length,
    whatsappFailed: attempted.filter((l) => !l.whatsapp_sent).slice(0, 10),
    bySource,
    daily,
    recent: leads.slice(0, 40),
    ai: {
      calls: calls.length,
      failed: calls.filter((c) => !c.ok).length,
      costUsd: byModel.reduce((s, m) => s + m.costUsd, 0),
      byModel,
      bySource: Array.from(aiSources, ([source, n]) => ({ source, calls: n })).sort((a, b) => b.calls - a.calls),
    },
  };
}

export async function loadDashboard(): Promise<DashboardData> {
  const db = getSupabase();
  const since = new Date(Date.now() - 30 * DAY).toISOString();

  const [leads, calls] = await Promise.all([
    db
      .from("all_leads")
      .select("id, created_at, source, name, whatsapp, email, clinic_name, city, score, headline, whatsapp_sent")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000),
    db
      .from("ai_calls")
      .select("created_at, source, model, input_tokens, output_tokens, latency_ms, ok")
      .gte("created_at", since)
      .limit(20000),
  ]);
  if (leads.error) throw leads.error;
  if (calls.error) throw calls.error;

  return aggregate((leads.data ?? []) as LeadRow[], (calls.data ?? []) as AiCallRow[]);
}
