import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contato | Diagnose Gratuita para sua Clínica",
  description:
    "Solicite sua Diagnose Digital Gratuita. A LK Digital analisa a presença digital da sua clínica e apresenta um plano estratégico personalizado para médicos, dentistas, dermatologistas, psicólogos e outros profissionais de saúde.",
  keywords: [
    "contato LK Digital",
    "diagnose gratuita marketing saúde",
    "consultoria marketing para clinicas",
    "agencia marketing saude contato",
    "marketing digital para medicos orçamento",
  ],
  openGraph: {
    title: "Contato | Diagnose Gratuita para sua Clínica",
    description:
      "Solicite uma análise gratuita da presença digital da sua clínica. Sem compromisso.",
    type: "website",
    locale: "pt_BR",
  },
};

function ContactInfoItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-sm bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-accent uppercase tracking-widest mb-1">{label}</p>
        <p className="text-foreground font-medium">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block hover:opacity-80 transition-opacity">
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}

function TrustBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        className="w-5 h-5 text-accent shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

export default function ContatoPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-premium">
        <div className="max-w-4xl">
          <div className="w-12 h-px bg-accent mb-8" aria-hidden="true" />

          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-5">
            Vamos Conversar
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
            Diagnose Digital Gratuita para Sua Clínica.
          </h1>

          <div className="w-16 h-px bg-accent my-10" aria-hidden="true" />

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Preencha o formulário e nossa equipe realizará uma análise completa
            da presença digital da sua clínica — sem custo e sem compromisso.
            Em até{" "}
            <span className="text-foreground font-medium">1 dia útil</span>,
            você receberá um retorno personalizado.
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="py-8 pb-24">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">

          {/* Left column: Info + Value Props + Trust Badges (40%) */}
          <aside className="lg:col-span-2 space-y-12">

            {/* Contact info */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">
                Informações de Contato
              </h2>

              <ContactInfoItem
                label="WhatsApp"
                value="+55 (11) 99999-9999"
                href="https://wa.me/5511999999999?text=Olá%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20Diagnose%20Gratuita%20da%20LK%20Digital"
                icon={
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                }
              />

              <ContactInfoItem
                label="E-mail"
                value="contato@lkdigital.com.br"
                href="mailto:contato@lkdigital.com.br"
                icon={
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              <ContactInfoItem
                label="Atendimento"
                value="Segunda a Sexta, das 9h às 18h"
                icon={
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>

            <div className="w-full h-px bg-border" aria-hidden="true" />

            {/* Value Props */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">
                O que acontece depois do contato?
              </h2>

              <ol className="space-y-5">
                {[
                  {
                    step: "01",
                    title: "Análise do seu perfil",
                    desc: "Nossa equipe revisa suas informações e pesquisa a presença digital atual da sua clínica.",
                  },
                  {
                    step: "02",
                    title: "Diagnose personalizada",
                    desc: "Em até 1 dia útil, agendamos uma sessão de 30 minutos para apresentar os pontos de oportunidade.",
                  },
                  {
                    step: "03",
                    title: "Proposta sob medida",
                    desc: "Se houver alinhamento, apresentamos um plano estratégico com escopo, entregáveis e ROI esperado.",
                  },
                ].map((item) => (
                  <li key={item.step} className="flex items-start gap-4">
                    <span className="text-2xl font-heading text-accent shrink-0 leading-none mt-1">
                      {item.step}
                    </span>
                    <div>
                      <p className="font-medium text-foreground text-sm">{item.title}</p>
                      <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="w-full h-px bg-border" aria-hidden="true" />

            {/* Trust Badges */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-5">
                Nossos compromissos com você
              </h2>
              <TrustBadge text="Diagnose 100% gratuita, sem compromisso de contratação" />
              <TrustBadge text="Comunicação ética, alinhada às normas do CFM e conselhos de saúde" />
              <TrustBadge text="Proposta personalizada para sua especialidade e mercado" />
              <TrustBadge text="Sigilo total — seus dados não são compartilhados" />
              <TrustBadge text="Sem contratos de longo prazo no primeiro projeto" />
              <TrustBadge text="Resposta garantida em até 1 dia útil" />
            </div>

            {/* Social proof */}
            <div className="bg-trust-bg border border-accent/20 p-6 space-y-3">
              <div className="flex items-center gap-1" aria-label="Avaliação 5 estrelas">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-accent fill-current" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-sm text-muted-foreground leading-relaxed italic">
                &ldquo;Após a Diagnose, ficou claro que estávamos invisíveis digitalmente.
                Em 90 dias de parceria com a LK Digital, nossa agenda estava
                completamente tomada.&rdquo;
              </blockquote>
              <p className="text-xs font-medium text-foreground">
                Clínica de Dermatologia — São Paulo, SP
              </p>
            </div>
          </aside>

          {/* Right column: Form (60%) */}
          <div className="lg:col-span-3">
            <div className="bg-muted p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                  Solicitar Diagnose Gratuita
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Preencha os campos abaixo. Quanto mais detalhes, mais precisa
                  será a sua análise personalizada.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom social proof strip */}
      <section className="border-t border-border py-12">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-8 uppercase tracking-widest font-medium">
            Especialidades Atendidas
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              "Medicina",
              "Odontologia",
              "Dermatologia",
              "Psicologia",
              "Fisioterapia",
              "Nutrição",
              "Cardiologia",
              "Ortopedia",
              "Pediatria",
            ].map((esp) => (
              <span key={esp} className="text-sm text-muted-foreground font-medium">
                {esp}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
