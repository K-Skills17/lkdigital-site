import { Container, SpecGrid } from "@/components/home/primitives";

export default function Manifesto() {
  const trilogy = [
    { label: "Precisão", desc: "sobre volume" },
    { label: "Dados", desc: "sobre intuição" },
    { label: "Sustentável", desc: "sobre tendências" },
  ];

  return (
    <section className="py-section">
      <Container>
        <SpecGrid
          label={
            <span aria-hidden="true" className="block font-display text-7xl leading-none text-accent md:text-8xl">
              &ldquo;
            </span>
          }
        >
          <blockquote className="manifesto-text">
            <p className="max-w-5xl font-display text-[clamp(2rem,1.2rem+3vw,3.75rem)] leading-[1.12] text-foreground text-balance">
              Marketing de precisão não é sobre fazer mais. É sobre fazer o{" "}
              <em className="text-accent-ink">exatamente certo</em> — para que
              cada real investido traga um paciente real à sua cadeira.
            </p>
          </blockquote>

          <dl className="manifesto-trilogy mt-14 grid grid-cols-3 border-t border-foreground/15">
            {trilogy.map((item, i) => (
              <div key={item.label} className={`pt-6 ${i > 0 ? "border-l border-foreground/15 pl-4 md:pl-8" : ""}`}>
                <dt className="font-display text-xl font-medium text-foreground md:text-2xl">{item.label}</dt>
                <dd className="mt-1 text-xs text-muted-foreground md:text-sm">{item.desc}</dd>
              </div>
            ))}
          </dl>
        </SpecGrid>
      </Container>
    </section>
  );
}
