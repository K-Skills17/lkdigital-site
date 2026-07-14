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
    <section className="relative py-16 bg-trust-bg border-y border-border/60">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {proofs.map((proof, i) => (
            <div
              key={i}
              className="social-proof-card flex flex-col gap-3"
            >
              <p className="text-sm text-foreground/80 italic leading-relaxed">
                &ldquo;{proof.quote}&rdquo;
              </p>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  — {proof.role}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  {proof.detail}
                </p>
              </div>
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
