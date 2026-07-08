// lib/raio-x/lead-sink.ts
// Abstracts persistence (Supabase) + Telegram notifications behind a single interface.

import { getSupabase } from "@/lib/supabase-server";
import type { Route } from "./score";

export interface LeadPayload {
  name: string;
  clinic_name: string;
  whatsapp: string | null;
  email: string | null;
  answers: number[];
  vis_score: number;
  vis_gap: boolean;
  op_score: number;
  op_gap: boolean;
  route: Route;
  consent: true;
}

export interface SinkResult { id: string; }

/** Persist lead to Supabase and fire Telegram notifications. Returns the lead UUID. */
export async function sinkLead(payload: LeadPayload): Promise<SinkResult> {
  const { data, error } = await getSupabase()
    .from("raio_x_scorecard_leads")
    .insert({
      name: payload.name,
      clinic_name: payload.clinic_name,
      whatsapp: payload.whatsapp,
      email: payload.email,
      answers: payload.answers,
      vis_score: payload.vis_score,
      vis_gap: payload.vis_gap,
      op_score: payload.op_score,
      op_gap: payload.op_gap,
      route: payload.route,
      consent: true,
    })
    .select("id")
    .single();

  if (error) throw error;

  const id = (data as { id: string }).id;

  // Await before returning -- Vercel serverless kills pending promises on response
  const tasks = [
    notifyKomando(id, payload).catch((e) =>
      console.error("[raio-x/lead-sink] komando notify error:", e)
    ),
  ];
  if (payload.route === "marcos" || payload.route === "dual") {
    tasks.push(
      notifyMarcos(id, payload).catch((e) =>
        console.error("[raio-x/lead-sink] marcos notify error:", e)
      )
    );
  }
  await Promise.all(tasks);

  return { id };
}

// -- Telegram helpers --------------------------------------------------------

const ROUTE_LABEL: Record<Route, string> = {
  lk:       "LK Digital (Visibilidade)",
  marcos:   "Biodonte/Marcos (Opera\u00e7\u00e3o)",
  dual:     "DUAL \u2014 ambos os dom\u00ednios em gap",
  optimize: "LK Digital \u2014 Base saud\u00e1vel (Otimiza\u00e7\u00e3o)",
};

function contactLine(lead: LeadPayload): string {
  return lead.whatsapp
    ? `WhatsApp: <code>${lead.whatsapp}</code>`
    : `E-mail: <code>${lead.email}</code>`;
}

async function notifyKomando(id: string, lead: LeadPayload): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.NOTIFY_KOMANDO_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[raio-x] Telegram skipped \u2014 set TELEGRAM_BOT_TOKEN + NOTIFY_KOMANDO_CHAT_ID");
    return;
  }

  const text = `\u{1F9EA} <b>Novo lead RAIO-X Scorecard</b>

<b>Nome:</b> ${lead.name}
<b>Cl\u00ednica:</b> ${lead.clinic_name}
<b>Contato:</b> ${contactLine(lead)}
<b>Rota:</b> ${ROUTE_LABEL[lead.route]}

<b>Visibilidade:</b> ${Math.round(lead.vis_score * 100)}% ${lead.vis_gap ? "\u26a0\ufe0f GAP" : "\u2705"}
<b>Opera\u00e7\u00e3o:</b> ${Math.round(lead.op_score * 100)}% ${lead.op_gap ? "\u26a0\ufe0f GAP" : "\u2705"}

<code>${id}</code>`;

  await telegramSend(token, chatId, text);
}

async function notifyMarcos(id: string, lead: LeadPayload): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.NOTIFY_MARCOS_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[raio-x] Marcos Telegram skipped \u2014 set TELEGRAM_BOT_TOKEN + NOTIFY_MARCOS_CHAT_ID");
    return;
  }

  const isDual = lead.route === "dual";
  const intro  = isDual
    ? "\u26a0\ufe0f Lead com gap em <b>ambos os dom\u00ednios</b>. Rota prim\u00e1ria: LK Digital. Warm intro quando pertinente."
    : "\u{1F4CA} Lead com gap em <b>Convers\u00e3o &amp; Opera\u00e7\u00e3o</b>. Rota direta para Biodonte.";

  const text = `${intro}

<b>Nome:</b> ${lead.name}
<b>Cl\u00ednica:</b> ${lead.clinic_name}
<b>Contato:</b> ${contactLine(lead)}

<b>Opera\u00e7\u00e3o:</b> ${Math.round(lead.op_score * 100)}% \u26a0\ufe0f GAP
<b>Visibilidade:</b> ${Math.round(lead.vis_score * 100)}% ${lead.vis_gap ? "\u26a0\ufe0f GAP" : "\u2705"}

<code>${id}</code>`;

  await telegramSend(token, chatId, text);
}

async function telegramSend(token: string, chatId: string, text: string): Promise<void> {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram ${res.status}: ${body}`);
  }
}
