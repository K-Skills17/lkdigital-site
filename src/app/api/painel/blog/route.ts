// GET  /api/painel/blog — every post (any status), newest edit first
// POST /api/painel/blog — create a draft
import { NextResponse } from "next/server";
import { currentUser, handleError, readJson } from "@/lib/blog/admin-api";
import { cleanInput, createPost, listAllPosts } from "@/lib/blog/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ posts: await listAllPosts() });
  } catch (err) {
    return handleError(err, "list");
  }
}

export async function POST(req: Request) {
  try {
    const post = await createPost(cleanInput(await readJson(req)), currentUser(req));
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return handleError(err, "create");
  }
}
