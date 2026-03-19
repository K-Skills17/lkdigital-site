import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Casos de Sucesso — Resultados Reais de Dentistas",
  description:
    "Veja como dentistas e clínicas odontológicas encheram suas agendas com pacientes qualificados usando o sistema LK Digital.",
};

const cases = [
  {
    specialty: "Implantodontista",
    location: "São Paulo, SP",
    challenge: "Agenda com 40% de ocupação, dependência total de indicações",
    results: [
      { metric: "92%", label: "Ocupação da agenda" },
      { metric: "47", label: "Novos pacientes/mês" },
      { metric: "3.2x", label: "ROI sobre investimento" },
    ],
    timeline: "90 dias",
    quote:
      "Em 3 meses, saí de depender de indicação para ter fila de espera. O sistema funciona enquanto eu opero.",
  },
  {
    specialty: "Ortodontista",
    location: "Curitiba, PR",
    challenge: "Concorrência forte de clínicas de alinhadores, pacientes comparando preço",
    results: [
      { metric: "68", label: "Leads qualificados/mês" },
      { metric: "R$ 180", label: "Custo por lead" },
      { metric: "28%", label: "Taxa de conversão" },
    ],
    timeline: "60 dias",
    quote:
      "Parei de competir por preço. Agora os pacientes me procuram pela expertise — não pelo desconto.",
  },
  {
    specialty: "Clínica Multidisciplinar",
    location: "Rio de Janeiro, RJ",
    challenge: "4 cadeiras, 2 dentistas ociosos, presença digital inexistente",
    results: [
      { metric: "100%", label: "Cadeiras ocupadas" },
      { metric: "R$ 85K", label: "Faturamento adicional/mês" },
      { metric: "4.8★", label: "Nota no Google (127 reviews)" },
    ],
    timeline: "120 dias",
    quote:
      "O ROI se pagou na primeira semana. Hoje não consigo imaginar a clínica sem a LK Digital.",
  },
];

export default function Casos() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          variant="dramatic"
          eyebrow="Casos de sucesso"
          title="Resultados Reais."
          titleAccent="Dentistas Reais."
          subtitle="Não prometemos — mostramos. Veja como consultórios odontológicos transformaram sua captação de pacientes com o sistema LK Digital."
        />

        {/* Case Studies */}
        <section className="py-20 md:py-28">
          <div className="max-w-content mx-auto px-4 sm:px-6 space-y-16">
            {cases.map((c, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-border/60 overflow-hidden"
              >
                <div className="p-8 md:p-10">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                      <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-1">
                        {c.specialty}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {c.location}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Resultados em {c.timeline}
                    </span>
                  </div>

                  {/* Challenge */}
                  <div className="mb-8">
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.25em] mb-2">
                      Desafio
                    </p>
                    <p className="text-foreground font-medium">{c.challenge}</p>
                  </div>

                  {/* Results Grid */}
                  <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-muted rounded-xl">
                    {c.results.map((r, j) => (
                      <div key={j} className="text-center">
                        <p className="font-display text-2xl md:text-3xl font-semibold text-accent">
                          {r.metric}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {r.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="border-l-2 border-accent/30 pl-4">
                    <p className="text-sm text-muted-foreground italic">
                      &ldquo;{c.quote}&rdquo;
                    </p>
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-muted text-center">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-md text-foreground mb-4">
              Quer Ser o Próximo Caso de Sucesso?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Comece com o diagnóstico gratuito e descubra o potencial de
              crescimento do seu consultório.
            </p>
            <Link
              href="/contato"
              className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
            >
              Quero Meu Diagnóstico Gratuito
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
