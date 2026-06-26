import Link from "next/link";
import { LogoIcon } from "@/components/ui/Logo";
import DemoChatWidget from "@/components/DemoChatWidget";

// Change this env var to point the demo at a different trained tenant.
// Set NEXT_PUBLIC_DEMO_TENANT_ID in your .env.local or Railway env vars.
const DEMO_TENANT_ID =
  process.env.NEXT_PUBLIC_DEMO_TENANT_ID ?? "38610ffd-cb80-4938-8b3b-be6230991592";

const WA_LINK =
  "https://wa.me/5511952823271?text=Ol%C3%A1!%20Testei%20a%20demonstra%C3%A7%C3%A3o%20e%20quero%20montar%20o%20assistente%20para%20minha%20cl%C3%ADnica.";
const IG_LINK = "https://instagram.com/lkdigital.odo";

export default function DemoPage() {
  return (
    <main
      id="main-content"
      className="min-h-dvh bg-[#0f0f0f] flex flex-col"
    >
      {/* ── Minimal header: logo only, no nav ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/5">
        <Link href="/" aria-label="LK Digital — página inicial">
          <span className="inline-flex items-center gap-2">
            <LogoIcon className="w-7 h-7" color="#c5a368" />
            <span className="font-display text-lg font-medium tracking-tight text-white">
              LK Digital
            </span>
          </span>
        </Link>

        {/* Subtle demo badge */}
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-body">
          Demonstração
        </span>
      </header>

      {/* ── Hero: tight, mobile-first ── */}
      <div className="flex-shrink-0 px-5 pt-6 pb-4 max-w-2xl mx-auto w-full text-center">
        <h1 className="font-display text-display-md text-white leading-tight mb-2">
          Veja o assistente agendando{" "}
          <span className="text-accent">pacientes em tempo real</span>
        </h1>
        <p className="text-sm text-white/50 font-body leading-relaxed">
          Essa é uma demonstração real — não é vídeo, não é script.
          Teste agora como se fosse um paciente marcando uma consulta.
        </p>
      </div>

      {/* ── Chat widget: dominant, flex-1, fills viewport ── */}
      <div className="flex-1 px-4 pb-4 max-w-2xl mx-auto w-full min-h-0 flex flex-col">
        <DemoChatWidget tenantId={DEMO_TENANT_ID} />
      </div>

      {/* ── Below the fold: context + CTA ── */}
      <section className="flex-shrink-0 border-t border-white/5 px-5 py-10 max-w-2xl mx-auto w-full text-center">
        <p className="text-sm text-white/50 font-body leading-relaxed mb-1">
          A sua clínica teria uma página assim — com o nome, as cores e os
          serviços de vocês.
        </p>
        <p className="text-sm text-white/50 font-body leading-relaxed mb-8">
          O assistente é treinado nos seus tratamentos, horários e forma de
          atendimento. Nada genérico.
        </p>

        {/* Primary CTA — WhatsApp */}
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-accent/20 text-sm mb-4"
        >
          {/* WhatsApp icon */}
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Gostou? Me chama no WhatsApp
        </a>

        {/* Secondary — Instagram */}
        <p className="text-xs text-white/30 font-body">
          Ou me encontra no Instagram{" "}
          <a
            href={IG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-accent transition-colors underline underline-offset-2"
          >
            @lkdigital.odo
          </a>
        </p>
      </section>

      {/* ── Minimal footer ── */}
      <footer className="flex-shrink-0 py-5 text-center">
        <p className="text-[11px] text-white/20 font-body">
          © {new Date().getFullYear()} LK Digital. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  );
}
