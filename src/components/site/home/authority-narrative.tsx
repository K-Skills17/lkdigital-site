export function AuthorityNarrative() {
  return (
    <section className="section-premium bg-muted">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section eyebrow */}
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
          Nossa Trajetória
        </p>

        {/* Section title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
          Expertise Multissetorial, Rigor Clínico.
        </h2>

        {/* Decorative divider */}
        <div className="w-16 h-px bg-accent mx-auto my-10" aria-hidden="true" />

        {/* Body copy - styled as an editorial block */}
        <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
          <p>
            O mercado digital não perdoa amadores. Após seis anos refinando
            estratégias de alta performance em mercados ultra-competitivos, a LK
            Digital traz esse arsenal para o setor odontológico.
          </p>

          <p>
            Não entregamos apenas &ldquo;curtidas&rdquo; ou tráfego vazio.
            Entregamos <span className="text-foreground font-medium">infraestrutura</span>.
            Entendemos que uma clínica de elite não precisa de mais volume, mas
            sim de <span className="text-foreground font-medium">previsibilidade</span>,{" "}
            <span className="text-foreground font-medium">pacientes de alto valor</span> e
            uma presença digital que reflita a excelência do seu trabalho clínico.
          </p>
        </div>
      </div>
    </section>
  );
}
