"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with Formspree or Resend endpoint)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section className="section-premium">
      <div className="max-w-2xl mx-auto">
        {/* Section header - Responsive margins */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs sm:text-sm font-medium text-accent uppercase tracking-widest mb-4 md:mb-6">
            Próximo Passo
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Inicie sua Transformação.
          </h2>
          <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Selecionamos um número limitado de parceiros para garantir a
            exclusividade e o rigor técnico que sua clínica merece.
          </p>
        </div>

        {/* Decorative divider */}
        <div className="w-12 md:w-16 h-px bg-accent mx-auto mb-8 md:mb-12" aria-hidden="true" />

        {isSubmitted ? (
          /* Success state */
          <div className="text-center py-8 md:py-12 px-4 md:px-6 border border-accent/30 bg-muted/50">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3 md:mb-4">
              Solicitação Recebida
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Nossa equipe entrará em contato em até 48 horas úteis.
            </p>
          </div>
        ) : (
          /* Form - Responsive spacing */
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Director name */}
            <div className="space-y-2">
              <label
                htmlFor="director-name"
                className="block text-sm font-medium text-foreground"
              >
                Nome do Diretor Clínico
              </label>
              <input
                type="text"
                id="director-name"
                name="director-name"
                required
                className="w-full px-4 py-3 md:py-4 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors text-base"
                placeholder="Dr. João Silva"
              />
            </div>

            {/* Clinic name */}
            <div className="space-y-2">
              <label
                htmlFor="clinic-name"
                className="block text-sm font-medium text-foreground"
              >
                Nome da Unidade/Clínica
              </label>
              <input
                type="text"
                id="clinic-name"
                name="clinic-name"
                required
                className="w-full px-4 py-3 md:py-4 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors text-base"
                placeholder="Clínica Odontológica Premium"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                E-mail Profissional
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 md:py-4 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors text-base"
                placeholder="contato@suaclinica.com.br"
              />
            </div>

            {/* Main challenge */}
            <div className="space-y-2">
              <label
                htmlFor="challenge"
                className="block text-sm font-medium text-foreground"
              >
                Principal desafio de crescimento atual
              </label>
              <textarea
                id="challenge"
                name="challenge"
                required
                rows={4}
                className="w-full px-4 py-3 md:py-4 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors resize-none text-base"
                placeholder="Descreva brevemente o principal desafio que sua clínica enfrenta atualmente..."
              />
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full bg-accent text-white hover:bg-accent-dark py-5 md:py-6 text-base disabled:opacity-50"
            >
              {isSubmitting ? "Processando..." : "Iniciar Minha Transformação"}
            </Button>

            {/* Privacy note */}
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              Suas informações são tratadas com confidencialidade absoluta.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
