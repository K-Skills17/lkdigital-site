// GET    /api/painel/blog/:id — one post with its body
// PUT    /api/painel/blog/:id — save edits (a snapshot of the previous version is kept)
// DELETE /api/painel/blog/:id — delete a draft/archived post
import { NextResponse } from "next/server";
import { afterLiveChange, assertPublishable, currentUser, handleError, readJson } from "@/lib/blog/admin-api";
import { cleanInput, deletePost, getPostById, updatePost } from "@/lib/blog/store";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const post = await getPostById(params.id);
    return post ? NextResponse.json({ post }) : NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
  } catch (err) {
    return handleError(err, "get");
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const input = cleanInput(await readJson(req));
    const current = await getPostById(params.id);
    if (!current) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
    // Edits to a published (or scheduled) post go live, so they must pass the checklist too.
    if (current.status === "published") assertPublishable(input);
    const post = await updatePost(params.id, input, currentUser(req));
    if (post.status === "published") await afterLiveChange(post);
    return NextResponse.json({ post });
  } catch (err) {
    return handleError(err, "update");
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await deletePost(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err, "delete");
  }
}
