"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { trackAll } from "./RaioXViewEvent";

const roleOptions = ["Dono(a) / Sócio(a)", "Gerente", "Marketing", "Outro"];
const chairOptions = ["1", "2–3", "4–6", "7+"];
const procedureOptions = ["Implantes", "Lentes/Facetas", "Invisalign/Orto", "HOF", "Clínica geral"];
const marketingOptions = ["Ninguém", "Eu mesmo(a)", "Agência", "Funcionário interno"];

function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

type FormState = "idle" | "submitting" | "success" | "waitlist" | "full";

export default function LeadForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [procedures, setProcedures] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const hasFiredStart = useRef(false);

  useEffect(() => {
    fetch("/api/raiox/vagas")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.remaining === "number" && d.remaining <= 0) {
          setState("full");
        }
      })
      .catch(() => {});
  }, []);

  const fireFormStart = useCallback(() => {
    if (hasFiredStart.current) return;
    hasFiredStart.current = true;
    trackAll("raiox_form_start", null);
  }, []);

  const toggleProcedure = (proc: string) => {
    setProcedures((prev) =>
      prev.includes(proc) ? prev.filter((p) => p !== proc) : [...prev, proc]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const form = formRef.current!;
    const fd = new FormData(form);

    const data = {
      name: (fd.get("name") as string)?.trim(),
      clinic_name: (fd.get("clinic_name") as string)?.trim(),
      city: (fd.get("city") as string)?.trim(),
      whatsapp: whatsapp,
      instagram: (fd.get("instagram") as string)?.trim(),
      site_url: (fd.get("site_url") as string)?.trim(),
      role: fd.get("role") as string,
      chairs: fd.get("chairs") as string,
      procedures,
      marketing_owner: fd.get("marketing_owner") as string,
      utm: getUtmParams(),
    };

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!data.name) newErrors.name = "Nome é obrigatório";
    if (!data.clinic_name) newErrors.clinic_name = "Nome da clínica é obrigatório";
    if (!data.city) newErrors.city = "Cidade é obrigatória";
    const digits = data.whatsapp.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) newErrors.whatsapp = "WhatsApp inválido";
    if (!data.role) newErrors.role = "Selecione seu papel";
    if (!data.chairs) newErrors.chairs = "Selecione o número de cadeiras";
    if (data.procedures.length === 0) newErrors.procedures = "Selecione ao menos um procedimento";
    if (!data.marketing_owner) newErrors.marketing_owner = "Selecione uma opção";
    if (data.site_url) {
      data.site_url = normalizeUrl(data.site_url);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setState("submitting");

    try {
      const res = await fetch("/api/raiox/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setServerError(json.error);
        } else if (json.fields) {
          setErrors(
            Object.fromEntries(
              Object.entries(json.fields).map(([k, v]) => [k, (v as string[])[0]])
            )
          );
        } else {
          setServerError(json.error || "Erro ao enviar. Tente novamente.");
        }
        setState("idle");
        return;
      }

      if (json.waitlist) {
        setState("waitlist");
      } else {
        setState("success");
        // GA4: generate_lead + custom event | Meta: Lead (with dedup ID for CAPI)
        trackAll("raiox_submit_success", "Lead", {
          content_name: "Raio-X Digital 2026",
          value: 0,
          currency: "BRL",
        });
      }
    } catch {
      setServerError("Erro de conexão. Verifique sua internet e tente novamente.");
      setState("idle");
    }
  };

  if (state === "success") {
    return (
      <section id="form" className="px-6 py-10 md:py-16 max-w-2xl mx-auto text-center">
        <div className="text-[#C4963A] text-5xl mb-4">&#10003;</div>
        <p className="text-[#EDE8DF] text-lg font-body leading-relaxed">
          Recebido! Seu Raio-X entra na fila da Turma Jun–Jul. Você receberá uma confirmação no
          WhatsApp em instantes — e o relatório em até 7 dias úteis.
        </p>
      </section>
    );
  }

  if (state === "full") {
    return (
      <section id="form" className="px-6 py-10 md:py-16 max-w-2xl mx-auto">
        <div className="bg-[#1A1A1A] border border-[#C4963A]/30 rounded p-8 text-center">
          <p className="text-[#EDE8DF] text-base font-body mb-6">
            As 50 vagas desta turma foram preenchidas. Deixe seu WhatsApp para entrar na lista da
            próxima turma.
          </p>
          <WaitlistForm />
        </div>
      </section>
    );
  }

  return (
    <section id="form" className="px-6 py-10 md:py-16 max-w-2xl mx-auto">
      <h2 className="font-display text-display-md text-[#EDE8DF] mb-2">
        Solicite o Raio-X da sua clínica
      </h2>
      <p className="text-[#EDE8DF]/60 text-sm font-body mb-10">
        Os dados abaixo personalizam a sua análise.
      </p>

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
        <Field label="Seu nome" name="name" error={errors.name} onFocus={fireFormStart} />
        <Field
          label="Nome da clínica"
          name="clinic_name"
          error={errors.clinic_name}
          onFocus={fireFormStart}
        />
        <Field label="Cidade / Estado" name="city" error={errors.city} onFocus={fireFormStart} />

        <div>
          <label htmlFor="whatsapp" className="block text-[#EDE8DF] text-sm font-body mb-1">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            type="tel"
            placeholder="(11) 91234-5678"
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
            onFocus={fireFormStart}
            className="w-full bg-[#1A1A1A] border border-[#C4963A]/20 rounded px-4 py-3 text-[#EDE8DF] text-base font-body placeholder:text-[#EDE8DF]/30 focus:border-[#C4963A] focus:outline-none transition-colors"
          />
          {errors.whatsapp && <p className="text-red-400 text-xs mt-1 font-body">{errors.whatsapp}</p>}
        </div>

        <Field
          label="Instagram da clínica"
          name="instagram"
          placeholder="@"
          required={false}
          error={errors.instagram}
          onFocus={fireFormStart}
        />
        <Field
          label="Site (se tiver)"
          name="site_url"
          placeholder="www.suaclinica.com.br"
          required={false}
          error={errors.site_url}
          onFocus={fireFormStart}
        />

        <SelectField
          label="Seu papel na clínica"
          name="role"
          options={roleOptions}
          error={errors.role}
          onFocus={fireFormStart}
        />
        <SelectField
          label="Número de cadeiras"
          name="chairs"
          options={chairOptions}
          error={errors.chairs}
          onFocus={fireFormStart}
        />

        <div>
          <span className="block text-[#EDE8DF] text-sm font-body mb-2">
            Procedimentos que quer atrair
          </span>
          <div className="flex flex-wrap gap-2">
            {procedureOptions.map((proc) => (
              <button
                key={proc}
                type="button"
                onClick={() => {
                  toggleProcedure(proc);
                  fireFormStart();
                }}
                className={`px-4 py-2 rounded text-sm font-body transition-colors ${
                  procedures.includes(proc)
                    ? "bg-[#C4963A] text-[#111111]"
                    : "bg-[#1A1A1A] border border-[#C4963A]/20 text-[#EDE8DF]/70 hover:border-[#C4963A]/50"
                }`}
              >
                {proc}
              </button>
            ))}
          </div>
          {errors.procedures && (
            <p className="text-red-400 text-xs mt-1 font-body">{errors.procedures}</p>
          )}
        </div>

        <SelectField
          label="Quem cuida do marketing hoje?"
          name="marketing_owner"
          options={marketingOptions}
          error={errors.marketing_owner}
          onFocus={fireFormStart}
        />

        <p className="text-[#EDE8DF]/40 text-xs font-body">
          Seus dados são usados apenas para realizar e entregar a sua avaliação. Nada de listas,
          nada de spam.
        </p>

        {serverError && (
          <p className="text-red-400 text-sm font-body bg-red-400/10 px-4 py-3 rounded">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full bg-[#C4963A] text-[#111111] font-semibold px-8 py-4 text-base rounded hover:bg-[#d4a94a] transition-colors font-body disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === "submitting" ? "Enviando..." : "Enviar e entrar na turma →"}
        </button>
      </form>
    </section>
  );
}

/* ── Reusable sub-components ── */

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  error,
  onFocus,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onFocus?: () => void;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[#EDE8DF] text-sm font-body mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        onFocus={onFocus}
        className="w-full bg-[#1A1A1A] border border-[#C4963A]/20 rounded px-4 py-3 text-[#EDE8DF] text-base font-body placeholder:text-[#EDE8DF]/30 focus:border-[#C4963A] focus:outline-none transition-colors"
      />
      {error && <p className="text-red-400 text-xs mt-1 font-body">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  error,
  onFocus,
}: {
  label: string;
  name: string;
  options: string[];
  error?: string;
  onFocus?: () => void;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[#EDE8DF] text-sm font-body mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue=""
        onFocus={onFocus}
        className="w-full bg-[#1A1A1A] border border-[#C4963A]/20 rounded px-4 py-3 text-[#EDE8DF] text-base font-body focus:border-[#C4963A] focus:outline-none transition-colors appearance-none"
      >
        <option value="" disabled>
          Selecione
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs mt-1 font-body">{error}</p>}
    </div>
  );
}

function WaitlistForm() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [wa, setWa] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = wa.replace(/\D/g, "");
    if (!name.trim() || digits.length < 10) return;
    await fetch("/api/raiox/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        clinic_name: "—",
        city: "—",
        whatsapp: wa,
        role: "Outro",
        chairs: "1",
        procedures: ["Clínica geral"],
        marketing_owner: "Ninguém",
      }),
    });
    setSent(true);
  };

  if (sent) {
    return (
      <p className="text-[#C4963A] text-sm font-body">
        Anotado! Avisaremos quando a próxima turma abrir.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 max-w-sm mx-auto">
      <input
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-[#111111] border border-[#C4963A]/20 rounded px-4 py-3 text-[#EDE8DF] text-sm font-body placeholder:text-[#EDE8DF]/30 focus:border-[#C4963A] focus:outline-none"
      />
      <input
        type="tel"
        placeholder="(11) 91234-5678"
        value={wa}
        onChange={(e) => setWa(formatWhatsApp(e.target.value))}
        className="bg-[#111111] border border-[#C4963A]/20 rounded px-4 py-3 text-[#EDE8DF] text-sm font-body placeholder:text-[#EDE8DF]/30 focus:border-[#C4963A] focus:outline-none"
      />
      <button
        type="submit"
        className="bg-[#C4963A] text-[#111111] font-semibold px-6 py-3 text-sm rounded font-body"
      >
        Entrar na lista de espera
      </button>
    </form>
  );
}

/* ── Helpers ── */

function getUtmParams() {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  return Object.keys(utm).length > 0 ? utm : undefined;
}

function normalizeUrl(s: string): string {
  const trimmed = s.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "https://" + trimmed;
}

