"use client";

import { useEffect } from "react";

/**
 * Global scroll observer — picks up ALL .animate-on-scroll elements in the DOM
 * and adds the .in-view class when they enter the viewport.
 */
export function ScrollObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    // Observe current elements
    const attach = () => {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        if (!el.classList.contains("in-view")) observer.observe(el);
      });
    };

    attach();

    // Re-attach on any future DOM mutations (e.g. client-side navigation)
    const mutationObserver = new MutationObserver(attach);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
