// Calculadora de CAC (/ferramentas/calculadora-cac, Eps 1, 2, 3). The page sends the visitor's inputs
// (clinic economics, no personal data) with the spreadsheet request; every number is re-computed here
// with the page's own module (src/tools/calculadora-cac/calc.js). With real numbers the lead gets a
// short AI analysis on WhatsApp; with the example clinic (or no numbers) only the downloads.
import * as LKCalc from "@/tools/calculadora-cac/calc";
import { arr, brl, num, obj, str, WHATSAPP_PLAN_RULES, type ToolAdapter } from "../types";
import { downloadMessage, fileUrl, parseLeadMagnet, toolUrl, type LeadMagnetMeta } from "./lead-magnet";

interface Funnel { invest: number; fixos: number; leads: number; qual: number; agend: number; comp: number; fech: number }

interface CacData extends LeadMagnetMeta {
  /** False when the visitor used the example clinic or left the calculator empty. */
  hasNumbers: boolean;
  funnel: Funnel | null;
  cacAds: number | null;
  cacReal: number | null;
  roas: number | null;
  roi: number | null;
  ltvCac: number | null;
  /** Funnel step whose improvement lowers CAC the most, and the CAC it would give. */
  maiorAlavanca: { label: string; cac: number | null; rate: number | null } | null;
  cacMaisAnuncios: number | null;
  procs: Array<{ nome: string; cac: number | null; lucroAposCac: number | null }>;
}

const pct = (v: number | null | undefined) => (v == null ? "–" : `${Math.round(v * 100)}%`);
const money = (v: number | null | undefined) => (v == null ? "–" : brl(v, 2));

export const calculadoraCac: ToolAdapter<CacData> = {
  id: "calculadora-cac",
  label: "Calculadora de CAC",
  requiresPhone: true,
  maxTokens: 700,

  parse(body) {
    const p = parseLeadMagnet(body);
    if (!p.ok) return p;
    const inp = obj(p.data.inputs);
    const n = (k: string) => num(inp[k]) ?? 0;
    const funnel: Funnel = { invest: n("invest"), fixos: n("fixos"), leads: n("leads"), qual: n("qual"), agend: n("agend"), comp: n("comp"), fech: n("fech") };
    const hasNumbers = p.data.example !== true && funnel.fech > 0 && funnel.invest + funnel.fixos > 0;

    const empty: CacData = {
      ...p.meta, hasNumbers: false, funnel: null, cacAds: null, cacReal: null, roas: null, roi: null, ltvCac: null,
      maiorAlavanca: null, cacMaisAnuncios: null, procs: [],
    };
    if (!hasNumbers) {
      return {
        ok: true,
        data: empty,
        lead: { ...p.contact, score: null, headline: "Baixou a planilha de CAC" + (p.data.example === true ? " (usou o exemplo)" : ""), reportUrl: toolUrl("calculadora-cac") },
      };
    }

    const r = LKCalc.compute({
      invest: funnel.invest, fixos: funnel.fixos, salario: n("salario"), pctSec: n("pctSec"),
      leads: funnel.leads, qual: funnel.qual, agend: funnel.agend, comp: funnel.comp, fech: funnel.fech,
      volta: n("volta"), retorno: n("retorno"), anos: n("anos") || 1,
      procs: arr(inp.procs).slice(0, 20).map((x) => {
        const o = obj(x);
        return { nome: str(o.nome).slice(0, 60), fech: num(o.fech) ?? 0, ticket: num(o.ticket) ?? 0, margem: num(o.margem) ?? 0 };
      }),
    });
    const best = r.onde.find((o: { key: string }) => o.key === r.maiorAlavanca) as { label: string; cac: number | null; rate: number | null } | undefined;
    const data: CacData = {
      ...p.meta,
      hasNumbers: true,
      funnel,
      cacAds: r.cacAds,
      cacReal: r.cacReal,
      roas: r.roas,
      roi: r.roi,
      ltvCac: r.ltvCac,
      maiorAlavanca: best ? { label: best.label, cac: best.cac, rate: best.rate } : null,
      cacMaisAnuncios: r.maisAnuncios.cac,
      procs: (r.procs as Array<{ nome: string; cac: number | null; lucroAposCac: number | null }>)
        .filter((x) => x.nome)
        .map((x) => ({ nome: x.nome, cac: x.cac, lucroAposCac: x.lucroAposCac })),
    };
    return {
      ok: true,
      data,
      lead: {
        ...p.contact,
        score: r.cacReal == null ? null : Math.round(r.cacReal),
        headline: `CAC real ${money(r.cacReal)} (anúncios ${money(r.cacAds)})` + (best ? ` · alavanca: ${best.label}` : ""),
        reportUrl: toolUrl("calculadora-cac"),
      },
    };
  },

  prompt(lead, d) {
    if (!d.hasNumbers || !d.funnel) return null;
    const f = d.funnel;
    const procs = d.procs.map((x) => `- ${x.nome}: CAC ${money(x.cac)}, lucro apos CAC ${money(x.lucroAposCac)}`).join("\n");
    return `Voce e consultor da LK Digital (marketing e funil para clinicas odontologicas no Brasil). Uma clinica preencheu a Calculadora de CAC com os numeros de um mes. Escreva uma analise curta.

CLINICA: ${lead.clinic} (${lead.city || "cidade nao informada"})

FUNIL DO MES: ${f.leads} leads → ${f.qual} qualificados → ${f.agend} agendados → ${f.comp} compareceram → ${f.fech} fecharam
Anuncios: ${brl(f.invest)} · Custos fixos de marketing: ${brl(f.fixos)}
CAC so anuncios: ${money(d.cacAds)} · CAC real: ${money(d.cacReal)}
ROAS: ${d.roas == null ? "–" : d.roas.toFixed(1)} · ROI: ${pct(d.roi)} · LTV:CAC: ${d.ltvCac == null ? "–" : d.ltvCac.toFixed(1)}
Maior alavanca: ${d.maiorAlavanca ? `${d.maiorAlavanca.label} (taxa atual ${pct(d.maiorAlavanca.rate)}; recuperando 20% de quem se perde ali, o CAC real iria para ${money(d.maiorAlavanca.cac)})` : "–"}
Com 20% a mais de anuncios e o mesmo funil, o CAC real seria ${money(d.cacMaisAnuncios)}
${procs ? `PROCEDIMENTOS:\n${procs}` : ""}

Explique a diferenca entre CAC so de anuncios e CAC real em uma frase e foque na maior alavanca do funil. Use apenas os numeros acima; nao invente estatisticas nem prometa resultados.
${WHATSAPP_PLAN_RULES}`;
  },

  message(lead, d, plan) {
    const links: Array<[string, string]> = [
      ["Planilha da calculadora (.xlsx)", fileUrl("calculadora-cac.xlsx")],
      ["Calculadora online", toolUrl("calculadora-cac")],
    ];
    if (!d.hasNumbers) {
      return downloadMessage(
        lead.name,
        `Aqui está a Calculadora de CAC da LK Digital para a *${lead.clinic}*: a mesma lógica da página, em planilha, para refazer a conta todo mês.`,
        links,
        `Quando preencher com os números da clínica, me conta qual etapa do funil pesou mais. 😊`
      );
    }
    const lines = [
      `Olá ${lead.name}! 👋`,
      ``,
      `Aqui está a análise de CAC da *${lead.clinic}*:`,
      ``,
      `💰 *CAC real:* ${money(d.cacReal)}`,
      `📣 *CAC só anúncios:* ${money(d.cacAds)}`,
    ];
    if (d.maiorAlavanca) lines.push(`🎯 *Maior alavanca:* ${d.maiorAlavanca.label} (CAC real iria para ${money(d.maiorAlavanca.cac)})`);
    if (plan) lines.push(``, `📋 *Análise:*`, ``, plan);
    lines.push(``, ...links.flatMap(([label, url]) => [`📎 *${label}:*`, url]));
    lines.push(``, `---`, ``, `Quer ver em que outras etapas a clínica perde pacientes? Faça o RAIO-X (3 minutos):`, toolUrl("raio-x"));
    return lines.join("\n");
  },

  auditData(lead, d) {
    return {
      source: "calculadora_cac",
      businessType: "dentista",
      clinicName: lead.clinic,
      email: lead.email,
      city: lead.city || "Nao informada",
      especialidade: d.especialidade,
      overallScore: null,
      keyFindings: d.hasNumbers
        ? [`CAC real ${money(d.cacReal)} (só anúncios ${money(d.cacAds)})`, ...(d.maiorAlavanca ? [`Maior alavanca: ${d.maiorAlavanca.label}`] : [])]
        : ["Baixou a planilha de CAC sem preencher números"],
      recommendations: d.maiorAlavanca ? [`Melhorar a etapa ${d.maiorAlavanca.label} antes de aumentar anúncios`] : [],
    };
  },
};
