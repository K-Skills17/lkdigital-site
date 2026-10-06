// Ported from K-Skills17/Fb-lead-audit-tool src/app/api/send-whatsapp/route.ts
import { arr, num, obj, optStr, str, strArr, type ToolAdapter } from "../types";

interface AuditCheck {
  category: string;
  name: string;
  passed: boolean;
  severity: string;
  message: string;
}

interface SiteAuditData {
  siteUrl: string;
  topIssues: string[];
  checks: AuditCheck[];
}

export const auditoriaSite: ToolAdapter<SiteAuditData> = {
  id: "auditoria-site",
  label: "Auditoria de Site",
  requiresPhone: true,

  parse(body) {
    const b = obj(body);
    const name = str(b.name);
    const clinic = str(b.clinicName);
    if (!name || !str(b.phone) || !clinic) {
      return { ok: false, error: "Nome, telefone e nome da clinica sao obrigatorios" };
    }
    const data: SiteAuditData = {
      siteUrl: str(b.siteUrl),
      topIssues: strArr(b.topIssues),
      checks: arr(b.checks).map((c) => {
        const o = obj(c);
        return {
          category: str(o.category),
          name: str(o.name),
          passed: o.passed === true,
          severity: str(o.severity),
          message: str(o.message),
        };
      }),
    };
    const score = num(b.score);
    return {
      ok: true,
      data,
      lead: {
        name,
        phone: str(b.phone),
        email: optStr(b.email),
        clinic,
        city: null,
        score,
        headline: `Site ${data.siteUrl} · nota ${score ?? "?"}/100 · ${data.checks.filter((c) => !c.passed).length} problemas`,
        reportUrl: optStr(b.reportUrl),
      },
    };
  },

  prompt(lead, d) {
    const failed = d.checks
      .filter((c) => !c.passed)
      .map((c) => `- [${c.severity.toUpperCase()}] ${c.name}: ${c.message}`)
      .join("\n");
    const passed = d.checks
      .filter((c) => c.passed)
      .map((c) => `- ${c.name}: ${c.message}`)
      .join("\n");
    return `Voce e um consultor de marketing digital especializado em clinicas e negocios locais no Brasil. Analise os resultados dessa auditoria de site e crie um plano de acao personalizado.

DADOS DO LEAD:
- Nome: ${lead.name}
- Clinica: ${lead.clinic}
- Site: ${d.siteUrl}
- Nota: ${lead.score ?? "?"}/100

PROBLEMAS ENCONTRADOS:
${failed || "Nenhum problema critico encontrado."}

O QUE ESTA BOM:
${passed || "Nenhum item aprovado."}

INSTRUCOES:
- Escreva em portugues brasileiro, tom profissional mas amigavel
- Maximo 3-4 acoes prioritarias, cada uma com 1-2 frases curtas
- Foque nas acoes que trariam mais pacientes/clientes
- Seja especifico para o contexto de clinica/negocio local
- NAO use markdown. Use formatacao WhatsApp: *negrito* para destaques
- Mantenha CURTO — maximo 400 caracteres no total do plano
- Retorne APENAS o plano de acao, sem introducao ou conclusao`;
  },

  message(lead, d, plan) {
    const lines = [
      `Ola ${lead.name}! 👋`,
      ``,
      `Aqui esta a analise completa do site da *${lead.clinic}*:`,
      ``,
      `🏆 *Nota: ${lead.score ?? "—"}/100*`,
    ];
    if (plan) {
      lines.push(``, `📋 *Seu plano de acao personalizado:*`, ``, plan);
    } else if (d.topIssues.length > 0) {
      lines.push(``, `⚠️ *Principais pontos para melhorar:*`, d.topIssues.slice(0, 5).map((issue, i) => `   ${i + 1}. ${issue}`).join("\n"));
    }
    if (lead.reportUrl) lines.push(``, `📊 *Relatorio completo:*`, lead.reportUrl);
    lines.push(
      ``,
      `---`,
      ``,
      `Quer corrigir esses pontos e atrair mais pacientes para a *${lead.clinic}*?`,
      ``,
      `Me conta: qual desses pontos voce sente que mais impacta o seu negocio hoje? 😊`
    );
    return lines.join("\n");
  },

  auditData(lead, d) {
    return {
      source: "auditoria_site",
      siteUrl: d.siteUrl,
      overallScore: lead.score,
      keyFindings: d.topIssues.slice(0, 5),
      recommendations: d.checks.filter((c) => !c.passed).slice(0, 5).map((c) => c.message),
    };
  },
};
