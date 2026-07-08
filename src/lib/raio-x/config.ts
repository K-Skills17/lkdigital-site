// lib/raio-x/config.ts
// Single source of truth for the RAIO-X scorecard funnel.
// All questions, scale, weights, domains, thresholds, and routing live here.
// Marcos's edits and threshold tuning = config-only, no component changes required.

export type DomainKey = "visibilidade" | "operacao";
export type DualRouteStrategy = "lk-primary" | "show-both" | "severity-weighted";

export interface Question {
  id: string;
  domain: DomainKey;
  weight: number;
  text: string; // CFO-271 — process/method language only
}

export interface DomainConfig {
  label: string;
  routesTo: "lk" | "marcos";
  /** 0.0–1.0 — score below this = gap in this domain */
  gapThreshold: number;
}

export interface RaioXConfig {
  scale: { value: number; label: string }[];
  domains: Record<DomainKey, DomainConfig>;
  questions: Question[];
  routing: {
    /** ⚑ DECISION: lk-primary | show-both | severity-weighted */
    dualRouteStrategy: DualRouteStrategy;
    /** ⚑ Fill in: LK call booking link (Cal.com or equivalent) */
    lkBookingUrl: string;
    /** ⚑ Fill in: Marcos/Biodonte booking link, or leave as warm-intro fallback */
    marcosBookingUrl: string;
    /** ⚑ Fill in: WhatsApp number for warm-intro fallback (used when marcosBookingUrl is not set) */
    marcosWaNumber: string;
  };
  flow: {
    /** Gate lead capture position */
    gatePosition: "before-results";
  };
}

export const raioXConfig: RaioXConfig = {
  // CFO-271: 4-point Likert scale — no neutral middle, higher = healthier
  scale: [
    { value: 0, label: "Discordo totalmente" },
    { value: 1, label: "Discordo em parte" },
    { value: 2, label: "Concordo em parte" },
    { value: 3, label: "Concordo totalmente" },
  ],

  domains: {
    visibilidade: {
      label: "Visibilidade & Aquisição",
      routesTo: "lk",
      gapThreshold: 0.6, // flag: domains.visibilidade.gapThreshold
    },
    operacao: {
      label: "Conversão & Operação",
      routesTo: "marcos",
      gapThreshold: 0.6, // flag: domains.operacao.gapThreshold
    },
  },

  // CFO-271: all texts describe process maturity — never promise outcomes, patient counts, or revenue.
  questions: [
    // ── Domínio A — Visibilidade & Aquisição (→ LK Digital) ──
    {
      id: "V1",
      domain: "visibilidade",
      weight: 1,
      text: "Nossa clínica tem um posicionamento claro: os pacientes sabem exatamente pelo que somos referência.",
    },
    {
      id: "V2",
      domain: "visibilidade",
      weight: 1,
      text: "Temos uma fonte previsível de novos pacientes todos os meses, sem depender só de indicação.",
    },
    {
      id: "V3",
      domain: "visibilidade",
      weight: 1,
      text: "Nosso site e Instagram transmitem autoridade e estão ativos e atualizados.",
    },
    {
      id: "V4",
      domain: "visibilidade",
      weight: 1,
      text: "Temos provas visíveis (depoimentos, casos, avaliações) que geram confiança antes do primeiro contato.",
    },
    {
      id: "V5",
      domain: "visibilidade",
      weight: 1,
      text: "Nossa proposta de valor é clara e nos diferencia das outras clínicas da região.",
    },
    {
      id: "V6",
      domain: "visibilidade",
      weight: 1,
      text: "Produzimos conteúdo com consistência para atrair e educar potenciais pacientes.",
    },
    // ── Domínio B — Conversão & Operação Clínica (→ Marcos / Biodonte) ──
    {
      id: "O1",
      domain: "operacao",
      weight: 1,
      text: "A maioria dos orçamentos que apresentamos é aceita pelos pacientes.",
    },
    {
      id: "O2",
      domain: "operacao",
      weight: 1,
      text: "Temos um processo estruturado para apresentar planos de tratamento e conduzir a decisão do paciente.",
    },
    {
      id: "O3",
      domain: "operacao",
      weight: 1,
      text: "Fazemos follow-up consistente dos orçamentos que não fecham na primeira consulta.",
    },
    {
      id: "O4",
      domain: "operacao",
      weight: 1,
      text: "Temos um sistema de retorno e manutenção que traz os pacientes de volta com regularidade.",
    },
    {
      id: "O5",
      domain: "operacao",
      weight: 1,
      text: "Nossa agenda é bem aproveitada: temos poucas faltas e pouca cadeira ociosa.",
    },
    {
      id: "O6",
      domain: "operacao",
      weight: 1,
      text: "A jornada do paciente na clínica é padronizada e gera uma experiência memorável.",
    },
  ],

  routing: {
    dualRouteStrategy: "lk-primary", // flag: routing.dualRouteStrategy
    // ⚑ Set via env var NEXT_PUBLIC_LK_BOOKING_URL
    lkBookingUrl: process.env.NEXT_PUBLIC_LK_BOOKING_URL ?? "#agendar",
    // ⚑ Set via env var NEXT_PUBLIC_MARCOS_BOOKING_URL (or leave empty for warm-intro)
    marcosBookingUrl: process.env.NEXT_PUBLIC_MARCOS_BOOKING_URL ?? "",
    // ⚑ Set via env var NEXT_PUBLIC_MARCOS_WA_NUMBER for warm-intro fallback
    marcosWaNumber: process.env.NEXT_PUBLIC_MARCOS_WA_NUMBER ?? "5511946851028",
  },

  flow: {
    gatePosition: "before-results", // flag: flow.gatePosition
  },
};
