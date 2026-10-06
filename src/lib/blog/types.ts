// lib/blog/types.ts
// One shape for every blog post, whether read by the public pages or edited
// in /painel/blog. Stored in the `blog_posts` table (db/schema.sql).

export type PostStatus = "draft" | "published" | "archived";

export interface FaqItem {
  question: string;
  answer: string;
}

/** The fields an editor writes. */
export interface PostInput {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  /** Sanitized HTML body (no <h1> — the page template renders the title). */
  content: string;
  tldr: string;
  category: string;
  tags: string[];
  keywords: string[];
  faqItems: FaqItem[];
  authorSlug: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaButton: string;
  /** Hand-picked related posts; empty = pick automatically by category. */
  relatedSlugs: string[];
  /** Keep the page out of Google (it still renders for visitors). */
  noindex: boolean;
}

export interface Post extends PostInput {
  id: string;
  status: PostStatus;
  /** When the post goes/went live. Future date + status=published = scheduled. */
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  readingTime: number;
  aiGenerated: boolean;
  aiModel: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

/** What visitors see: Post plus the resolved author. */
export interface PublicPost extends Post {
  author: Author;
}

export interface Author {
  slug: string;
  name: string;
  title: string;
  bio: string;
}

/** Status as an editor sees it (scheduled is derived from publishedAt). */
export type DisplayStatus = "draft" | "scheduled" | "published" | "archived";

export function displayStatus(p: Pick<Post, "status" | "publishedAt">, now = Date.now()): DisplayStatus {
  if (p.status === "published" && p.publishedAt && Date.parse(p.publishedAt) > now) return "scheduled";
  return p.status;
}
