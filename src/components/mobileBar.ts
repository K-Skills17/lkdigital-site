// Below md, the marketing pages replace the two floating bubbles (WhatsApp +
// AI chat) with one bottom bar that reserves its own space, so nothing covers
// content. Tools, the panel and the demo keep the bubbles: some tools have
// their own fixed bottom bar (e.g. calculadora-cac).
const EXCLUDED_PREFIXES = ["/ferramentas/", "/raio-x", "/painel", "/demo"];

export function hasMobileBar(pathname: string | null): boolean {
  if (!pathname) return true;
  return !EXCLUDED_PREFIXES.some((p) => pathname === p.replace(/\/$/, "") || pathname.startsWith(p));
}

/** Window event the bar dispatches to open the AI chat (ChatWidget listens). */
export const OPEN_CHAT_EVENT = "lk:open-chat";

export const WHATSAPP_HREF =
  "https://wa.me/5511946851028?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20LK%20Digital.";
