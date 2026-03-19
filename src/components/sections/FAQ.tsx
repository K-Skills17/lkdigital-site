"use client";

import { useState } from "react";

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
    <section className="py-20 md:py-28 bg-muted" id="faq">
      <div className="max-w-narrow mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-3">
            Suas dúvidas, respondidas
          </p>
          <h2 className="font-display text-display-md text-foreground text-balance">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3" role="list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-card rounded-lg border border-border/60 overflow-hidden"
              role="listitem"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left group"
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="font-display text-base font-medium text-foreground group-hover:text-accent transition-colors">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${
                    openIndex === i ? "rotate-45" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
              <div
                id={`faq-answer-${i}`}
                className="faq-content"
                data-open={openIndex === i}
              >
                <div>
                  <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
