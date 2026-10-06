import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleView from "@/components/blog/ArticleView";
import { getAuthor } from "@/lib/blog/catalog";
import { getPostById, getRelatedPosts } from "@/lib/blog/store";
import { displayStatus } from "@/lib/blog/types";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "Pré-visualização | LK Painel" } };

// Renders the saved version of any post (draft included) exactly as visitors
// would see it. Lives under /painel, so only signed-in admins can open it.
export default async function PreviewPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  if (!post) notFound();
  const related = await getRelatedPosts(post, 3);
  const status = displayStatus(post);

  return (
    <>
      <div className="sticky top-0 z-[60] bg-amber-100 text-amber-950 text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-2">
          <span>
            Pré-visualização · <strong>{{ draft: "Rascunho", scheduled: "Agendado", published: "Publicado", archived: "Arquivado" }[status]}</strong>
            {" "}— mostra a última versão salva.
          </span>
          <Link href={`/painel/blog/${post.id}`} className="underline">Voltar ao editor</Link>
        </div>
      </div>
      <Navbar />
      <ArticleView post={{ ...post, publishedAt: post.publishedAt ?? post.updatedAt, author: getAuthor(post.authorSlug) }} relatedPosts={related} />
      <Footer />
    </>
  );
}
