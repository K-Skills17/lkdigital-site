import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAllListItems } from "@/lib/blog";

export const metadata: Metadata = {
  title: { absolute: "Stephen Domingos Komando — Fundador, LK Digital" },
  description:
    "Stephen Domingos Komando é fundador da LK Digital, agência de marketing digital especializada exclusivamente em odontologia. Escreve sobre SEO local, Google Ads e captação de pacientes para dentistas.",
  alternates: { canonical: "/autores/stephen-domingos-komando" },
  openGraph: {
    title: "Stephen Domingos Komando | LK Digital",
    description: "Fundador da LK Digital. Especialista em marketing digital para dentistas no Brasil.",
    images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AuthorPage() {
  const allPosts = getAllListItems();
  const authorPosts = allPosts.filter(
    (p) => p.authorName === "Stephen Domingos Komando" || p.source === "static"
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Stephen Domingos Komando",
    jobTitle: "Fundador e CEO",
    worksFor: {
      "@type": "Organization",
      name: "LK Digital",
      url: "https://lkdigital.odo.br",
    },
    url: "https://lkdigital.odo.br/autores/stephen-domingos-komando",
    knowsAbout: [
      "marketing digital para dentistas",
      "SEO local para consultórios odontológicos",
      "Google Ads para odontologia",
      "captação de pacientes qualificados",
      "marketing odontológico no Brasil",
    ],
    description:
      "Fundador da LK Digital, agência especializada exclusivamente em marketing para dentistas. Trabalha com consultórios em todo o Brasil para lotar agendas e construir marcas premium na odontologia.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />
      <main className="pt-20 md:pt-24">
        {/* Author Header */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-foreground">Stephen Domingos Komando</span>
            </nav>

            <div className="flex items-start gap-6 md:gap-10">
              <div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center">
                <span className="font-display text-2xl md:text-4xl font-medium text-accent">SK</span>
              </div>
              <div className="flex-1">
                <h1 className="font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-tight text-foreground mb-1">
                  Stephen Domingos Komando
                </h1>
                <p className="text-accent text-sm font-medium mb-4">Fundador &amp; CEO — LK Digital</p>
                <div className="space-y-3 text-muted-foreground text-sm leading-relaxed max-w-2xl">
                  <p>
                    Fundei a LK Digital com uma premissa simples: dentistas excelentes merecem
                    agendas cheias. Antes de lançar a agência, trabalhei com marketing digital
                    para vários setores e vi de perto como profissionais de saúde eram mal
                    atendidos por agências genéricas — campanhas erradas, métricas de vaidade
                    e zero conhecimento das regulações do CFO.
                  </p>
                  <p>
                    Decidi fazer diferente. A LK Digital atende exclusivamente dentistas.
                    Isso significa que conheço profundamente o funil do paciente odontológico,
                    as especialidades de maior ticket, o que funciona no Google Ads para implantes,
                    e como construir autoridade local para consultórios que querem cobrar mais
                    sem perder pacientes.
                  </p>
                  <p>
                    Trabalho com consultórios em todo o Brasil, desde clínicas multiespecialistas
                    em São Paulo até clínicos gerais em cidades do interior. O que une todos:
                    querem pacientes qualificados, não só volume.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <Link
                    href="/sobre"
                    className="text-sm font-medium text-accent hover:text-accent-dark transition-colors"
                  >
                    Sobre a LK Digital →
                  </Link>
                  <Link
                    href="/contato"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Falar com Stephen →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16 md:py-24">
          <div className="max-w-content mx-auto px-4 sm:px-6">
            <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-8">
              Artigos publicados · {authorPosts.length} no total
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group p-5 bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all duration-200 flex flex-col"
                >
                  <span className="inline-block px-2 py-0.5 text-[10px] font-medium text-accent bg-accent/10 rounded uppercase tracking-wider mb-3">
                    {post.category}
                  </span>
                  <h2 className="font-display text-base font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{formatDate(post.datePublished)}</span>
                    <span className="text-xs text-muted-foreground">{post.readTime} leitura</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
