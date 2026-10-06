// Shared parsing for the lead magnets of the series "O Sistema Operacional da Clínica Odontológica"
// (RAIO-X, checklist, calculator, dashboard, scripts). Their form (src/tools/shared/lead-form.js) sends
//   { name, phone, clinicName, city, email, especialidade, consent, episode, returning, data }
// and every one of them needs a WhatsApp number and explicit LGPD consent.
import { LEAD_MAGNET_CONFIG, SITE_URL } from "@/tools/shared/lead-magnets";
import { obj, optStr, str, type LeadCore, type Obj } from "../types";

export interface LeadMagnetMeta {
  especialidade: string | null;
  /** YouTube episode the visitor came from (?ep=), when present. */
  episode: string | null;
  /** The visitor had already filled the form for another lead magnet. */
  returning: boolean;
}

type Contact = Omit<LeadCore, "score" | "headline" | "reportUrl">;

export function parseLeadMagnet(
  body: unknown
): { ok: true; body: Obj; data: Obj; meta: LeadMagnetMeta; contact: Contact } | { ok: false; error: string } {
  const b = obj(body);
  const name = str(b.name);
  const clinic = str(b.clinicName);
  if (!name || !str(b.phone) || !clinic) {
    return { ok: false, error: "Nome, WhatsApp e nome da clinica sao obrigatorios" };
  }
  if (b.consent !== true) return { ok: false, error: "Consentimento obrigatorio" };
  return {
    ok: true,
    body: b,
    data: obj(b.data),
    meta: { especialidade: optStr(b.especialidade), episode: optStr(b.episode), returning: b.returning === true },
    contact: { name, phone: str(b.phone), email: optStr(b.email), clinic, city: optStr(b.city) },
  };
}

/** Absolute URL of a lead-magnet page or of a downloadable file. */
export const toolUrl = (slug: keyof typeof LEAD_MAGNET_CONFIG.ASSET_URLS) => SITE_URL + LEAD_MAGNET_CONFIG.ASSET_URLS[slug];
export const fileUrl = (name: string) => SITE_URL + LEAD_MAGNET_CONFIG.FILES_BASE_URL + name;

/** WhatsApp message for a lead magnet that is a download: greeting, the links, one next step. */
export function downloadMessage(name: string, intro: string, links: Array<[string, string]>, closing: string): string {
  return [
    `Olá ${name}! 👋`,
    ``,
    intro,
    ``,
    ...links.flatMap(([label, url]) => [`📎 *${label}:*`, url]),
    ``,
    `---`,
    ``,
    `Quer descobrir em que etapa sua clínica perde mais pacientes? Faça o RAIO-X (3 minutos):`,
    toolUrl("raio-x"),
    ``,
    closing,
  ].join("\n");
}
