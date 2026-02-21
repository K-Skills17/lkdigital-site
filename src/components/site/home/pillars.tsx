import { AnimatedSection } from "@/components/shared/animated-section";
import { Search, Palette, Cpu } from "lucide-react";

const pillars = [
  {
    number: "I",
    title: "Aquisição de Pacientes de Precisão",
    subtitle: "GEO & SEO para Saúde",
    description:
      "Quando um paciente pergunta ao Google ou a uma IA qual especialista procurar na sua região, sua clínica deve ser a resposta. Otimizamos sua presença para buscadores tradicionais e LLMs como ChatGPT, Gemini e Claude, garantindo que você seja a primeira escolha — de forma orgânica e sustentável.",
    icon: Search,
    detail: "Visibilidade dominante em Google, ChatGPT e Gemini",
  },
  {
    number: "II",
    title: "Branding e Experiência Boutique",
    subtitle: "Identidade Premium para Saúde",
    description:
      "A percepção de valor começa antes da consulta. Desenhamos identidades visuais e experiências digitais que comunicam autoridade, confiança e exclusividade — posicionando sua clínica ou consultório acima da concorrência e atraindo pacientes que valorizam qualidade, não preço.",
    icon: Palette,
    detail: "Da identidade visual ao site de alta conversão",
  },
  {
    number: "III",
    title: "Sistemas de Escala Digital",
    subtitle: "Infraestrutura e Automação",
    description:
      "Preparamos o terreno para o seu crescimento sustentável. Estruturamos funis de conversão, automações de relacionamento com pacientes e dashboards de inteligência de dados para suportar a expansão de uma ou múltiplas unidades com eficiência operacional máxima.",
    icon: Cpu,
    detail: "Automações, CRM e dashboards prontos para expansão",
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
            O Que Você Conquista
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
            Visibilidade onde seus pacientes buscam, uma marca que justifica seus
            honorários e um sistema que trabalha por você 24h — sem que você
            precise tocar em nada.
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
                <span>GEO & SEO para Saúde</span>
                <span className="text-accent/40">·</span>
                <span>Branding Premium</span>
                <span className="text-accent/40">·</span>
                <span>Infraestrutura Digital</span>
                <span className="text-accent/40">·</span>
                <span>Captação de Pacientes</span>
                <span className="text-accent/40">·</span>
                <span>Escala Sustentável</span>
                <span className="text-accent/40">·</span>
                <span>Medicina · Odontologia · Dermatologia</span>
                <span className="text-accent/40">·</span>
                <span>Psicologia · Fisioterapia · Nutrição</span>
                <span className="text-accent/40">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
