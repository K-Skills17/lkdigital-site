// Settings shared by the lead magnets (RAIO-X, checklist, calculator, dashboard, scripts).
// Everything here is public (rendered into the browser); secrets stay in env vars.

export const SITE_URL = "https://lkdigital.odo.br";

/** LK WhatsApp (same number as the site's floating button and footer). */
export const LK_WHATSAPP = "5511946851028";

/** Downloads built by lead-magnets/ (offline) and served from public/. */
export const FILES_PATH = "/ferramentas/arquivos/";

export const PRIVACY_PATH = "/privacidade";

/** RAIO-X "oferta" segment button: the implant offer. */
export const IMPLANT_OFFER_PATH = "/pre-temporada";

/** Where each lead magnet lives (RAIO-X CTAs and WhatsApp messages link here). */
export const TOOL_PATHS = {
  "raio-x": "/raio-x",
  "checklist-google": "/ferramentas/checklist-google",
  "dashboard-clinica": "/ferramentas/dashboard-clinica",
  "calculadora-cac": "/ferramentas/calculadora-cac",
  "scripts-whatsapp": "/ferramentas/scripts-whatsapp",
} as const;

/**
 * YouTube URL per episode of "O Sistema Operacional da Clínica Odontológica".
 * Fill each one when the episode is published; while empty, the RAIO-X shows the
 * episode name without a link.
 */
export const YOUTUBE_EPISODE_URLS: Record<string, string> = {
  ep00: "", ep01: "", ep02: "", ep03: "", ep04: "", ep05: "", ep06: "", ep07: "",
  ep08: "", ep09: "", ep10: "", ep11: "", ep12: "", ep13: "", ep14: "",
};

/** The config object the lead-magnet pages read (window-free, passed as props). */
export const LEAD_MAGNET_CONFIG = {
  SITE_BASE_URL: SITE_URL,
  LK_WHATSAPP,
  PRIVACY_URL: PRIVACY_PATH,
  IMPLANT_OFFER_URL: IMPLANT_OFFER_PATH,
  FILES_BASE_URL: FILES_PATH,
  ASSET_URLS: TOOL_PATHS,
  YOUTUBE_EPISODE_URLS,
};

export type LeadMagnetConfig = typeof LEAD_MAGNET_CONFIG;
