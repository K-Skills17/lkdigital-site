"use client";

import { useState, type FormEvent } from "react";

type FormState = {
  nome: string;
  especialidade: string;
  clinica: string;
  whatsapp: string;
  email: string;
  objetivo: string;
  desafio: string;
};

const initialState: FormState = {
  nome: "",
  especialidade: "",
  clinica: "",
  whatsapp: "",
  email: "",
  objetivo: "",
  desafio: "",
};

const especialidades = [
  "Médico(a)",
  "Dentista",
  "Dermatologista",
  "Psicólogo(a)",
  "Fisioterapeuta",
  "Nutricionista",
  "Cardiologista",
  "Ortopedista",
  "Pediatra",
  "Ginecologista / Obstetra",
  "Outro",
];

const objetivos = [
  "Atrair mais pacientes qualificados",
  "Construir autoridade digital na minha especialidade",
  "Melhorar meu posicionamento no Google e nas IAs",
  "Desenvolver identidade visual e branding",
  "Automatizar minha comunicação e marketing",
  "Lançar uma nova clínica ou serviço",
  "Outro objetivo",
];

function CheckCircleIcon() {
  return (
    <svg
      className="w-16 h-16 text-accent mx-auto"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Formspree endpoint — replace YOUR_FORM_ID with actual ID before launch
      const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          "Nome Completo": form.nome,
          "Especialidade": form.especialidade,
          "Nome da Clínica": form.clinica,
          "WhatsApp": form.whatsapp,
          "E-mail": form.email,
          "Principal Objetivo": form.objetivo,
          "Descrição do Desafio": form.desafio,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setForm(initialState);
      } else {
        setError(
          "Não foi possível enviar o formulário. Por favor, tente novamente ou entre em contato via WhatsApp."
        );
      }
    } catch {
      setError(
        "Erro de conexão. Por favor, tente novamente ou entre em contato via WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-trust-bg border border-accent/20 p-10 text-center space-y-6">
        <CheckCircleIcon />
        <h3 className="text-2xl md:text-3xl font-semibold text-foreground">
          Mensagem Recebida com Sucesso.
        </h3>
        <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
          Nossa equipe analisará o seu perfil e entrará em contato em até{" "}
          <span className="text-foreground font-medium">1 dia útil</span> para
          agendar sua Diagnose Gratuita. Fique atento ao seu WhatsApp e e-mail.
        </p>
        <div className="w-12 h-px bg-accent mx-auto" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Enquanto isso, explore nossos{" "}
          <a href="/casos" className="text-accent underline underline-offset-4 hover:text-accent-dark transition-colors">
            casos de sucesso
          </a>{" "}
          e veja o que construímos para outros profissionais de saúde.
        </p>
      </div>
    );
  }

  const inputBase =
    "w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/60 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors duration-200";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Nome completo */}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-foreground mb-2">
          Nome Completo <span className="text-accent" aria-label="obrigatório">*</span>
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
          autoComplete="name"
          placeholder="Dr. João Silva"
          className={inputBase}
        />
      </div>

      {/* Especialidade */}
      <div>
        <label htmlFor="especialidade" className="block text-sm font-medium text-foreground mb-2">
          Especialidade <span className="text-accent" aria-label="obrigatório">*</span>
        </label>
        <select
          id="especialidade"
          name="especialidade"
          value={form.especialidade}
          onChange={handleChange}
          required
          className={`${inputBase} cursor-pointer`}
        >
          <option value="" disabled>
            Selecione sua especialidade
          </option>
          {especialidades.map((esp) => (
            <option key={esp} value={esp}>
              {esp}
            </option>
          ))}
        </select>
      </div>

      {/* Nome da clínica */}
      <div>
        <label htmlFor="clinica" className="block text-sm font-medium text-foreground mb-2">
          Nome da Clínica ou Consultório <span className="text-accent" aria-label="obrigatório">*</span>
        </label>
        <input
          type="text"
          id="clinica"
          name="clinica"
          value={form.clinica}
          onChange={handleChange}
          required
          autoComplete="organization"
          placeholder="Clínica Saúde & Bem-Estar"
          className={inputBase}
        />
      </div>

      {/* WhatsApp + Email (2 cols) */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-foreground mb-2">
            WhatsApp <span className="text-accent" aria-label="obrigatório">*</span>
          </label>
          <input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            required
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            className={inputBase}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            E-mail <span className="text-accent" aria-label="obrigatório">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="contato@suaclinica.com.br"
            className={inputBase}
          />
        </div>
      </div>

      {/* Principal objetivo */}
      <div>
        <label htmlFor="objetivo" className="block text-sm font-medium text-foreground mb-2">
          Principal Objetivo <span className="text-accent" aria-label="obrigatório">*</span>
        </label>
        <select
          id="objetivo"
          name="objetivo"
          value={form.objetivo}
          onChange={handleChange}
          required
          className={`${inputBase} cursor-pointer`}
        >
          <option value="" disabled>
            Qual é o seu principal objetivo agora?
          </option>
          {objetivos.map((obj) => (
            <option key={obj} value={obj}>
              {obj}
            </option>
          ))}
        </select>
      </div>

      {/* Descrição do desafio */}
      <div>
        <label htmlFor="desafio" className="block text-sm font-medium text-foreground mb-2">
          Breve Descrição do Desafio
        </label>
        <textarea
          id="desafio"
          name="desafio"
          value={form.desafio}
          onChange={handleChange}
          rows={4}
          placeholder="Descreva brevemente sua situação atual: qual é o maior desafio de marketing ou crescimento que sua clínica enfrenta hoje?"
          className={`${inputBase} resize-none`}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Opcional — mas quanto mais detalhes, mais precisa será nossa análise.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent text-white hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 px-8 py-4 text-base font-medium flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Enviando...
          </>
        ) : (
          <>
            Solicitar Diagnose Gratuita
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Seus dados são tratados com total sigilo, em conformidade com a LGPD.
        Não fazemos spam. Você será contactado exclusivamente para tratar da sua Diagnose.
      </p>
    </form>
  );
}
