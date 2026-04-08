import Link from "next/link";
import { getAllListItems } from "@/lib/blog";

export default function LatestPosts() {
  const posts = getAllListItems().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-muted">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-3">
              Blog
            </p>
            <h2 className="font-display text-display-md text-foreground">
              Artigos Recentes
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent hover:gap-2 transition-all"
          >
            Ver todos
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-accent/5 to-accent/10 flex items-center justify-center">
                <span className="text-xs text-accent/40 uppercase tracking-[0.25em] font-medium">
                  {post.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-0.5 text-[10px] font-medium text-accent bg-accent/10 rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {post.readTime} de leitura
                  </span>
                </div>
                <h3 className="font-display text-lg font-medium text-foreground group-hover:text-accent transition-colors mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-4 pt-4 border-t border-border/60">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
                    Ler artigo
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent"
          >
            Ver todos os artigos
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
