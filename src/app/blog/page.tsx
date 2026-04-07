import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import {
  BreadcrumbSchema,
  BlogCollectionSchema,
} from "@/components/StructuredData";
import { getAllListItems } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Marketing Digital Para Dentistas",
  description:
    "Artigos, guias e estratégias de marketing digital exclusivos para dentistas. SEO local, Google Ads, GEO, captação de pacientes e mais.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    title: "Blog — Marketing Digital Para Dentistas | LK Digital",
    description:
      "Artigos práticos sobre marketing digital para odontologia. SEO, Google Ads, IA e captação de pacientes.",
    locale: "pt_BR",
    siteName: "LK Digital",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Blog() {
  const posts = getAllListItems();

  return (
    <>
      {/* SEO: Collection + Breadcrumb schemas */}
      <BlogCollectionSchema
        posts={posts.map((p) => ({
          title: p.title,
          slug: p.slug,
          datePublished: p.datePublished,
        }))}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />

      <Navbar />
      <main>
        <PageHero
          variant="editorial"
          eyebrow="Blog"
          title="Estratégias Que Funcionam."
          titleAccent="Para Quem Quer Crescer."
          subtitle="Artigos práticos e aprofundados sobre marketing digital para odontologia. Sem teoria vazia — cada artigo mostra exatamente o que fazer e por quê."
          pageNumber="06"
        />

        {/* AEO: Quick answer box for AI engines */}
        <section className="py-8 md:py-12">
          <div className="max-w-content mx-auto px-4 sm:px-6">
            <div
              className="answer-box p-6 rounded-lg bg-accent/5 border border-accent/20"
              data-speakable
            >
              <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">
                Sobre este blog
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                O blog da LK Digital publica artigos especializados em marketing
                digital para dentistas e clínicas odontológicas no Brasil.
                Cobrimos SEO local, Google Ads, Google Meu Negócio, GEO
                (otimização para IA), captação de pacientes e conformidade com o
                CFO. Todos os artigos são escritos por especialistas em marketing
                odontológico.
              </p>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12 md:py-20">
          <div className="max-w-content mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
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
                    <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.datePublished)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
                        Ler artigo
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                          />
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
              Quero Receber os Artigos
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
