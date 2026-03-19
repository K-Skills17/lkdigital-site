import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Soluções — O Que Fazemos Pelo Seu Consultório",
  description:
    "Visibilidade no Google e Maps, gestão completa de marketing, exclusividade territorial. Conheça os três pilares que enchem a agenda de dentistas.",
};

const services = [
  {
    category: "Visibilidade Digital",
    items: [
      {
        title: "SEO Local para Dentistas",
        desc: "Posicionamos seu consultório na primeira página do Google para buscas como 'dentista em [sua cidade]', '[sua especialidade] perto de mim' e variações que seus pacientes realmente digitam.",
        result: "Pacientes encontram você antes do concorrente",
      },
      {
        title: "Google Maps & Google Meu Negócio",
        desc: "Perfil otimizado com fotos profissionais, avaliações gerenciadas, posts semanais e respostas a perguntas. Seu consultório aparece no mapa quando o paciente busca na região.",
        result: "Aparição no pacote local do Google (top 3)",
      },
      {
        title: "GEO & AEO — Presença em IA",
        desc: "Otimizamos seu conteúdo para ser citado por ChatGPT, Gemini e Perplexity quando pacientes perguntam sobre tratamentos odontológicos na sua região.",
        result: "Sua clínica recomendada por inteligências artificiais",
      },
    ],
  },
  {
    category: "Captação Ativa",
    items: [
      {
        title: "Google Ads para Odontologia",
        desc: "Campanhas de busca e display focadas em intenção de compra. Quando alguém busca 'implante dentário preço' ou 'ortodontista particular', seu anúncio aparece primeiro.",
        result: "Pacientes prontos para agendar chegam até você",
      },
      {
        title: "Meta Ads (Instagram & Facebook)",
        desc: "Anúncios segmentados para o público da sua região. Criativos que respeitam as regras do CFO e convertem curiosos em pacientes agendados.",
        result: "Fluxo previsível de novos pacientes via redes sociais",
      },
      {
        title: "Landing Pages de Conversão",
        desc: "Páginas específicas para cada campanha e especialidade, otimizadas para transformar cliques em agendamentos. Sem distrações, sem saídas — apenas conversão.",
        result: "Taxa de conversão 3-5x maior que sites genéricos",
      },
    ],
  },
  {
    category: "Gestão e Conteúdo",
    items: [
      {
        title: "Conteúdo Estratégico",
        desc: "Blog posts, artigos e conteúdo social criados pela nossa equipe — otimizados para SEO, escritos com autoridade e em conformidade com o CFO. Você não precisa pensar em nada.",
        result: "Autoridade digital que atrai pacientes organicamente",
      },
      {
        title: "Gestão de Reputação Online",
        desc: "Monitoramento e resposta a avaliações no Google, gestão da percepção online e estratégias para aumentar o volume de reviews positivos de forma ética.",
        result: "Reputação 5 estrelas que convence pacientes indecisos",
      },
      {
        title: "Relatórios e Otimização Contínua",
        desc: "Relatório mensal claro — sem jargão — mostrando pacientes captados, custo por lead, ROI e próximos passos. Reunião mensal com seu estrategista dedicado.",
        result: "Visibilidade total dos resultados e do investimento",
      },
    ],
  },
];

export default function Solucoes() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          variant="typographic"
          eyebrow="Soluções"
          title="Nunca Mais Cadeira Vazia"
          titleAccent="Vazia"
          subtitle="Cada serviço foi desenhado especificamente para odontologia. Não adaptamos estratégias de restaurante para dentista — construímos do zero para o seu mercado."
        />

        {/* Services */}
        {services.map((category, ci) => (
          <section
            key={ci}
            className={`py-20 md:py-24 ${ci % 2 === 1 ? "bg-muted" : ""}`}
          >
            <div className="max-w-content mx-auto px-4 sm:px-6">
              <h2 className="font-display text-display-sm text-foreground mb-10">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {category.items.map((service, si) => (
                  <div
                    key={si}
                    className="group p-6 md:p-8 bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all duration-300 flex flex-col"
                  >
                    <h3 className="font-display text-lg font-medium text-foreground mb-3 group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                      {service.desc}
                    </p>
                    <div className="pt-4 border-t border-border/60">
                      <p className="text-sm font-medium text-accent flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {service.result}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="py-20 md:py-28 text-center">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-md text-foreground mb-4">
              Quer Saber Quais Soluções Fazem Sentido Para Você?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              O diagnóstico gratuito identifica as oportunidades específicas do
              seu consultório e da sua região.
            </p>
            <Link
              href="/contato"
              className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
            >
              Solicitar Diagnóstico Gratuito
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
