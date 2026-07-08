"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoIcon } from "@/components/ui/Logo";
import { raioXConfig } from "@/lib/raio-x/config";
import type { Route } from "@/lib/raio-x/score";

// Analytics
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function fireEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  window.gtag?.("event", name, params);
}

type Phase = "landing" | "quiz" | "gate" | "submitting";

interface GateForm {
  name: string;
  clinic_name: string;
  whatsapp: string;
  email: string;
  consent: boolean;
}

const LS_ANSWERS_KEY = "raio_x_scorecard_answers";
export const SS_RESULT_KEY = "raio_x_scorecard_result";

const questions = raioXConfig.questions;
const scale = raioXConfig.scale;
const TOTAL = questions.length; // 12

function formatPhone(v: string): string {
  const d = v.replace(/D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return "(" + d.slice(0, 2) + ") " + d.slice(2);
  return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
}

// PageHeader
function PageHeader({ badge }: { badge?: string }) {
  return (
    <header className="flex items-center justify-between px-5 py-4 max-w-2xl mx-auto w-full">
      <Link
        href="/"
        aria-label="LK Digital"
        className="inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[#C5A368] rounded"
      >
        <LogoIcon className="w-6 h-6" color="#C5A368" />
        <span className="font-display text-base font-medium text-[#EDE8DF] tracking-tight">
          LK Digital
        </span>
      </Link>
      {badge && (
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E6A63] font-body">
          {badge}
        </span>
      )}
    </header>
  );
}

// LandingPhase — CFO-271: all copy uses process/method language, no outcome promises
function LandingPhase({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader />
      <main
        id="main-content"
        className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-2xl mx-auto w-full text-center"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-[#C5A368] mb-6 font-body">
          Diagnóstico gratuito · Clínicas odontológicas
        </p>

        <h1 className="font-display text-[clamp(1.75rem,4.5vw,3rem)] leading-[1.15] tracking-[-0.02em] text-[#EDE8DF] mb-5">
          Descubra em 3 minutos onde sua clínica está perdendo pacientes.
        </h1>

        {/* CFO-271: diagnostic framing, no outcome promises */}
        <p className="text-[#EDE8DF]/70 text-base leading-relaxed max-w-xl mx-auto mb-8 font-body">
          O RAIO-X é um diagnóstico gratuito que mostra se o seu gargalo está na{" "}
          <strong className="text-[#EDE8DF]/90">atração de pacientes</strong> ou na{" "}
          <strong className="text-[#EDE8DF]/90">conversão e operação</strong> da clínica — e qual
          é o próximo passo certo.
        </p>

        <button
          onClick={onStart}
          className="bg-[#C5A368] text-[#0F0F0F] font-semibold px-10 py-4 text-base rounded-lg hover:bg-[#d4b47a] transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A368] focus-visible:outline-offset-2 font-body"
        >
          Fazer meu RAIO-X gratuito
        </button>

        {/* CFO-271: trust line — method + partnership, no result promises */}
        <p className="mt-6 text-[#6E6A63] text-sm font-body">
          Método Clínica Unicórnio™ · em parceria com{" "}
          <span className="text-[#EDE8DF]/50">Biodonte</span>
        </p>
        <p className="mt-2 text-[#6E6A63] text-xs font-body">
          Leva ~3 minutos · Sem custo · Resultado imediato
        </p>
      </main>
    </div>
  );
}

// QuizPhase
function QuizPhase({
  qi,
  selectedOpt,
  onAnswer,
  onBack,
}: {
  qi: number;
  selectedOpt: number | null;
  onAnswer: (val: number) => void;
  onBack: () => void;
}) {
  const q = questions[qi];
  const pct = Math.round((qi / TOTAL) * 100);
  const domainLabel =
    q.domain === "visibilidade" ? "Visibilidade & Aquisição" : "Conversão & Operação";

  return (
    <div className="min-h-screen flex flex-col">
      <div
        role="progressbar"
        aria-valuenow={qi + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL}
        aria-label={"Pergunta " + String(qi + 1) + " de " + String(TOTAL)}
        className="h-1 bg-[#EDE8DF]/10"
      >
        <div className="h-full bg-[#C5A368] transition-all duration-300" style={{ width: String(pct) + "%" }} />
      </div>

      <div className="flex items-center justify-between px-5 py-4 max-w-2xl mx-auto w-full">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="text-[#6E6A63] hover:text-[#EDE8DF] text-sm font-body transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A368] rounded px-1"
        >
          ← Voltar
        </button>
        <span className="text-[#6E6A63] text-sm font-body" aria-live="polite">
          {qi + 1} / {TOTAL}
        </span>
      </div>

      <div key={qi} className="flex-1 flex flex-col justify-center px-6 pb-16 max-w-2xl mx-auto w-full motion-safe:animate-fade-up">
        <p className="text-xs uppercase tracking-[0.2em] text-[#C5A368] mb-3 font-body">{domainLabel}</p>
        <h2 className="font-display text-[clamp(1.25rem,3vw,1.875rem)] leading-[1.25] text-[#EDE8DF] mb-8">
          {q.text}
        </h2>

        <div role="group" aria-label="Grau de concordância" className="flex flex-col gap-3">
          {scale.map((opt) => {
            const sel = selectedOpt === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onAnswer(opt.value)}
                disabled={selectedOpt !== null}
                aria-pressed={sel}
                className={[
                  "w-full text-left px-5 py-4 rounded-lg border text-base font-body transition-all",
                  "focus-visible:outline-2 focus-visible:outline-[#C5A368] focus-visible:outline-offset-1",
                  "disabled:cursor-wait",
                  sel
                    ? "border-[#C5A368] bg-[#C5A368]/15 text-[#EDE8DF]"
                    : "border-[#EDE8DF]/15 bg-[#EDE8DF]/5 text-[#EDE8DF]/80 hover:border-[#C5A368]/50 hover:text-[#EDE8DF]",
                ].join(" ")}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// GatePhase
function GatePhase({
  form,
  errors,
  serverError,
  isSubmitting,
  onFormChange,
  onSubmit,
}: {
  form: GateForm;
  errors: Partial<Record<keyof GateForm | "root", string>>;
  serverError: string;
  isSubmitting: boolean;
  onFormChange: (field: keyof GateForm, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const ic = (err?: string) =>
    "w-full bg-[#EDE8DF]/5 border rounded-lg px-4 py-3 text-[#EDE8DF] text-base font-body " +
    "placeholder:text-[#6E6A63] focus:outline-none focus:border-[#C5A368] transition-colors " +
    (err ? "border-red-400" : "border-[#EDE8DF]/15");

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader badge="RAIO-X" />

      <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-2xl mx-auto w-full">
        {/* CFO-271 — gate headline: diagnostic language, no result previewed before consent */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C5A368] mb-3 font-body">
            Diagnóstico concluído
          </p>
          <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight text-[#EDE8DF]">
            Seu RAIO-X está pronto.
          </h2>
          <p className="text-[#6E6A63] text-base font-body mt-2">
            Para onde enviamos o resultado?
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="w-full flex flex-col gap-5">
          <div>
            <label htmlFor="gate-name" className="block text-sm text-[#EDE8DF]/70 mb-1.5 font-body">
              Seu nome <span aria-hidden="true" className="text-[#C5A368]">*</span>
            </label>
            <input
              id="gate-name" type="text" autoComplete="name"
              value={form.name} placeholder="Dr(a). Nome Sobrenome"
              onChange={(e) => onFormChange("name", e.target.value)}
              aria-invalid={!!errors.name} className={ic(errors.name)}
            />
            {errors.name && <p role="alert" className="text-red-400 text-xs mt-1 font-body">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="gate-clinic" className="block text-sm text-[#EDE8DF]/70 mb-1.5 font-body">
              Nome da clínica <span aria-hidden="true" className="text-[#C5A368]">*</span>
            </label>
            <input
              id="gate-clinic" type="text"
              value={form.clinic_name} placeholder="Clínica Exemplo"
              onChange={(e) => onFormChange("clinic_name", e.target.value)}
              aria-invalid={!!errors.clinic_name} className={ic(errors.clinic_name)}
            />
            {errors.clinic_name && <p role="alert" className="text-red-400 text-xs mt-1 font-body">{errors.clinic_name}</p>}
          </div>

          <div>
            <label htmlFor="gate-wa" className="block text-sm text-[#EDE8DF]/70 mb-1.5 font-body">
              WhatsApp <span className="text-[#6E6A63] text-xs">(ou e-mail abaixo — informe ao menos um)</span>
            </label>
            <input
              id="gate-wa" type="tel" inputMode="numeric" autoComplete="tel"
              value={form.whatsapp} placeholder="(11) 99999-9999"
              onChange={(e) => onFormChange("whatsapp", formatPhone(e.target.value))}
              aria-invalid={!!errors.whatsapp} className={ic(errors.whatsapp)}
            />
            {errors.whatsapp && <p role="alert" className="text-red-400 text-xs mt-1 font-body">{errors.whatsapp}</p>}
          </div>

          <div>
            <label htmlFor="gate-email" className="block text-sm text-[#EDE8DF]/70 mb-1.5 font-body">
              E-mail <span className="text-[#6E6A63] text-xs">(opcional)</span>
            </label>
            <input
              id="gate-email" type="email" autoComplete="email"
              value={form.email} placeholder="voce@clinica.com.br"
              onChange={(e) => onFormChange("email", e.target.value)}
              aria-invalid={!!errors.email} className={ic(errors.email)}
            />
            {errors.email && <p role="alert" className="text-red-400 text-xs mt-1 font-body">{errors.email}</p>}
          </div>

          {/* CFO-271 — LGPD: required, explicit consent, no third-party sharing */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox" checked={form.consent}
                onChange={(e) => onFormChange("consent", e.target.checked)}
                aria-required="true" aria-invalid={!!errors.consent}
                className="mt-0.5 w-4 h-4 shrink-0 accent-[#C5A368] cursor-pointer"
              />
              <span className="text-xs text-[#6E6A63] leading-relaxed group-hover:text-[#EDE8DF]/60 transition-colors font-body">
                Autorizo a LK Digital a entrar em contato sobre meu diagnóstico. Seus dados não
                serão compartilhados com terceiros sem sua autorização.{" "}
                <Link href="/raio-x/privacidade" className="underline underline-offset-2 hover:text-[#C5A368]">
                  Política de privacidade.
                </Link>
              </span>
            </label>
            {errors.consent && <p role="alert" className="text-red-400 text-xs mt-1 font-body">{errors.consent}</p>}
          </div>

          {serverError && (
            <p className="text-red-400 text-sm font-body bg-red-400/10 px-4 py-3 rounded-lg">{serverError}</p>
          )}

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-[#C5A368] text-[#0F0F0F] font-semibold py-4 text-base rounded-lg hover:bg-[#d4b47a] transition-colors mt-2 focus-visible:outline-2 focus-visible:outline-[#C5A368] focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-wait font-body"
          >
            {isSubmitting ? "Processando..." : "Ver meu resultado →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Main coordinator
export default function ScorecardFunnel() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("landing");
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [form, setForm] = useState<GateForm>({
    name: "", clinic_name: "", whatsapp: "", email: "", consent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GateForm | "root", string>>>({});
  const [serverError, setServerError] = useState("");
  const hasFiredStart = useRef(false);

  // Restore in-progress quiz from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LS_ANSWERS_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Record<string, number>;
      if (typeof parsed === "object" && parsed !== null) {
        setAnswers(parsed);
        const answered = Object.keys(parsed).length;
        if (answered > 0 && answered < TOTAL) {
          setQi(answered);
          setPhase("quiz");
        } else if (answered >= TOTAL) {
          setPhase("gate");
        }
      }
    } catch { /* ignore corrupt storage */ }
  }, []);

  const handleStart = useCallback(() => {
    if (!hasFiredStart.current) {
      hasFiredStart.current = true;
      fireEvent("raio_x_start");
    }
    setPhase("quiz");
  }, []);

  const handleAnswer = useCallback(
    (val: number) => {
      if (selectedOpt !== null) return;
      setSelectedOpt(val);

      setTimeout(() => {
        const q = questions[qi];
        const next = { ...answers, [q.id]: val };
        setAnswers(next);
        localStorage.setItem(LS_ANSWERS_KEY, JSON.stringify(next));
        fireEvent("raio_x_step_" + String(qi + 1), { question_id: q.id, domain: q.domain, value: val });
        setSelectedOpt(null);
        if (qi + 1 >= TOTAL) {
          fireEvent("raio_x_gate_view");
          setPhase("gate");
        } else {
          setQi(qi + 1);
        }
      }, 180);
    },
    [qi, answers, selectedOpt]
  );

  const handleBack = useCallback(() => {
    if (qi === 0) setPhase("landing");
    else setQi(qi - 1);
  }, [qi]);

  const handleFormChange = useCallback(
    (field: keyof GateForm, value: string | boolean) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setServerError("");

      const errs: typeof errors = {};
      if (form.name.trim().length < 2) errs.name = "Nome é obrigatório";
      if (form.clinic_name.trim().length < 2) errs.clinic_name = "Nome da clínica é obrigatório";
      const waDigits = form.whatsapp.replace(/D/g, "");
      const hasWa = waDigits.length >= 10 && waDigits.length <= 11;
      const hasEmail = /^[^s@]+@[^s@]+.[^s@]+$/.test(form.email.trim());
      if (!hasWa && !hasEmail) {
        errs.whatsapp = "Informe WhatsApp ou e-mail para receber o resultado";
      } else if (form.whatsapp.trim() && !hasWa) {
        errs.whatsapp = "WhatsApp inválido — ex: (11) 99999-9999";
      }
      if (form.email.trim() && !hasEmail) errs.email = "E-mail inválido";
      if (!form.consent) errs.consent = "Necessário para receber o resultado";

      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }

      setPhase("submitting");
      fireEvent("raio_x_gate_submit");

      try {
        const res = await fetch("/api/raio-x/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            clinic_name: form.clinic_name.trim(),
            whatsapp: form.whatsapp.trim() || undefined,
            email: form.email.trim() || undefined,
            answers,
            consent: true,
          }),
        });

        const json = await res.json();

        if (!res.ok) {
          if (json.fields) {
            setErrors(
              Object.fromEntries(
                Object.entries(json.fields as Record<string, string[]>).map(([k, v]) => [k, v[0]])
              )
            );
          } else {
            setServerError(json.error || "Erro ao enviar. Tente novamente.");
          }
          setPhase("gate");
          return;
        }

        // No PII or scores in URL — results travel via sessionStorage
        sessionStorage.setItem(
          SS_RESULT_KEY,
          JSON.stringify({ id: json.id, route: json.route as Route, domainScores: json.domainScores })
        );

        localStorage.removeItem(LS_ANSWERS_KEY);
        router.push("/raio-x/resultado");
      } catch {
        setServerError("Erro de conexão. Verifique sua internet e tente novamente.");
        setPhase("gate");
      }
    },
    [form, answers, router]
  );

  if (phase === "submitting") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0F0F]">
        <div
          className="w-10 h-10 border-2 border-[#C5A368]/30 border-t-[#C5A368] rounded-full animate-spin"
          aria-label="Processando..."
          role="status"
        />
        <p className="mt-4 text-[#6E6A63] text-sm font-body">Analisando sua clínica…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#EDE8DF] font-body selection:bg-[#C5A368]/30">
      {phase === "landing" && <LandingPhase onStart={handleStart} />}
      {phase === "quiz" && (
        <QuizPhase qi={qi} selectedOpt={selectedOpt} onAnswer={handleAnswer} onBack={handleBack} />
      )}
      {phase === "gate" && (
        <GatePhase
          form={form}
          errors={errors}
          serverError={serverError}
          isSubmitting={false}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
