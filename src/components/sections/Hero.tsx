import Link from "next/link";
import dynamic from "next/dynamic";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-hero-bg"
      aria-label="Seção principal"
    >
      {/* WebGL Canvas — lazy loaded, no SSR */}
      <div id="hero-canvas-container" className="absolute inset-0 z-0" aria-hidden="true">
        <div className="w-full h-full bg-gradient-to-br from-[#0f0f0f] via-[#1a1510] to-[#0f0f0f]" />
        <HeroCanvas />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 grain-overlay z-[1]" />

      {/* Content — visible immediately for fast LCP, CSS animations for entrance */}
      <div className="relative z-10 max-w-narrow mx-auto px-4 sm:px-6 pt-24 pb-16 md:pt-36 md:pb-28 text-center">
        {/* Eyebrow */}
        <p
          className="hero-eyebrow inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase mb-5 md:mb-6 animate-hero-fade-in"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Marketing Digital para Dentistas
        </p>

        {/* H1 — LCP element, must be visible without JS */}
        <h1
          className="hero-title font-display text-[clamp(1.75rem,5vw,4.5rem)] leading-[1.1] text-white text-balance max-w-4xl mx-auto mb-4 md:mb-6 animate-hero-fade-in [animation-delay:150ms]"
        >
          Agenda Cheia de Pacientes Qualificados.{" "}
          <span className="text-accent">Sem Você Gerenciar Nada.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="hero-sub text-base md:text-xl text-white/60 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed animate-hero-fade-in [animation-delay:300ms]"
        >
          Captamos pacientes de alto valor para o seu consultório odontológico
          — enquanto você foca no que faz de melhor: cuidar de sorrisos.
        </p>

        {/* CTAs */}
        <div className="hero-ctas flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 md:mb-16 animate-hero-fade-in [animation-delay:450ms]">
          <Link
            href="/contato"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25 text-center"
          >
            Agendar Diagnóstico Gratuito
          </Link>
          <Link
            href="/solucoes"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-accent/40 text-accent hover:bg-accent hover:text-white font-medium rounded-md transition-all duration-200 text-center"
          >
            Ver Soluções
          </Link>
        </div>

        {/* Stats */}
        <div className="hero-stats grid grid-cols-3 gap-3 sm:gap-6 max-w-sm sm:max-w-lg mx-auto animate-hero-fade-in [animation-delay:600ms]">
          <div className="text-center">
            <p className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-white">
              24h
            </p>
            <p className="text-[10px] sm:text-xs text-white/40 mt-1">Ativos para você</p>
          </div>
          <div className="text-center border-x border-white/10">
            <p className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-white">
              100%
            </p>
            <p className="text-[10px] sm:text-xs text-white/40 mt-1">Foco em odontologia</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-white">
              Zero
            </p>
            <p className="text-[10px] sm:text-xs text-white/40 mt-1">Gestão da sua parte</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/30">
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
