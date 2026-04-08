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

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
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
