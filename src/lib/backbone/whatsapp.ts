// lib/backbone/whatsapp.ts
// WhatsApp delivery for every tool: LK Chatbot first (so the bot picks up the
// conversation with full context), Evolution API direct as fallback.

export interface ChatbotAuditData {
  source: string;
  overallScore?: number | null;
  keyFindings?: string[];
  recommendations?: string[];
  businessType?: string;
  siteUrl?: string;
  [key: string]: unknown;
}

export interface DeliveryResult {
  sent: boolean;
  channel: "chatbot" | "evolution" | null;
  error: string | null;
}

export async function deliverWhatsApp(input: {
  phone: string;
  name: string;
  message: string;
  auditData: ChatbotAuditData;
}): Promise<DeliveryResult> {
  const errors: string[] = [];

  const chatbotUrl = process.env.LK_CHATBOT_URL;
  const chatbotKey = process.env.LK_CHATBOT_API_KEY;
  const tenantId = process.env.LK_CHATBOT_TENANT_ID;

  if (chatbotUrl && chatbotKey && tenantId) {
    try {
      const res = await fetch(`${chatbotUrl.replace(/\/$/, "")}/webhook/audit-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: chatbotKey },
        body: JSON.stringify({
          phone: input.phone,
          name: input.name,
          reportMessage: input.message,
          tenantId,
          auditData: input.auditData,
        }),
      });
      if (res.ok) return { sent: true, channel: "chatbot", error: null };
      errors.push(`chatbot ${res.status}: ${(await res.text()).slice(0, 300)}`);
    } catch (err) {
      errors.push(`chatbot: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const evoUrl = process.env.EVOLUTION_API_URL;
  const evoKey = process.env.EVOLUTION_API_KEY;
  // The site historically used EVOLUTION_INSTANCE, the tools EVOLUTION_API_INSTANCE.
  const evoInstance = process.env.EVOLUTION_API_INSTANCE || process.env.EVOLUTION_INSTANCE;

  if (evoUrl && evoKey && evoInstance) {
    try {
      const res = await fetch(
        `${evoUrl.replace(/\/$/, "")}/message/sendText/${evoInstance}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: evoKey },
          body: JSON.stringify({ number: input.phone, text: input.message }),
        }
      );
      if (res.ok) return { sent: true, channel: "evolution", error: null };
      errors.push(`evolution ${res.status}: ${(await res.text()).slice(0, 300)}`);
    } catch (err) {
      errors.push(`evolution: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (errors.length === 0) errors.push("no WhatsApp channel configured");
  return { sent: false, channel: null, error: errors.join(" | ") };
}
