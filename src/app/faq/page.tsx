import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import FAQ from "@/components/sections/FAQ";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — Perguntas Frequentes Sobre Marketing Para Dentistas",
  description:
    "Respostas completas sobre marketing digital para dentistas: prazos, investimento, exclusividade territorial, conformidade com CFO e mais.",
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          variant="minimal"
          eyebrow="FAQ"
          title="Suas Dúvidas, Respondidas"
          titleAccent="com Clareza."
          subtitle="Tudo o que dentistas perguntam antes de começar. Se a sua dúvida não estiver aqui, agende um diagnóstico gratuito e tire todas as suas perguntas ao vivo."
          pageNumber="Perguntas · 07"
        />

        {/* FAQ Component */}
        <FAQ />

        {/* CTA */}
        <section className="py-20 md:py-28 text-center">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-md text-foreground mb-4">
              Ainda Tem Dúvidas?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Agende uma conversa sem compromisso. Respondemos tudo e ainda
              mostramos onde estão as oportunidades para o seu consultório.
            </p>
            <Link
              href="/contato"
              className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
            >
              Falar Com a Equipe
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
