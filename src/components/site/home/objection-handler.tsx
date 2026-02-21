import { AnimatedSection } from "@/components/shared/animated-section";
import { Clock, DollarSign, Zap } from "lucide-react";

const objections = [
  {
    icon: Clock,
    concern: "Não tenho tempo para me envolver com marketing",
    answer:
      "Você não precisa. Após uma reunião inicial de 60 minutos para entender sua clínica, a LK Digital opera de forma autônoma. Relatórios mensais em PDF — sem reuniões semanais, sem aprovações constantes.",
  },
  {
    icon: DollarSign,
    concern: "Já investi em marketing e não tive retorno",
    answer:
      "Entendemos. Por isso entregamos um diagnóstico gratuito antes de qualquer investimento. Você vê exatamente onde está o gap e o que faremos — sem promessas vagas, com projeções baseadas em dados reais das clínicas parceiras.",
  },
  {
    icon: Zap,
    concern: "É muito complexo para minha realidade atual",
    answer:
      "Adaptamos o ritmo à sua clínica. Começamos pelo impacto mais rápido — normalmente SEO local e posicionamento em IA — e escalamos conforme os resultados aparecem. Simples para você, complexo para nós.",
  },
];

export function ObjectionHandler() {
  return (
    <section
      className="section-premium"
      aria-labelledby="objection-heading"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <AnimatedSection animation="fade-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="block w-6 h-px bg-accent" aria-hidden="true" />
              <p className="text-xs font-medium text-accent uppercase tracking-[0.25em]">
                Suas Dúvidas, Respondidas
              </p>
              <span className="block w-6 h-px bg-accent" aria-hidden="true" />
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={1}>
            <h2
              id="objection-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight"
            >
              Sem Interferir na Sua Rotina Clínica
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={2}>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Sabemos o que você está pensando. Aqui estão as respostas honestas.
            </p>
          </AnimatedSection>
        </div>

        {/* Objections */}
        <div className="space-y-6">
          {objections.map((obj, i) => (
            <AnimatedSection key={obj.concern} animation="fade-up" delay={(i + 2) as 0 | 1 | 2 | 3 | 4 | 5}>
              <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start bg-muted p-8 border-l-2 border-accent/30 hover:border-accent transition-colors duration-300">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <obj.icon
                    className="w-5 h-5 text-accent"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <div>
                  <p className="text-base font-semibold text-foreground mb-3">
                    &ldquo;{obj.concern}&rdquo;
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {obj.answer}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
