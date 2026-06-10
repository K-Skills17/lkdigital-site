"use client";

import { useState } from "react";

const faqs = [
  {
    q: "É grátis mesmo? Qual a pegadinha?",
    a: 'É grátis. A "pegadinha", com transparência: algumas clínicas, depois de ver o relatório, decidem nos contratar para resolver o que encontramos. A maioria usa o checklist por conta própria. Os dois caminhos estão ok.',
  },
  {
    q: "Vocês vão me ligar insistindo?",
    a: "Não. Você recebe o PDF e uma única mensagem perguntando se quer ajuda. Sem follow-up infinito.",
  },
  {
    q: "Serve para clínica pequena?",
    a: "A avaliação é a mesma para 1 ou 10 cadeiras. O que muda é o plano de ação.",
  },
  {
    q: "Por que só 50 vagas?",
    a: "Porque cada análise inclui etapas manuais — incluindo o teste de atendimento real, feito por uma pessoa. Não é um relatório gerado em massa por ferramenta.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-6 py-16 md:py-24 max-w-3xl mx-auto">
      <h2 className="font-display text-display-md text-[#EDE8DF] mb-10">Perguntas frequentes</h2>
      <div className="divide-y divide-[#C4963A]/20">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left py-5 flex justify-between items-center gap-4 group"
              aria-expanded={open === i}
            >
              <span className="text-[#EDE8DF] text-base font-body font-medium">{faq.q}</span>
              <span
                className="text-[#C4963A] text-xl flex-shrink-0 transition-transform duration-200"
                style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className="overflow-hidden transition-all duration-200"
              style={{
                maxHeight: open === i ? "200px" : "0px",
                opacity: open === i ? 1 : 0,
              }}
            >
              <p className="text-[#EDE8DF]/70 text-sm font-body pb-5 leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
