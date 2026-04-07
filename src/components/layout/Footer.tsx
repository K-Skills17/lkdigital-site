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
            <p className="text-sm leading-relaxed max-w-xs">
              Marketing digital de precisão para dentistas que querem uma agenda
              cheia de pacientes qualificados — sem gerenciar nada.
            </p>
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
