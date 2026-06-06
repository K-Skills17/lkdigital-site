import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

import CTAFinal from "@/components/sections/CTAFinal";
import { BreadcrumbSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Diagnóstico Gratuito — Agende Sua Análise",
  description:
    "Solicite seu diagnóstico digital gratuito. Analisamos sua presença online, região e concorrência — e mostramos exatamente como captar mais pacientes.",
  alternates: {
    canonical: "/contato",
  },
  openGraph: {
    title: "Diagnóstico Gratuito | LK Digital",
    description: "Solicite seu diagnóstico digital gratuito para dentistas. Analisamos sua presença online e mostramos como captar mais pacientes.",
    images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
  },
};

export default function Contato() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Contato", href: "/contato" },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contato — LK Digital",
        "url": "https://lkdigital.odo.br/contato",
        "description": "Solicite seu diagnóstico digital gratuito para dentistas."
      }) }} />
      <Navbar />
      <main>
        <PageHero
          variant="dramatic"
          eyebrow="Próximo passo"
          title="Solicite Seu Diagnóstico"
          titleAccent="Gratuito."
          subtitle="Em 30 minutos, mostramos quantos pacientes você está perdendo e exatamente o que fazer para captá-los. Sem compromisso."
        />

        {/* Form Section */}
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
