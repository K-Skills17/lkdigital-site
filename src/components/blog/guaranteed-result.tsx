import Link from "next/link";
import { Button } from "@/components/ui/button";

interface GuaranteedResultProps {
  title?: string;
  description?: string;
  ctaText?: string;
}

export function GuaranteedResult({
  title = "Pronto para Resultados Garantidos?",
  description = "Transforme sua clínica com estratégias que entregam crescimento previsível e mensurável.",
  ctaText = "Garantir Meu Crescimento",
}: GuaranteedResultProps) {
  return (
    <div className="my-8 md:my-12 p-6 md:p-8 bg-foreground text-background rounded-sm">
      {/* Decorative top line */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-px bg-accent" aria-hidden="true" />
        <span className="text-xs uppercase tracking-widest text-accent">
          LK Guarantee
        </span>
      </div>

      {/* Shield icon */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
          <svg
            className="w-6 h-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-lg md:text-xl font-semibold text-background mb-2">
            {title}
          </h4>
          <p className="text-sm md:text-base text-background/70 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Guarantee points */}
      <ul className="space-y-2 mb-6">
        <li className="flex items-center gap-3 text-sm text-background/80">
          <svg
            className="w-4 h-4 text-accent shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Resultados mensuráveis em até 90 dias</span>
        </li>
        <li className="flex items-center gap-3 text-sm text-background/80">
          <svg
            className="w-4 h-4 text-accent shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Metodologia GEO exclusiva para clínicas</span>
        </li>
        <li className="flex items-center gap-3 text-sm text-background/80">
          <svg
            className="w-4 h-4 text-accent shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Suporte estratégico contínuo</span>
        </li>
      </ul>

      {/* CTA Button */}
      <Button
        asChild
        size="lg"
        className="w-full bg-accent text-foreground hover:bg-accent-light py-5 md:py-6 text-base font-medium"
      >
        <Link href="/contato">{ctaText}</Link>
      </Button>

      {/* Trust note */}
      <p className="text-center text-xs text-background/50 mt-4">
        Consultoria estratégica gratuita • Sem compromisso
      </p>
    </div>
  );
}
