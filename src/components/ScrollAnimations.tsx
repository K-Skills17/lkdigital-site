"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      document.querySelectorAll(".opacity-0").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
      });
      return;
    }

    // Make hero visible immediately with CSS — don't wait for GSAP
    const heroEls = document.querySelectorAll(
      ".hero-eyebrow, .hero-title, .hero-sub, .hero-ctas, .hero-stats"
    );
    heroEls.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
      htmlEl.style.transform = "translateY(20px)";
      requestAnimationFrame(() => {
        htmlEl.style.opacity = "1";
        htmlEl.style.transform = "translateY(0)";
      });
    });

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

        // Batch all scroll-triggered animations with a single observer approach
        const revealElements = document.querySelectorAll(
          ".social-proof-card, .problem-card, .pillar-card, .how-step, .cta-form"
        );

        revealElements.forEach((el) => {
          gsap.set(el, { y: 20 });
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });

        // Pillar asymmetric (only on desktop)
        if (!isMobile) {
          document.querySelectorAll(".pillar-card").forEach((card, i) => {
            const xStart = i === 0 ? -30 : i === 2 ? 30 : 0;
            gsap.set(card, { x: xStart });
            gsap.to(card, {
              x: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            });
          });
        }

        // Manifesto
        const manifestoQuote = document.querySelector(".manifesto-quote");
        if (manifestoQuote) {
          gsap.set(manifestoQuote, { scale: 0.8 });
          gsap.to(manifestoQuote, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: manifestoQuote,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });
        }

        const manifestoText = document.querySelector(".manifesto-text");
        if (manifestoText) {
          gsap.to(manifestoText, {
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: manifestoText,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });
        }

        const manifestoTrilogy = document.querySelector(".manifesto-trilogy");
        if (manifestoTrilogy) {
          gsap.set(manifestoTrilogy, { y: 16 });
          gsap.to(manifestoTrilogy, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: manifestoTrilogy,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        }

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
    }, 2500); // Delay 2.5s — let LCP render first

    return () => {
      clearTimeout(loadTimer);
      cleanup?.();
    };
  }, []);

  return null;
}
