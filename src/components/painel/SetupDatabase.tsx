"use client";

// Shown in /painel/blog when the blog tables don't exist yet (a release added
// tables and db/schema.sql hasn't been run). One click creates them.

import { useState } from "react";

export default function SetupDatabase() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/painel/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? `Erro ${res.status}`);
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl text-foreground">Configurar o blog</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        O banco de dados está conectado, mas as tabelas do blog ainda não existem. Clique abaixo para criá-las —
        os 75 artigos existentes são importados automaticamente. É seguro: nada que já existe é apagado ou alterado.
      </p>
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="mt-6 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:opacity-50"
      >
        {busy ? "Criando tabelas e importando artigos…" : "Criar tabelas do blog"}
      </button>
      {error && <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p>}
      <p className="mt-6 text-xs text-muted-foreground">
        Alternativa: cole o conteúdo de <code>db/schema.sql</code> no SQL Editor do Neon e clique em Run.
      </p>
    </main>
  );
}
