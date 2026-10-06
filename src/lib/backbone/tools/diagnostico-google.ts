// K-Skills17/diagnostico-google had no backend — leads only went to a Google
// Sheet. On the backbone it gets the same routine as every other tool.
import { arr, num, obj, optStr, str, type Obj, type ToolAdapter } from "../types";

interface GbpData {
  gradeLabel: string;
  sectionScores: Array<{ title: string; percent: number }>;
  actionItems: Array<{ text: string; impact: string }>;
  answers: Obj;
}

export const diagnosticoGoogle: ToolAdapter<GbpData> = {
  id: "diagnostico-google",
  label: "Diagnóstico Google Meu Negócio",
  // The original form only required e-mail; WhatsApp is optional here.
  requiresPhone: false,

  parse(body) {
    const b = obj(body);
    const name = str(b.name);
    const clinic = str(b.clinicName);
    if (!name || !clinic || (!str(b.email) && !str(b.phone))) {
      return { ok: false, error: "Nome, clinica e e-mail ou WhatsApp sao obrigatorios" };
    }
    const r = obj(b.results);
    const data: GbpData = {
      gradeLabel: str(r.gradeLabel),
      sectionScores: arr(r.sectionScores).map((s) => {
        const o = obj(s);
        return { title: str(o.title), percent: num(o.percent) ?? 0 };
      }),
      actionItems: arr(r.actionItems).map((a) => {
        const o = obj(a);
        return { text: str(o.text), impact: str(o.impact) };
      }),
      answers: obj(r.answers),
    };
    const score = num(r.totalScore);
    return {
      ok: true,
      data,
      lead: {
        name,
        phone: str(b.phone),
        email: optStr(b.email),
        clinic,
        city: optStr(b.city),
        score,
        headline: `Perfil Google ${score ?? "?"}/100 (${data.gradeLabel || "—"})`,
        reportUrl: optStr(b.reportUrl),
      },
    };
  },

  prompt(lead, d) {
    const sections = d.sectionScores.map((s) => `- ${s.title}: ${s.percent}%`).join("\n");
    const actions = d.actionItems.map((a) => `- [${a.impact}] ${a.text}`).join("\n");
    return `Voce e um consultor de SEO local especializado em clinicas odontologicas no Brasil. Analise o diagnostico do Perfil da Empresa no Google (Google Meu Negocio) desta clinica e crie um plano de acao personalizado.

DADOS DO LEAD:
- Nome: ${lead.name}
- Clinica: ${lead.clinic}
- Cidade: ${lead.city || "nao informada"}
- Nota geral: ${lead.score ?? "?"}/100 (${d.gradeLabel})

NOTA POR AREA:
${sections || "Nao informado"}

PONTOS FRACOS IDENTIFICADOS:
${actions || "Nenhum"}

INSTRUCOES:
- Escreva em portugues brasileiro, tom profissional mas amigavel
- Maximo 3-4 acoes prioritarias, cada uma com 1-2 frases curtas
- Foque no que faz a clinica aparecer mais no Google Maps e receber mais ligacoes
- NAO use markdown. Use formatacao WhatsApp: *negrito* para destaques
- Mantenha CURTO — maximo 500 caracteres no total do plano
- Retorne APENAS o plano de acao, sem introducao ou conclusao`;
  },

  message(lead, d, plan) {
    const lines = [
      `Ola ${lead.name}! 👋`,
      ``,
      `Aqui esta o diagnostico do Google Meu Negocio da *${lead.clinic}*:`,
      ``,
      `🏆 *Nota: ${lead.score ?? "—"}/100 — ${d.gradeLabel}*`,
    ];
    if (d.sectionScores.length) {
      lines.push(``, ...d.sectionScores.map((s) => `${s.percent >= 70 ? "✅" : s.percent >= 50 ? "⚠️" : "❌"} ${s.title}: ${s.percent}%`));
    }
    if (plan) {
      lines.push(``, `📋 *Seu plano de acao personalizado:*`, ``, plan);
    } else if (d.actionItems.length) {
      lines.push(``, `📋 *Prioridades:*`, ...d.actionItems.slice(0, 4).map((a, i) => `   ${i + 1}. ${a.text}`));
    }
    if (lead.reportUrl) lines.push(``, `📊 *Relatorio completo:*`, lead.reportUrl);
    lines.push(
      ``,
      `---`,
      ``,
      `Quer que a *${lead.clinic}* apareca no topo do Google quando pacientes buscam dentista na sua regiao?`,
      ``,
      `Me conta: hoje a maioria dos seus pacientes novos chega por indicacao ou pelo Google? 😊`
    );
    return lines.join("\n");
  },

  auditData(lead, d) {
    return {
      source: "diagnostico_google",
      businessType: "dentista",
      overallScore: lead.score,
      keyFindings: d.sectionScores.filter((s) => s.percent < 50).map((s) => `${s.title}: ${s.percent}%`),
      recommendations: d.actionItems.map((a) => a.text),
    };
  },
};
