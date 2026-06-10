const cards = [
  {
    title: "Busca por IA",
    text: "Pacientes já perguntam ao ChatGPT e ao Gemini qual clínica procurar — e a resposta cita nomes.",
  },
  {
    title: "Decisão no WhatsApp",
    text: "O paciente fala com 3 clínicas ao mesmo tempo. A primeira resposta de qualidade costuma levar a consulta.",
  },
  {
    title: "Perfis desatualizados",
    text: "O Google reordena resultados o tempo todo. Quem parou no tempo desce — sem aviso.",
  },
];

export default function TheShift() {
  return (
    <section className="px-6 py-16 md:py-24 max-w-3xl mx-auto">
      <h2 className="font-display text-display-md text-[#EDE8DF] mb-6">
        O jogo mudou — e a maioria das clínicas ainda não percebeu.
      </h2>
      <div className="space-y-4 text-[#EDE8DF]/80 text-base leading-relaxed font-body mb-12">
        <p>
          Em 2026, o paciente não procura dentista só no Google. Ele pergunta para a IA do celular:
          &ldquo;qual o melhor lugar para fazer implante perto de mim?&rdquo; — e recebe uma
          resposta, não dez links.
        </p>
        <p>
          Se a sua clínica não aparece nessa resposta, ela não existe para esse paciente. E o
          detalhe: a concorrente que aparece não é necessariamente a melhor clínica. É a que está
          tecnicamente preparada.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="border border-[#C4963A]/30 rounded bg-[#1A1A1A] p-6"
          >
            <h3 className="font-display text-lg text-[#C4963A] mb-2">{card.title}</h3>
            <p className="text-[#EDE8DF]/70 text-sm font-body">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
