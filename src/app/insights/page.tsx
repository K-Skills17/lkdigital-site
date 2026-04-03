import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insights — Blog de Marketing Digital Para Dentistas",
  description:
    "Artigos, guias e estratégias de marketing digital exclusivos para dentistas. SEO local, Google Ads, captação de pacientes e mais.",
};

const posts = [
  {
    slug: "seo-local-dentistas-guia-completo",
    title: "SEO Local para Dentistas: O Guia Completo para Aparecer no Google da Sua Região",
    excerpt:
      "82% dos pacientes buscam dentistas no Google antes de agendar. Este guia mostra exatamente como posicionar seu consultório na primeira página — passo a passo.",
    category: "SEO",
    readTime: "12 min",
  },
  {
    slug: "google-meu-negocio-dentista",
    title: "Google Meu Negócio Para Dentistas: 7 Otimizações Que Triplicam Seus Pacientes",
    excerpt:
      "Seu perfil no Google Maps é o primeiro contato de muitos pacientes. Estas 7 otimizações transformam um perfil esquecido em uma máquina de agendamentos.",
    category: "Google Maps",
    readTime: "8 min",
  },
  {
    slug: "google-ads-odontologia",
    title: "Google Ads Para Odontologia: Como Investir Sem Desperdiçar Dinheiro",
    excerpt:
      "O erro mais caro em Google Ads para dentistas é pagar por cliques que nunca viram pacientes. Veja como montar campanhas que geram agendamentos reais.",
    category: "Ads",
    readTime: "10 min",
  },
  {
    slug: "marketing-implantodontia",
    title: "Marketing Para Implantodontistas: Como Captar Pacientes de Alto Ticket",
    excerpt:
      "Pacientes de implante pesquisam por semanas antes de decidir. Veja como construir a presença digital que os convence de que você é a melhor escolha.",
    category: "Estratégia",
    readTime: "9 min",
  },
  {
    slug: "regras-cfo-publicidade",
    title: "Publicidade Odontológica: O Que o CFO Permite (e O Que Pode Dar Problema)",
    excerpt:
      "Antes e depois, preços, promessas de resultado — o que pode e o que não pode na publicidade odontológica segundo as resoluções do CFO.",
    category: "Compliance",
    readTime: "7 min",
  },
  {
    slug: "ia-busca-dentistas",
    title: "Como IAs (ChatGPT, Gemini) Estão Mudando a Forma Como Pacientes Escolhem Dentistas",
    excerpt:
      "Pacientes já perguntam ao ChatGPT 'qual o melhor dentista em [cidade]'. Veja como garantir que seu consultório seja a resposta.",
    category: "GEO",
    readTime: "11 min",
  },
];

export default function Insights() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          variant="editorial"
          eyebrow="Insights"
          title="Estratégias Que Funcionam."
          titleAccent="Para Quem Quer Crescer."
          subtitle="Artigos práticos e aprofundados sobre marketing digital para odontologia. Sem teoria vazia — cada artigo mostra exatamente o que fazer e por quê."
          pageNumber="06"
        />

        {/* Posts Grid */}
        <section className="py-20 md:py-28">
          <div className="max-w-content mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/insights/${post.slug}`}
                  className="group bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Placeholder image area */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-accent/5 to-accent/10 flex items-center justify-center">
                    <span className="text-xs text-accent/40 uppercase tracking-[0.25em] font-medium">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-0.5 text-[10px] font-medium text-accent bg-accent/10 rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {post.readTime} de leitura
                      </span>
                    </div>
                    <h2 className="font-display text-lg font-medium text-foreground group-hover:text-accent transition-colors mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border/60">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
                        Ler artigo
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 md:py-28 bg-muted text-center">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-md text-foreground mb-4">
              Receba Estratégias Direto no Seu E-mail
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Um e-mail por semana com a estratégia mais relevante para
              consultórios odontológicos. Sem spam, sem enrolação.
            </p>
            <Link
              href="/contato"
              className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
            >
              Quero Receber os Insights
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
