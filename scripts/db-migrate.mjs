// Applies db/schema.sql to the Neon database at DATABASE_URL.
// Idempotent — every statement is `create … if not exists` / `create or replace`.
//   DATABASE_URL=postgres://… npm run db:migrate
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";
import { splitStatements } from "../db/sql-utils.mjs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(url);
const statements = splitStatements(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
for (const stmt of statements) {
  await sql.query(stmt);
  console.log("✓", stmt.split("\n")[0].slice(0, 80));
}
console.log(`Schema applied (${statements.length} statements).`);
