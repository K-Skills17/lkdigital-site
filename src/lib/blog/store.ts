// lib/blog/store.ts
// Blog persistence (Neon `blog_posts`). Public pages read live posts from
// here; /painel/blog writes through here. Without DATABASE_URL (local dev,
// preview builds) the public side falls back to the read-only seed file so the
// site still renders.

import { readFileSync } from "fs";
import path from "path";
import { isDbConfigured, query } from "@/lib/db";
// Plain ESM helper shared with scripts/db-migrate.mjs.
import { seedBlogOnce } from "../../../db/sql-utils.mjs";
import { getAuthor } from "./catalog";
import { readingTimeOf, slugify, SLUG_RE } from "./quality";
import { plainText, sanitizePostHtml } from "./sanitize";
import type { FaqItem, Post, PostInput, PostStatus, PublicPost } from "./types";

// ─── Row mapping ────────────────────────────────────────────────────────────

const COLS = `id, slug, title, seo_title, seo_description, excerpt, content, tldr, category, tags, keywords,
  faq_items, author_slug, cta_heading, cta_description, cta_button, related_slugs, noindex, reading_time,
  status, published_at, created_at, updated_at, created_by, updated_by, ai_generated, ai_model,
  reviewed_by, reviewed_at`;

const iso = (v: unknown): string | null =>
  v == null ? null : v instanceof Date ? v.toISOString() : new Date(String(v)).toISOString();

type Row = Record<string, unknown>;

export function rowToPost(r: Row): Post {
  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title),
    seoTitle: String(r.seo_title ?? ""),
    seoDescription: String(r.seo_description ?? ""),
    excerpt: String(r.excerpt ?? ""),
    content: String(r.content ?? ""),
    tldr: String(r.tldr ?? ""),
    category: String(r.category ?? ""),
    tags: (r.tags as string[]) ?? [],
    keywords: (r.keywords as string[]) ?? [],
    faqItems: (r.faq_items as FaqItem[]) ?? [],
    authorSlug: String(r.author_slug ?? ""),
    ctaHeading: String(r.cta_heading ?? ""),
    ctaDescription: String(r.cta_description ?? ""),
    ctaButton: String(r.cta_button ?? ""),
    relatedSlugs: (r.related_slugs as string[]) ?? [],
    noindex: Boolean(r.noindex),
    readingTime: Number(r.reading_time ?? 1),
    status: r.status as PostStatus,
    publishedAt: iso(r.published_at),
    createdAt: iso(r.created_at)!,
    updatedAt: iso(r.updated_at)!,
    createdBy: (r.created_by as string) ?? null,
    updatedBy: (r.updated_by as string) ?? null,
    aiGenerated: Boolean(r.ai_generated),
    aiModel: (r.ai_model as string) ?? null,
    reviewedBy: (r.reviewed_by as string) ?? null,
    reviewedAt: iso(r.reviewed_at),
  };
}

const toPublic = (p: Post): PublicPost => ({ ...p, author: getAuthor(p.authorSlug) });

// ─── Input cleaning (every write goes through this) ─────────────────────────

export class ValidationError extends Error {}

const list = (v: unknown, max = 30) =>
  (Array.isArray(v) ? v : typeof v === "string" ? v.split(",") : [])
    .map((x) => plainText(String(x)))
    .filter(Boolean)
    .slice(0, max);

const text = (v: unknown, max = 2000) => plainText(typeof v === "string" ? v : "").slice(0, max);

export function cleanInput(raw: unknown): PostInput {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const title = text(o.title, 200);
  if (!title) throw new ValidationError("O título é obrigatório.");
  const slug = (typeof o.slug === "string" && o.slug.trim() ? o.slug.trim().toLowerCase() : slugify(title)).slice(0, 100);
  if (!SLUG_RE.test(slug)) throw new ValidationError("Slug inválido — use só letras minúsculas, números e hífens.");

  const faqItems = (Array.isArray(o.faqItems) ? o.faqItems : [])
    .map((f) => ({ question: text((f as FaqItem)?.question, 300), answer: text((f as FaqItem)?.answer, 2000) }))
    .filter((f) => f.question && f.answer)
    .slice(0, 20);

  return {
    slug,
    title,
    seoTitle: text(o.seoTitle, 120),
    seoDescription: text(o.seoDescription, 300),
    excerpt: text(o.excerpt, 600),
    content: sanitizePostHtml(typeof o.content === "string" ? o.content : "").slice(0, 400_000),
    tldr: text(o.tldr, 1000),
    category: text(o.category, 60),
    tags: list(o.tags),
    keywords: list(o.keywords, 10),
    faqItems,
    authorSlug: getAuthor(typeof o.authorSlug === "string" ? o.authorSlug : null).slug,
    ctaHeading: text(o.ctaHeading, 160),
    ctaDescription: text(o.ctaDescription, 400),
    ctaButton: text(o.ctaButton, 60),
    relatedSlugs: list(o.relatedSlugs, 6).filter((s) => SLUG_RE.test(s) && s !== slug),
    noindex: o.noindex === true,
  };
}

function inputParams(p: PostInput): unknown[] {
  return [
    p.slug, p.title, p.seoTitle, p.seoDescription, p.excerpt, p.content, p.tldr, p.category, p.tags,
    p.keywords, JSON.stringify(p.faqItems), p.authorSlug, p.ctaHeading, p.ctaDescription, p.ctaButton,
    p.relatedSlugs, p.noindex, readingTimeOf(p.content),
  ];
}

// ─── Public reads ───────────────────────────────────────────────────────────

const LIVE = `status = 'published' and published_at <= now()`;

type SeedPost = PostInput & { publishedAt: string; updatedAt?: string };

function readSeedFile(): SeedPost[] {
  return JSON.parse(readFileSync(path.join(process.cwd(), "db", "seed", "blog-posts.json"), "utf8"));
}

let _seed: PublicPost[] | null = null;
function seedPosts(): PublicPost[] {
  if (_seed) return _seed;
  _seed = readSeedFile()
    .map((p) =>
      toPublic({
        ...p,
        id: p.slug,
        status: "published",
        readingTime: readingTimeOf(p.content),
        createdAt: p.publishedAt,
        updatedAt: p.updatedAt ?? p.publishedAt,
        createdBy: null,
        updatedBy: null,
        aiGenerated: false,
        aiModel: null,
        reviewedBy: null,
        reviewedAt: null,
      })
    )
    .sort((a, b) => Date.parse(b.publishedAt!) - Date.parse(a.publishedAt!));
  return _seed;
}

/**
 * The existing posts are imported into an empty database automatically on
 * first use (also done by `npm run db:migrate`), so creating the tables from
 * Neon's SQL editor is enough. Runs at most once per server instance.
 */
let seedChecked = false;
async function ensureSeeded(): Promise<void> {
  if (seedChecked) return;
  const done = await query(`select 1 from app_meta where key = 'blog_seeded'`);
  if (!done.length) {
    const r = await seedBlogOnce((text: string, params: unknown[]) => query(text, params), readSeedFile());
    if (r.seeded) console.log(`[blog] imported ${r.inserted} existing posts into the database`);
  }
  seedChecked = true;
}

const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";
let warnedFallback = false;

/**
 * Read live posts from the database. Without DATABASE_URL, use the seed file.
 * During `next build` a database error (not migrated yet, Neon hiccup) also
 * falls back to the seed instead of failing the whole deploy — the cached
 * pages then refresh from the database within 5 minutes. At runtime errors are
 * thrown, so Next keeps serving the last good version of the page.
 */
async function fromDbOrSeed<T>(fromDb: () => Promise<T>, fromSeed: () => T): Promise<T> {
  if (!isDbConfigured()) return fromSeed();
  try {
    await ensureSeeded();
    return await fromDb();
  } catch (err) {
    // Tables not created yet (db/schema.sql not run since this release): keep
    // the public blog up from the seed instead of a 500. Any other runtime error
    // is thrown so Next keeps serving the last good version of the page.
    if (!IS_BUILD && !isMissingTable(err)) throw err;
    if (!warnedFallback) {
      warnedFallback = true;
      console.warn(
        isMissingTable(err)
          ? "[blog] blog tables missing — run db/schema.sql (or use /painel/blog). Serving db/seed/blog-posts.json meanwhile."
          : "[blog] database unavailable during build — using db/seed/blog-posts.json:",
        err instanceof Error ? err.message : err
      );
    }
    return fromSeed();
  }
}

/** Postgres "undefined_table": the schema hasn't been applied to this database yet. */
export function isMissingTable(err: unknown): boolean {
  return (err as { code?: string } | null)?.code === "42P01";
}

// Listings don't need the (large) HTML body.
const LIST_COLS = COLS.replace(/\bcontent\b/, "''::text as content");

/** Live posts, newest first. Bodies are omitted (content = ""); use getPublishedPost for one post. */
export async function listPublishedPosts(limit = 1000): Promise<PublicPost[]> {
  return fromDbOrSeed(
    async () => {
      const rows = await query(`select ${LIST_COLS} from blog_posts where ${LIVE} order by published_at desc limit $1`, [limit]);
      return rows.map(rowToPost).map(toPublic);
    },
    () => seedPosts().slice(0, limit)
  );
}

export async function getPublishedPost(slug: string): Promise<PublicPost | null> {
  return fromDbOrSeed(
    async () => {
      const rows = await query(`select ${COLS} from blog_posts where slug = $1 and ${LIVE}`, [slug]);
      return rows[0] ? toPublic(rowToPost(rows[0])) : null;
    },
    () => seedPosts().find((p) => p.slug === slug) ?? null
  );
}

/** Hand-picked related posts first, then same category, then most recent. */
export async function getRelatedPosts(post: Post, limit = 3): Promise<PublicPost[]> {
  const all = await listPublishedPosts();
  const others = all.filter((p) => p.slug !== post.slug);
  const picked: PublicPost[] = [];
  const add = (p?: PublicPost) => {
    if (p && !picked.includes(p) && picked.length < limit) picked.push(p);
  };
  post.relatedSlugs.forEach((s) => add(others.find((p) => p.slug === s)));
  others.filter((p) => p.category === post.category).forEach((p) => add(p));
  others.forEach((p) => add(p));
  return picked;
}

// ─── Admin reads ────────────────────────────────────────────────────────────

export async function listAllPosts(): Promise<Post[]> {
  await ensureSeeded();
  const rows = await query(`select ${LIST_COLS} from blog_posts order by updated_at desc`);
  return rows.map(rowToPost);
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await query(`select ${COLS} from blog_posts where id = $1`, [id]);
  return rows[0] ? rowToPost(rows[0]) : null;
}

// ─── Admin writes ───────────────────────────────────────────────────────────

async function assertSlugFree(slug: string, exceptId?: string) {
  const rows = await query(`select id from blog_posts where slug = $1 and id <> coalesce($2::uuid, '00000000-0000-0000-0000-000000000000')`, [slug, exceptId ?? null]);
  if (rows.length) throw new ValidationError(`Já existe um artigo com o slug "${slug}".`);
}

/** `base`, or `base-2`, `base-3`… — the first slug no post (any status) uses. */
export async function uniqueSlug(base: string): Promise<string> {
  const rows = await query<{ slug: string }>(`select slug from blog_posts where slug = $1 or slug like $2`, [base, `${base}-%`]);
  const taken = new Set(rows.map((r) => r.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

export async function createPost(
  input: PostInput,
  user: string,
  ai?: { model: string }
): Promise<Post> {
  await assertSlugFree(input.slug);
  const rows = await query(
    `insert into blog_posts (slug, title, seo_title, seo_description, excerpt, content, tldr, category, tags,
       keywords, faq_items, author_slug, cta_heading, cta_description, cta_button, related_slugs, noindex,
       reading_time, status, created_by, updated_by, ai_generated, ai_model)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13, $14, $15, $16, $17, $18,
       'draft', $19, $19, $20, $21)
     returning ${COLS}`,
    [...inputParams(input), user, !!ai, ai?.model ?? null]
  );
  return rowToPost(rows[0]);
}

async function snapshot(post: Post, user: string) {
  await query(`insert into blog_post_revisions (post_id, saved_by, snapshot) values ($1, $2, $3::jsonb)`, [
    post.id,
    user,
    JSON.stringify(post),
  ]);
}

export async function updatePost(id: string, input: PostInput, user: string): Promise<Post> {
  const current = await getPostById(id);
  if (!current) throw new ValidationError("Artigo não encontrado.");
  await assertSlugFree(input.slug, id);
  // A live post's URL is its identity on Google — don't let it change silently.
  if (current.status === "published" && current.slug !== input.slug) {
    throw new ValidationError("Não dá para mudar o slug de um artigo publicado (a URL já está no Google). Despublique primeiro.");
  }
  await snapshot(current, user);
  const rows = await query(
    `update blog_posts set slug = $1, title = $2, seo_title = $3, seo_description = $4, excerpt = $5,
       content = $6, tldr = $7, category = $8, tags = $9, keywords = $10, faq_items = $11::jsonb,
       author_slug = $12, cta_heading = $13, cta_description = $14, cta_button = $15, related_slugs = $16,
       noindex = $17, reading_time = $18, updated_at = now(), updated_by = $19
     where id = $20 returning ${COLS}`,
    [...inputParams(input), user, id]
  );
  return rowToPost(rows[0]);
}

export type StatusAction =
  | { action: "publish"; at?: string | null }
  | { action: "unpublish" }
  | { action: "archive" }
  | { action: "review" };

export async function changeStatus(id: string, a: StatusAction, user: string): Promise<Post> {
  const current = await getPostById(id);
  if (!current) throw new ValidationError("Artigo não encontrado.");
  let sql: string;
  let params: unknown[];
  switch (a.action) {
    case "publish": {
      if (current.aiGenerated && !current.reviewedBy) {
        throw new ValidationError("Este rascunho foi gerado por IA: marque \"Revisei este conteúdo\" antes de publicar.");
      }
      const at = a.at ? new Date(a.at) : null;
      if (at && Number.isNaN(at.getTime())) throw new ValidationError("Data de agendamento inválida.");
      // Republishing keeps the original date unless a new one is given.
      sql = `update blog_posts set status = 'published',
               published_at = coalesce($1::timestamptz, case when status = 'published' then published_at end, now()),
               updated_at = now(), updated_by = $2 where id = $3 returning ${COLS}`;
      params = [at ? at.toISOString() : null, user, id];
      break;
    }
    case "unpublish":
      sql = `update blog_posts set status = 'draft', updated_at = now(), updated_by = $1 where id = $2 returning ${COLS}`;
      params = [user, id];
      break;
    case "archive":
      sql = `update blog_posts set status = 'archived', updated_at = now(), updated_by = $1 where id = $2 returning ${COLS}`;
      params = [user, id];
      break;
    case "review":
      sql = `update blog_posts set reviewed_by = $1, reviewed_at = now() where id = $2 returning ${COLS}`;
      params = [user, id];
      break;
  }
  const rows = await query(sql, params);
  return rowToPost(rows[0]);
}

export async function deletePost(id: string): Promise<void> {
  const current = await getPostById(id);
  if (!current) return;
  if (current.status === "published") throw new ValidationError("Despublique ou arquive o artigo antes de excluir.");
  await query(`delete from blog_posts where id = $1`, [id]);
}

// ─── Revisions ──────────────────────────────────────────────────────────────

export interface RevisionSummary {
  id: string;
  savedAt: string;
  savedBy: string | null;
  title: string;
}

export async function listRevisions(postId: string): Promise<RevisionSummary[]> {
  const rows = await query(
    `select id, saved_at, saved_by, snapshot->>'title' as title from blog_post_revisions
      where post_id = $1 order by saved_at desc limit 50`,
    [postId]
  );
  return rows.map((r) => ({ id: String(r.id), savedAt: iso(r.saved_at)!, savedBy: (r.saved_by as string) ?? null, title: String(r.title) }));
}

/** A saved version as editable input (a live post's slug is never changed by a restore). */
export async function revisionInput(postId: string, revisionId: string): Promise<PostInput> {
  const rows = await query(`select snapshot from blog_post_revisions where id = $1 and post_id = $2`, [revisionId, postId]);
  if (!rows[0]) throw new ValidationError("Versão não encontrada.");
  const snap = (typeof rows[0].snapshot === "string" ? JSON.parse(rows[0].snapshot) : rows[0].snapshot) as Post;
  const current = await getPostById(postId);
  return cleanInput({ ...snap, slug: current?.status === "published" ? current.slug : snap.slug });
}

/** All live slugs (sitemap, IndexNow). */
export async function publishedSlugs(): Promise<Array<{ slug: string; updatedAt: string }>> {
  return (await listPublishedPosts()).filter((p) => !p.noindex).map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
}
