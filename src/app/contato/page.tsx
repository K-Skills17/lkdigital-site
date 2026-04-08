import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import MultilingualBadge from "@/components/ui/MultilingualBadge";
import CTAFinal from "@/components/sections/CTAFinal";

export const metadata: Metadata = {
  title: "Diagnóstico Gratuito — Agende Sua Análise",
  description:
    "Solicite seu diagnóstico digital gratuito. Analisamos sua presença online, região e concorrência — e mostramos exatamente como captar mais pacientes.",
};

export default function Contato() {
  return (
    <>
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
        <MultilingualBadge />
      </main>
      <Footer />
    </>
  );
}
