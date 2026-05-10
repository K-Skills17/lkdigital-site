import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import FAQ from "@/components/sections/FAQ";
import Link from "next/link";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: { absolute: "Perguntas Frequentes | LK Digital" },
  description:
    "Respostas completas sobre marketing digital para dentistas: prazos, investimento, exclusividade territorial, conformidade com CFO e mais.",
  openGraph: {
    title: "Perguntas Frequentes | LK Digital",
    description: "Respostas completas sobre marketing digital para dentistas: prazos, investimento, exclusividade territorial, conformidade com CFO e mais.",
    images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
  },
};

export default function FAQPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "FAQ", href: "/faq" },
      ]} />
      <FAQSchema faqs={[
        { question: "Quanto tempo leva para ver os primeiros pacientes?", answer: "A maioria dos nossos clientes dentistas começa a receber pacientes qualificados nas primeiras 2 a 4 semanas após a ativação." },
        { question: "Eu preciso criar conteúdo ou gerenciar algo?", answer: "Não. Nós criamos todo o conteúdo, gerenciamos as campanhas, otimizamos os perfis e produzimos os relatórios." },
        { question: "Como funciona a exclusividade territorial?", answer: "Aceitamos apenas um consultório por especialidade por região definida. Seu concorrente direto nunca será nosso cliente." },
        { question: "Vocês trabalham com consultórios pequenos ou só clínicas grandes?", answer: "Trabalhamos com ambos. Nosso sistema funciona para um dentista solo e também para clínicas multi-cadeira." },
        { question: "Qual é o investimento? Tem contrato de fidelidade?", answer: "O investimento varia conforme a cidade e especialidade. Não temos multa de fidelidade. Você fica porque funciona." },
        { question: "E se eu já tenho um site e redes sociais?", answer: "Aproveitamos tudo o que já existe. Otimizamos o que funciona, corrigimos o que não funciona e adicionamos as camadas que faltam." },
        { question: "Vocês respeitam as regras do CFO para publicidade odontológica?", answer: "Toda a nossa estratégia é desenvolvida em conformidade com as resoluções do Conselho Federal de Odontologia." },
      ]} />
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
