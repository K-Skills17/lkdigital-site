import SpotCounter from "./SpotCounter";

export default function Hero() {
  return (
    <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-3xl mx-auto text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[#C4963A] mb-6 font-body">
        Avaliação gratuita · Clínicas odontológicas
      </p>
      <h1 className="font-display text-display-lg md:text-display-xl text-[#EDE8DF] mb-6">
        Sua clínica está pronta para como os pacientes vão encontrar dentistas em 2026?
      </h1>
      <p className="text-[#EDE8DF]/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 font-body">
        Avaliação gratuita e individual da presença digital da sua clínica — Google, site,
        Instagram, WhatsApp e busca por IA — com nota de 0 a 100 e os 3 pontos mais críticos para
        corrigir. Sem custo, sem compromisso, sem call de vendas obrigatória.
      </p>
      <a
        href="#form"
        className="inline-block bg-[#C4963A] text-[#111111] font-semibold px-8 py-4 text-base rounded hover:bg-[#d4a94a] transition-colors font-body"
      >
        Solicitar meu Raio-X gratuito →
      </a>
      <div className="mt-8">
        <SpotCounter />
      </div>
    </section>
  );
}
