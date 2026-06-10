import Hero from "@/components/raiox/Hero";
import TheShift from "@/components/raiox/TheShift";
import WhatYouGet from "@/components/raiox/WhatYouGet";
import WhoAnalyzes from "@/components/raiox/WhoAnalyzes";
import HowItWorks from "@/components/raiox/HowItWorks";
import FAQ from "@/components/raiox/FAQ";
import LeadForm from "@/components/raiox/LeadForm";
import Footer from "@/components/raiox/Footer";
import SpotCounter from "@/components/raiox/SpotCounter";
import RaioXTracking from "@/components/raiox/RaioXViewEvent";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "É grátis mesmo? Qual a pegadinha?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'É grátis. A "pegadinha", com transparência: algumas clínicas, depois de ver o relatório, decidem nos contratar para resolver o que encontramos. A maioria usa o checklist por conta própria. Os dois caminhos estão ok.',
      },
    },
    {
      "@type": "Question",
      name: "Vocês vão me ligar insistindo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. Você recebe o PDF e uma única mensagem perguntando se quer ajuda. Sem follow-up infinito.",
      },
    },
    {
      "@type": "Question",
      name: "Serve para clínica pequena?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A avaliação é a mesma para 1 ou 10 cadeiras. O que muda é o plano de ação.",
      },
    },
    {
      "@type": "Question",
      name: "Por que só 50 vagas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Porque cada análise inclui etapas manuais — incluindo o teste de atendimento real, feito por uma pessoa. Não é um relatório gerado em massa por ferramenta.",
      },
    },
  ],
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LK Digital",
  url: "https://lkdigital.odo.br",
  description: "Marketing exclusivo para clínicas odontológicas",
  areaServed: "BR",
};

export default function RaioXPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#111111] text-[#EDE8DF] selection:bg-[#C4963A]/30 pb-16 md:pb-0"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <RaioXTracking />

      <Hero />
      <hr className="border-[#C4963A]/10 max-w-3xl mx-auto" />
      <section data-track-section="the-shift">
        <TheShift />
      </section>
      <hr className="border-[#C4963A]/10 max-w-3xl mx-auto" />
      <section data-track-section="what-you-get">
        <WhatYouGet />
      </section>
      <hr className="border-[#C4963A]/10 max-w-3xl mx-auto" />
      <section data-track-section="who-analyzes">
        <WhoAnalyzes />
      </section>
      <hr className="border-[#C4963A]/10 max-w-3xl mx-auto" />
      <section data-track-section="how-it-works">
        <HowItWorks />
      </section>
      <hr className="border-[#C4963A]/10 max-w-3xl mx-auto" />
      <section data-track-section="faq">
        <FAQ />
      </section>
      <hr className="border-[#C4963A]/10 max-w-3xl mx-auto" />
      <LeadForm />
      <Footer />

      {/* Sticky mobile counter bar */}
      <SpotCounter variant="sticky" />
    </main>
  );
}
