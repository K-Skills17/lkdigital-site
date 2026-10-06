// lib/backbone/store.ts
// Persistence for the backbone: every tool lead lands in `tool_leads`, every
// AI call in `ai_calls` (Neon, see db/schema.sql). Storage failures are logged,
// never thrown — a database outage must not stop a lead from getting their
// WhatsApp report.

import { isDbConfigured, query } from "@/lib/db";

export interface ToolLeadInsert {
  tool: string;
  name: string;
  phone: string;
  email: string | null;
  clinic_name: string | null;
  city: string | null;
  score: number | null;
  headline: string | null;
  payload: unknown;
  utm: Record<string, string> | null;
  report_url: string | null;
}

export interface ToolLeadUpdate {
  ai_plan?: string | null;
  whatsapp_sent?: boolean;
  whatsapp_channel?: string | null;
  whatsapp_error?: string | null;
  capi_sent?: boolean;
}

export interface AiCallInsert {
  source: string;
  lead_id: string | null;
  model: string;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  ok: boolean;
  error: string | null;
}

const UPDATABLE = ["ai_plan", "whatsapp_sent", "whatsapp_channel", "whatsapp_error", "capi_sent"] as const;

export async function insertToolLead(row: ToolLeadInsert): Promise<string | null> {
  if (!isDbConfigured()) {
    console.warn("[backbone/store] DATABASE_URL not set — lead not persisted");
    return null;
  }
  try {
    const rows = await query<{ id: string }>(
      `insert into tool_leads (tool, name, phone, email, clinic_name, city, score, headline, payload, utm, report_url)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11)
       returning id`,
      [
        row.tool, row.name, row.phone, row.email, row.clinic_name, row.city, row.score, row.headline,
        JSON.stringify(row.payload ?? {}), row.utm ? JSON.stringify(row.utm) : null, row.report_url,
      ]
    );
    return rows[0]?.id ?? null;
  } catch (err) {
    console.error("[backbone/store] insert tool_leads failed:", err);
    return null;
  }
}

export async function updateToolLead(id: string | null, patch: ToolLeadUpdate): Promise<void> {
  if (!id || !isDbConfigured()) return;
  const cols = UPDATABLE.filter((c) => patch[c] !== undefined);
  if (!cols.length) return;
  try {
    await query(
      `update tool_leads set ${cols.map((c, i) => `${c} = $${i + 2}`).join(", ")} where id = $1`,
      [id, ...cols.map((c) => patch[c])]
    );
  } catch (err) {
    console.error("[backbone/store] update tool_leads failed:", err);
  }
}

export async function logAiCall(row: AiCallInsert): Promise<void> {
  if (!isDbConfigured()) return;
  try {
    await query(
      `insert into ai_calls (source, lead_id, model, input_tokens, output_tokens, latency_ms, ok, error)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [row.source, row.lead_id, row.model, row.input_tokens, row.output_tokens, row.latency_ms, row.ok, row.error]
    );
  } catch (err) {
    console.error("[backbone/store] insert ai_calls failed:", err);
  }
}
