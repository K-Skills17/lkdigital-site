"use client";

import { useState } from "react";

export default function CTAFinal() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");
  const [formData, setFormData] = useState({
    name: "",
    clinic: "",
    email: "",
    challenge: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    // Simulate submission — replace with real endpoint
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFormState("success");
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden" id="main-content">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/[0.03] to-background" />

      <div className="relative max-w-narrow mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div>
            <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-3">
              Próximo passo
            </p>
            <h2 className="font-display text-display-md text-foreground mb-4">
              Descubra Quantos Pacientes Você Está Perdendo Hoje
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nosso diagnóstico gratuito analisa sua presença digital, sua
              região e seus concorrentes — e mostra exatamente onde estão as
              oportunidades que você não está aproveitando.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Análise completa sem custo e sem compromisso",
                "Relatório personalizado para a sua especialidade e cidade",
                "Reunião de 30 minutos para apresentar os resultados",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <svg
                    className="w-4 h-4 text-accent flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Vagas limitadas — 1 consultório por especialidade por região
            </div>
          </div>

          {/* Right — Form */}
          <div className="cta-form bg-card rounded-xl border border-border/60 p-6 md:p-8 shadow-lg shadow-black/5 opacity-0">
            {formState === "success" ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-medium text-foreground mb-2">
                  Diagnóstico Solicitado
                </h3>
                <p className="text-sm text-muted-foreground">
                  Recebemos seus dados. Nossa equipe entrará em contato em até
                  24 horas úteis para agendar sua análise.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                    Seu nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors outline-none"
                    placeholder="Dr. / Dra."
                  />
                </div>
                <div>
                  <label htmlFor="clinic" className="block text-sm font-medium text-foreground mb-1.5">
                    Nome do consultório / clínica
                  </label>
                  <input
                    type="text"
                    id="clinic"
                    required
                    value={formData.clinic}
                    onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors outline-none"
                    placeholder="Clínica Odontológica..."
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                    E-mail profissional
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors outline-none"
                    placeholder="voce@clinica.com.br"
                  />
                </div>
                <div>
                  <label htmlFor="challenge" className="block text-sm font-medium text-foreground mb-1.5">
                    Seu maior desafio hoje
                  </label>
                  <select
                    id="challenge"
                    required
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors outline-none"
                  >
                    <option value="">Selecione...</option>
                    <option value="agenda">Agenda com muitos horários vazios</option>
                    <option value="pacientes">Preciso de mais pacientes qualificados</option>
                    <option value="digital">Não tenho presença digital forte</option>
                    <option value="concorrencia">Concorrência está me tirando pacientes</option>
                    <option value="gestao">Não tenho tempo para cuidar do marketing</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={formState === "loading"}
                  className="w-full px-6 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formState === "loading" ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
                    </svg>
                  ) : (
                    "Solicitar Meu Diagnóstico Gratuito"
                  )}
                </button>
                <p className="text-[11px] text-muted-foreground text-center">
                  Sem compromisso. Sem spam. Seus dados estão protegidos pela LGPD.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
