"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, UserCheck, Clock } from "lucide-react";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function Hero() {
  const { ref: heroRef, inView } = useInView(0.05);
  const [imgError, setImgError] = useState(false);

  return (
    <section className="section-premium overflow-hidden" ref={heroRef}>
      {/* Background dot grid — decorative */}
      <div
        className="absolute top-0 right-0 w-[480px] h-[480px] dot-grid pointer-events-none"
        aria-hidden="true"
        style={{ opacity: 0.12 }}
      />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* ── LEFT: Copy ── */}
        <div className="space-y-8 relative z-10">

          {/* Eyebrow with animated gold line */}
          <div
            className={`flex items-center gap-3 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span
              className="block h-px bg-accent"
              style={{ width: inView ? "3rem" : "0", transition: "width 0.8s ease 0.1s" }}
              aria-hidden="true"
            />
            <p className="text-xs font-medium text-accent uppercase tracking-[0.25em]">
              Mais Pacientes. Menos Esforço. Agenda Sempre Cheia.
            </p>
          </div>

          {/* Main Headline — staggered word by word */}
          <h1
            className={`text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] transition-all duration-700 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Da Agenda Cheia ao{" "}
            <br className="hidden sm:block" />
            Faturamento que Você Merece.{" "}
            <span className="text-shimmer">
              Sem Trabalhar Mais Horas.
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className={`text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Sua clínica encontrada pelos pacientes certos — no Google, no
            ChatGPT e nas IAs da sua região.{" "}
            <span className="text-foreground font-semibold">Você cuida dos pacientes.
            Nós cuidamos da visibilidade.</span>
          </p>

          {/* CTA Button */}
          <div
            className={`pt-2 transition-all duration-700 delay-300 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Button
              asChild
              size="lg"
              className="relative overflow-hidden bg-accent text-white hover:bg-accent-dark px-8 py-6 text-base group"
            >
              <Link href="/contato">
                <span className="relative z-10">Agendar Diagnóstico Gratuito</span>
                <span
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>

          {/* Quick trust stats */}
          <div
            className={`flex flex-wrap gap-6 pt-4 border-t border-border/60 transition-all duration-700 delay-[400ms] ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {[
              { icon: Eye, label: "Visibilidade ativa, 24 horas por dia", value: "24h" },
              { icon: UserCheck, label: "Pacientes qualificados antes de ligar", value: "100%" },
              { icon: Clock, label: "Horas de marketing que você não precisa gerir", value: "Zero" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
                <div>
                  <span className="text-base font-semibold text-foreground">{value}</span>
                  <span className="text-xs text-muted-foreground ml-1">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Hero Image ── */}
        <div
          className={`relative transition-all duration-1000 delay-200 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          }`}
        >
          {/* Gold corner frame — top right */}
          <div
            className="absolute -top-5 -right-5 w-28 h-28 border-r-2 border-t-2 border-accent/40 z-10 pointer-events-none animate-float-slow"
            aria-hidden="true"
          />
          {/* Gold corner frame — bottom left */}
          <div
            className="absolute -bottom-5 -left-5 w-28 h-28 border-l-2 border-b-2 border-accent/40 z-10 pointer-events-none"
            aria-hidden="true"
          />

          {/* Image Container */}
          <div className="relative aspect-[4/3] image-frame rounded-sm overflow-hidden bg-muted shadow-2xl shadow-accent/10">
            {!imgError ? (
              <Image
                src="/images/hero.jpg"
                alt="Clínica de saúde premium com profissional atendendo paciente — excelência e precisão no setor de saúde"
                fill
                priority
                className="object-cover object-center"
                onError={() => setImgError(true)}
              />
            ) : (
              /* Elegant fallback when image not yet available */
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-muted via-trust-bg to-muted">
                <div className="space-y-3 text-center px-8">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto border border-accent/20">
                    <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Adicione a imagem em <code className="bg-border px-1 rounded">/public/images/hero.jpg</code>
                  </p>
                </div>
              </div>
            )}

            {/* Subtle gradient overlay on image */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent pointer-events-none z-[2]"
              aria-hidden="true"
            />
          </div>

          {/* Floating glass metric card */}
          <div
            className="absolute -bottom-6 -left-6 glass-card px-5 py-4 z-20 animate-float"
            aria-hidden="true"
          >
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Agenda Cheia
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-heading font-semibold text-foreground">Todo</span>
              <span className="text-xs text-accent font-medium">mês</span>
            </div>
            <div className="mt-2 h-1 w-full bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: "85%", transition: "width 1.5s ease 0.8s" }}
              />
            </div>
          </div>

          {/* Floating badge — top left */}
          <div
            className="absolute -top-4 left-6 glass-card px-4 py-2 z-20 flex items-center gap-2"
            aria-hidden="true"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Vagas Limitadas
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
