import { Container, SectionLabel, SpecGrid } from "@/components/home/primitives";

export default function Problem() {
  const painPoints = [
    "Cadeiras vazias em horários nobres que deveriam estar faturando",
    "Investimento em marketing que não se transforma em pacientes na cadeira",
    "Dependência de indicações — quando param, a agenda esvazia",
    "Agências genéricas que não entendem a regulação do CFO e as nuances da odontologia",
  ];

  return (
    <section className="py-section">
      <Container>
        <SpecGrid label={<SectionLabel>O problema</SectionLabel>}>
          <h2 className="max-w-4xl font-display text-display-lg text-foreground text-balance">
            Você Estudou Anos Para Ser um Dentista Excelente.{" "}
            <span className="text-muted-foreground">Não Para Ser um Especialista em Marketing.</span>
          </h2>

          <ol className="mt-14 grid border-t border-foreground/15 sm:grid-cols-2 sm:gap-x-12">
            {painPoints.map((text, i) => (
              <li key={i} className="problem-card flex gap-6 border-b border-foreground/15 py-6">
                <span className="w-6 shrink-0 font-display text-lg text-accent-ink lining-nums" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-foreground/85">{text}</p>
              </li>
            ))}
          </ol>
        </SpecGrid>
      </Container>
    </section>
  );
}
