import { notFound } from "next/navigation";
import PostEditor from "@/components/painel/PostEditor";
import { getPostById, listRevisions } from "@/lib/blog/store";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "Editar artigo | LK Painel" } };

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  if (!post) notFound();
  const revisions = await listRevisions(post.id);
  return <PostEditor initial={post} revisions={revisions} />;
}
