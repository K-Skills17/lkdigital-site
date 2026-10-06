// Scripts de WhatsApp para a recepção (/ferramentas/scripts-whatsapp, Eps 2, 12, 13).
// A download: no AI plan, the WhatsApp message carries the booklet, the .md and the cheat sheet.
import type { ToolAdapter } from "../types";
import { downloadMessage, fileUrl, parseLeadMagnet, toolUrl, type LeadMagnetMeta } from "./lead-magnet";

export const scriptsWhatsapp: ToolAdapter<LeadMagnetMeta> = {
  id: "scripts-whatsapp",
  label: "Scripts de WhatsApp",
  requiresPhone: true,

  parse(body) {
    const p = parseLeadMagnet(body);
    if (!p.ok) return p;
    return {
      ok: true,
      data: p.meta,
      lead: { ...p.contact, score: null, headline: "Baixou os Scripts de WhatsApp (livreto)", reportUrl: toolUrl("scripts-whatsapp") },
    };
  },

  prompt: () => null,

  message(lead) {
    return downloadMessage(
      lead.name,
      `Aqui estão os Scripts de WhatsApp para a recepção da *${lead.clinic}*: do primeiro “oi” até a avaliação.`,
      [
        ["Livreto (PDF)", fileUrl("scripts-whatsapp.pdf")],
        ["Textos para copiar e colar (.md)", fileUrl("scripts-whatsapp.md")],
        ["Cola rápida da recepção (PDF, 1 página)", fileUrl("cola-rapida.pdf")],
      ],
      `Comece pela primeira resposta em até 5 minutos. Ficou alguma dúvida? É só responder esta mensagem. 😊`
    );
  },

  auditData(lead, d) {
    return {
      source: "scripts_whatsapp",
      businessType: "dentista",
      clinicName: lead.clinic,
      email: lead.email,
      city: lead.city || "Nao informada",
      especialidade: d.especialidade,
      overallScore: null,
      keyFindings: ["Baixou os Scripts de WhatsApp para a recepção"],
      recommendations: ["Primeira resposta em até 5 minutos", "Responder “quanto custa?” levando para a avaliação"],
    };
  },
};
