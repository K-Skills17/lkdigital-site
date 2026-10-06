// POST /api/painel/setup — create any missing tables (applies db/schema.sql,
// which is safe to re-run) and import the existing blog posts if needed.
// Admin-only (src/middleware.ts guards /api/painel/*).
import { NextResponse } from "next/server";
import { applySchema } from "@/lib/db-setup";
import { listAllPosts } from "@/lib/blog/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  try {
    const statements = await applySchema();
    const posts = (await listAllPosts()).length; // also runs the one-time post import
    return NextResponse.json({ ok: true, statements, posts });
  } catch (err) {
    console.error("[painel/setup] failed:", err);
    return NextResponse.json(
      { error: `Não foi possível criar as tabelas: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
