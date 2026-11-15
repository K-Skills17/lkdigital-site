"use client";

import { useState } from "react";
import { Container, SectionLabel } from "@/components/ui/primitives";

const faqs = [
  {
    question: "Quanto tempo leva para ver os primeiros pacientes?",
    answer:
      "A maioria dos nossos clientes dentistas começa a receber pacientes qualificados nas primeiras 2 a 4 semanas após a ativação. Campanhas pagas geram resultados mais rápidos, enquanto SEO e Google Maps constroem um fluxo crescente e sustentável nos meses seguintes.",
  },
  {
    question: "Eu preciso criar conteúdo ou gerenciar algo?",
    answer:
      "Não. Nós criamos todo o conteúdo, gerenciamos as campanhas, otimizamos os perfis e produzimos os relatórios. Você recebe pacientes na agenda e um resumo mensal claro dos resultados. Sua única tarefa é fazer o que você faz de melhor: atender seus pacientes.",
  },
  {
    question: "Como funciona a exclusividade territorial?",
    answer:
      "Aceitamos apenas um consultório por especialidade por região definida. Se você é implantodontista em Moema, São Paulo, nenhum outro implantodontista de Moema pode ser nosso cliente. Isso garante que toda a nossa estratégia, dados e inteligência competitiva trabalhem exclusivamente a seu favor.",
  },
  {
    question: "Vocês trabalham com consultórios pequenos ou só clínicas grandes?",
    answer:
      "Trabalhamos com ambos. Nosso sistema foi desenhado para escalar: funciona para um dentista solo que quer encher sua agenda pessoal e também para clínicas multi-cadeira que precisam de fluxo para vários profissionais. O diagnóstico gratuito mostra exatamente o que faz sentido para o seu porte.",
  },
  {
    question: "Qual é o investimento? Tem contrato de fidelidade?",
    answer:
      "O investimento varia conforme a cidade, especialidade e escopo — por isso começamos com o diagnóstico gratuito, que inclui uma proposta personalizada com valores transparentes. Não temos multa de fidelidade. Você fica porque funciona, não porque está preso a um contrato.",
  },
  {
    question: "E se eu já tenho um site e redes sociais?",
    answer:
      "Ótimo — aproveitamos tudo o que já existe. Nosso trabalho começa com uma auditoria do que você já tem. Otimizamos o que funciona, corrigimos o que não funciona e adicionamos as camadas que faltam. Não jogamos fora o investimento que você já fez.",
  },
  {
    question: "Vocês respeitam as regras do CFO para publicidade odontológica?",
    answer:
      "Absolutamente. Toda a nossa estratégia de conteúdo e publicidade para dentistas é desenvolvida em conformidade com as resoluções do Conselho Federal de Odontologia. Isso inclui restrições sobre antes/depois, promessas de resultado e linguagem promocional. Compliance não é opcional — é parte do nosso processo.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="border-t border-border bg-muted py-section" id="faq">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <SectionLabel>Suas dúvidas, respondidas</SectionLabel>
            <h2 className="mt-6 font-display text-display-lg text-foreground text-balance">Perguntas Frequentes</h2>
          </div>

          <ul className="border-t border-foreground/80 lg:col-span-8">
            {faqs.map((faq, i) => (
              <li key={i} className="border-b border-foreground/15">
                <h3>
                  <button
                    onClick={() => toggle(i)}
                    className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                    aria-expanded={openIndex === i}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                  >
                    <span className="font-display text-xl font-medium text-foreground transition-colors group-hover:text-accent-ink md:text-2xl">
                      {faq.question}
                    </span>
                    <svg
                      aria-hidden="true"
                      className={`mt-1.5 h-5 w-5 flex-shrink-0 text-accent-ink transition-transform duration-300 ${
                        openIndex === i ? "rotate-45" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </h3>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  className="faq-content"
                  data-open={openIndex === i}
                >
                  <div>
                    <p className="max-w-2xl pb-6 text-base leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
