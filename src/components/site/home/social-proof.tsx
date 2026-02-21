import { AnimatedSection } from "@/components/shared/animated-section";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote:
      "Em 4 meses, saímos de R$80k para R$150k de faturamento mensal. O que mais me surpreendeu foi que não precisei mudar nada na minha rotina de atendimentos — a LK Digital cuidou de tudo nos bastidores.",
    author: "Dra. A. Santos",
    specialty: "Cardiologista",
    location: "São Paulo, SP",
    result: "+87% faturamento em 4 meses",
    stars: 5,
  },
  {
    id: 2,
    quote:
      "Tentei duas agências antes. Nenhuma entendia o contexto de uma clínica odontológica especializada em implantes. A LK Digital chegou com dados e um plano claro. Em 90 dias, o ticket médio subiu 52%.",
    author: "Dr. R. Mendes",
    specialty: "Cirurgião-Dentista (Implantodontia)",
    location: "Curitiba, PR",
    result: "+52% ticket médio em 90 dias",
    stars: 5,
  },
  {
    id: 3,
    quote:
      "Dermatologia é um mercado saturado. A LK Digital nos colocou como referência nas buscas por IA — hoje pacientes chegam dizendo que o ChatGPT recomendou nossa clínica. Resultado inacreditável.",
    author: "Dra. C. Torres",
    specialty: "Dermatologista",
    location: "Rio de Janeiro, RJ",
    result: "3.4× retorno sobre investimento",
    stars: 5,
  },
];

export function SocialProof() {
  return (
    <section className="section-premium bg-muted" aria-labelledby="social-proof-heading">
      <div className="text-center mb-14">
        <AnimatedSection animation="fade-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-6 h-px bg-accent" aria-hidden="true" />
            <p className="text-xs font-medium text-accent uppercase tracking-[0.25em]">
              Resultados Reais
            </p>
            <span className="block w-6 h-px bg-accent" aria-hidden="true" />
          </div>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={1}>
          <h2
            id="social-proof-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight"
          >
            O Que os Parceiros Dizem
          </h2>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={2}>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Depoimentos de profissionais de saúde que transformaram seus
            resultados. Nomes preservados por confidencialidade.
          </p>
        </AnimatedSection>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <AnimatedSection key={t.id} animation="fade-up" delay={(i + 2) as 0 | 1 | 2 | 3 | 4 | 5}>
            <article className="flex flex-col h-full bg-background border border-border/60 p-8 relative overflow-hidden">
              {/* Gold left accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent"
                aria-hidden="true"
              />

              {/* Stars */}
              <div className="flex gap-1 mb-6" aria-label={`${t.stars} de 5 estrelas`}>
                {Array.from({ length: t.stars }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-4 h-4 text-accent fill-accent"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1 text-muted-foreground leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Result badge */}
              <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 px-3 py-1.5 rounded-sm mb-5 self-start">
                <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                  {t.result}
                </span>
              </div>

              {/* Author */}
              <footer>
                <p className="text-sm font-semibold text-foreground">{t.author}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.specialty} · {t.location}
                </p>
              </footer>
            </article>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
