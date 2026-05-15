// src/lib/events.ts
//
// Centralized analytics dispatcher. Fires events to GA4 (and Meta Pixel when applicable)
// from a single call. Safe to use anywhere — silently no-ops if analytics scripts haven't
// loaded yet (e.g., during SSR or before lazyOnload finishes).
//
// Usage:
//   import { trackEvent } from "@/lib/events";
//   trackEvent("cta_click", { cta: "Agendar Diagnóstico", page: "/cidades/sao-paulo" });

type EventName =
  | "cta_click"
  | "form_submit"
  | "generate_lead"
  | "faq_open"
  | "nearby_city_click";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Which events should also fire to Meta Pixel, and as what Pixel event name.
// null = don't send to Meta (avoids noise on internal-only events)
const META_EVENT_MAP: Record<EventName, string | null> = {
  cta_click: "Lead",
  form_submit: "Lead",
  generate_lead: "Lead",
  faq_open: null,
  nearby_city_click: null,
};

export function trackEvent(name: EventName, params: EventParams = {}): void {
  if (typeof window === "undefined") return;

  // Strip undefined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined),
  );

  // GA4
  if (typeof window.gtag === "function") {
    window.gtag("event", name, cleanParams);
  }

  // Meta Pixel
  const fbEvent = META_EVENT_MAP[name];
  if (fbEvent && typeof window.fbq === "function") {
    window.fbq("track", fbEvent, cleanParams);
  }
}

// Helper: wrap any click handler with tracking
export function trackedClick<T>(
  name: EventName,
  params: EventParams = {},
  callback?: (e: React.MouseEvent<T>) => void,
) {
  return (e: React.MouseEvent<T>) => {
    trackEvent(name, params);
    if (callback) callback(e);
  };
}
