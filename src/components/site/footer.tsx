import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Filosofia", href: "/sobre" },
    { label: "Soluções", href: "/solucoes" },
    { label: "O Jornal", href: "/insights" },
    { label: "Inquérito", href: "/contato" },
  ];

  const legalLinks = [
    { label: "Política de Privacidade", href: "/privacidade" },
    { label: "Termos de Serviço", href: "/termos" },
  ];

  return (
    <footer className="bg-foreground text-background/90 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Section 1: Brand & Bio */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-heading font-semibold text-background">
                LK Digital
              </span>
            </Link>
            <p className="text-sm text-background/70 leading-relaxed">
              Elevando o padrão do crescimento odontológico através de
              inteligência digital e resultados garantidos.
            </p>
            {/* Decorative accent line */}
            <div className="w-12 h-px bg-accent" aria-hidden="true" />
          </div>

          {/* Section 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-accent uppercase tracking-widest">
              Navegação
            </h3>
            <nav className="flex flex-col space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-background/70 hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Section 3: Authority & SEO */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-accent uppercase tracking-widest">
              Especialidades
            </h3>
            <p className="text-sm text-background/70 leading-relaxed">
              Especialistas em GEO Odontológico, SEO para Dentistas, Marketing
              de Alta Performance e Expansão de Clínicas.
            </p>
            <div className="pt-2">
              <p className="text-xs text-background/50">
                Atendendo Portugal, Brasil e Clínicas Internacionais.
              </p>
            </div>
          </div>

          {/* Section 4: Legal & Compliance */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-accent uppercase tracking-widest">
              Legal
            </h3>
            <nav className="flex flex-col space-y-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-background/70 hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-background/50">
              © {currentYear} LK Digital. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-background/50">PT</span>
              <span className="text-xs text-background/30">|</span>
              <span className="text-xs text-background/30">EN (em breve)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Schema for SEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "LK Digital",
            description:
              "Especialistas em marketing digital para dentistas e clínicas odontológicas. GEO, SEO e sistemas de aquisição de pacientes.",
            url: "https://lkdigital.com.br",
            areaServed: ["Portugal", "Brasil", "Internacional"],
            knowsAbout: [
              "GEO Odontológico",
              "SEO para Dentistas",
              "Marketing Odontológico",
              "Expansão de Clínicas",
            ],
          }),
        }}
      />

      {/* Spacer for mobile sticky CTA */}
      <div className="h-20 md:h-0" />
    </footer>
  );
}
