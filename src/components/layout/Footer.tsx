import Link from "next/link";
import Logo from "@/components/ui/Logo";

const footerSections = [
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Soluções", href: "/solucoes" },
      { label: "Casos de Sucesso", href: "/casos" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Especialidades",
    links: [
      { label: "Implantodontia", href: "/segmentos#implantodontia" },
      { label: "Ortodontia", href: "/segmentos#ortodontia" },
      { label: "Odontopediatria", href: "/segmentos#odontopediatria" },
      { label: "Endodontia", href: "/segmentos#endodontia" },
      { label: "Periodontia", href: "/segmentos#periodontia" },
      { label: "Estética Dental", href: "/segmentos#estetica" },
    ],
  },
  {
    title: "Reserve Sua Vaga",
    links: [
      { label: "Diagnóstico Gratuito", href: "/contato" },
      { label: "Ferramentas Gratuitas", href: "/ferramentas" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-white/60 border-t border-white/5">
      <div className="max-w-content mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex mb-4">
              <Logo variant="full" color="white" />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-5">
              Marketing digital de precisão para dentistas que querem uma agenda
              cheia de pacientes qualificados — sem gerenciar nada.
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://wa.me/5511952823271"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                (11) 95282-3271
              </a>
              <a
                href="tel:+5511946851028"
                className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                (11) 94685-1028
              </a>
              <a
                href="mailto:contato@lkdigital.org"
                className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                contato@lkdigital.org
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-white text-sm font-medium mb-4 uppercase tracking-[0.25em]">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Language Links */}
        <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs">
          <a href="/" className="text-white/60 hover:text-white transition-colors">
            Portugu&ecirc;s
          </a>
          <span className="text-white/20">|</span>
          <a href="/en" className="text-white/60 hover:text-white transition-colors">
            English
          </a>
          <span className="text-white/20">|</span>
          <a href="/fr" className="text-white/60 hover:text-white transition-colors">
            Fran&ccedil;ais
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} LK Digital. Todos os direitos
            reservados.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/privacidade" className="hover:text-white transition-colors">
              Privacidade (LGPD)
            </Link>
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
