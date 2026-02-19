import { AnimatedSection } from "@/components/shared/animated-section";
import { Search, Palette, Cpu } from "lucide-react";

const pillars = [
  {
    number: "I",
    title: "Aquisição de Precisão",
    subtitle: "GEO & SEO",
    description:
      "Onde os pacientes buscam respostas, sua clínica deve ser a autoridade. Otimizamos sua presença para motores de busca e inteligências artificiais (LLMs), garantindo que você seja a primeira escolha.",
    icon: Search,
    detail: "Visibilidade dominante em Google e ChatGPT",
  },
  {
    number: "II",
    title: "Branding e Experiência Boutique",
    subtitle: "Identidade Premium",
    description:
      "A percepção de valor começa antes da consulta. Desenhamos identidades visuais e experiências digitais que comunicam luxo, confiança e exclusividade.",
    icon: Palette,
    detail: "Da identidade visual ao site de alta conversão",
  },
  {
    number: "III",
    title: "Sistemas de Escala Digital",
    subtitle: "Infraestrutura",
    description:
      "Preparando o terreno para o futuro. Estruturamos sua coleta de dados e funis de conversão para suportar a expansão de múltiplas unidades com eficiência operacional.",
    icon: Cpu,
    detail: "Automações e dashboards prontos para expansão",
  },
];

export function Pillars() {
  return (
    <section className="section-premium relative overflow-hidden">
      {/* Section header */}
      <div className="text-center mb-20">
        <AnimatedSection animation="fade-up">
          <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-4 flex items-center justify-center gap-3">
            <span className="block w-6 h-px bg-accent" aria-hidden="true" />
            Nossa Expertise
            <span className="block w-6 h-px bg-accent" aria-hidden="true" />
          </p>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={1}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Os Três Pilares
          </h2>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={2}>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Um ecossistema completo de crescimento — estratégia, identidade e
            infraestrutura — construído especificamente para clínicas odontológicas de alto padrão.
          </p>
        </AnimatedSection>
      </div>

      {/* Pillars grid */}
      <div className="grid md:grid-cols-3 gap-0 lg:gap-0 border-t border-border/60">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          const animDelay = (i + 1) as 1 | 2 | 3;
          return (
            <AnimatedSection
              key={pillar.number}
              animation="fade-up"
              delay={animDelay}
              className={`pillar-card group p-8 lg:p-10 border-b border-border/60 ${
                i < pillars.length - 1 ? "md:border-r" : ""
              } relative cursor-default`}
            >
              {/* Top accent line — animates on hover */}
              <div
                className="absolute top-0 left-0 h-0.5 bg-accent transition-all duration-500 group-hover:w-full"
                style={{ width: "0%" }}
                aria-hidden="true"
              />

              {/* Icon + Roman numeral */}
              <div className="flex items-start justify-between mb-8">
                <span className="text-accent/30 font-heading text-5xl font-light leading-none group-hover:text-accent/60 transition-colors duration-300">
                  {pillar.number}
                </span>
                <div className="w-10 h-10 rounded-full border border-accent/20 flex items-center justify-center group-hover:bg-accent/5 group-hover:border-accent/40 transition-all duration-300">
                  <Icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
                </div>
              </div>

              {/* Pillar title */}
              <h3 className="text-xl md:text-2xl font-semibold text-foreground leading-tight mb-3 group-hover:text-accent transition-colors duration-300">
                {pillar.title}
              </h3>

              {/* Pillar subtitle */}
              <p className="text-[10px] text-accent uppercase tracking-[0.2em] mb-5">
                {pillar.subtitle}
              </p>

              {/* Pillar description */}
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                {pillar.description}
              </p>

              {/* Detail — appears on hover */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-4 h-px bg-accent" aria-hidden="true" />
                <p className="text-xs text-accent font-medium">{pillar.detail}</p>
              </div>
            </AnimatedSection>
          );
        })}
      </div>

      {/* Bottom marquee */}
      <div className="mt-20 overflow-hidden border-y border-border/40 py-4">
        <div className="flex whitespace-nowrap">
          <div className="marquee-track flex items-center gap-8 text-xs uppercase tracking-[0.3em] text-muted-foreground/50 pr-8">
            {Array.from({ length: 2 }, (_, k) => (
              <span key={k} className="flex items-center gap-8">
                <span>GEO & SEO</span>
                <span className="text-accent/40">·</span>
                <span>Branding Premium</span>
                <span className="text-accent/40">·</span>
                <span>Infraestrutura Digital</span>
                <span className="text-accent/40">·</span>
                <span>Aquisição de Precisão</span>
                <span className="text-accent/40">·</span>
                <span>Escala Sustentável</span>
                <span className="text-accent/40">·</span>
                <span>Identidade de Luxo</span>
                <span className="text-accent/40">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
