// lib/backbone/pipeline.ts
// The one routine every lead goes through, whichever tool captured it:
//   validate → store → (AI plan ‖ Meta CAPI) → WhatsApp → update record → alert team

import { generateText } from "./ai";
import { leadEvent, sendCapiEvents } from "./capi";
import { notifyTeam } from "./notify";
import { isValidBrPhone, normalizeBrPhone } from "./phone";
import { insertToolLead, updateToolLead } from "./store";
import type { ToolAdapter } from "./types";
import { deliverWhatsApp } from "./whatsapp";

export interface PipelineContext {
  clientIp?: string | null;
  userAgent?: string | null;
  sourceUrl?: string | null;
  /** Shared with the browser pixel's Lead event so Meta deduplicates them. */
  eventId?: string | null;
  utm?: Record<string, string> | null;
}

export interface PipelineResult {
  status: number;
  body: {
    success: boolean;
    leadId?: string | null;
    messageSent?: boolean;
    aiPlanGenerated?: boolean;
    whatsappError?: string;
    error?: string;
  };
}

export async function runLeadPipeline<T>(
  adapter: ToolAdapter<T>,
  rawBody: unknown,
  ctx: PipelineContext = {}
): Promise<PipelineResult> {
  const parsed = adapter.parse(rawBody);
  if (!parsed.ok) return { status: 400, body: { success: false, error: parsed.error } };

  const { lead, data } = parsed;
  const phone = lead.phone ? normalizeBrPhone(lead.phone) : "";
  const hasPhone = isValidBrPhone(phone);

  if (adapter.requiresPhone && !hasPhone) {
    return { status: 400, body: { success: false, error: "Numero de telefone invalido" } };
  }

  const leadId = await insertToolLead({
    tool: adapter.id,
    name: lead.name,
    phone,
    email: lead.email,
    clinic_name: lead.clinic,
    city: lead.city,
    score: lead.score,
    headline: lead.headline,
    payload: data,
    utm: ctx.utm ?? null,
    report_url: lead.reportUrl,
  });

  const prompt = adapter.prompt(lead, data);
  const [plan, capiSent] = await Promise.all([
    prompt
      ? generateText({
          source: adapter.id,
          tier: "fast",
          prompt,
          maxTokens: adapter.maxTokens ?? 1024,
          leadId,
        })
      : Promise.resolve(null),
    sendCapiEvents(
      [
        leadEvent({
          phone: phone || "",
          name: lead.name,
          email: lead.email,
          contentName: `${adapter.label}${lead.clinic ? ` - ${lead.clinic}` : ""}`,
          value: lead.score,
          sourceUrl: ctx.sourceUrl,
          eventId: ctx.eventId,
        }),
      ],
      ctx.clientIp,
      ctx.userAgent
    ),
  ]);

  let delivery: Awaited<ReturnType<typeof deliverWhatsApp>> = {
    sent: false,
    channel: null,
    error: hasPhone ? null : "no phone provided",
  };
  if (hasPhone) {
    delivery = await deliverWhatsApp({
      phone,
      name: lead.name,
      message: adapter.message(lead, data, plan),
      auditData: { ...adapter.auditData(lead, data), leadId },
    });
    if (!delivery.sent) console.error(`[backbone/${adapter.id}] WhatsApp not sent:`, delivery.error);
  }

  // Vercel freezes the function after the response, so finish side effects first.
  await Promise.all([
    updateToolLead(leadId, {
      ai_plan: plan,
      whatsapp_sent: delivery.sent,
      whatsapp_channel: delivery.channel,
      whatsapp_error: delivery.error,
      capi_sent: capiSent,
    }),
    notifyTeam(
      [
        ["Ferramenta", adapter.label],
        ["Nome", lead.name],
        ["Clínica", lead.clinic],
        ["Cidade", lead.city],
        ["WhatsApp", phone || "—"],
        ["E-mail", lead.email],
        ["Resultado", lead.headline],
        ["Relatório WhatsApp", delivery.sent ? `enviado (${delivery.channel})` : `NÃO enviado — ${delivery.error}`],
      ],
      `Novo lead — ${adapter.label}`
    ),
  ]);

  return {
    status: 200,
    body: {
      success: true,
      leadId,
      messageSent: delivery.sent,
      aiPlanGenerated: !!plan,
      whatsappError: delivery.sent ? undefined : delivery.error ?? undefined,
    },
  };
}
