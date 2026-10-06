// GET  /api/painel/blog/:id/revisions — saved versions, newest first
// POST /api/painel/blog/:id/revisions { revisionId } — restore one (the current version is kept as a revision)
import { NextResponse } from "next/server";
import { afterLiveChange, assertPublishable, currentUser, handleError, readJson } from "@/lib/blog/admin-api";
import { getPostById, listRevisions, revisionInput, updatePost, ValidationError } from "@/lib/blog/store";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    return NextResponse.json({ revisions: await listRevisions(params.id) });
  } catch (err) {
    return handleError(err, "revisions");
  }
}

export async function POST(req: Request, { params }: Ctx) {
  try {
    const { revisionId } = (await readJson(req)) as { revisionId?: string };
    if (!revisionId || !/^[0-9a-f-]{36}$/i.test(revisionId)) throw new ValidationError("Versão inválida.");
    const current = await getPostById(params.id);
    if (!current) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
    const input = await revisionInput(params.id, revisionId);
    if (current.status === "published") assertPublishable(input);
    const post = await updatePost(params.id, input, currentUser(req));
    if (post.status === "published") await afterLiveChange(post);
    return NextResponse.json({ post });
  } catch (err) {
    return handleError(err, "restore");
  }
}
