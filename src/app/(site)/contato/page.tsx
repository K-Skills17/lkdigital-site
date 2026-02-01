"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const objectives = [
  { value: "dobrar-faturamento", label: "Dobrar o faturamento" },
  { value: "abrir-unidades", label: "Abrir novas unidades" },
  { value: "pacientes-alto-ticket", label: "Atrair pacientes de ticket mais alto" },
];

const patientVolumes = [
  { value: "menos-20", label: "Menos de 20 pacientes/mês" },
  { value: "20-50", label: "20 a 50 pacientes/mês" },
  { value: "50-100", label: "50 a 100 pacientes/mês" },
  { value: "mais-100", label: "Mais de 100 pacientes/mês" },
];

export default function ContatoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with actual endpoint)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section className="section-premium">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon - Responsive sizing */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 md:mb-8">
            <svg
              className="w-10 h-10 md:w-12 md:h-12 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 md:mb-6">
            Solicitação Recebida com Sucesso.
          </h1>

          <div className="w-12 md:w-16 h-px bg-accent mx-auto my-6 md:my-8" aria-hidden="true" />

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-8">
            Seus dados estão sendo analisados por nossos especialistas. Em até{" "}
            <span className="text-foreground font-medium">24 horas úteis</span>,
            nossa equipe entrará em contato para agendar sua consultoria
            estratégica privada.
          </p>

          <div className="bg-trust-bg p-4 sm:p-6 md:p-8 rounded-sm text-left space-y-3 md:space-y-4">
            <p className="text-xs sm:text-sm font-medium text-accent uppercase tracking-widest">
              O que acontece agora:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-accent">1</span>
                </span>
                <span>
                  Análise completa da sua presença digital atual
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-accent">2</span>
                </span>
                <span>
                  Contato para agendar reunião estratégica de 15 minutos
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-accent">3</span>
                </span>
                <span>
                  Apresentação do plano de ação com garantias de resultados
                </span>
              </li>
            </ul>
          </div>

          <p className="mt-6 md:mt-8 text-xs sm:text-sm text-muted-foreground">
            Enquanto isso, sinta-se à vontade para explorar nossos{" "}
            <a href="/insights" className="text-accent hover:underline">
              Insights
            </a>{" "}
            sobre marketing odontológico.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Header Section */}
      <section className="section-premium pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div className="space-y-6 md:space-y-8">
            <div className="w-10 md:w-12 h-px bg-accent" aria-hidden="true" />

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground leading-tight">
              Inicie sua Ascensão ao Topo do Mercado.
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Estamos prontos para assumir o peso do seu crescimento. Por favor,
              preencha os detalhes abaixo para que nossa equipe possa realizar
              uma{" "}
              <span className="text-foreground font-medium">
                análise prévia da sua clínica
              </span>{" "}
              antes da nossa consultoria privada.
            </p>

            <div className="w-12 md:w-16 h-px bg-border" aria-hidden="true" />

            <p className="text-xs sm:text-sm text-muted-foreground">
              Todas as informações são tratadas com confidencialidade absoluta.
            </p>
          </div>

          {/* Right: Visual Placeholder - Hidden on mobile */}
          <div className="relative hidden lg:block">
            <div className="aspect-[4/3] bg-muted rounded-sm flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Mesa minimalista com caneta premium simbolizando a assinatura
                  de uma nova era
                </p>
              </div>
            </div>
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-accent/30"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* Intake Form Section */}
      <section className="section-premium">
        <div className="max-w-2xl mx-auto">
          {/* Form Header */}
          <div className="text-center mb-8 md:mb-12">
            <p className="text-xs sm:text-sm font-medium text-accent uppercase tracking-widest mb-3 md:mb-4">
              Formulário de Aplicação
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
              Conte-nos sobre sua Clínica
            </h2>
          </div>

          <div className="w-12 md:w-16 h-px bg-accent mx-auto mb-8 md:mb-12" aria-hidden="true" />

          {/* The Form */}
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
            {/* Field 1: Director Name */}
            <div className="space-y-2 md:space-y-3">
              <label
                htmlFor="director-name"
                className="block text-sm font-medium text-foreground"
              >
                Nome do Diretor Clínico / Proprietário
              </label>
              <input
                type="text"
                id="director-name"
                name="director-name"
                required
                className="w-full px-4 md:px-5 py-3 md:py-4 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors text-base"
                placeholder="Dr. João Silva"
              />
            </div>

            {/* Field 2: Clinic Name & Location */}
            <div className="space-y-2 md:space-y-3">
              <label
                htmlFor="clinic-info"
                className="block text-sm font-medium text-foreground"
              >
                Nome da Clínica e Localização
              </label>
              <input
                type="text"
                id="clinic-info"
                name="clinic-info"
                required
                className="w-full px-4 md:px-5 py-3 md:py-4 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors text-base"
                placeholder="Clínica Odontológica Premium — São Paulo, SP"
              />
            </div>

            {/* Field 3: Website or Instagram */}
            <div className="space-y-2 md:space-y-3">
              <label
                htmlFor="digital-presence"
                className="block text-sm font-medium text-foreground"
              >
                Website Atual ou Perfil de Instagram
                <span className="text-muted-foreground font-normal block sm:inline sm:ml-2 text-xs sm:text-sm mt-1 sm:mt-0">
                  (Para análise prévia)
                </span>
              </label>
              <input
                type="text"
                id="digital-presence"
                name="digital-presence"
                required
                className="w-full px-4 md:px-5 py-3 md:py-4 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors text-base"
                placeholder="www.suaclinica.com.br ou @suaclinica"
              />
            </div>

            {/* Field 4: Objective (The Filter) */}
            <div className="space-y-2 md:space-y-3">
              <label
                htmlFor="objective"
                className="block text-sm font-medium text-foreground"
              >
                Qual é o seu objetivo principal nos próximos 12 meses?
              </label>
              <div className="space-y-2 md:space-y-3">
                {objectives.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-border bg-background cursor-pointer hover:border-accent/50 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5"
                  >
                    <input
                      type="radio"
                      name="objective"
                      value={option.value}
                      required
                      className="w-5 h-5 text-accent border-border focus:ring-accent shrink-0"
                    />
                    <span className="text-sm md:text-base text-foreground">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Field 5: Patient Volume (The Authority Drop) */}
            <div className="space-y-2 md:space-y-3">
              <label
                htmlFor="patient-volume"
                className="block text-sm font-medium text-foreground"
              >
                Qual o volume atual de novos pacientes por mês?
              </label>
              <select
                id="patient-volume"
                name="patient-volume"
                required
                className="w-full px-4 md:px-5 py-3 md:py-4 border border-border bg-background text-foreground focus:outline-none focus:border-accent transition-colors text-base appearance-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                {patientVolumes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-border" aria-hidden="true" />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full bg-accent text-white hover:bg-accent-dark py-5 md:py-6 text-base disabled:opacity-50"
            >
              {isSubmitting
                ? "Processando sua solicitação..."
                : "Solicitar Análise de Viabilidade"}
            </Button>

            {/* Privacy Note */}
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              Ao enviar, você concorda com nossa{" "}
              <a href="/privacidade" className="text-accent hover:underline">
                Política de Privacidade
              </a>
              .
            </p>
          </form>
        </div>
      </section>

      {/* Reassurance Block */}
      <section className="section-premium bg-trust-bg">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-xs sm:text-sm font-medium text-accent uppercase tracking-widest mb-3 md:mb-4">
              Processo Transparente
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
              O que acontece a seguir?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-3 md:space-y-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <span className="text-xl md:text-2xl font-heading text-accent">1</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-foreground">
                Análise em 24h
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Nossa equipe analisa sua presença digital atual em até 24 horas
                úteis.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-3 md:space-y-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <span className="text-xl md:text-2xl font-heading text-accent">2</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-foreground">
                Reunião Estratégica
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Entramos em contato para agendar uma reunião estratégica de 15
                minutos.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-3 md:space-y-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <span className="text-xl md:text-2xl font-heading text-accent">3</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-foreground">
                Plano com Garantias
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Apresentamos o plano de ação com garantias de resultados para
                sua clínica.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
