import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, formatDate, calculateReadingTime } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Jornal | Insights Estratégicos para Clínicas Odontológicas",
  description:
    "Artigos sobre GEO, SEO, branding e estratégias de crescimento para dentistas. Conteúdo exclusivo da LK Digital para transformar sua clínica.",
  openGraph: {
    title: "Jornal LK Digital | Marketing Odontológico de Elite",
    description:
      "Insights estratégicos sobre marketing digital para clínicas odontológicas. Aprenda com especialistas em GEO e crescimento.",
  },
};

export default function JornalPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero Section */}
      <section className="section-premium text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm font-medium text-accent uppercase tracking-widest mb-4 md:mb-6">
            LK Jornal
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
            Insights Estratégicos para{" "}
            <span className="text-accent">Crescimento de Clínicas</span>
          </h1>
          <p className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Artigos exclusivos sobre GEO, SEO, branding e estratégias de
            aquisição de pacientes. Conteúdo criado por especialistas em
            marketing odontológico.
          </p>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="w-16 h-px bg-accent mx-auto" aria-hidden="true" />

      {/* Posts Grid */}
      <section className="section-premium">
        {posts.length === 0 ? (
          /* Empty state */
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-muted-foreground/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Conteúdo em Desenvolvimento
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Estamos preparando artigos exclusivos sobre marketing odontológico.
              Em breve, você encontrará insights valiosos para o crescimento da
              sua clínica.
            </p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {/* Featured Post (first post) */}
            {posts.length > 0 && (
              <article className="mb-12 md:mb-16">
                <Link
                  href={`/jornal/${posts[0].slug}`}
                  className="group block"
                >
                  <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
                    {/* Image placeholder */}
                    <div className="aspect-[4/3] bg-muted rounded-sm overflow-hidden">
                      {posts[0].frontmatter.image ? (
                        <img
                          src={posts[0].frontmatter.image}
                          alt={posts[0].frontmatter.imageAlt || posts[0].frontmatter.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-muted-foreground/30"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-accent uppercase tracking-wider">
                          {posts[0].frontmatter.category}
                        </span>
                        {posts[0].frontmatter.featured && (
                          <span className="text-xs font-medium text-white bg-accent px-2 py-0.5 rounded-full">
                            Destaque
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-accent transition-colors">
                        {posts[0].frontmatter.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">
                        {posts[0].frontmatter.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatDate(posts[0].frontmatter.date)}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                        <span>
                          {posts[0].frontmatter.readingTime ||
                            calculateReadingTime(posts[0].frontmatter.description)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* Divider if there are more posts */}
            {posts.length > 1 && (
              <div className="w-full h-px bg-border mb-12 md:mb-16" />
            )}

            {/* Rest of posts */}
            {posts.length > 1 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {posts.slice(1).map((post) => (
                  <article key={post.slug}>
                    <Link
                      href={`/jornal/${post.slug}`}
                      className="group block space-y-4"
                    >
                      {/* Image */}
                      <div className="aspect-[4/3] bg-muted rounded-sm overflow-hidden">
                        {post.frontmatter.image ? (
                          <img
                            src={post.frontmatter.image}
                            alt={post.frontmatter.imageAlt || post.frontmatter.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-muted-foreground/30"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-accent uppercase tracking-wider">
                          {post.frontmatter.category}
                        </span>
                        <h3 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                          {post.frontmatter.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {post.frontmatter.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                          <span>{formatDate(post.frontmatter.date)}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                          <span>
                            {post.frontmatter.readingTime ||
                              calculateReadingTime(post.frontmatter.description)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Newsletter/CTA Section */}
      <section className="section-premium bg-trust-bg">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs sm:text-sm font-medium text-accent uppercase tracking-widest mb-4">
            Mantenha-se Atualizado
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">
            Insights Direto no Seu E-mail
          </h2>
          <p className="mt-4 md:mt-6 text-muted-foreground leading-relaxed">
            Receba artigos exclusivos sobre crescimento de clínicas, tendências
            de GEO e estratégias que funcionam.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-4 sm:py-5 bg-accent text-white hover:bg-accent-dark transition-colors text-base font-medium"
            >
              Falar com Especialista
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
