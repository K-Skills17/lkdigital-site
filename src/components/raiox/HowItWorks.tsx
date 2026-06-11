const steps = [
  { num: "①", text: "Você preenche o formulário (2 minutos)" },
  { num: "②", text: "Sua análise roda nos 7 pilares (até 7 dias úteis)" },
  { num: "③", text: "Você recebe o relatório em PDF no seu WhatsApp" },
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-10 md:py-16 max-w-3xl mx-auto">
      <h2 className="font-display text-display-md text-[#EDE8DF] mb-10">Como funciona</h2>
      <div className="flex flex-col md:flex-row gap-6 md:gap-4 md:items-start">
        {steps.map((step, i) => (
          <div key={i} className="flex-1 flex items-start gap-3">
            <span className="text-[#C4963A] text-2xl leading-none">{step.num}</span>
            <p className="text-[#EDE8DF]/80 text-base font-body">{step.text}</p>
          </div>
        ))}
      </div>
      <p className="text-[#EDE8DF]/60 text-sm font-body mt-8">
        Só isso. Se quiser conversar sobre os achados, a porta está aberta — mas a decisão é sua.
      </p>
    </section>
  );
}
