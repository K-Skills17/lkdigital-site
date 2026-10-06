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

// ─── Legacy lead tables → tool_leads ────────────────────────────────────────
// Before the lead magnets moved into this site, three funnels had their own tables. Their rows
// are kept in tool_leads (same id and created_at, the whole original row in payload) under these
// sources, so /painel shows one list and nothing is lost.
export const LEGACY_LEAD_TABLES = {
  raiox_leads: "raio-x-2026",
  unicornio_leads: "unicornio",
  raio_x_scorecard_leads: "raio-x-scorecard",
};

const TOOL_LEAD_COLS = [
  "id", "created_at", "tool", "name", "phone", "email", "clinic_name", "city", "score", "headline", "payload", "utm", "status",
];

const numOrNull = (v) => (v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));

/** Map one row of a legacy lead table (Neon or Supabase PostgREST shape) to a tool_leads row. */
export function legacyToToolLead(table, row) {
  const { id, created_at, ...rest } = row;
  const base = { id, created_at, tool: LEGACY_LEAD_TABLES[table], payload: rest, utm: null, status: "new", email: null, city: null };
  if (table === "raiox_leads") {
    return { ...base, name: row.name, phone: row.whatsapp || "", clinic_name: row.clinic_name, city: row.city,
      score: numOrNull(row.lead_score), headline: [row.lead_tier, row.role].filter(Boolean).join(" · "),
      utm: row.utm ?? null, status: row.status || "new" };
  }
  if (table === "unicornio_leads") {
    return { ...base, name: row.nome, phone: row.whatsapp || "", email: row.email ?? null, clinic_name: row.clinica,
      city: row.cidade, score: numOrNull(row.total), headline: `Arquétipo ${row.arquetipo} · ${row.total}/42` };
  }
  if (table === "raio_x_scorecard_leads") {
    const vis = numOrNull(row.vis_score), op = numOrNull(row.op_score);
    return { ...base, name: row.name, phone: row.whatsapp || "", email: row.email ?? null, clinic_name: row.clinic_name,
      score: vis === null || op === null ? null : Math.round(((vis + op) / 2) * 100), headline: `rota: ${row.route}` };
  }
  throw new Error(`unknown legacy table ${table}`);
}

/** Insert legacy rows into tool_leads; rows already there (same id) are skipped. Returns the number inserted. */
export async function insertLegacyRows(run, table, rows) {
  let inserted = 0;
  for (let i = 0; i < rows.length; i += 200) {
    const mapped = rows.slice(i, i + 200).map((r) => legacyToToolLead(table, r));
    const params = [];
    const tuples = mapped.map((m) => `(${TOOL_LEAD_COLS.map((c) => {
      const v = c === "payload" || c === "utm" ? (m[c] == null ? null : JSON.stringify(m[c])) : m[c];
      params.push(v ?? (c === "phone" ? "" : null));
      return `$${params.length}${c === "payload" || c === "utm" ? "::jsonb" : ""}`;
    }).join(", ")})`);
    const res = await run(
      `insert into tool_leads (${TOOL_LEAD_COLS.join(", ")}) values ${tuples.join(", ")} on conflict (id) do nothing returning id`,
      params
    );
    inserted += res.length;
  }
  return inserted;
}

/**
 * Copy the rows of any legacy lead table still present in this database into tool_leads.
 * Idempotent; never drops anything (db/drop-legacy-lead-tables.sql is a manual step).
 * `run(text, params)` executes one statement and returns rows.
 */
export async function migrateLegacyLeads(run) {
  const report = {};
  for (const table of Object.keys(LEGACY_LEAD_TABLES)) {
    const [exists] = await run(`select to_regclass($1) as t`, [`public.${table}`]);
    if (!exists || !exists.t) continue;
    const rows = await run(`select * from ${table} order by created_at`, []);
    report[table] = { rows: rows.length, inserted: rows.length ? await insertLegacyRows(run, table, rows) : 0 };
  }
  return report;
}
