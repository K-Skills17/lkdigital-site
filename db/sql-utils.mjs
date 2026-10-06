// Small helpers shared by the db scripts (plain ESM so they run with `node`).

/** Split a schema file into statements. db/schema.sql has no functions or
 *  quoted semicolons, so splitting on `;` at end of line is safe. */
export function splitStatements(sql) {
  return sql
    .split(/;\s*$/m)
    .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);
}

/**
 * Build one idempotent multi-row INSERT for rows copied from another database.
 * `types` maps column → Postgres data_type (from information_schema) so jsonb
 * values are serialized while text[]/int[] arrays are passed as arrays.
 */
export function buildInsert(table, rows, types) {
  const cols = Object.keys(rows[0]).filter((c) => c in types);
  const params = [];
  const tuples = rows.map((row) => {
    const ph = cols.map((c) => {
      let v = row[c];
      if (types[c] === "jsonb" && v !== null && v !== undefined) v = JSON.stringify(v);
      params.push(v ?? null);
      return `$${params.length}${types[c] === "jsonb" ? "::jsonb" : ""}`;
    });
    return `(${ph.join(", ")})`;
  });
  const quoted = cols.map((c) => `"${c}"`).join(", ");
  return {
    text: `insert into ${table} (${quoted}) values ${tuples.join(", ")} on conflict (id) do nothing`,
    params,
  };
}

/** Column order for inserting seed posts into blog_posts. */
const BLOG_COLS = [
  "slug", "title", "seo_title", "seo_description", "excerpt", "content", "tldr", "category", "tags",
  "keywords", "faq_items", "author_slug", "cta_heading", "cta_description", "cta_button", "related_slugs",
  "noindex", "reading_time", "status", "published_at", "updated_at", "created_by", "updated_by",
];

function readingTime(html) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Load db/seed/blog-posts.json into blog_posts exactly once (tracked in
 * app_meta), so posts an admin later deletes are not re-created by the next
 * migrate. Safe to run concurrently (slug and flag inserts skip conflicts). `run(text, params)` executes one statement and returns rows.
 */
export async function seedBlogOnce(run, posts) {
  const done = await run(`select 1 from app_meta where key = 'blog_seeded'`, []);
  if (done.length) return { seeded: false, inserted: 0 };

  let inserted = 0;
  for (let i = 0; i < posts.length; i += 10) {
    const chunk = posts.slice(i, i + 10);
    const params = [];
    const tuples = chunk.map((p) => {
      const values = [
        p.slug, p.title, p.seoTitle, p.seoDescription, p.excerpt, p.content, p.tldr, p.category, p.tags,
        p.keywords, JSON.stringify(p.faqItems), p.authorSlug, p.ctaHeading, p.ctaDescription, p.ctaButton,
        p.relatedSlugs, p.noindex, readingTime(p.content), "published", p.publishedAt, p.updatedAt ?? p.publishedAt,
        "import", "import",
      ];
      const ph = values.map((v) => {
        params.push(v);
        return `$${params.length}`;
      });
      ph[10] += "::jsonb";
      return `(${ph.join(", ")})`;
    });
    const rows = await run(
      `insert into blog_posts (${BLOG_COLS.join(", ")}) values ${tuples.join(", ")}
       on conflict (slug) do nothing returning id`,
      params
    );
    inserted += rows.length;
  }
  // `on conflict do nothing`: two servers may seed at the same time on first use.
  await run(`insert into app_meta (key, value) values ('blog_seeded', $1) on conflict (key) do nothing`, [String(inserted)]);
  return { seeded: true, inserted };
}
