"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    // Hero elements are now CSS-animated (animate-hero-fade-in) — no JS needed

    const isMobile = window.innerWidth < 768;
    let cleanup: (() => void) | undefined;
    // Delay heavy library loading — let LCP paint first
    const loadTimer = setTimeout(() => {
      const imports: Promise<unknown>[] = [
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ];

      // Skip Lenis on mobile — kills TBT
      if (!isMobile) {
        imports.push(import("lenis"));
      }

      Promise.all(imports).then((modules) => {
        const gsap = (modules[0] as { default: typeof import("gsap")["default"] }).default;
        const ScrollTrigger = (modules[1] as { ScrollTrigger: typeof import("gsap/ScrollTrigger")["ScrollTrigger"] }).ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        // Lenis only on desktop
        let lenis: { destroy: () => void; on: (e: string, cb: () => void) => void; raf: (t: number) => void } | null = null;
        if (!isMobile && modules[2]) {
          const Lenis = (modules[2] as { default: new (opts: object) => typeof lenis }).default;
          lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
          lenis!.on("scroll", ScrollTrigger.update);
          gsap.ticker.add((time: number) => lenis!.raf(time * 1000));
          gsap.ticker.lagSmoothing(0);
        }

        // A few deliberate reveals only (docs/redesign/HOMEPAGE.md): the
        // pillar rows, the three steps and the form. Text elsewhere is static.
        const revealElements = document.querySelectorAll(
          ".pillar-card, .how-step, .cta-form"
        );

        revealElements.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // Hero canvas fade — only on desktop (no scrub overhead on mobile)
        if (!isMobile) {
          gsap.to("#hero-canvas-container", {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "#hero-canvas-container",
              start: "top top",
              end: "15%",
              scrub: true,
            },
          });
        }

        cleanup = () => {
          ScrollTrigger.getAll().forEach((t) => t.kill());
          lenis?.destroy();
        };
      });
    }, isMobile ? 4000 : 2500); // Delay longer on mobile — let LCP render and TBT window close

    return () => {
      clearTimeout(loadTimer);
      cleanup?.();
    };
  }, []);

  return null;
}
