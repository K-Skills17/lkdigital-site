// Ported from K-Skills17/Calculadora-precificac-o api/send-whatsapp.js
import { arr, num, obj, optStr, str, strArr, WHATSAPP_PLAN_RULES, type ToolAdapter } from "../types";

interface Procedure {
  nome: string;
  precoAtual: number | null;
  precoRecomendado: number | null;
  custoTotal: number | null;
  abaixoCusto: boolean;
}

interface PricingData {
  lucroHoraReal: number | null;
  custoPorHora: number | null;
  abaixoCusto: number;
  totalProcedimentos: number;
  topIssues: string[];
  procedures: Procedure[];
}

const money = (v: number | null) => (v == null ? "—" : `R$${Math.round(v)}`);

export const calculadoraPrecificacao: ToolAdapter<PricingData> = {
  id: "calculadora-precificacao",
  label: "Calculadora de Precificação",
  requiresPhone: true,

  parse(body) {
    const b = obj(body);
    const p = obj(b.pricingData);
    const name = str(b.name);
    const clinic = str(b.clinicName);
    if (!name || !str(b.phone) || !clinic) {
      return { ok: false, error: "Nome, telefone e nome da clinica sao obrigatorios" };
    }
    const data: PricingData = {
      lucroHoraReal: num(p.lucroHoraReal),
      custoPorHora: num(p.custoPorHora),
      abaixoCusto: num(p.abaixoCusto) ?? 0,
      totalProcedimentos: num(p.totalProcedimentos) ?? 0,
      topIssues: strArr(p.topIssues),
      procedures: arr(p.procedures).slice(0, 8).map((x) => {
        const o = obj(x);
        return {
          nome: str(o.nome),
          precoAtual: num(o.precoAtual),
          precoRecomendado: num(o.precoRecomendado),
          custoTotal: num(o.custoTotal),
          abaixoCusto: o.abaixoCusto === true,
        };
      }),
    };
    return {
      ok: true,
      data,
      lead: {
        name,
        phone: str(b.phone),
        email: optStr(b.email),
        clinic,
        city: optStr(b.city),
        score: data.lucroHoraReal,
        headline: `Lucro real ${money(data.lucroHoraReal)}/h · ${data.abaixoCusto} de ${data.totalProcedimentos} procedimentos abaixo do custo`,
        reportUrl: optStr(b.reportUrl),
      },
    };
  },

  prompt(lead, d) {
    const procedures = d.procedures
      .map((p) => `- ${p.nome}: cobrado ${money(p.precoAtual)}, custo ${money(p.custoTotal)}, recomendado ${money(p.precoRecomendado)}${p.abaixoCusto ? " [ABAIXO DO CUSTO]" : ""}`)
      .join("\n");
    return `Voce e um consultor de gestao financeira especializado em clinicas odontologicas no Brasil. Analise os dados de precificacao desta clinica e crie um plano de acao personalizado.

DADOS DO LEAD:
- Nome: ${lead.name}
- Clinica: ${lead.clinic}
- Cidade: ${lead.city || "nao informada"}
- Lucro/hora real: ${money(d.lucroHoraReal)}
- Custo fixo por hora de cadeira: ${money(d.custoPorHora)}
- Procedimentos abaixo do custo: ${d.abaixoCusto}
- Total procedimentos analisados: ${d.totalProcedimentos}

PROCEDIMENTOS:
${procedures || "Nenhum detalhe disponivel."}

Foque em: procedimentos subprecificados, margens de lucro, otimizacao de custos, mix de servicos.
${WHATSAPP_PLAN_RULES}`;
  },

  message(lead, d, plan) {
    const lines = [
      `Ola ${lead.name}! 👋`,
      ``,
      `Aqui esta a analise de precificacao da *${lead.clinic}*:`,
      ``,
      `💰 *Lucro real por hora: ${money(d.lucroHoraReal)}*`,
      `🏥 *Custo fixo/hora de cadeira: ${money(d.custoPorHora)}*`,
    ];
    if (d.abaixoCusto > 0) lines.push(`⚠️ *${d.abaixoCusto} procedimento(s) ABAIXO DO CUSTO*`);
    if (plan) {
      lines.push(``, `📋 *Seu plano de acao personalizado:*`, ``, plan);
    } else if (d.topIssues.length > 0) {
      lines.push(``, `⚠️ *Pontos criticos:*`, d.topIssues.slice(0, 4).map((issue, i) => `   ${i + 1}. ${issue}`).join("\n"));
    }
    if (lead.reportUrl) lines.push(``, `📊 *Relatorio completo:*`, lead.reportUrl);
    lines.push(
      ``,
      `---`,
      ``,
      `Quer otimizar a precificacao da *${lead.clinic}* e aumentar seu lucro real por hora?`,
      ``,
      `Me conta: qual desses pontos voce sente que mais impacta seu faturamento hoje? 😊`
    );
    return lines.join("\n");
  },

  auditData(lead, d) {
    return {
      source: "calculadora_precificacao",
      businessType: "dentista",
      overallScore: d.lucroHoraReal,
      keyFindings: d.topIssues.slice(0, 5),
      recommendations: d.procedures
        .filter((p) => p.abaixoCusto)
        .map((p) => `${p.nome}: subir de ${money(p.precoAtual)} para ${money(p.precoRecomendado)}`),
      custoPorHora: d.custoPorHora,
      abaixoCusto: d.abaixoCusto,
      totalProcedimentos: d.totalProcedimentos,
    };
  },
};
