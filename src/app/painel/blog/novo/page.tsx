import PostEditor from "@/components/painel/PostEditor";

export const metadata = { title: { absolute: "Novo artigo | LK Painel" } };

export default function NewPostPage() {
  return <PostEditor initial={null} />;
}
