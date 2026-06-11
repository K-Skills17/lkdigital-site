"use client";

import { useEffect, useRef } from "react";

const SCROLL_THRESHOLDS = [25, 50, 75, 90];

function genEventId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function fireGA4(name: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  // gtag.js (loaded in root layout)
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
  // also push to dataLayer for GTM if present
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
}

function fireMeta(eventName: string, params?: Record<string, string | number>, eventId?: string) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  // Use trackSingle to avoid double-firing if multiple pixels exist
  // event_id enables dedup with server-side CAPI
  window.fbq("track", eventName, params || {}, { eventID: eventId });
}

function trackAll(
  ga4Name: string,
  metaName: string | null,
  params?: Record<string, string | number>
) {
  const eventId = genEventId();
  fireGA4(ga4Name, { ...params, event_id: eventId });
  if (metaName) {
    fireMeta(metaName, params, eventId);
  }
}

export default function RaioXTracking() {
  const firedDepths = useRef(new Set<number>());
  const firedSections = useRef(new Set<string>());

  useEffect(() => {
    // Analytics may load with 5s delay (root layout).
    // Wait for them, then fire pageview. If already loaded, fires immediately.
    const waitForAnalytics = (cb: () => void, maxWait = 8000) => {
      const start = Date.now();
      const check = () => {
        const hasGtag = typeof window.gtag === "function";
        const hasFbq = typeof window.fbq === "function";
        if ((hasGtag || hasFbq) || Date.now() - start > maxWait) {
          cb();
        } else {
          setTimeout(check, 250);
        }
      };
      check();
    };

    waitForAnalytics(() => {
      // Page view — GA4 auto-fires PageView via gtag config, Meta fires via fbq init
      // Fire custom raiox_view for funnel analysis + Meta ViewContent for retargeting
      trackAll("raiox_view", "ViewContent", {
        content_name: "Raio-X Digital 2026",
        content_category: "lead_funnel",
      });
    });

    // Scroll depth tracking
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const threshold of SCROLL_THRESHOLDS) {
        if (pct >= threshold && !firedDepths.current.has(threshold)) {
          firedDepths.current.add(threshold);
          // GA4 only — scroll depth is noise for Meta
          fireGA4("raiox_scroll_depth", { depth: threshold });
        }
      }
    };

    // Section visibility tracking
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id =
            entry.target.id ||
            entry.target.getAttribute("data-track-section") ||
            "unknown";
          if (!firedSections.current.has(id)) {
            firedSections.current.add(id);
            // GA4 only — section views are internal analytics
            fireGA4("raiox_section_view", { section: id });
          }
        }
      },
      { threshold: 0.3 }
    );

    setTimeout(() => {
      document.querySelectorAll("section[id], section[data-track-section]").forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    // CTA click tracking (delegated)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href="#form"]');
      if (link) {
        // GA4 + Meta — CTA click signals high intent
        trackAll("raiox_cta_click", "InitiateCheckout", {
          cta_text: link.textContent?.trim().slice(0, 60) || "",
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
      observer.disconnect();
    };
  }, []);

  return null;
}

// Exported so LeadForm can use them
export { trackAll, fireGA4, fireMeta, genEventId };
