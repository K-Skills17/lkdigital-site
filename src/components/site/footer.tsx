import Link from "next/link";

const footerNav = {
  empresa: [
    { label: "Sobre Nós", href: "/sobre" },
    { label: "Soluções", href: "/solucoes" },
    { label: "Casos de Sucesso", href: "/casos" },
    { label: "Segmentos Atendidos", href: "/segmentos" },
    { label: "Insights & Blog", href: "/insights" },
    { label: "FAQ", href: "/faq" },
  ],
  segmentos: [
    { label: "Medicina Geral", href: "/segmentos#medicina" },
    { label: "Odontologia", href: "/segmentos#odontologia" },
    { label: "Dermatologia", href: "/segmentos#dermatologia" },
    { label: "Psicologia", href: "/segmentos#psicologia" },
    { label: "Fisioterapia", href: "/segmentos#fisioterapia" },
    { label: "Nutrição & Wellness", href: "/segmentos#nutricao" },
  ],
  legal: [
    { label: "Privacidade (LGPD)", href: "/privacidade" },
    { label: "Termos de Uso", href: "/termos" },
    { label: "Contato", href: "/contato" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t mt-auto bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Main footer grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4">
              <span className="text-xl font-semibold text-foreground tracking-tight">
                LK <span className="text-accent">Digital</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Marketing digital de precisão para clínicas e profissionais
              de saúde que buscam crescimento sustentável.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>Brasil & Portugal</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-widest mb-4">
              Empresa
            </h3>
            <ul className="space-y-2.5">
              {footerNav.empresa.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-widest mb-4">
              Especialidades
            </h3>
            <ul className="space-y-2.5">
              {footerNav.segmentos.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA box */}
          <div>
            <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-widest mb-4">
              Reserve Sua Vaga
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Máx. 5 clínicas por cidade e 1 por município. Verifique se há disponibilidade para sua região.
            </p>
            <Link
              href="/contato"
              className="inline-block text-xs uppercase tracking-widest font-medium border border-accent/50 text-accent hover:bg-accent hover:text-white px-4 py-2.5 transition-all duration-300"
            >
              Verificar Disponibilidade
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/60 mb-6" aria-hidden="true" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60">
          <div className="flex flex-wrap gap-4">
            {footerNav.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p>© {new Date().getFullYear()} LK Digital. Todos os direitos reservados.</p>
        </div>

        {/* Spacer for mobile bottom CTA */}
        <div className="h-20 md:h-0" />
      </div>
    </footer>
  );
}

