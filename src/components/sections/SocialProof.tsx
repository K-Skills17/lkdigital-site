export default function SocialProof() {
  const proofs = [
    {
      quote: "Em 3 meses, minha agenda de implantes saiu de 40% para 92% de ocupação.",
      role: "Implantodontista — São Paulo, SP",
    },
    {
      quote: "Finalmente parei de depender de indicação. Agora os pacientes me encontram.",
      role: "Ortodontista — Curitiba, PR",
    },
    {
      quote: "O ROI se pagou na primeira semana. Não exagero.",
      role: "Clínica Odontológica — Rio de Janeiro, RJ",
    },
  ];

  return (
    <section className="relative py-16 bg-trust-bg border-y border-border/60">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {proofs.map((proof, i) => (
            <div
              key={i}
              className="social-proof-card flex flex-col gap-3 opacity-0"
            >
              <p className="text-sm text-foreground/80 italic leading-relaxed">
                &ldquo;{proof.quote}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                — {proof.role}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="text-xs text-muted-foreground font-medium">
            Vagas limitadas por cidade — aceitamos apenas 1 consultório por
            especialidade por região
          </p>
        </div>
      </div>
    </section>
  );
}
