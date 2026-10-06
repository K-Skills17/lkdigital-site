// Dashboard da Clínica (/ferramentas/dashboard-clinica, Eps 5, 8, 14): weekly spreadsheet, blank + example.
// A download: no AI plan, the WhatsApp message carries both files.
import type { ToolAdapter } from "../types";
import { downloadMessage, fileUrl, parseLeadMagnet, toolUrl, type LeadMagnetMeta } from "./lead-magnet";

export const dashboardClinica: ToolAdapter<LeadMagnetMeta> = {
  id: "dashboard-clinica",
  label: "Dashboard da Clínica",
  requiresPhone: true,

  parse(body) {
    const p = parseLeadMagnet(body);
    if (!p.ok) return p;
    return {
      ok: true,
      data: p.meta,
      lead: { ...p.contact, score: null, headline: "Baixou o Dashboard da Clínica (planilha)", reportUrl: toolUrl("dashboard-clinica") },
    };
  },

  prompt: () => null,

  message(lead) {
    return downloadMessage(
      lead.name,
      `Aqui está o Dashboard da Clínica para a *${lead.clinic}*: 10 minutos toda segunda para saber quanto custou cada paciente e qual canal trouxe receita.`,
      [
        ["Versão em branco (para a sua clínica)", fileUrl("dashboard-clinica.xlsx")],
        ["Exemplo preenchido (clínica fictícia)", fileUrl("dashboard-clinica-demo.xlsx")],
      ],
      `No Google Sheets: Arquivo → Importar → Fazer upload. Ficou alguma dúvida para preencher? É só responder esta mensagem. 😊`
    );
  },

  auditData(lead, d) {
    return {
      source: "dashboard_clinica",
      businessType: "dentista",
      clinicName: lead.clinic,
      email: lead.email,
      city: lead.city || "Nao informada",
      especialidade: d.especialidade,
      overallScore: null,
      keyFindings: ["Baixou o Dashboard da Clínica (planilha semanal)"],
      recommendations: ["Lançar investimento, agendamentos e receita toda segunda", "Comparar canais pelo custo por paciente fechado"],
    };
  },
};
