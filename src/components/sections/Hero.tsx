import dynamic from "next/dynamic";
import { ButtonLink, Container, SectionLabel } from "@/components/home/primitives";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const stats = [
  { value: "24h", label: "Ativos para você" },
  { value: "100%", label: "Foco em odontologia" },
  { value: "Zero", label: "Gestão da sua parte" },
];

export default function Hero() {
  return (
    <section
      className="relative flex min-h-[92svh] items-end overflow-hidden bg-hero-bg"
      aria-label="Seção principal"
    >
      {/* WebGL canvas — lazy loaded, no SSR. Solid brand black until it paints. */}
      <div id="hero-canvas-container" className="absolute inset-0 z-0" aria-hidden="true">
        <HeroCanvas />
      </div>

      {/* Content — visible without JS for fast LCP; CSS-only entrance */}
      <Container className="relative z-10 pb-14 pt-32 md:pb-20 md:pt-40">
        <div className="animate-hero-fade-in">
          <SectionLabel tone="dark">Marketing Digital para Dentistas</SectionLabel>
        </div>

        <h1 className="mt-8 max-w-5xl font-display text-[clamp(2.5rem,1.3rem+5vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.01em] text-white text-balance animate-hero-fade-in [animation-delay:150ms]">
          Pacientes de Alto Valor Encontram Você Primeiro.{" "}
          <span className="italic text-accent">Sem Você Gerenciar Nada.</span>
        </h1>

        <div className="mt-10 grid gap-10 border-t border-white/15 pt-10 md:mt-14 lg:grid-cols-12 lg:gap-8">
          <p className="text-lg leading-relaxed text-white/70 lg:col-span-5 animate-hero-fade-in [animation-delay:300ms]">
            Posicionamos seu consultório como a primeira opção na sua região
            — enquanto você foca no que faz de melhor: cuidar de sorrisos.
          </p>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row lg:col-span-4 lg:col-start-6 lg:flex-col lg:items-start animate-hero-fade-in [animation-delay:450ms]">
            <ButtonLink href="/contato" tone="dark">
              Agendar Diagnóstico Gratuito
            </ButtonLink>
            <ButtonLink href="/solucoes" variant="secondary" tone="dark">
              Ver Soluções
            </ButtonLink>
          </div>

          <dl className="grid grid-cols-3 lg:col-span-3 lg:grid-cols-1 lg:gap-4 animate-hero-fade-in [animation-delay:600ms]">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col gap-1 lg:flex-row lg:items-baseline lg:gap-4 ${i > 0 ? "border-l border-white/15 pl-4 lg:border-l-0 lg:pl-0" : ""}`}
              >
                <dt className="order-2 text-xs text-white/60">{s.label}</dt>
                <dd className="order-1 font-display text-2xl text-white lining-nums md:text-3xl lg:w-20">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
