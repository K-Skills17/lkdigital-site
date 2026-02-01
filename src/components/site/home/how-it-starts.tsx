import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Section } from "../section";

export function HowItStarts() {
  const steps = [
    "Avaliação estratégica",
    "Identificação de gargalos reais",
    "Direcionamento claro",
  ];

  return (
    <Section title="Tudo começa com um diagnóstico.">
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-0">
          {steps.map((step, index) => (
            <div key={index}>
              <div className="py-4 flex items-start">
                <span className="mr-4 text-accent font-medium text-base md:text-lg shrink-0">
                  {index + 1}.
                </span>
                <span className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && <Separator className="ml-12" />}
            </div>
          ))}
        </div>
        <div>
          <Button
            asChild
            size="lg"
            className="bg-accent text-white hover:opacity-90"
          >
            <Link href="/diagnostico">Diagnosticar sua clínica</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
