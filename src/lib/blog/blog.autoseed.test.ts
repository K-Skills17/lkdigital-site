// A database created only from db/schema.sql (e.g. pasted into Neon's SQL
// editor, without running db:migrate) imports the existing posts on first use.
import { readFileSync } from "fs";
import path from "path";
import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";
import { query, setQueryFnForTests } from "../db";
import { getPublishedPost, listAllPosts, listPublishedPosts } from "./store";
import { splitStatements } from "../../../db/sql-utils.mjs";

it("imports the 75 existing posts on the first read, exactly once", async () => {
  const pg = new PGlite();
  for (const stmt of splitStatements(readFileSync(path.join(__dirname, "../../../db/schema.sql"), "utf8"))) await pg.exec(stmt);
  setQueryFnForTests(async (text, params = []) => (await pg.query(text, params)).rows as Record<string, unknown>[]);

  // Two concurrent first requests (two serverless instances) must not double-import or fail.
  const [a, b] = await Promise.all([listPublishedPosts(), getPublishedPost("regras-cfo-publicidade")]);
  expect(a).toHaveLength(75);
  expect(b?.slug).toBe("regras-cfo-publicidade");
  expect((await listAllPosts()).length).toBe(75);

  // A post deleted later is not re-created.
  await query("delete from blog_posts where slug = 'regras-cfo-publicidade'");
  expect(await getPublishedPost("regras-cfo-publicidade")).toBeNull();
  const flag = await query("select value from app_meta where key = 'blog_seeded'");
  expect(flag).toHaveLength(1);
});
