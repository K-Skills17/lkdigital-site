// Ported from K-Skills17/LK-diagnostico-clinica api/send-whatsapp.js
import { brl, num, obj, optStr, str, type Obj, type ToolAdapter } from "../types";

interface DiagnosticData {
  inputs: Obj;
  results: {
    perdaTotal: number;
    perdaAnual: number;
    perdaFaltas: number;
    perdaOrcamentos: number;
    perdaRetorno: number;
    desperdicioMarketing: number;
    receitaAtual: number;
    receitaPotencial: number;
    custoPorPaciente: number;
    faltasPorMes: number;
    orcamentosRecusados: number;
    pacientesQueNaoVoltam: number;
  };
}

const RESULT_KEYS = [
  "perdaTotal", "perdaAnual", "perdaFaltas", "perdaOrcamentos", "perdaRetorno",
  "desperdicioMarketing", "receitaAtual", "receitaPotencial", "custoPorPaciente",
  "faltasPorMes", "orcamentosRecusados", "pacientesQueNaoVoltam",
] as const;

export const diagnosticoClinica: ToolAdapter<DiagnosticData> = {
  id: "diagnostico-clinica",
  label: "Diagnóstico de Clínica",
  requiresPhone: true,

  parse(body) {
    const b = obj(body);
    const l = obj(b.lead);
    const name = str(l.nome);
    const clinic = str(l.clinica);
    if (!name || !str(l.whatsapp) || !clinic) {
      return { ok: false, error: "Nome, telefone e nome da clinica sao obrigatorios" };
    }
    const r = obj(b.results);
    const results = Object.fromEntries(RESULT_KEYS.map((k) => [k, num(r[k]) ?? 0])) as DiagnosticData["results"];
    return {
      ok: true,
      data: { inputs: obj(b.inputs), results },
      lead: {
        name,
        phone: str(l.whatsapp),
        email: optStr(l.email),
        clinic,
        city: optStr(l.cidade),
        score: results.perdaTotal,
        headline: `Perda de ${brl(results.perdaTotal)}/mês (${brl(results.perdaAnual)}/ano)`,
        reportUrl: optStr(b.resultsUrl),
      },
    };
  },

  prompt(lead, { inputs, results: r }) {
    return `Voce e um consultor financeiro especializado em clinicas odontologicas no Brasil. Analise o diagnostico financeiro desta clinica e crie um plano de acao personalizado com 3-4 recomendacoes especificas.

DADOS DA CLINICA:
- Clinica: ${lead.clinic}
- Cidade: ${lead.city || "Nao informada"}

DIAGNOSTICO FINANCEIRO:
- Receita atual: ${brl(r.receitaAtual)}/mes
- Receita potencial: ${brl(r.receitaPotencial)}/mes
- Perda total: ${brl(r.perdaTotal)}/mes (${brl(r.perdaAnual)}/ano)

DETALHAMENTO DAS PERDAS:
- Faltas: ${brl(r.perdaFaltas)}/mes (${r.faltasPorMes} pacientes/mes)
- Orcamentos recusados: ${brl(r.perdaOrcamentos)}/mes (${r.orcamentosRecusados} recusas/mes)
- Pacientes que nao retornam: ${brl(r.perdaRetorno)}/mes (${r.pacientesQueNaoVoltam} pacientes)
- Desperdicio em marketing: ${brl(r.desperdicioMarketing)}/mes (custo por paciente: ${brl(r.custoPorPaciente)})

DADOS DE ENTRADA:
- Pacientes agendados/mes: ${str(inputs.pacientesAgendados) || "N/A"}
- Ticket medio: ${brl(num(inputs.ticketMedio))}
- Taxa de faltas: ${str(inputs.taxaFaltas) || "N/A"}%
- Taxa de aceite de orcamentos: ${str(inputs.taxaAceite) || "N/A"}%
- Investimento em marketing: ${brl(num(inputs.gastoMarketing))}/mes

INSTRUCOES:
- Escreva em portugues brasileiro, tom profissional mas amigavel
- De exatamente 3-4 acoes prioritarias, cada uma com 1-2 frases curtas
- Foque nas acoes que trariam mais receita imediata baseado nos dados acima
- Seja especifico — use os numeros do diagnostico para justificar cada acao
- Priorize pela maior perda financeira primeiro
- NAO use markdown. Use formatacao WhatsApp: *negrito* para destaques
- Mantenha CURTO — maximo 500 caracteres no total do plano
- Retorne APENAS o plano de acao numerado (1. 2. 3. 4.), sem introducao ou conclusao`;
  },

  message(lead, { results: r }, plan) {
    const lines = [
      `Ola ${lead.name}! 👋`,
      ``,
      `Acabamos de analisar os numeros da *${lead.clinic}* e o resultado e importante.`,
      ``,
      `💰 *Sua clinica esta perdendo ${brl(r.perdaTotal)} por mes*`,
      `Isso equivale a *${brl(r.perdaAnual)} por ano*.`,
      ``,
      `📊 *Detalhamento das perdas:*`,
      ``,
      `❌ *Faltas:* ${brl(r.perdaFaltas)}/mes`,
      `   ${r.faltasPorMes} pacientes nao comparecem`,
      ``,
      `❌ *Orcamentos recusados:* ${brl(r.perdaOrcamentos)}/mes`,
      `   ${r.orcamentosRecusados} orcamentos rejeitados`,
      ``,
      `❌ *Pacientes que nao retornam:* ${brl(r.perdaRetorno)}/mes`,
      `   ${r.pacientesQueNaoVoltam} pacientes perdidos`,
      ``,
      `❌ *Desperdicio em marketing:* ${brl(r.desperdicioMarketing)}/mes`,
      `   Custo por paciente: ${brl(r.custoPorPaciente)}`,
      ``,
      `📈 *Receita atual:* ${brl(r.receitaAtual)}/mes`,
      `📈 *Receita potencial:* ${brl(r.receitaPotencial)}/mes`,
    ];
    if (plan) {
      lines.push(``, `---`, ``, `🎯 *Seu plano de acao personalizado (IA):*`, ``, plan);
    } else {
      lines.push(
        ``,
        `---`,
        ``,
        `🔧 *5 sistemas para corrigir essas perdas:*`,
        ``,
        `1. *Sistema de Confirmacao* — confirmacoes automaticas via WhatsApp para reduzir faltas`,
        `2. *Sistema de Follow-up* — acompanhamento de orcamentos pendentes com mensagens personalizadas`,
        `3. *Sistema de Reativacao* — campanhas automaticas para trazer pacientes inativos de volta`,
        `4. *Sistema de Captacao Inteligente* — otimizar marketing com rastreamento e metricas claras`,
        `5. *Sistema de Indicacoes* — transformar pacientes satisfeitos em promotores da clinica`
      );
    }
    lines.push(
      ``,
      `📊 *Seu relatorio completo:*`,
      lead.reportUrl || "https://lkdigital.odo.br/ferramentas/diagnostico-clinica",
      ``,
      `---`,
      ``,
      `Quer descobrir como implementar essas acoes na *${lead.clinic}* e parar de perder dinheiro?`,
      ``,
      `Qual dessas perdas voce sente que mais impacta a ${lead.clinic} hoje? 😊`
    );
    return lines.join("\n");
  },

  // The original repo sent this as `diagnosticData`, which the chatbot's
  // /webhook/audit-lead ignores — the bot had no context for these leads.
  auditData(lead, { results: r }) {
    return {
      source: "diagnostico_clinica",
      businessType: "dentista",
      overallScore: Math.round(r.perdaTotal),
      keyFindings: [
        `Perda total ${brl(r.perdaTotal)}/mes`,
        `Faltas: ${brl(r.perdaFaltas)}/mes`,
        `Orcamentos recusados: ${brl(r.perdaOrcamentos)}/mes`,
        `Pacientes que nao retornam: ${brl(r.perdaRetorno)}/mes`,
        `Desperdicio em marketing: ${brl(r.desperdicioMarketing)}/mes`,
      ],
      recommendations: [],
      clinicName: lead.clinic,
      city: lead.city,
    };
  },
};
