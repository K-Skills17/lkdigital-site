// POST /api/painel/blog/:id/status
//   { action: "publish", at?: ISO date }  publish now, or schedule for `at`
//   { action: "unpublish" }                back to draft (leaves the site)
//   { action: "archive" }                  hide from the site, keep the record
//   { action: "review" }                   mark an AI draft as reviewed by the signed-in admin
import { NextResponse } from "next/server";
import { afterLiveChange, assertPublishable, currentUser, handleError, readJson } from "@/lib/blog/admin-api";
import { changeStatus, getPostById, ValidationError, type StatusAction } from "@/lib/blog/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = (await readJson(req)) as { action?: string; at?: string | null };
    if (!body || !["publish", "unpublish", "archive", "review"].includes(body.action ?? "")) {
      throw new ValidationError("Ação inválida.");
    }
    const current = await getPostById(params.id);
    if (!current) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
    if (body.action === "publish") assertPublishable(current);

    const wasPublished = current.status === "published";
    const post = await changeStatus(params.id, body as StatusAction, currentUser(req));
    if (wasPublished || post.status === "published") {
      await afterLiveChange(post, { ping: body.action === "publish" });
    }
    return NextResponse.json({ post });
  } catch (err) {
    return handleError(err, "status");
  }
}
