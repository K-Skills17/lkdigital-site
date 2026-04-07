// ═══════════════════════════════════════════════════════════════
// Blog reader — unified API for ALL blog posts
// Merges: src/data/blog-posts.ts (initial 6) + content/blog/*.json (engine-generated)
// ═══════════════════════════════════════════════════════════════

import * as fs from "fs";
import * as path from "path";
import { blogPosts, type BlogPost } from "@/data/blog-posts";

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

// ─── Unified listing item (used by blog listing page) ───
export interface BlogListItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  datePublished: string;
  dateModified: string;
  source: "static" | "engine";
  authorName: string;
  tags?: string[];
  tldr?: string;
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

// ─── Convert static BlogPost to BlogListItem ───
function staticToListItem(post: BlogPost): BlogListItem {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    readTime: post.readTime,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    source: "static",
    authorName: "Equipe LK Digital",
  };
}

// ─── Convert engine BlogArticle to BlogListItem ───
function engineToListItem(article: BlogArticle): BlogListItem {
  const readTime =
    typeof article.readingTime === "number"
      ? `${article.readingTime} min`
      : article.readingTime;

  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    readTime,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    source: "engine",
    authorName: article.author.name,
    tags: article.tags,
    tldr: article.tldr,
  };
}

// ─── Get ALL posts as listing items (merged, sorted by date) ───
export function getAllListItems(): BlogListItem[] {
  const staticItems = blogPosts.map(staticToListItem);
  const engineItems = getGeneratedPosts().map(engineToListItem);

  // Deduplicate by slug (static takes precedence)
  const slugSet = new Set(staticItems.map((p) => p.slug));
  const uniqueEngine = engineItems.filter((p) => !slugSet.has(p.slug));

  return [...staticItems, ...uniqueEngine].sort(
    (a, b) =>
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  );
}

// ─── Get all engine-generated blog posts ───
export function getAllBlogPosts(): BlogArticle[] {
  const generated = getGeneratedPosts();
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

// ─── Get all slugs (both sources) ───
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
