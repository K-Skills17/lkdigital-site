// ═══════════════════════════════════════════════════════════════
// Blog reader — reads articles from content/blog/*.json
// AND from src/data/blog-posts.ts (initial 6 articles)
// ═══════════════════════════════════════════════════════════════

import * as fs from "fs";
import * as path from "path";

export interface BlogArticle {
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  slug: string;
  excerpt: string;
  content: string;
  tags?: string[];
  keywords?: string[];
  category: string;
  pillar?: string;
  readingTime: number | string;
  tldr?: string;
  faqItems: { question: string; answer: string }[];
  author: {
    name: string;
    title: string;
    bio?: string;
    slug?: string;
  };
  datePublished: string;
  dateModified: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButton?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

// ─── Read JSON blog posts from content/blog/ ───
function getGeneratedPosts(): BlogArticle[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
        return JSON.parse(raw) as BlogArticle;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as BlogArticle[];
}

// ─── Get all blog posts (generated + initial) ───
export function getAllBlogPosts(): BlogArticle[] {
  const generated = getGeneratedPosts();

  // Sort by date, newest first
  return generated.sort(
    (a, b) =>
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  );
}

// ─── Get post by slug ───
export function getBlogPostBySlug(slug: string): BlogArticle | undefined {
  const all = getAllBlogPosts();
  return all.find((p) => p.slug === slug);
}

// ─── Get all slugs ───
export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((p) => p.slug);
}

// ─── Get related posts ───
export function getRelatedPosts(slug: string, limit = 3): BlogArticle[] {
  const all = getAllBlogPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];

  return all
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit);
}
