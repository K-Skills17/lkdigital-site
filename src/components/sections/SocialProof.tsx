import { Container } from "@/components/home/primitives";

export default function SocialProof() {
  const proofs = [
    {
      quote: "Pela primeira vez, eu sei de onde cada paciente novo está vindo. Antes era tudo no escuro.",
      role: "Implantodontista — São Paulo, SP",
      detail: "Cliente desde 2025",
    },
    {
      quote: "Parei de depender só de indicação. Agora tenho um sistema que trabalha por mim enquanto eu atendo.",
      role: "Ortodontista — Curitiba, PR",
      detail: "Cliente desde 2025",
    },
    {
      quote: "O que mais me surpreendeu foi a exclusividade. Sei que meu concorrente da esquina não tem acesso ao mesmo sistema.",
      role: "Clínica Odontológica — Rio de Janeiro, RJ",
      detail: "Cliente desde 2025",
    },
  ];

  return (
    <section className="border-b border-border bg-trust-bg py-16 md:py-20">
      <Container>
        <ul className="grid md:grid-cols-3">
          {proofs.map((proof, i) => (
            <li
              key={i}
              className={`social-proof-card flex flex-col justify-between gap-6 border-t border-foreground/15 py-8 md:border-t-0 md:py-0 ${
                i > 0 ? "md:border-l md:pl-8" : ""
              } ${i < 2 ? "md:pr-8" : ""} ${i === 0 ? "border-t-0 pt-0" : ""}`}
            >
              <blockquote className="font-display text-xl italic leading-snug text-foreground md:text-2xl">
                &ldquo;{proof.quote}&rdquo;
              </blockquote>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground/80">{proof.role}</span>
                <span className="mx-2 text-accent-ink" aria-hidden="true">·</span>
                {proof.detail}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-12 border-t border-foreground/15 pt-6 text-xs font-medium text-muted-foreground">
          Vagas limitadas por cidade — aceitamos apenas 1 consultório por
          especialidade por região
        </p>
      </Container>
    </section>
  );
}
