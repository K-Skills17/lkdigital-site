// Checklist do Perfil da Empresa no Google + kit de avaliações (/ferramentas/checklist-google, Ep 9).
// A download: no AI plan, the WhatsApp message carries the PDF and the page link.
import { num, type ToolAdapter } from "../types";
import { downloadMessage, fileUrl, parseLeadMagnet, toolUrl, type LeadMagnetMeta } from "./lead-magnet";

interface ChecklistData extends LeadMagnetMeta {
  /** Items already ticked on the page when the form was sent (null if unknown). */
  done: number | null;
  total: number | null;
}

export const checklistGoogle: ToolAdapter<ChecklistData> = {
  id: "checklist-google",
  label: "Checklist do Google",
  requiresPhone: true,

  parse(body) {
    const p = parseLeadMagnet(body);
    if (!p.ok) return p;
    const data: ChecklistData = { ...p.meta, done: num(p.data.done), total: num(p.data.total) };
    const pct = data.done !== null && data.total ? Math.round((data.done / data.total) * 100) : null;
    return {
      ok: true,
      data,
      lead: {
        ...p.contact,
        score: pct,
        headline: pct === null ? "Baixou o checklist (PDF)" : `Baixou o checklist (PDF) · ${data.done}/${data.total} itens feitos`,
        reportUrl: toolUrl("checklist-google"),
      },
    };
  },

  prompt: () => null,

  message(lead, d) {
    const progress = d.done !== null && d.total ? ` Você já marcou ${d.done} de ${d.total} itens.` : "";
    return downloadMessage(
      lead.name,
      `Aqui está o Checklist do Perfil da Empresa no Google da *${lead.clinic}*, com o kit de avaliações e os modelos prontos.${progress}`,
      [
        ["Checklist em PDF (A4)", fileUrl("checklist-google.pdf")],
        ["Versão interativa, com pontuação", toolUrl("checklist-google")],
      ],
      `Dica: comece pela Base do perfil e pelo Contato. Ficou alguma dúvida? É só responder esta mensagem. 😊`
    );
  },

  auditData(lead, d) {
    return {
      source: "checklist_google",
      businessType: "dentista",
      clinicName: lead.clinic,
      email: lead.email,
      city: lead.city || "Nao informada",
      especialidade: d.especialidade,
      overallScore: lead.score,
      keyFindings: d.done !== null && d.total ? [`Checklist do Google: ${d.done}/${d.total} itens feitos`] : [],
      recommendations: ["Revisar o Perfil da Empresa no Google item por item", "Pedir avaliação a todos os pacientes, toda semana"],
    };
  },
};
