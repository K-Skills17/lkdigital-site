// Ported from K-Skills17/calculadora-agenda api/send-whatsapp.js
import { arr, brl, num, obj, optStr, str, strArr, WHATSAPP_PLAN_RULES, type ToolAdapter } from "../types";

interface Procedure {
  nome: string;
  receitaPorHora: number;
  tempoMinutos: number;
  quantidadeAtual: number;
  quantidadeIdeal: number;
}

interface AgendaData {
  receitaAtual: string;
  receitaIdeal: string;
  receitaExtra: string;
  horaAtual: string;
  horaIdeal: string;
  horasEconomizadas: string;
  worstMismatch: string | null;
  procedures: Procedure[];
  topIssues: string[];
}

export const calculadoraAgenda: ToolAdapter<AgendaData> = {
  id: "calculadora-agenda",
  label: "Calculadora de Agenda",
  requiresPhone: true,

  parse(body) {
    const b = obj(body);
    const a = obj(b.agendaData);
    const name = str(b.name);
    const clinic = str(b.clinicName);
    if (!name || !str(b.phone) || !clinic) {
      return { ok: false, error: "Nome, telefone e nome da clinica sao obrigatorios" };
    }
    const data: AgendaData = {
      receitaAtual: str(a.receitaAtual),
      receitaIdeal: str(a.receitaIdeal),
      receitaExtra: str(a.receitaExtra),
      horaAtual: str(a.horaAtual),
      horaIdeal: str(a.horaIdeal),
      horasEconomizadas: str(a.horasEconomizadas),
      worstMismatch: optStr(a.worstMismatch),
      procedures: arr(a.procedures).map((p) => {
        const o = obj(p);
        return {
          nome: str(o.nome),
          receitaPorHora: num(o.receitaPorHora) ?? 0,
          tempoMinutos: num(o.tempoMinutos) ?? 0,
          quantidadeAtual: num(o.quantidadeAtual) ?? 0,
          quantidadeIdeal: num(o.quantidadeIdeal) ?? 0,
        };
      }),
      topIssues: strArr(b.topIssues),
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
        score: num(b.score),
        headline: `Ganho potencial +${data.receitaExtra}/mês (atual ${data.receitaAtual})`,
        reportUrl: optStr(b.reportUrl),
      },
    };
  },

  prompt(lead, d) {
    const procedures = d.procedures
      .map((p) => `- ${p.nome}: ${brl(p.receitaPorHora, 2)}/hora, ${p.tempoMinutos}min, atual ${p.quantidadeAtual}/sem → ideal ${p.quantidadeIdeal}/sem`)
      .join("\n");
    return `Voce e um consultor de gestao de agenda para clinicas odontologicas no Brasil. Analise os dados desta calculadora de agenda e crie um plano de acao personalizado.

DADOS DO LEAD:
- Nome: ${lead.name}
- Clinica: ${lead.clinic}
- Score de otimizacao: ${lead.score ?? "?"}%

ANALISE DA AGENDA:
- Receita atual: ${d.receitaAtual}
- Receita ideal: ${d.receitaIdeal}
- Ganho potencial: ${d.receitaExtra}
- Valor/hora atual: ${d.horaAtual}
- Valor/hora ideal: ${d.horaIdeal}
- Horas economizaveis: ${d.horasEconomizadas}

PROCEDIMENTOS (ranking por receita/hora):
${procedures || "Nao informado"}

PIOR DESALINHAMENTO: ${d.worstMismatch || "Nenhum identificado"}

Foque em: otimizacao de tempo de cadeira, mix de procedimentos, eficiencia de agenda.
${WHATSAPP_PLAN_RULES}`;
  },

  message(lead, d, plan) {
    const lines = [
      `Ola ${lead.name}! 👋`,
      ``,
      `Aqui esta a analise da agenda da *${lead.clinic}*:`,
      ``,
      `📊 *Score de Otimizacao: ${lead.score ?? "—"}%*`,
      ``,
      `💰 *Receita atual:* ${d.receitaAtual}`,
      `📈 *Receita ideal:* ${d.receitaIdeal}`,
      `✨ *Ganho potencial:* +${d.receitaExtra}/mes`,
    ];
    if (d.horasEconomizadas && d.horasEconomizadas !== "0.0h/semana") {
      lines.push(`⏰ *Economia de tempo:* ${d.horasEconomizadas}`);
    }
    if (plan) {
      lines.push(``, `📋 *Seu plano de acao personalizado:*`, ``, plan);
    } else if (d.topIssues.length > 0) {
      lines.push(``, `⚠️ *Principais achados:*`, ...d.topIssues.slice(0, 4).map((issue, i) => `   ${i + 1}. ${issue}`));
    }
    if (lead.reportUrl) lines.push(``, `📊 *Relatorio completo:*`, lead.reportUrl);
    lines.push(
      ``,
      `---`,
      ``,
      `Quer atrair exatamente os pacientes de alto valor para preencher sua agenda ideal?`,
      ``,
      `Me conta: qual procedimento voce mais gostaria de aumentar na sua agenda? 😊`
    );
    return lines.join("\n");
  },

  auditData(lead, d) {
    return {
      source: "calculadora_agenda",
      businessType: "dentista",
      clinicName: lead.clinic,
      email: lead.email,
      city: lead.city || "Nao informada",
      overallScore: lead.score,
      keyFindings: d.topIssues.slice(0, 5),
      recommendations: d.procedures
        .slice(0, 5)
        .map((p) => `${p.nome}: de ${p.quantidadeAtual}/sem para ${p.quantidadeIdeal}/sem (${brl(p.receitaPorHora, 2)}/hora)`),
    };
  },
};
