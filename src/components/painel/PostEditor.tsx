"use client";

// The blog post editor in /painel/blog. Human-in-the-loop by design: the
// quality checklist runs live, errors block publishing, and AI drafts must be
// explicitly marked as reviewed by a signed-in admin before they can go live.

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import { AUTHORS, CATEGORIES } from "@/lib/blog/catalog";
import { checkPost, hasBlockingIssues, readingTimeOf, slugify, wordCount } from "@/lib/blog/quality";
import { displayStatus, type FaqItem, type Post, type PostInput } from "@/lib/blog/types";

type Revision = { id: string; savedAt: string; savedBy: string | null; title: string };

export const EMPTY_POST: PostInput = {
  slug: "",
  title: "",
  seoTitle: "",
  seoDescription: "",
  excerpt: "",
  content: "",
  tldr: "",
  category: "",
  tags: [],
  keywords: [],
  faqItems: [],
  authorSlug: AUTHORS[0].slug,
  ctaHeading: "",
  ctaDescription: "",
  ctaButton: "",
  relatedSlugs: [],
  noindex: false,
};

function toInput(p: Post | PostInput): PostInput {
  const keys = Object.keys(EMPTY_POST) as Array<keyof PostInput>;
  return Object.fromEntries(keys.map((k) => [k, p[k]])) as unknown as PostInput;
}

const STATUS_LABEL = {
  draft: { text: "Rascunho", cls: "bg-muted text-foreground" },
  scheduled: { text: "Agendado", cls: "bg-sky-100 text-sky-900" },
  published: { text: "Publicado", cls: "bg-emerald-100 text-emerald-900" },
  archived: { text: "Arquivado", cls: "bg-zinc-200 text-zinc-700" },
} as const;

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });

/** <input type="datetime-local"> value in the browser's local time. */
function localInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function api<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `Erro ${res.status}`);
  return json as T;
}

// ─── Small field components ──────────────────────────────────────────────────

const inputCls =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40";

function Field({ label, hint, children, count }: { label: string; hint?: string; children: React.ReactNode; count?: string }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2 text-xs font-medium text-foreground mb-1">
        {label}
        {count && <span className="font-normal text-muted-foreground tabular-nums">{count}</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-foreground mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function FaqEditor({ items, onChange }: { items: FaqItem[]; onChange: (f: FaqItem[]) => void }) {
  const set = (i: number, k: keyof FaqItem, v: string) => onChange(items.map((f, j) => (j === i ? { ...f, [k]: v } : f)));
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <div key={i} className="rounded-md border border-border p-2 space-y-2">
          <input className={inputCls} placeholder="Pergunta" value={f.question} onChange={(e) => set(i, "question", e.target.value)} aria-label={`Pergunta ${i + 1}`} />
          <textarea className={inputCls} rows={3} placeholder="Resposta" value={f.answer} onChange={(e) => set(i, "answer", e.target.value)} aria-label={`Resposta ${i + 1}`} />
          <button type="button" className="text-xs text-red-700 hover:underline" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            Remover pergunta
          </button>
        </div>
      ))}
      <button type="button" className="text-sm text-accent-dark hover:underline" onClick={() => onChange([...items, { question: "", answer: "" }])}>
        + Adicionar pergunta
      </button>
    </div>
  );
}

// ─── Editor ───────────────────────────────────────────────────────────────────

export default function PostEditor({ initial, revisions: initialRevisions = [] }: { initial: Post | null; revisions?: Revision[] }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(initial);
  const [form, setForm] = useState<PostInput>(initial ? toInput(initial) : EMPTY_POST);
  const [saved, setSaved] = useState<string>(JSON.stringify(initial ? toInput(initial) : EMPTY_POST));
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [scheduleAt, setScheduleAt] = useState(localInputValue(new Date(Date.now() + 24 * 3600 * 1000)));
  const [revisions, setRevisions] = useState<Revision[]>(initialRevisions);

  const dirty = JSON.stringify(form) !== saved;
  const checks = useMemo(() => checkPost(form), [form]);
  const blocking = hasBlockingIssues(checks);
  const status = post ? displayStatus(post) : "draft";
  const isPublished = post?.status === "published";
  const needsReview = !!post?.aiGenerated && !post.reviewedBy;

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const update = <K extends keyof PostInput>(key: K, value: PostInput[K]) =>
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "title" && !slugTouched && !isPublished) next.slug = slugify(String(value));
      return next;
    });

  const run = useCallback(async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    setMessage(null);
    try {
      await fn();
    } catch (e) {
      setMessage({ kind: "error", text: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(null);
    }
  }, []);

  const applyPost = (p: Post) => {
    setPost(p);
    const input = toInput(p);
    setForm(input);
    setSaved(JSON.stringify(input));
  };

  const loadRevisions = async (id: string) => {
    const { revisions } = await api<{ revisions: Revision[] }>(`/api/painel/blog/${id}/revisions`, "GET");
    setRevisions(revisions);
  };

  /** Save; returns the saved post (creating it on first save). */
  const save = async (): Promise<Post> => {
    if (!post) {
      const { post: created } = await api<{ post: Post }>("/api/painel/blog", "POST", form);
      applyPost(created);
      // Update the address bar without remounting the editor (keeps messages
      // and any follow-up action like "publish" running in this component).
      window.history.replaceState(null, "", `/painel/blog/${created.id}`);
      return created;
    }
    if (!dirty) return post;
    const { post: updated } = await api<{ post: Post }>(`/api/painel/blog/${post.id}`, "PUT", form);
    applyPost(updated);
    await loadRevisions(updated.id);
    return updated;
  };

  const setStatus = (label: string, body: Record<string, unknown>, okText: string) =>
    run(label, async () => {
      const current = await save();
      const { post: p } = await api<{ post: Post }>(`/api/painel/blog/${current.id}/status`, "POST", body);
      applyPost(p);
      setMessage({ kind: "ok", text: okText });
    });

  const words = wordCount(form.content);
  const live = isPublished && status === "published";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/painel/blog" className="text-sm text-muted-foreground hover:text-foreground">← Artigos</Link>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_LABEL[status].cls}`}>{STATUS_LABEL[status].text}</span>
          {post?.aiGenerated && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-900">
              Gerado por IA{post.reviewedBy ? ` · revisado por ${post.reviewedBy}` : " · aguardando revisão"}
            </span>
          )}
          {dirty && <span className="text-xs text-amber-700">Alterações não salvas</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {live && (
            <a href={`/blog/${post!.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-dark hover:underline">
              Ver no site ↗
            </a>
          )}
          {post && (
            <a
              href={`/painel/blog/${post.id}/preview`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-md border border-border text-sm hover:bg-muted"
              onClick={(e) => {
                if (dirty) {
                  e.preventDefault();
                  setMessage({ kind: "error", text: "Salve antes de pré-visualizar." });
                }
              }}
            >
              Pré-visualizar
            </a>
          )}
          <button
            type="button"
            disabled={!!busy || (!dirty && !!post)}
            onClick={() => run("save", async () => { await save(); setMessage({ kind: "ok", text: isPublished ? "Salvo — já está no site." : "Rascunho salvo." }); })}
            className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium disabled:opacity-40"
          >
            {busy === "save" ? "Salvando…" : isPublished ? "Salvar alterações" : "Salvar rascunho"}
          </button>
        </div>
      </div>

      {message && (
        <div role="status" className={`mb-4 rounded-md px-4 py-2 text-sm ${message.kind === "ok" ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ── Main column ── */}
        <div className="space-y-4 min-w-0">
          <input
            className="w-full bg-transparent font-display text-3xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            placeholder="Título do artigo"
            aria-label="Título"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
          <Field label="Slug (endereço)" hint={isPublished ? "Artigo publicado: o endereço não muda (já está no Google)." : `lkdigital.odo.br/blog/${form.slug || "…"}`}>
            <input
              className={`${inputCls} font-mono`}
              value={form.slug}
              disabled={isPublished}
              onChange={(e) => {
                setSlugTouched(true);
                update("slug", e.target.value.toLowerCase());
              }}
            />
          </Field>
          <Field label="Resumo" hint="Aparece na listagem do blog e no topo do artigo." count={`${form.excerpt.length}`}>
            <textarea className={inputCls} rows={3} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
          </Field>
          <RichTextEditor key={post?.id ?? "new"} value={form.content} onChange={(html) => update("content", html)} />
          <p className="text-xs text-muted-foreground tabular-nums">
            {words} palavras · {readingTimeOf(form.content)} min de leitura
          </p>
          <Field label="Resumo rápido (TL;DR)" hint="2–3 conclusões principais. Aparece em destaque no topo e ajuda respostas de IA.">
            <textarea className={inputCls} rows={3} value={form.tldr} onChange={(e) => update("tldr", e.target.value)} />
          </Field>
          <Box title="Perguntas frequentes (FAQ)">
            <FaqEditor items={form.faqItems} onChange={(f) => update("faqItems", f)} />
          </Box>
        </div>

        {/* ── Sidebar ── */}
        <aside className="space-y-4">
          <Box title="Publicação">
            {post?.publishedAt && post.status === "published" && (
              <p className="text-xs text-muted-foreground">
                {status === "scheduled" ? "Vai ao ar em " : "Publicado em "}
                {fmt(post.publishedAt)}
              </p>
            )}
            {post && (
              <p className="text-xs text-muted-foreground">
                Última edição {fmt(post.updatedAt)}
                {post.updatedBy ? ` por ${post.updatedBy}` : ""}
              </p>
            )}

            {needsReview && (
              <div className="rounded-md bg-violet-50 p-3 text-xs text-violet-950 space-y-2">
                <p>
                  Rascunho gerado por IA ({post!.aiModel}). Leia tudo, confira cada número e fonte e ajuste o texto antes de publicar.
                </p>
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => setStatus("review", { action: "review" }, "Marcado como revisado.")}
                  className="w-full rounded-md bg-violet-700 px-3 py-2 text-white font-medium disabled:opacity-40"
                >
                  Revisei este conteúdo
                </button>
              </div>
            )}

            {post?.status !== "published" && (
              <>
                <button
                  type="button"
                  disabled={!!busy || blocking || needsReview}
                  onClick={() => setStatus("publish", { action: "publish" }, "Publicado! Já está no site.")}
                  className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-40"
                >
                  {busy === "publish" ? "Publicando…" : "Publicar agora"}
                </button>
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    className={`${inputCls} py-1.5`}
                    value={scheduleAt}
                    onChange={(e) => setScheduleAt(e.target.value)}
                    aria-label="Data e hora para publicar"
                  />
                  <button
                    type="button"
                    disabled={!!busy || blocking || needsReview || !scheduleAt}
                    onClick={() => {
                      const at = new Date(scheduleAt);
                      if (at.getTime() <= Date.now()) {
                        setMessage({ kind: "error", text: "Escolha uma data no futuro." });
                        return;
                      }
                      setStatus("schedule", { action: "publish", at: at.toISOString() }, `Agendado para ${fmt(at.toISOString())}.`);
                    }}
                    className="shrink-0 rounded-md border border-border px-3 text-sm hover:bg-muted disabled:opacity-40"
                  >
                    Agendar
                  </button>
                </div>
                {(blocking || needsReview) && (
                  <p className="text-xs text-red-800">
                    {needsReview ? "Marque a revisão acima para liberar a publicação." : "Corrija os erros do checklist para liberar a publicação."}
                  </p>
                )}
              </>
            )}

            {post?.status === "published" && (
              <button
                type="button"
                disabled={!!busy}
                onClick={() => {
                  if (window.confirm(status === "scheduled" ? "Cancelar o agendamento e voltar para rascunho?" : "Tirar o artigo do site? Ele volta para rascunho.")) {
                    setStatus("unpublish", { action: "unpublish" }, status === "scheduled" ? "Agendamento cancelado." : "Artigo retirado do site.");
                  }
                }}
                className="w-full rounded-md border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-40"
              >
                {status === "scheduled" ? "Cancelar agendamento" : "Despublicar"}
              </button>
            )}

            {post && post.status !== "archived" && (
              <button
                type="button"
                disabled={!!busy}
                onClick={() => {
                  if (window.confirm("Arquivar? O artigo sai do site mas fica guardado aqui.")) setStatus("archive", { action: "archive" }, "Arquivado.");
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                Arquivar
              </button>
            )}
            {post && post.status !== "published" && (
              <button
                type="button"
                disabled={!!busy}
                onClick={() =>
                  run("delete", async () => {
                    if (!window.confirm("Excluir definitivamente este artigo e todo o histórico? Não dá para desfazer.")) return;
                    await api(`/api/painel/blog/${post.id}`, "DELETE");
                    setSaved(JSON.stringify(form)); // nothing left to lose
                    router.push("/painel/blog");
                  })
                }
                className="w-full text-xs text-red-700 hover:underline"
              >
                Excluir
              </button>
            )}
          </Box>

          <Box title={`Checklist de qualidade${checks.length ? ` (${checks.length})` : ""}`}>
            {checks.length === 0 ? (
              <p className="text-sm text-emerald-800">✓ Tudo certo.</p>
            ) : (
              <ul className="space-y-2">
                {checks.map((c, i) => (
                  <li key={i} className={`text-xs leading-snug ${c.level === "error" ? "text-red-800" : "text-amber-800"}`}>
                    <span aria-hidden="true">{c.level === "error" ? "✕ " : "! "}</span>
                    <span className="sr-only">{c.level === "error" ? "Erro: " : "Aviso: "}</span>
                    {c.message}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[11px] text-muted-foreground">✕ bloqueia a publicação · ! é recomendação</p>
          </Box>

          <Box title="SEO">
            <Field label="Título SEO" hint="Até 48 caracteres. Vazio = usa o título." count={`${(form.seoTitle || form.title).length}/48`}>
              <input className={inputCls} value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} />
            </Field>
            <Field label="Descrição SEO" hint="130–170 caracteres." count={`${form.seoDescription.length}`}>
              <textarea className={inputCls} rows={3} value={form.seoDescription} onChange={(e) => update("seoDescription", e.target.value)} />
            </Field>
            <Field label="Palavras-chave" hint="Separe por vírgula. A primeira é a principal.">
              <input className={inputCls} value={form.keywords.join(", ")} onChange={(e) => update("keywords", e.target.value.split(",").map((s) => s.trimStart()))} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.noindex} onChange={(e) => update("noindex", e.target.checked)} />
              Não indexar no Google (noindex)
            </label>
          </Box>

          <Box title="Organização">
            <Field label="Categoria">
              <select className={inputCls} value={form.category} onChange={(e) => update("category", e.target.value)}>
                <option value="">—</option>
                {Array.from(new Set([...(form.category ? [form.category] : []), ...CATEGORIES])).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Autor">
              <select className={inputCls} value={form.authorSlug} onChange={(e) => update("authorSlug", e.target.value)}>
                {AUTHORS.map((a) => (
                  <option key={a.slug} value={a.slug}>{a.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Tags" hint="Separe por vírgula.">
              <input className={inputCls} value={form.tags.join(", ")} onChange={(e) => update("tags", e.target.value.split(",").map((s) => s.trimStart()))} />
            </Field>
            <Field label="Artigos relacionados" hint="Slugs separados por vírgula. Vazio = escolhe pela categoria.">
              <input className={`${inputCls} font-mono text-xs`} value={form.relatedSlugs.join(", ")} onChange={(e) => update("relatedSlugs", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
            </Field>
          </Box>

          <Box title="Chamada final (CTA)">
            <p className="text-[11px] text-muted-foreground">Vazio = texto padrão da LK Digital. O botão leva para /contato.</p>
            <Field label="Título"><input className={inputCls} value={form.ctaHeading} onChange={(e) => update("ctaHeading", e.target.value)} /></Field>
            <Field label="Descrição"><textarea className={inputCls} rows={2} value={form.ctaDescription} onChange={(e) => update("ctaDescription", e.target.value)} /></Field>
            <Field label="Texto do botão"><input className={inputCls} value={form.ctaButton} onChange={(e) => update("ctaButton", e.target.value)} /></Field>
          </Box>

          {post && (
            <Box title="Histórico de versões">
              {revisions.length === 0 ? (
                <p className="text-xs text-muted-foreground">Cada vez que você salva, a versão anterior fica guardada aqui.</p>
              ) : (
                <ul className="space-y-1.5 max-h-64 overflow-auto">
                  {revisions.map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground tabular-nums">
                        {fmt(r.savedAt)}
                        {r.savedBy ? ` · ${r.savedBy}` : ""}
                      </span>
                      <button
                        type="button"
                        disabled={!!busy}
                        className="text-accent-dark hover:underline disabled:opacity-40"
                        onClick={() =>
                          run("restore", async () => {
                            if (dirty && !window.confirm("Você tem alterações não salvas que serão perdidas. Restaurar mesmo assim?")) return;
                            if (!window.confirm(`Restaurar a versão de ${fmt(r.savedAt)}? A versão atual fica no histórico.`)) return;
                            const { post: p } = await api<{ post: Post }>(`/api/painel/blog/${post.id}/revisions`, "POST", { revisionId: r.id });
                            applyPost(p);
                            await loadRevisions(p.id);
                            setMessage({ kind: "ok", text: "Versão restaurada." });
                          })
                        }
                      >
                        Restaurar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Box>
          )}
        </aside>
      </div>
    </div>
  );
}
