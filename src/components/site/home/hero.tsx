import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="py-10 md:py-14">
      <div className="space-y-8 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-[rgb(var(--brand-primary))] leading-tight">
          LK Digital instala sistemas previsíveis de aquisição e conversão para
          clínicas odontológicas que não querem depender de sorte.
        </h1>
        <div className="space-y-6">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Menos improviso. Mais controle.
            <br />
            Processos claros do anúncio até o agendamento — com foco em
            previsibilidade operacional.
          </p>
          <div className="space-y-2">
            <Button
              asChild
              size="lg"
              className="bg-[rgb(var(--brand-accent))] text-white hover:opacity-90"
            >
              <Link href="/diagnostico">Diagnosticar sua clínica</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Avaliação estratégica. Sem propostas. Sem vendas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
