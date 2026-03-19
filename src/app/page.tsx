import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import Problem from "@/components/sections/Problem";
import Pillars from "@/components/sections/Pillars";
import HowItWorks from "@/components/sections/HowItWorks";
import Marquee from "@/components/sections/Marquee";
import Manifesto from "@/components/sections/Manifesto";
import FAQ from "@/components/sections/FAQ";
import CTAFinal from "@/components/sections/CTAFinal";
import ScrollAnimations from "@/components/ScrollAnimations";
import { OrganizationSchema, WebSiteSchema, FAQSchema } from "@/components/StructuredData";

const homeFaqs = [
  { question: "Quanto tempo leva para ver os primeiros pacientes?", answer: "A maioria dos nossos clientes dentistas começa a receber pacientes qualificados nas primeiras 2 a 4 semanas após a ativação." },
  { question: "Eu preciso criar conteúdo ou gerenciar algo?", answer: "Não. Nós criamos todo o conteúdo, gerenciamos as campanhas, otimizamos os perfis e produzimos os relatórios." },
  { question: "Como funciona a exclusividade territorial?", answer: "Aceitamos apenas um consultório por especialidade por região definida. Seu concorrente direto nunca será nosso cliente." },
  { question: "Vocês trabalham com consultórios pequenos ou só clínicas grandes?", answer: "Trabalhamos com ambos. Nosso sistema funciona para um dentista solo e também para clínicas multi-cadeira." },
  { question: "Qual é o investimento? Tem contrato de fidelidade?", answer: "O investimento varia conforme a cidade e especialidade. Não temos multa de fidelidade. Você fica porque funciona." },
  { question: "E se eu já tenho um site e redes sociais?", answer: "Aproveitamos tudo o que já existe. Otimizamos o que funciona, corrigimos o que não funciona e adicionamos as camadas que faltam." },
  { question: "Vocês respeitam as regras do CFO para publicidade odontológica?", answer: "Toda a nossa estratégia é desenvolvida em conformidade com as resoluções do Conselho Federal de Odontologia." },
];

export default function Home() {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <FAQSchema faqs={homeFaqs} />
      <Navbar />
      <ScrollAnimations />
      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <Pillars />
        <HowItWorks />
        <Marquee />
        <Manifesto />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
