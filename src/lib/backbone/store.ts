// lib/backbone/store.ts
// Persistence for the backbone: every tool lead lands in `tool_leads`, every
// AI call in `ai_calls`. Storage failures are logged, never thrown — a Supabase
// outage must not stop a lead from getting their WhatsApp report.

import { getSupabase } from "@/lib/supabase-server";

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

function supabaseOrNull() {
  try {
    return getSupabase();
  } catch {
    return null;
  }
}

export async function insertToolLead(row: ToolLeadInsert): Promise<string | null> {
  const db = supabaseOrNull();
  if (!db) {
    console.warn("[backbone/store] Supabase not configured — lead not persisted");
    return null;
  }
  const { data, error } = await db.from("tool_leads").insert(row).select("id").single();
  if (error) {
    console.error("[backbone/store] insert tool_leads failed:", error);
    return null;
  }
  return (data as { id: string }).id;
}

export async function updateToolLead(id: string | null, patch: ToolLeadUpdate): Promise<void> {
  if (!id) return;
  const db = supabaseOrNull();
  if (!db) return;
  const { error } = await db.from("tool_leads").update(patch).eq("id", id);
  if (error) console.error("[backbone/store] update tool_leads failed:", error);
}

export async function logAiCall(row: AiCallInsert): Promise<void> {
  const db = supabaseOrNull();
  if (!db) return;
  const { error } = await db.from("ai_calls").insert(row);
  if (error) console.error("[backbone/store] insert ai_calls failed:", error);
}
