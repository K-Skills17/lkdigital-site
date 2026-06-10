"use client";

import { useEffect, useRef } from "react";

const SCROLL_THRESHOLDS = [25, 50, 75, 90];

function pushEvent(event: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export default function RaioXTracking() {
  const firedDepths = useRef(new Set<number>());
  const firedSections = useRef(new Set<string>());

  useEffect(() => {
    // Page view
    pushEvent("raiox_view");

    // Scroll depth tracking
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const threshold of SCROLL_THRESHOLDS) {
        if (pct >= threshold && !firedDepths.current.has(threshold)) {
          firedDepths.current.add(threshold);
          pushEvent("raiox_scroll_depth", { depth: threshold });
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
            pushEvent("raiox_section_view", { section: id });
          }
        }
      },
      { threshold: 0.3 }
    );

    // Observe all major sections
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
        pushEvent("raiox_cta_click", {
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
