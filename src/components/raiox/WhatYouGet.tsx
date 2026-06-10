const items = [
  "Nota Raio-X (0–100) da presença digital da sua clínica",
  "Análise dos 7 pilares: Google, site, busca, IA, Instagram, WhatsApp e conformidade CFO",
  "Teste real de atendimento: simulamos um paciente entrando em contato e medimos a resposta",
  "Verificação de conformidade: sinalizamos riscos de publicidade irregular antes que virem problema",
  "Os 3 achados críticos da sua clínica, com evidências e o que fazer",
  "Checklist 2026 — 10 itens que você pode corrigir por conta própria, hoje",
];

export default function WhatYouGet() {
  return (
    <section className="px-6 py-16 md:py-24 max-w-3xl mx-auto">
      <h2 className="font-display text-display-md text-[#EDE8DF] mb-10">
        O que você recebe — em até 7 dias úteis
      </h2>
      <ol className="space-y-6">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full border border-[#C4963A] flex items-center justify-center text-[#C4963A] text-sm font-semibold font-body">
              {i + 1}
            </span>
            <p className="text-[#EDE8DF]/80 text-base font-body pt-1">{item}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
