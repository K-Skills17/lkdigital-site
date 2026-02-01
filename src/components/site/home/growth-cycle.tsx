import Link from "next/link";
import { Button } from "@/components/ui/button";

const cycleSteps = [
  {
    number: "01",
    title: "Aquisição",
    outcome: "Leads Qualificados",
    description:
      "Captamos o paciente ideal via SEO, GEO e sistemas de geração de leads que garantem um fluxo constante de demanda qualificada.",
    icon: (
      <svg
        className="w-5 h-5 md:w-6 md:h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Conversão",
    outcome: "Ticket Elevado",
    description:
      "Elevamos seu ticket médio através de branding de autoridade e posicionamento premium que elimina objeções de preço.",
    icon: (
      <svg
        className="w-5 h-5 md:w-6 md:h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Estratégia",
    outcome: "Lucro Escalável",
    description:
      "Otimizamos seus processos internos para escalar o lucro, não apenas o faturamento. Análise de dados e infraestrutura de crescimento.",
    icon: (
      <svg
        className="w-5 h-5 md:w-6 md:h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Retenção",
    outcome: "Indicações Orgânicas",
    description:
      "Criamos experiências que garantem fidelidade e indicação orgânica. Pacientes satisfeitos que se tornam embaixadores da sua marca.",
    icon: (
      <svg
        className="w-5 h-5 md:w-6 md:h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
];

export function GrowthCycle() {
  return (
    <section className="section-premium bg-foreground text-background overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20">
          <p className="text-xs sm:text-sm font-medium text-accent uppercase tracking-widest mb-4 md:mb-6">
            Metodologia Proprietária
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-background leading-tight">
            O Ciclo de Crescimento LK
          </h2>
          <p className="mt-4 md:mt-6 text-base md:text-lg text-background/60 leading-relaxed max-w-2xl mx-auto">
            Um sistema holístico que integra marketing, vendas e operações para
            transformar sua clínica em uma máquina de crescimento previsível.
          </p>
        </div>

        {/* Flywheel Visual - Desktop */}
        <div className="hidden lg:block relative mb-20">
          {/* Center Flywheel - Background decorative element */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
            <div className="relative opacity-60">
              {/* Outer glow ring */}
              <div className="absolute inset-0 w-72 h-72 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-accent/20 blur-2xl" />
              {/* Outer ring */}
              <div className="relative w-56 h-56 rounded-full border-2 border-accent/50 flex items-center justify-center">
                {/* Inner circle */}
                <div className="w-36 h-36 rounded-full bg-accent flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Cards in circular layout */}
          <div className="grid grid-cols-4 gap-6">
            {cycleSteps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Arrow connector to next card */}
                {index < cycleSteps.length - 1 && (
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <svg
                      className="w-6 h-6 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}

                {/* Card */}
                <div className="group relative h-full">
                  {/* Card background with border */}
                  <div className="absolute inset-0 border border-background/10 group-hover:border-accent/40 transition-colors duration-300" />

                  {/* Gold accent line at top */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative p-6 h-full flex flex-col">
                    {/* Header: Number + Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-4xl font-heading text-accent/40 group-hover:text-accent/60 transition-colors">
                        {step.number}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-foreground transition-all duration-300">
                        {step.icon}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#C5A368] mb-2">
                      {step.title}
                    </h3>

                    {/* Outcome badge */}
                    <div className="inline-flex items-center gap-1.5 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span className="text-xs font-medium text-accent uppercase tracking-wider">
                        {step.outcome}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-background/50 leading-relaxed flex-grow">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Circular arrow indicating cycle - from last to first */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 text-accent/60">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs uppercase tracking-wider">Ciclo Contínuo</span>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden mb-12">
          {/* Mobile Flywheel indicator */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
              <svg
                className="w-8 h-8 text-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>

          {/* Mobile Cards - Vertical stack with connectors */}
          <div className="space-y-4">
            {cycleSteps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Vertical connector line */}
                {index < cycleSteps.length - 1 && (
                  <div className="absolute left-8 top-full h-4 w-px bg-gradient-to-b from-accent/50 to-transparent" />
                )}

                {/* Card */}
                <div className="border border-background/10 p-5 sm:p-6">
                  <div className="flex gap-4 sm:gap-5">
                    {/* Left: Number + Icon column */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        {step.icon}
                      </div>
                      <span className="text-2xl font-heading text-accent/40">
                        {step.number}
                      </span>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-[#C5A368] mb-1">
                        {step.title}
                      </h3>

                      {/* Outcome badge */}
                      <div className="inline-flex items-center gap-1.5 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="text-xs font-medium text-accent uppercase tracking-wider">
                          {step.outcome}
                        </span>
                      </div>

                      <p className="text-sm text-background/50 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cycle indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 text-accent/60">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs uppercase tracking-wider">Ciclo Contínuo</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-accent text-foreground hover:bg-accent-light px-8 py-6 text-base font-medium"
          >
            <Link href="/contato">Ativar o Ciclo na Minha Clínica</Link>
          </Button>
          <p className="mt-4 text-xs text-background/40">
            Consultoria estratégica gratuita • Sem compromisso
          </p>
        </div>
      </div>
    </section>
  );
}
