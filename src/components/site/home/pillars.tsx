import { Card, CardContent } from "@/components/ui/card";
import { Section } from "../section";

export function Pillars() {
  const pillars = [
    {
      title: "Aquisição previsível",
      text: "Tráfego é apenas o ponto de entrada — não o sistema.",
    },
    {
      title: "Qualificação real",
      text: "Menos curiosos. Mais pacientes viáveis.",
    },
    {
      title: "Conversão operacional",
      text: "Agenda protegida. Processos claros. Menos faltas.",
    },
  ];

  return (
    <Section title="Não operamos campanhas. Instalamos sistemas.">
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {pillars.map((pillar, index) => (
          <Card
            key={index}
            className="rounded-2xl border-muted/60 bg-background py-0"
          >
            <CardContent className="p-6 md:p-8 space-y-3">
              <h3 className="text-lg md:text-xl font-semibold text-foreground">
                {pillar.title}
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {pillar.text}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
