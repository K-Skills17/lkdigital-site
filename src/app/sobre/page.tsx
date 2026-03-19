import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre — Quem é a LK Digital",
  description:
    "Somos uma agência de marketing digital especializada exclusivamente em odontologia. Precisão, dados e exclusividade territorial para dentistas que querem crescer.",
};

export default function Sobre() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          variant="split"
          eyebrow="Sobre nós"
          title="Não Somos Uma Agência Genérica."
          titleAccent="Somos o Sistema."
          subtitle="A LK Digital existe para resolver um problema específico: dentistas excelentes que não recebem os pacientes que merecem — porque ninguém os encontra online."
        />

        {/* Manifesto */}
        <section className="py-20 md:py-28">
          <div className="max-w-prose mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-sm text-foreground mb-8">
              O que acreditamos
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                A odontologia brasileira tem um paradoxo: profissionais
                extremamente qualificados com agendas pela metade. O problema
                quase nunca é a qualidade do serviço. É a visibilidade.
              </p>
              <p>
                Nós nascemos para resolver isso. Não com promessas vagas de
                &ldquo;mais seguidores&rdquo; ou &ldquo;branding&rdquo;, mas com
                um sistema mensurável que coloca pacientes qualificados na sua
                cadeira — semana após semana.
              </p>
              <p>
                Cada real investido precisa gerar retorno. Cada estratégia
                precisa ter dados por trás. E cada dentista que trabalha conosco
                precisa sentir que tem uma equipe de marketing dedicada — não um
                serviço genérico que atende 200 clientes ao mesmo tempo.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  value: "Precisão",
                  desc: "Cada campanha, cada conteúdo e cada otimização é baseada em dados da sua região, especialidade e concorrência.",
                },
                {
                  value: "Exclusividade",
                  desc: "Um consultório por especialidade por região. Seu concorrente direto nunca será nosso cliente.",
                },
                {
                  value: "Transparência",
                  desc: "Você sabe exatamente o que está sendo feito, quanto custa, e quais resultados está gerando.",
                },
              ].map((item, i) => (
                <div key={i} className="border-t-2 border-accent/30 pt-4">
                  <h3 className="font-display text-lg font-medium text-foreground mb-2">
                    {item.value}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Dentistry Only */}
        <section className="py-20 md:py-28 bg-muted">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="font-display text-display-md text-foreground text-balance">
                Por Que Só Odontologia?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {[
                {
                  title: "Conhecemos as regras do CFO",
                  desc: "Publicidade odontológica tem regras específicas. Sabemos exatamente o que pode e o que não pode — porque só fazemos isso.",
                },
                {
                  title: "Entendemos o funil do paciente",
                  desc: "Desde a primeira busca no Google até sentar na cadeira. Cada etapa tem uma estratégia otimizada para odontologia.",
                },
                {
                  title: "Dados comparativos reais",
                  desc: "Nossos benchmarks são de consultórios odontológicos reais — não de e-commerce ou restaurantes. Isso muda tudo.",
                },
                {
                  title: "Vocabulário do paciente",
                  desc: "Sabemos que o paciente busca 'clareamento dental preço' e não 'bleaching cosmético'. Parecemos óbvios, mas a maioria erra nisso.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 bg-card rounded-xl border border-border/60"
                >
                  <h3 className="font-display text-lg font-medium text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 text-center">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-md text-foreground mb-4">
              Pronto Para Ter Uma Agenda Que Faz Jus ao Seu Trabalho?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              O diagnóstico é gratuito, sem compromisso, e mostra exatamente
              onde estão os pacientes que você não está alcançando.
            </p>
            <Link
              href="/contato"
              className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
            >
              Agendar Diagnóstico Gratuito
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
