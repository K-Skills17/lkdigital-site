"use client";

// "Atualizar banco de dados" in /painel: applies db/schema.sql (safe to re-run) and copies
// rows left in the old lead tables (RAIO-X 2026, Unicórnio, scorecard) into tool_leads.
// Nothing is deleted. Same endpoint as the blog setup screen.

import { useState } from "react";

const LEGACY_LABELS: Record<string, string> = {
  raiox_leads: "RAIO-X Digital 2026",
  unicornio_leads: "Clínica Unicórnio",
  raio_x_scorecard_leads: "RAIO-X Scorecard",
};

type Report = Record<string, { rows: number; inserted: number }>;

export default function UpdateDatabase() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const run = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/painel/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? `Erro ${res.status}`);
      const legacy = Object.entries((json.legacy ?? {}) as Report);
      const copied = legacy.map(([t, r]) => `${LEGACY_LABELS[t] ?? t}: ${r.inserted} novos de ${r.rows}`).join(" · ");
      setMsg({
        ok: true,
        text: `Banco atualizado.${legacy.length ? ` Leads antigos copiados — ${copied}.` : " Nenhuma tabela antiga de leads encontrada."} Recarregue a página para ver os números.`,
      });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-accent disabled:opacity-50"
        title="Cria tabelas que faltam e copia os leads das tabelas antigas para a tabela única. Não apaga nada."
      >
        {busy ? "Atualizando…" : "Atualizar banco de dados"}
      </button>
      {msg && (
        <p role="status" className={`max-w-xl text-sm ${msg.ok ? "text-emerald-700" : "text-red-700"}`}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
