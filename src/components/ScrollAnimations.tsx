"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      // Make everything visible without animation
      document.querySelectorAll(".opacity-0").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
      });
      return;
    }

    let cleanup: (() => void) | undefined;

    // Load GSAP + Lenis
    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("lenis"),
    ]).then(([gsapMod, scrollTriggerMod, lenisMod]) => {
      const gsap = gsapMod.default;
      const ScrollTrigger = scrollTriggerMod.ScrollTrigger;
      const Lenis = lenisMod.default;

      gsap.registerPlugin(ScrollTrigger);

      // ── Lenis Smooth Scroll ──
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time: number) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      // ── Hero Entrance (staggered) ──
      const heroTl = gsap.timeline({ delay: 0.3 });
      heroTl
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to(".hero-title", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.35")
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35")
        .to(".hero-ctas", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .to(".hero-stats", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.25");

      // Set initial translateY for hero elements
      gsap.set([".hero-eyebrow", ".hero-title", ".hero-sub", ".hero-ctas", ".hero-stats"], {
        y: 30,
      });

      // ── Social Proof Cards ──
      gsap.utils.toArray<HTMLElement>(".social-proof-card").forEach((card, i) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
        gsap.set(card, { y: 24 });
      });

      // ── Problem Cards ──
      gsap.utils.toArray<HTMLElement>(".problem-card").forEach((card, i) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
        gsap.set(card, { y: 24 });
      });

      // ── Pillar Cards — asymmetric entrance ──
      gsap.utils.toArray<HTMLElement>(".pillar-card").forEach((card, i) => {
        const xStart = i === 0 ? -40 : i === 2 ? 40 : 0;
        const yStart = i === 1 ? 40 : 0;
        gsap.set(card, { x: xStart, y: yStart });
        gsap.to(card, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });

      // ── How It Works Steps ──
      gsap.utils.toArray<HTMLElement>(".how-step").forEach((step, i) => {
        gsap.set(step, { y: 30 });
        gsap.to(step, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });

      // ── Manifesto ──
      gsap.set(".manifesto-quote", { scale: 0.6 });
      gsap.to(".manifesto-quote", {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".manifesto-quote",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      gsap.set(".manifesto-text", { filter: "blur(8px)" });
      gsap.to(".manifesto-text", {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".manifesto-text",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      gsap.set(".manifesto-trilogy", { y: 20 });
      gsap.to(".manifesto-trilogy", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".manifesto-trilogy",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // ── CTA Form ──
      gsap.set(".cta-form", { y: 24 });
      gsap.to(".cta-form", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".cta-form",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // ── Hero canvas fade on scroll ──
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

      cleanup = () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        lenis.destroy();
        gsap.ticker.remove((time: number) => lenis.raf(time * 1000));
      };
    });

    return () => cleanup?.();
  }, []);

  return null;
}
