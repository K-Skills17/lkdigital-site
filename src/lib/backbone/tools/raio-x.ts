// RAIO-X da clínica (/raio-x): 3 profile + 12 scored questions over 6 areas of the path from first
// contact to the chair. The browser sends the answers; the score is recomputed here from the same
// module the page uses (src/tools/raio-x/raiox.js), so stored numbers can't be tampered with.
import * as RX from "@/tools/raio-x/raiox";
import { IMPLANT_OFFER_PATH, SITE_URL } from "@/tools/shared/lead-magnets";
import { obj, str, WHATSAPP_PLAN_RULES, type ToolAdapter } from "../types";
import { parseLeadMagnet, toolUrl, type LeadMagnetMeta } from "./lead-magnet";

interface Area { key: string; label: string; pct: number; diagnosis: string; acoes: string[] }

interface RaioXData extends LeadMagnetMeta {
  profile: { especialidade: string; particular: string; anuncios: string };
  /** q1…q12 → points (0–3) and the option label chosen. */
  answers: Record<string, number>;
  answerLabels: Record<string, string>;
  total: number;
  band: string;
  bandDesc: string;
  segment: "oferta" | "nutrir";
  weakest: string;
  weakestLabel: string;
  areas: Area[];
  /** Areas from weakest to strongest. */
  ranked: string[];
}

const CHOSEN = (i: number) => RX.QUESTIONS[i].options.map((o) => o[1] as number);

export const raioX: ToolAdapter<RaioXData> = {
  id: "raio-x",
  label: "RAIO-X da Clínica",
  requiresPhone: true,
  maxTokens: 700,

  parse(body) {
    const p = parseLeadMagnet(body);
    if (!p.ok) return p;
    const a = obj(p.data.answers);
    const labelsIn = obj(p.data.answer_labels);
    const points: number[] = [];
    for (let i = 0; i < RX.QUESTIONS.length; i++) {
      const v = Number(a["q" + (i + 1)]);
      if (!CHOSEN(i).includes(v)) return { ok: false, error: "Respostas do RAIO-X incompletas" };
      points.push(v);
    }
    const profile = { especialidade: str(a.especialidade), particular: str(a.particular), anuncios: str(a.anuncios) };
    const r = RX.score(points);
    const pct = r.areas as Record<string, number>;
    const segment = RX.segment(profile, r.total) as "oferta" | "nutrir";
    const weak = RX.areaByKey(r.weakest)!;
    const answers: Record<string, number> = {};
    const answerLabels: Record<string, string> = {};
    points.forEach((v, i) => {
      answers["q" + (i + 1)] = v;
      answerLabels["q" + (i + 1)] = str(labelsIn["q" + (i + 1)]).slice(0, 200);
    });
    const data: RaioXData = {
      ...p.meta,
      especialidade: p.meta.especialidade || profile.especialidade || null,
      profile, answers, answerLabels,
      total: r.total,
      band: r.band.label,
      bandDesc: r.band.desc,
      segment,
      weakest: r.weakest,
      weakestLabel: weak.label,
      areas: RX.AREAS.map((x) => ({
        key: x.key, label: x.label, pct: pct[x.key], diagnosis: RX.diagnosis(x.key, pct[x.key]), acoes: x.acoes,
      })),
      ranked: r.ranked,
    };
    return {
      ok: true,
      data,
      lead: {
        ...p.contact,
        score: r.total,
        headline: `${r.total}/100 · ${r.band.label} · mais fraco: ${weak.label} · ${segment}`,
        reportUrl: toolUrl("raio-x"),
      },
    };
  },

  prompt(lead, d) {
    const areas = d.areas.map((a) => `- ${a.label}: ${a.pct}% (${a.diagnosis})`).join("\n");
    const weakTwo = d.ranked.slice(0, 2).map((k) => d.areas.find((a) => a.key === k)!);
    return `Voce e consultor da LK Digital, que instala o sistema entre o lead e a cadeira em clinicas odontologicas no Brasil. Uma clinica fez o RAIO-X (12 perguntas) e voce vai escrever o plano de acao dela.

CLINICA: ${lead.clinic} (${lead.city || "cidade nao informada"})
Especialidade: ${d.profile.especialidade || "nao informada"}
Faturamento particular: ${d.profile.particular || "nao informado"}
Investimento em anuncios: ${d.profile.anuncios || "nao informado"}

RESULTADO: ${d.total}/100 (${d.band})
${areas}

AREAS MAIS FRACAS: ${weakTwo.map((a) => a.label).join(" e ")}
Acoes de referencia para elas:
${weakTwo.flatMap((a) => a.acoes.map((x) => `- ${x}`)).join("\n")}

Foque nas 2 areas mais fracas, na ordem do funil. Nao invente estatisticas, percentuais de mercado ou promessas de resultado. Nao fale de precos.
${WHATSAPP_PLAN_RULES}`;
  },

  message(lead, d, plan) {
    const weak = d.areas.find((a) => a.key === d.weakest)!;
    const lines = [
      `Olá ${lead.name}! 👋`,
      ``,
      `Aqui está o RAIO-X da *${lead.clinic}*:`,
      ``,
      `📊 *${d.total}/100 · ${d.band}*`,
      d.bandDesc,
      ``,
      ...d.areas.map((a) => `${a.key === d.weakest ? "⚠️" : "•"} ${a.label}: ${a.pct}%`),
      ``,
      `*Ponto mais fraco: ${weak.label}*`,
      weak.diagnosis,
    ];
    if (plan) lines.push(``, `📋 *Seu plano de ação:*`, ``, plan);
    else lines.push(``, `📋 *Comece por aqui:*`, ...weak.acoes.map((x, i) => `${i + 1}. ${x}`));
    lines.push(``, `Relatório completo: ${toolUrl("raio-x")}`, ``, `---`, ``);
    if (d.segment === "oferta") {
      lines.push(
        `A LK instala esse sistema na sua clínica: resposta, qualificação, agendamento, comparecimento e retorno.`,
        `Veja como funciona: ${SITE_URL}${IMPLANT_OFFER_PATH}`,
        ``,
        `Quer conversar sobre a sua clínica? É só responder esta mensagem. 😊`
      );
    } else {
      const asset = RX.areaByKey(d.weakest)!;
      lines.push(
        `Material gratuito para ${weak.label.toLowerCase()}: ${toolUrl(asset.asset as Parameters<typeof toolUrl>[0])}${asset.assetHash || ""}`,
        ``,
        `Ficou alguma dúvida sobre o resultado? É só responder esta mensagem. 😊`
      );
    }
    return lines.join("\n");
  },

  auditData(lead, d) {
    const weakTwo = d.ranked.slice(0, 2).map((k) => d.areas.find((a) => a.key === k)!);
    return {
      source: "raio_x",
      businessType: "dentista",
      clinicName: lead.clinic,
      email: lead.email,
      city: lead.city || "Nao informada",
      overallScore: d.total,
      band: d.band,
      segment: d.segment,
      especialidade: d.especialidade,
      areaScores: Object.fromEntries(d.areas.map((a) => [a.key, a.pct])),
      keyFindings: weakTwo.map((a) => `${a.label} (${a.pct}%): ${a.diagnosis}`),
      recommendations: weakTwo.flatMap((a) => a.acoes),
    };
  },
};
