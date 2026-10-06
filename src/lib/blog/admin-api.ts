// lib/blog/admin-api.ts
// Helpers shared by the /api/painel/blog route handlers.

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/indexnow";
import { PAINEL_USER_HEADER } from "@/lib/painel-auth";
import { checkPost, hasBlockingIssues } from "./quality";
import { ValidationError } from "./store";
import type { Post, PostInput } from "./types";

/** The signed-in admin (set by middleware, which already rejected anonymous requests). */
export function currentUser(req: Request): string {
  return req.headers.get(PAINEL_USER_HEADER) ?? "desconhecido";
}

export async function readJson(req: Request): Promise<unknown> {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    throw new ValidationError("Envie JSON (Content-Type: application/json).");
  }
  try {
    return await req.json();
  } catch {
    throw new ValidationError("JSON inválido.");
  }
}

/** Map thrown errors to responses: validation → 422, anything else → 500. */
export function handleError(err: unknown, where: string) {
  if (err instanceof ValidationError) return NextResponse.json({ error: err.message }, { status: 422 });
  console.error(`[painel/blog] ${where}:`, err);
  return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
}

/** Errors in the quality checklist block anything that would put content live. */
export function assertPublishable(input: PostInput) {
  const checks = checkPost(input);
  if (hasBlockingIssues(checks)) {
    const msgs = checks.filter((c) => c.level === "error").map((c) => c.message);
    throw new ValidationError(`Corrija antes de publicar: ${msgs.join(" ")}`);
  }
}

export const isLive = (p: Post) => p.status === "published" && !!p.publishedAt && Date.parse(p.publishedAt) <= Date.now();

/**
 * After anything that changes what visitors see: refresh the cached pages and,
 * for a newly live indexable post, ping search engines via IndexNow.
 */
export async function afterLiveChange(post: Post, { ping = false }: { ping?: boolean } = {}) {
  for (const path of ["/", "/blog", `/blog/${post.slug}`, "/autores/stephen-domingos-komando"]) {
    revalidatePath(path);
  }
  if (ping && isLive(post) && !post.noindex && process.env.INDEXNOW_KEY) {
    // Awaited: Vercel may freeze the function as soon as the response is sent.
    await submitToIndexNow([`https://lkdigital.odo.br/blog/${post.slug}`]).catch((e) =>
      console.error("[painel/blog] IndexNow failed:", e)
    );
  }
}
