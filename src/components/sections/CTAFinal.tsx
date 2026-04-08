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
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Vagas limitadas — 1 consultório por especialidade por região
            </div>

            {/* WhatsApp Direct Contact */}
            <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <p className="text-sm font-medium text-foreground mb-2">
                Prefere falar direto?
              </p>
              <a
                href="https://wa.me/5511952823271?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20gratuito%20para%20meu%20consult%C3%B3rio."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-green-600/20"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chamar no WhatsApp
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                (11) 95282-3271
              </p>
            </div>

            {/* Phone & Email */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <a
                href="tel:+5511946851028"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border/60 text-foreground text-sm font-medium rounded-md hover:border-accent/30 transition-all"
              >
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                Ligar: (11) 94685-1028
              </a>
              <a
                href="mailto:contato@lkdigital.org"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border/60 text-foreground text-sm font-medium rounded-md hover:border-accent/30 transition-all"
              >
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                contato@lkdigital.org
              </a>
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
