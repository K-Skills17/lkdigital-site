import Link from "next/link";
import { Button } from "@/components/ui/button";

const cycleSteps = [
  {
    number: "01",
    title: "Aquisição",
    description:
      "Captamos o paciente ideal via SEO, GEO e sistemas de geração de leads que garantem um fluxo constante de demanda qualificada.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Conversão",
    description:
      "Elevamos seu ticket médio através de branding de autoridade e posicionamento premium que elimina objeções de preço.",
    icon: (
      <svg
        className="w-6 h-6"
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
    description:
      "Otimizamos seus processos internos para escalar o lucro, não apenas o faturamento. Análise de dados e infraestrutura de crescimento.",
    icon: (
      <svg
        className="w-6 h-6"
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
    description:
      "Criamos experiências que garantem fidelidade e indicação orgânica. Pacientes satisfeitos que se tornam embaixadores da sua marca.",
    icon: (
      <svg
        className="w-6 h-6"
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
    <section className="section-premium bg-foreground text-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs sm:text-sm font-medium text-accent uppercase tracking-widest mb-4 md:mb-6">
            Metodologia Proprietária
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-background leading-tight">
            O Ciclo de Crescimento LK
          </h2>
          <p className="mt-4 md:mt-6 text-base md:text-lg text-background/70 leading-relaxed max-w-2xl mx-auto">
            Um sistema holístico de expansão que integra marketing, vendas e
            operações para transformar sua clínica em uma máquina de
            crescimento previsível.
          </p>
        </div>

        {/* Flywheel Visual */}
        <div className="relative mb-12 md:mb-16">
          {/* Center circle - visible on md+ */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-accent/20 items-center justify-center z-10">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-accent flex items-center justify-center">
              <svg
                className="w-10 h-10 lg:w-12 lg:h-12 text-foreground"
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

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {cycleSteps.map((step, index) => (
              <div
                key={step.number}
                className="relative group"
              >
                {/* Connector line - hidden on mobile */}
                {index < cycleSteps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-accent/50 to-transparent z-0"
                    aria-hidden="true"
                  />
                )}

                {/* Card */}
                <div className="relative bg-background/5 border border-background/10 p-6 md:p-8 hover:border-accent/30 transition-colors h-full">
                  {/* Step Number */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl md:text-4xl font-heading text-accent/50">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      {step.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-semibold text-background mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm md:text-base text-background/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
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
        </div>
      </div>
    </section>
  );
}
