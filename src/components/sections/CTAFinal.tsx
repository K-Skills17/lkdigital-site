"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/events";
import { submitLead } from "@/tools/shared/backbone-client";
import { Container, SectionLabel, buttonClass } from "@/components/ui/primitives";

export default function CTAFinal() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    clinic: "",
    email: "",
    challenge: "",
    consent: false,
    website: "", // honeypot, hidden from people
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");

    trackEvent("form_submit", {
      form: "diagnostico_gratuito",
      challenge: formData.challenge,
    });

    // Stored in tool_leads and alerted to the team on Telegram via the backbone
    // (src/lib/backbone/tools/diagnostico-gratuito.ts). The visitor only sees
    // "received" when the server returns a stored lead id.
    const result = (await submitLead("diagnostico-gratuito", formData)) as { success?: boolean; leadId?: string | null };

    if (result?.success && result.leadId) {
      trackEvent("generate_lead", {
        form: "diagnostico_gratuito",
        challenge: formData.challenge,
      });
      setFormState("success");
    } else {
      setFormState("error");
    }
  };

  const inputClass = "w-full rounded-[2px] border border-foreground/25 bg-white px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-foreground focus:ring-1 focus:ring-foreground";

  return (
    <section className="border-t border-border py-section">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Left — Copy */}
          <div className="lg:col-span-6">
            <SectionLabel>Próximo passo</SectionLabel>
            <h2 className="mt-6 font-display text-display-lg text-foreground text-balance">
              Descubra Quantos Pacientes Você Está Perdendo Hoje
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Nosso diagnóstico gratuito analisa sua presença digital, sua
              região e seus concorrentes — e mostra exatamente onde estão as
              oportunidades que você não está aproveitando.
            </p>
            <ul className="mt-8 max-w-xl border-t border-foreground/15">
              {[
                "Análise completa sem custo e sem compromisso",
                "Relatório personalizado para a sua especialidade e cidade",
                "Reunião de 30 minutos para apresentar os resultados",
              ].map((item) => (
                <li key={item} className="flex gap-4 border-b border-foreground/15 py-3 text-sm text-foreground">
                  <span aria-hidden="true" className="mt-[0.6rem] h-px w-4 shrink-0 bg-accent-ink" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground">
              Vagas limitadas — 1 consultório por especialidade por região
            </p>

            {/* Direct contact */}
            <div className="mt-10">
              <p className="text-sm font-medium text-foreground">Prefere falar direto?</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="https://wa.me/5511946851028?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20gratuito%20para%20meu%20consult%C3%B3rio."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("secondary")}
                >
                  <svg className="h-4 w-4 text-[#25D366]" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                  Chamar no WhatsApp
                </a>
                <a href="tel:+5511946851028" className="inline-flex min-h-12 items-center gap-2 border-b border-foreground/30 text-sm font-medium text-foreground hover:border-foreground sm:px-2">
                  Ligar: (11) 94685-1028
                </a>
                <a href="mailto:contato@lkdigital.org" className="inline-flex min-h-12 items-center gap-2 border-b border-foreground/30 text-sm font-medium text-foreground hover:border-foreground sm:px-2">
                  contato@lkdigital.org
                </a>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="cta-form border-t-2 border-accent bg-white p-6 md:p-10 lg:col-span-6">
            {formState === "success" ? (
              <div className="py-8">
                <h3 className="font-display text-3xl font-medium text-foreground">Diagnóstico Solicitado</h3>
                <p className="mt-3 text-base text-muted-foreground">
                  Recebemos seus dados. Nossa equipe entrará em contato em até
                  24 horas úteis para agendar sua análise.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                    Seu nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                    placeholder="Dr. / Dra."
                  />
                </div>
                <div>
                  <label htmlFor="clinic" className="mb-2 block text-sm font-medium text-foreground">
                    Nome do consultório / clínica
                  </label>
                  <input
                    type="text"
                    id="clinic"
                    autoComplete="organization"
                    required
                    value={formData.clinic}
                    onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                    className={inputClass}
                    placeholder="Clínica Odontológica..."
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    E-mail profissional
                  </label>
                  <input
                    type="email"
                    id="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                    placeholder="voce@clinica.com.br"
                  />
                </div>
                <div>
                  <label htmlFor="challenge" className="mb-2 block text-sm font-medium text-foreground">
                    Seu maior desafio hoje
                  </label>
                  <select
                    id="challenge"
                    required
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Selecione...</option>
                    <option value="agenda">Agenda com muitos horários vazios</option>
                    <option value="pacientes">Preciso de mais pacientes qualificados</option>
                    <option value="digital">Não tenho presença digital forte</option>
                    <option value="concorrencia">Concorrência está me tirando pacientes</option>
                    <option value="gestao">Não tenho tempo para cuidar do marketing</option>
                  </select>
                </div>
                {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="website">Site</label>
                  <input
                    type="text"
                    id="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <label htmlFor="consent" className="flex items-start gap-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#7a6540]"
                  />
                  <span>Concordo em receber este material e contatos da LK Digital pelo WhatsApp e e-mail. Posso cancelar a qualquer momento.</span>
                </label>
                {formState === "error" && (
                  <p role="alert" className="border-l-2 border-[#9a3412] pl-4 text-sm text-foreground">
                    Não conseguimos registrar seu pedido agora. Tente de novo em instantes ou fale direto pelo{" "}
                    <a
                      href="https://wa.me/5511946851028?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20gratuito%20para%20meu%20consult%C3%B3rio."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      WhatsApp
                    </a>
                    .
                  </p>
                )}
                <button
                  type="submit"
                  disabled={formState === "loading"}
                  className={buttonClass("primary", "light", "w-full disabled:cursor-not-allowed disabled:opacity-70")}
                >
                  {formState === "loading" ? (
                    <svg aria-label="Enviando" className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
                    </svg>
                  ) : (
                    "Solicitar Meu Diagnóstico Gratuito"
                  )}
                </button>
                <p className="text-xs text-muted-foreground">
                  Sem compromisso. Sem spam. Seus dados estão protegidos pela LGPD.
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
