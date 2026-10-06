// Applies db/schema.sql to the Neon database at DATABASE_URL, copies any rows left in the old
// per-funnel lead tables into tool_leads, then (first run only) imports the existing blog posts
// from db/seed/blog-posts.json.
// Idempotent — every statement is `create … if not exists` / `create or replace`.
//   DATABASE_URL=postgres://… npm run db:migrate
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";
import pg from "pg";
import { migrateLegacyLeads, seedBlogOnce, splitStatements } from "../db/sql-utils.mjs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

// Neon's HTTP driver in production; plain `pg` for a local Postgres.
const sql = /@(localhost|127\.0\.0\.1)[:/]/.test(url)
  ? (() => {
      const pool = new pg.Pool({ connectionString: url, max: 1 });
      return { query: async (text, params) => (await pool.query(text, params)).rows, end: () => pool.end() };
    })()
  : neon(url);
const statements = splitStatements(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
for (const stmt of statements) {
  await sql.query(stmt);
  console.log("✓", stmt.split("\n")[0].slice(0, 80));
}
console.log(`Schema applied (${statements.length} statements).`);

const legacy = await migrateLegacyLeads((text, params) => sql.query(text, params));
for (const [table, r] of Object.entries(legacy)) console.log(`✓ ${table} → tool_leads: ${r.inserted} new of ${r.rows}`);

// First run only: import the existing blog posts (75 at the time of the move to Neon).
const posts = JSON.parse(readFileSync(new URL("../db/seed/blog-posts.json", import.meta.url), "utf8"));
const seed = await seedBlogOnce((text, params) => sql.query(text, params), posts);
console.log(seed.seeded ? `Blog: imported ${seed.inserted} posts.` : "Blog: already imported, skipped.");
await sql.end?.();
