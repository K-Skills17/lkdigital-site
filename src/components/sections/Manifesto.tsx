export default function Manifesto() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-prose mx-auto px-4 sm:px-6 text-center">
        {/* Decorative quotes */}
        <span className="manifesto-quote block font-display text-7xl md:text-8xl text-accent/10 leading-none mb-4 opacity-0">
          &ldquo;
        </span>

        <blockquote className="manifesto-text opacity-0">
          <p className="font-display text-display-sm md:text-display-md text-foreground leading-snug text-balance mb-8">
            Marketing de precisão não é sobre fazer mais.
            <br className="hidden md:block" />
            É sobre fazer o{" "}
            <span className="text-accent">exactamente certo</span> — para que
            cada real investido traga um paciente real à sua cadeira.
          </p>
        </blockquote>

        <div className="w-12 h-px bg-accent/40 mx-auto mb-8" />

        {/* Philosophy trilogy */}
        <div className="manifesto-trilogy flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 opacity-0">
          {[
            { label: "Precisão", desc: "sobre volume" },
            { label: "Dados", desc: "sobre intuição" },
            { label: "Sustentável", desc: "sobre tendências" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-lg font-medium text-foreground">
                {item.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
