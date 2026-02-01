import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="section-premium flex flex-col items-center text-center">
      {/* Decorative accent line */}
      <div className="w-12 h-px bg-accent mb-8" aria-hidden="true" />

      {/* Main Headline */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight max-w-4xl">
        A Nova Era do Crescimento Odontológico de Alto Padrão.
      </h1>

      {/* Sub-headline */}
      <p className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
        Combinamos seis anos de inteligência digital com a precisão exigida pela
        odontologia moderna. Criamos ecossistemas de aquisição que transformam
        clínicas em referências de mercado.
      </p>

      {/* CTA Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center">
        <Button
          asChild
          size="lg"
          className="bg-accent text-white hover:bg-accent-dark px-8 py-6 text-base"
        >
          <Link href="/contato">Solicitar Consultoria Estratégica</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-foreground/20 text-foreground hover:bg-foreground/5 px-8 py-6 text-base"
        >
          <Link href="/filosofia">Conheça nossa Filosofia</Link>
        </Button>
      </div>

      {/* Bottom decorative element */}
      <div className="mt-16 w-24 h-px bg-border" aria-hidden="true" />
    </section>
  );
}
