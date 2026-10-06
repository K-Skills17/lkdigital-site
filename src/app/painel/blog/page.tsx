import Link from "next/link";
import { listAllPosts } from "@/lib/blog/store";
import { displayStatus, type DisplayStatus } from "@/lib/blog/types";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "Blog | LK Painel" } };

const LABEL: Record<DisplayStatus, { text: string; cls: string }> = {
  draft: { text: "Rascunho", cls: "bg-muted text-foreground" },
  scheduled: { text: "Agendado", cls: "bg-sky-100 text-sky-900" },
  published: { text: "Publicado", cls: "bg-emerald-100 text-emerald-900" },
  archived: { text: "Arquivado", cls: "bg-zinc-200 text-zinc-700" },
};

const FILTERS: Array<{ key: DisplayStatus | "all"; text: string }> = [
  { key: "all", text: "Todos" },
  { key: "draft", text: "Rascunhos" },
  { key: "scheduled", text: "Agendados" },
  { key: "published", text: "Publicados" },
  { key: "archived", text: "Arquivados" },
];

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });

export default async function BlogAdminPage({ searchParams }: { searchParams: { status?: string; q?: string } }) {
  let posts;
  try {
    posts = await listAllPosts();
  } catch (err) {
    console.error("[painel/blog] list failed:", err);
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="text-2xl font-semibold">Blog indisponível</h1>
        <p className="mt-2 text-muted-foreground">
          Não foi possível ler o banco de dados. Verifique DATABASE_URL e rode <code>npm run db:migrate</code>.
        </p>
      </main>
    );
  }

  const withStatus = posts.map((p) => ({ ...p, display: displayStatus(p) }));
  const counts = Object.fromEntries(FILTERS.map((f) => [f.key, f.key === "all" ? posts.length : withStatus.filter((p) => p.display === f.key).length]));
  const filter = (FILTERS.find((f) => f.key === searchParams.status)?.key ?? "all") as DisplayStatus | "all";
  const q = (searchParams.q ?? "").trim().toLowerCase();
  const shown = withStatus.filter(
    (p) => (filter === "all" || p.display === filter) && (!q || p.title.toLowerCase().includes(q) || p.slug.includes(q))
  );

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl text-foreground">Blog</h1>
          <p className="text-sm text-muted-foreground">Escreva, revise e publique os artigos de lkdigital.odo.br/blog.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/painel/blog/gerar" className="px-4 py-2 rounded-md border border-border text-sm hover:bg-muted">
            ✨ Rascunho com IA
          </Link>
          <Link href="/painel/blog/novo" className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium">
            + Novo artigo
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <nav className="flex flex-wrap gap-1" aria-label="Filtrar por status">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={{ pathname: "/painel/blog", query: { ...(f.key !== "all" ? { status: f.key } : {}), ...(q ? { q } : {}) } }}
              aria-current={filter === f.key ? "page" : undefined}
              className={`px-3 py-1.5 rounded-md text-sm ${filter === f.key ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}
            >
              {f.text} <span className="tabular-nums opacity-70">{counts[f.key]}</span>
            </Link>
          ))}
        </nav>
        <form className="flex gap-2" action="/painel/blog">
          {filter !== "all" && <input type="hidden" name="status" value={filter} />}
          <input
            name="q"
            defaultValue={searchParams.q ?? ""}
            placeholder="Buscar título ou slug"
            aria-label="Buscar"
            className="rounded-md border border-border bg-card px-3 py-1.5 text-sm w-60"
          />
        </form>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-2 font-medium">Título</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Categoria</th>
              <th className="px-4 py-2 font-medium">Publicação</th>
              <th className="px-4 py-2 font-medium">Última edição</th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nenhum artigo aqui.</td>
              </tr>
            )}
            {shown.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                <td className="px-4 py-2.5">
                  <Link href={`/painel/blog/${p.id}`} className="font-medium text-foreground hover:text-accent-dark">
                    {p.title}
                  </Link>
                  <div className="text-xs text-muted-foreground font-mono">/{p.slug}</div>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${LABEL[p.display].cls}`}>{LABEL[p.display].text}</span>
                  {p.aiGenerated && !p.reviewedBy && (
                    <span className="ml-1.5 px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-900">IA · revisar</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{p.category || "—"}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground tabular-nums">
                  {p.status === "published" && p.publishedAt ? fmt(p.publishedAt) : "—"}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground tabular-nums">
                  {fmt(p.updatedAt)}
                  {p.updatedBy ? ` · ${p.updatedBy}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
