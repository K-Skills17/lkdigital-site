import Link from "next/link";
import type { Metadata } from "next";
import { FAQSchema } from "@/components/shared/structured-data";
import { FAQAccordion } from "./faq-accordion";
import { faqItems } from "./faq-data";

export const metadata: Metadata = {
  title: "FAQ | Perguntas Frequentes sobre Marketing Digital para Saúde",
  description:
    "Respostas completas sobre GEO, SEO, branding, automação e investimento em marketing digital para clínicas e profissionais de saúde. Médicos, dentistas, dermatologistas, psicólogos e mais.",
  keywords: [
    "FAQ marketing digital saúde",
    "perguntas frequentes marketing clinicas",
    "o que é GEO para saúde",
    "SEO para clinicas medicas",
    "marketing para medicos duvidas",
    "quanto custa marketing digital para dentistas",
    "onboarding agencia marketing saude",
  ],
  openGraph: {
    title: "FAQ | Perguntas Frequentes sobre Marketing Digital para Saúde",
    description:
      "Tudo que você precisa saber sobre marketing digital, GEO e aquisição de pacientes para sua clínica.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function FAQPage() {
  // Spread into a plain mutable array so FAQSchema receives the expected type
  const faqData = faqItems.map((item) => ({ question: item.question, answer: item.answer }));

  return (
    <>
      {/* FAQ Schema for AEO — rendered server-side for maximum crawlability */}
      <FAQSchema faqs={faqData} />

      {/* Hero */}
      <section className="section-premium">
        <div className="max-w-3xl">
          <div className="w-12 h-px bg-accent mb-8" aria-hidden="true" />

          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-5">
            Perguntas Frequentes
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
            Tudo que Você Precisa Saber Antes de Decidir.
          </h1>

          <div className="w-16 h-px bg-accent my-10" aria-hidden="true" />

          <p className="text-xl text-muted-foreground leading-relaxed">
            Reunimos as dúvidas mais comuns de médicos, dentistas, dermatologistas,
            psicólogos e outros profissionais de saúde sobre marketing digital,
            GEO e nossa metodologia. Se a sua pergunta não estiver aqui,{" "}
            <Link
              href="/contato"
              className="text-accent underline underline-offset-4 hover:text-accent-dark transition-colors"
            >
              fale com nossa equipe
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ Accordion — client island, zero layout shift */}
      <section className="py-12 pb-24">
        <div className="max-w-3xl">
          <FAQAccordion />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-premium bg-foreground text-background">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
            Pronto para o Próximo Passo?
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-6">
            Sua dúvida não foi respondida aqui?
          </h2>

          <div className="w-16 h-px bg-accent mx-auto mb-8" aria-hidden="true" />

          <p className="text-lg text-background/75 leading-relaxed mb-10">
            Nossa equipe está disponível para uma conversa consultiva, sem compromisso.
            Agende sua{" "}
            <span className="text-accent font-medium">Diagnose Gratuita</span>{" "}
            e receba uma análise personalizada da presença digital da sua clínica.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white hover:bg-accent-dark transition-colors duration-200 px-8 py-4 text-base font-medium"
            >
              Agendar Diagnose Gratuita
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/segmentos"
              className="inline-flex items-center justify-center gap-2 border border-background/30 text-background hover:border-accent hover:text-accent transition-colors duration-200 px-8 py-4 text-base font-medium"
            >
              Ver Especialidades Atendidas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
