// "Diagnóstico gratuito" request form (homepage and /contato, src/components/sections/CTAFinal.tsx).
// No phone field, so no AI plan or WhatsApp report: the lead is stored and the team is
// alerted on Telegram to get in touch by e-mail within 24 business hours, as the form promises.
import { obj, str, type ToolAdapter } from "../types";

export const CHALLENGES = {
  agenda: "Agenda com muitos horários vazios",
  pacientes: "Preciso de mais pacientes qualificados",
  digital: "Não tenho presença digital forte",
  concorrencia: "Concorrência está me tirando pacientes",
  gestao: "Não tenho tempo para cuidar do marketing",
} as const;

type ChallengeId = keyof typeof CHALLENGES;

interface DiagnosticoData {
  challenge: ChallengeId;
  consent: true;
}

const isChallenge = (v: string): v is ChallengeId => v in CHALLENGES;

export const diagnosticoGratuito: ToolAdapter<DiagnosticoData> = {
  id: "diagnostico-gratuito",
  label: "Diagnóstico Gratuito (site)",
  requiresPhone: false,

  parse(body) {
    const b = obj(body);
    // Honeypot: a hidden field people never fill in.
    if (str(b.website)) return { ok: false, error: "Envio invalido" };
    const name = str(b.name);
    const clinic = str(b.clinic);
    const email = str(b.email);
    const challenge = str(b.challenge);
    if (!name || !clinic || !email) return { ok: false, error: "Nome, clinica e e-mail sao obrigatorios" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "E-mail invalido" };
    if (!isChallenge(challenge)) return { ok: false, error: "Desafio invalido" };
    if (b.consent !== true) return { ok: false, error: "Consentimento obrigatorio" };
    return {
      ok: true,
      data: { challenge, consent: true },
      lead: {
        name,
        phone: "",
        email,
        clinic,
        city: null,
        score: null,
        headline: `Pediu diagnóstico — ${CHALLENGES[challenge]}`,
        reportUrl: null,
      },
    };
  },

  prompt() {
    return null;
  },

  // Only used if a phone is ever added to the form.
  message(lead, d) {
    return [
      `Ola ${lead.name}! Recebemos seu pedido de diagnostico gratuito para a *${lead.clinic}*.`,
      ``,
      `Desafio informado: ${CHALLENGES[d.challenge]}.`,
      ``,
      `Nossa equipe vai entrar em contato em ate 24 horas uteis para agendar sua analise.`,
    ].join("\n");
  },

  auditData(lead, d) {
    return {
      source: "diagnostico_gratuito",
      businessType: "dentista",
      clinicName: lead.clinic,
      email: lead.email,
      city: "Nao informada",
      overallScore: null,
      keyFindings: [CHALLENGES[d.challenge]],
      recommendations: [],
    };
  },
};
