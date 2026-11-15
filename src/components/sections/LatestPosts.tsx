import Link from "next/link";
import { getAllListItems } from "@/lib/blog";
import { Container, SectionLabel, arrow } from "@/components/ui/primitives";

export default async function LatestPosts() {
  const posts = (await getAllListItems()).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="border-t border-border bg-muted py-section">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <SectionLabel>Blog</SectionLabel>
            <h2 className="mt-6 font-display text-display-lg text-foreground">Artigos Recentes</h2>
          </div>
          <Link
            href="/blog"
            className="hidden min-h-11 items-center gap-2 border-b border-foreground/30 text-sm font-medium text-foreground transition-colors hover:border-foreground sm:inline-flex"
          >
            Ver todos
            {arrow}
          </Link>
        </div>

        <ul className="mt-14 grid md:grid-cols-3 md:gap-10">
          {posts.map((post) => (
            <li key={post.slug} className="border-t border-foreground/80">
              <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col py-6">
                <p className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-medium uppercase tracking-[0.15em] text-accent-ink">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  {post.readTime} de leitura
                </p>
                <h3 className="mt-4 font-display text-2xl font-medium leading-snug text-foreground line-clamp-3 group-hover:text-accent-ink">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{post.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  Ler artigo
                  <span className="transition-transform duration-200 group-hover:translate-x-1">{arrow}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/blog"
          className="mt-4 inline-flex min-h-11 items-center gap-2 border-b border-foreground/30 text-sm font-medium text-foreground sm:hidden"
        >
          Ver todos os artigos
          {arrow}
        </Link>
      </Container>
    </section>
  );
}
