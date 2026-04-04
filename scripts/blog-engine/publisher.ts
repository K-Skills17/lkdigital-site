// ═══════════════════════════════════════════════════════════════
// LK Digital Blog Engine — Publisher
// Writes articles to content/blog/ as JSON and tracks published
// ═══════════════════════════════════════════════════════════════

import * as fs from "fs";
import * as path from "path";
import { CONTENT_DIR, PUBLISHED_FILE } from "./config";
import type { GeneratedArticle } from "./generator";

// ─── Ensure directory exists ───
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ─── Generate unique slug ───
function ensureUniqueSlug(slug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(slug)) return slug;
  let counter = 1;
  while (existingSlugs.includes(`${slug}-${counter}`)) counter++;
  return `${slug}-${counter}`;
}

// ─── Get published list ───
export function getPublishedList(): string[] {
  const filePath = path.resolve(PUBLISHED_FILE);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

// ─── Get published slugs ───
export function getPublishedSlugs(): string[] {
  const dir = path.resolve(CONTENT_DIR);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

// ─── Publish article ───
export function publishArticle(article: GeneratedArticle): string {
  const dir = path.resolve(CONTENT_DIR);
  ensureDir(dir);

  const existingSlugs = getPublishedSlugs();
  const slug = ensureUniqueSlug(article.slug, existingSlugs);
  article.slug = slug;

  const filePath = path.join(dir, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2), "utf-8");

  // Update published list
  const published = getPublishedList();
  published.push(article.title);
  fs.writeFileSync(
    path.resolve(PUBLISHED_FILE),
    JSON.stringify(published, null, 2),
    "utf-8"
  );

  console.log(`  📄 Published: ${filePath}`);
  return slug;
}

// ─── Get all published articles ───
export function getAllPublishedArticles(): GeneratedArticle[] {
  const dir = path.resolve(CONTENT_DIR);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
    );
}
