"use client";

// "Rascunho com IA": the semi-automatic path. The AI writes a first draft from
// a topic + keyword; it opens in the editor as a draft that an admin must edit,
// check and mark as reviewed before it can be published.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/blog/catalog";
import { FRAMEWORK_CONTEXTS } from "@/lib/blog/editorial";

const inputCls =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40";

export default function GenerateDraftPage() {
  const router = useRouter();
  const [form, setForm] = useState({ topic: "", keyword: "", category: "", notes: "", framework: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/painel/blog/ai-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? `Erro ${res.status}`);
      router.push(`/painel/blog/${json.post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <Link href="/painel/blog" className="text-sm text-muted-foreground hover:text-foreground">← Artigos</Link>
      <h1 className="font-display text-3xl text-foreground mt-3">Rascunho com IA</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-6">
        A IA escreve um primeiro rascunho seguindo as regras editoriais da LK (sem estatísticas inventadas, conforme o CFO).
        Nada é publicado automaticamente: o rascunho abre no editor para você revisar, ajustar e publicar.
      </p>

      <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-card p-5">
        <label className="block">
          <span className="text-xs font-medium">Tema do artigo *</span>
          <input className={inputCls} required value={form.topic} onChange={(e) => set("topic", e.target.value)} placeholder="Ex.: Como reduzir faltas de pacientes com confirmação por WhatsApp" />
        </label>
        <label className="block">
          <span className="text-xs font-medium">Palavra-chave principal *</span>
          <input className={inputCls} required value={form.keyword} onChange={(e) => set("keyword", e.target.value)} placeholder="Ex.: faltas pacientes consultório" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium">Categoria</span>
            <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">—</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium">Framework (opcional)</span>
            <select className={inputCls} value={form.framework} onChange={(e) => set("framework", e.target.value)}>
              <option value="">Nenhum</option>
              {Object.keys(FRAMEWORK_CONTEXTS).map((k) => <option key={k}>{k}</option>)}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-xs font-medium">Orientações, ângulo ou tópicos (opcional)</span>
          <textarea className={inputCls} rows={6} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder={"Ex.:\n1. Por que pacientes faltam\n2. Script de confirmação 48h e 24h antes\n3. O que fazer com quem falta duas vezes\nTom: direto, com exemplos práticos"} />
        </label>

        {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p>}

        <button type="submit" disabled={busy} className="w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background disabled:opacity-50">
          {busy ? "Escrevendo o rascunho… (1–2 minutos)" : "Gerar rascunho"}
        </button>
        {busy && <p className="text-xs text-muted-foreground text-center">Pode deixar esta aba aberta — o editor abre sozinho quando terminar.</p>}
      </form>
    </main>
  );
}
