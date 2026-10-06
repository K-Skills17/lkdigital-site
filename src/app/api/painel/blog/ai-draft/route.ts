// POST /api/painel/blog/ai-draft { topic, keyword, category, notes?, framework? }
// Asks the AI for a first draft and saves it as a DRAFT flagged ai_generated.
// It cannot be published until an admin edits it and marks it reviewed.
import { NextResponse } from "next/server";
import { generateDraft } from "@/lib/blog/ai-draft";
import { currentUser, handleError, readJson } from "@/lib/blog/admin-api";
import { cleanInput, createPost, listPublishedPosts, uniqueSlug, ValidationError } from "@/lib/blog/store";
import { slugify } from "@/lib/blog/quality";
import { DEFAULT_AUTHOR_SLUG } from "@/lib/blog/catalog";

export const dynamic = "force-dynamic";
// Long-form generation can take a minute or two.
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body = (await readJson(req)) as Record<string, string | undefined>;
    const topic = body.topic?.trim();
    const keyword = body.keyword?.trim();
    if (!topic || !keyword) throw new ValidationError("Informe o tema e a palavra-chave.");

    const live = await listPublishedPosts(30);
    const draft = await generateDraft({
      topic: topic.slice(0, 300),
      keyword: keyword.slice(0, 100),
      category: (body.category ?? "").slice(0, 60),
      notes: body.notes?.slice(0, 4000),
      framework: body.framework,
      linkableSlugs: live.map((p) => p.slug),
    });

    const slug = await uniqueSlug(draft.slug || slugify(topic));
    const input = cleanInput({ ...draft, slug, category: body.category ?? "", authorSlug: DEFAULT_AUTHOR_SLUG });
    const post = await createPost(input, currentUser(req), { model: draft.model });
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return handleError(err, "ai-draft");
  }
}
