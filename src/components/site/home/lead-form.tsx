"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/shared/animated-section";
import { CheckCircle2, Lock, ArrowRight } from "lucide-react";

const inputClass =
  "w-full px-5 py-4 border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all duration-200 text-sm rounded-none";

export function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section className="section-premium relative overflow-hidden">
      {/* Subtle radial glow behind form */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(197,163,104,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <AnimatedSection animation="fade-up">
            <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-4 flex items-center justify-center gap-3">
              <span className="block w-6 h-px bg-accent" aria-hidden="true" />
              Próximo Passo
              <span className="block w-6 h-px bg-accent" aria-hidden="true" />
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
              Inicie sua Transformação.
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={2}>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Selecionamos um número limitado de parceiros para garantir a
              exclusividade e o rigor técnico que sua clínica ou consultório merece.
            </p>
          </AnimatedSection>
        </div>

        {/* Decorative divider */}
        <AnimatedSection animation="scale-in" delay={2}>
          <div className="w-16 h-px bg-accent mx-auto mb-14" aria-hidden="true" />
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={3}>
          {isSubmitted ? (
            /* Success state */
            <div className="text-center py-16 px-8 border border-accent/20 bg-trust-bg relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(197,163,104,0.08) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto border border-accent/30">
                  <CheckCircle2 className="w-8 h-8 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    Solicitação Recebida
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Nossa equipe de especialistas entrará em contato em até{" "}
                    <span className="text-foreground font-medium">48 horas úteis</span>{" "}
                    para agendar a sua diagnose estratégica.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    Confirmação enviada ao seu e-mail
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-0">
              {/* Form container with left accent border */}
              <div className="border border-border bg-background relative">
                {/* Gold left accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent"
                  aria-hidden="true"
                />

                <div className="p-8 space-y-6">
                  {/* Row 1: Name + Clinic */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="director-name"
                        className="block text-[11px] font-medium text-foreground uppercase tracking-widest"
                      >
                        Nome do Diretor / Gestor Clínico
                      </label>
                      <input
                        type="text"
                        id="director-name"
                        name="director-name"
                        required
                        className={inputClass}
                        placeholder="Dr. João Silva"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="clinic-name"
                        className="block text-[11px] font-medium text-foreground uppercase tracking-widest"
                      >
                        Nome da Clínica
                      </label>
                      <input
                        type="text"
                        id="clinic-name"
                        name="clinic-name"
                        required
                        className={inputClass}
                        placeholder="Clínica de Saúde Premium"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-[11px] font-medium text-foreground uppercase tracking-widest"
                    >
                      E-mail Profissional
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className={inputClass}
                      placeholder="contato@suaclinica.com.br"
                    />
                  </div>

                  {/* Challenge */}
                  <div className="space-y-2">
                    <label
                      htmlFor="challenge"
                      className="block text-[11px] font-medium text-foreground uppercase tracking-widest"
                    >
                      Principal Desafio de Crescimento
                    </label>
                    <textarea
                      id="challenge"
                      name="challenge"
                      required
                      rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder="Descreva brevemente o principal desafio que sua clínica enfrenta atualmente..."
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full group bg-accent text-white hover:bg-accent-dark py-6 text-sm uppercase tracking-widest disabled:opacity-50 rounded-none"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Processando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Iniciar Minha Transformação
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Trust note */}
              <div className="flex items-center justify-center gap-2 pt-5">
                <Lock className="w-3 h-3 text-muted-foreground/60" strokeWidth={1.5} />
                <p className="text-xs text-muted-foreground/60">
                  Suas informações são tratadas com confidencialidade absoluta.
                </p>
              </div>
            </form>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
