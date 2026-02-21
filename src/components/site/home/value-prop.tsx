"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function useCountUp(target: number, duration = 1600, decimals = 0) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const raf = requestAnimationFrame(function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration, decimals]);

  return { ref, value };
}

function AnimatedStat({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const decimals = value % 1 !== 0 ? 1 : 0;
  const { ref, value: count } = useCountUp(value, 1600, decimals);

  return (
    <div
      ref={ref}
      className="flex flex-col"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-4xl md:text-5xl font-heading text-accent counter-value">
        {count.toFixed(decimals)}{suffix}
      </div>
      <p className="text-sm text-muted-foreground mt-2 leading-snug">{label}</p>
    </div>
  );
}

export function ValueProp() {
  return (
    <section className="section-premium relative overflow-hidden">

      {/* Background accent rectangle */}
      <div
        className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-accent/30 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center">
        {/* ── LEFT: Visual panel (40%) */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="relative">
            {/* Main visual — editorial card stack */}
            <div className="relative space-y-4">

              {/* Card 1 — Strategy */}
              <div className="animate-on-scroll anim-fade-right glass-card p-6 rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-accent mb-2">
                  Estratégia
                </p>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  GEO & SEO de Precisão
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sua clínica ou consultório como primeira resposta — em buscadores e IAs.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: "82%" }} />
                  </div>
                  <span className="text-xs text-accent font-medium">82%</span>
                </div>
              </div>

              {/* Card 2 — Branding (offset) */}
              <div className="animate-on-scroll anim-fade-right stagger-2 glass-card p-6 rounded-sm ml-8">
                <p className="text-[10px] uppercase tracking-widest text-accent mb-2">
                  Branding
                </p>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  Identidade Premium
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Percepção de valor elevada antes mesmo da primeira consulta.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: "91%" }} />
                  </div>
                  <span className="text-xs text-accent font-medium">91%</span>
                </div>
              </div>

              {/* Card 3 — Infrastructure */}
              <div className="animate-on-scroll anim-fade-right stagger-3 glass-card p-6 rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-accent mb-2">
                  Infraestrutura
                </p>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  Sistemas de Escala
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Funis e automações preparados para múltiplas unidades.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: "74%" }} />
                  </div>
                  <span className="text-xs text-accent font-medium">74%</span>
                </div>
              </div>

              {/* Decorative dot grid behind cards */}
              <div
                className="absolute -z-10 -bottom-8 -left-8 w-40 h-40 dot-grid"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT: Copy (60%) */}
        <div className="lg:col-span-3 order-1 lg:order-2 space-y-8">
          {/* Eyebrow */}
          <div className="animate-on-scroll anim-fade-up flex items-center gap-3">
            <span className="gold-line" aria-hidden="true" />
            <p className="text-xs font-medium text-accent uppercase tracking-[0.25em]">
              Por Que Clínicas Escolhem a LK Digital
            </p>
          </div>

          {/* Headline */}
          <h2 className="animate-on-scroll anim-fade-up stagger-1 text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
            Sua Especialidade é a Saúde.{" "}
            <span className="text-accent">A Nossa é o Seu Crescimento.</span>
          </h2>

          {/* Decorative divider */}
          <div className="animate-on-scroll anim-fade-in stagger-2 w-16 h-px bg-accent" aria-hidden="true" />

          {/* Body copy */}
          <div className="animate-on-scroll anim-fade-up stagger-2 space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>
              Você passou anos se tornando o melhor no que faz. Marketing não
              deveria consumir esse tempo. A LK Digital instala{" "}
              <span className="text-foreground font-medium">
                sistemas de atração de pacientes
              </span>{" "}
              que funcionam enquanto você atende — sem reuniões intermináveis,
              sem jargão técnico, sem surpresas.
            </p>
            <p>
              Você vê os números. Nós cuidamos dos bastidores. Simples assim.
            </p>
          </div>

          {/* Authority pillars */}
          <div className="animate-on-scroll anim-fade-up stagger-3 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border/60">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Testado em Alta Competição</p>
              <p className="text-sm text-muted-foreground leading-relaxed">Metodologia forjada em e-commerce e educação antes de chegar à saúde.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Especialização Exclusiva</p>
              <p className="text-sm text-muted-foreground leading-relaxed">100% focado no setor de saúde. Não somos uma agência generalista.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Parceria Boutique</p>
              <p className="text-sm text-muted-foreground leading-relaxed">Selecionamos cada parceiro. Atenção irrestrita, não volume.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="animate-on-scroll anim-fade-up stagger-4 pt-2">
            <Button
              asChild
              size="lg"
              className="group bg-accent text-white hover:bg-accent-dark px-8 py-6 text-base"
            >
              <Link href="/contato" className="flex items-center gap-2">
                Agendar Diagnóstico Gratuito
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
