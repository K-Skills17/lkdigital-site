import { Card, CardContent } from "@/components/ui/card";

export function Pillars() {
  const pillars = [
    {
      number: "I",
      title: "Aquisição de Precisão",
      subtitle: "GEO & SEO",
      description:
        "Onde os pacientes buscam respostas, sua clínica deve ser a autoridade. Otimizamos sua presença para motores de busca e inteligências artificiais (LLMs), garantindo que você seja a primeira escolha.",
    },
    {
      number: "II",
      title: "Branding e Experiência Boutique",
      subtitle: "Identidade Premium",
      description:
        "A percepção de valor começa antes da consulta. Desenhamos identidades visuais e experiências digitais que comunicam luxo, confiança e exclusividade.",
    },
    {
      number: "III",
      title: "Sistemas de Escala Digital",
      subtitle: "Infraestrutura",
      description:
        "Preparando o terreno para o futuro. Estruturamos sua coleta de dados e funis de conversão para suportar a expansão de múltiplas unidades com eficiência operacional.",
    },
  ];

  return (
    <section className="section-premium">
      {/* Section header */}
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
          Nossa Expertise
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
          Os Três Pilares
        </h2>
      </div>

      {/* Pillars grid */}
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {pillars.map((pillar) => (
          <Card
            key={pillar.number}
            className="rounded-none border-0 border-t border-accent/30 bg-transparent shadow-none"
          >
            <CardContent className="pt-8 px-0 space-y-4">
              {/* Pillar number */}
              <span className="text-accent font-heading text-2xl font-medium">
                {pillar.number}
              </span>

              {/* Pillar title */}
              <h3 className="text-xl md:text-2xl font-semibold text-foreground leading-tight">
                {pillar.title}
              </h3>

              {/* Pillar subtitle */}
              <p className="text-sm text-accent uppercase tracking-wider">
                {pillar.subtitle}
              </p>

              {/* Pillar description */}
              <p className="text-base text-muted-foreground leading-relaxed pt-2">
                {pillar.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
