// Ported from K-Skills17/simulador-convenio api/send-whatsapp.js
import { arr, brl, num, obj, optStr, str, type ToolAdapter } from "../types";

interface PlanResult {
  nome: string;
  score: number;
  classificacao: "verde" | "amarelo" | "vermelho" | string;
  perdaTotal: number;
}

interface ConvenioData {
  receitaPrivada: number | null;
  planResults: PlanResult[];
}

const STATUS: Record<string, [string, string]> = {
  verde: ["✅", "Rentavel"],
  amarelo: ["⚠️", "No limite"],
  vermelho: ["❌", "Prejuizo"],
};

export const simuladorConvenios: ToolAdapter<ConvenioData> = {
  id: "simulador-convenios",
  label: "Simulador de Convênios",
  requiresPhone: true,

  parse(body) {
    const b = obj(body);
    const name = str(b.name);
    const clinic = str(b.clinicName);
    if (!name || !str(b.phone) || !clinic) {
      return { ok: false, error: "Nome, telefone e nome da clinica sao obrigatorios" };
    }
    const data: ConvenioData = {
      receitaPrivada: num(b.receitaPrivada),
      planResults: arr(b.planResults).map((p) => {
        const o = obj(p);
        return {
          nome: str(o.nome),
          score: num(o.score) ?? 0,
          classificacao: str(o.classificacao),
          perdaTotal: num(o.perdaTotal) ?? 0,
        };
      }),
    };
    const losing = data.planResults.filter((p) => p.classificacao === "vermelho").length;
    return {
      ok: true,
      data,
      lead: {
        name,
        phone: str(b.phone),
        email: optStr(b.email),
        clinic,
        city: optStr(b.cidade) ?? optStr(b.city),
        score: num(b.score),
        headline: `Nota ${num(b.score) ?? "?"}/100 · ${losing} de ${data.planResults.length} convênios no prejuízo`,
        reportUrl: optStr(b.reportUrl),
      },
    };
  },

  maxTokens: 800,

  prompt(lead, d) {
    const plans = d.planResults
      .map((p) => `- ${p.nome}: ${p.classificacao.toUpperCase()} (reembolso ${p.score}%, perda ${brl(p.perdaTotal)}/mes)`)
      .join("\n");
    return `Voce e um consultor especializado em gestao de clinicas odontologicas no Brasil. Analise os convenios dessa clinica e de conselhos praticos e personalizados.

DADOS:
- Nome: ${lead.name}
- Clinica: ${lead.clinic}
- Nota geral: ${lead.score ?? "?"}/100
- Receita particular estimada: ${d.receitaPrivada != null ? brl(d.receitaPrivada) : "?"}/mes

CONVENIOS ANALISADOS:
${plans}

INSTRUCOES:
- Escreva em portugues brasileiro, tom profissional mas amigavel
- Maximo 3 acoes prioritarias, cada uma com 1-2 frases
- Foque em decisoes praticas: manter, renegociar ou descredenciar
- NAO use markdown. Use formatacao WhatsApp: *negrito* para destaques
- Maximo 500 caracteres no total
- Retorne APENAS as recomendacoes, sem introducao`;
  },

  message(lead, d, plan) {
    const lines = [
      `Ola ${lead.name}! 👋`,
      ``,
      `Aqui esta a analise dos convenios da *${lead.clinic}*:`,
      ``,
      `🏆 *Nota geral: ${lead.score ?? "—"}/100*`,
    ];
    if (plan) {
      lines.push(``, `📋 *Recomendacoes personalizadas:*`, ``, plan);
    } else {
      const summary = d.planResults
        .slice(0, 5)
        .map((p) => {
          const [emoji, label] = STATUS[p.classificacao] ?? STATUS.vermelho;
          return `   ${emoji} ${p.nome}: ${label}`;
        })
        .join("\n");
      lines.push(``, `📊 *Seus convenios:*`, summary);
    }
    if (lead.reportUrl) lines.push(``, `📊 *Relatorio completo:*`, lead.reportUrl);
    lines.push(
      ``,
      `---`,
      ``,
      `Quer otimizar a rentabilidade dos convenios da *${lead.clinic}*?`,
      ``,
      `Me conta: voce ja pensou em renegociar ou descredenciar algum plano? 😊`
    );
    return lines.join("\n");
  },

  auditData(lead, d) {
    return {
      source: "simulador_convenios",
      businessType: "dentista",
      overallScore: lead.score,
      keyFindings: d.planResults
        .filter((p) => p.classificacao === "vermelho")
        .map((p) => `${p.nome}: prejuizo de ${brl(p.perdaTotal)}/mes`),
      recommendations: d.planResults.map((p) => `${p.nome}: ${p.classificacao}`),
    };
  },
};
