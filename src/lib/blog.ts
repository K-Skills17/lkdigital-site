// lib/blog.ts
// Listing view of live blog posts for the blog index, home page and author
// page. Posts live in the database (lib/blog/store.ts) and are written in
// /painel/blog.

import { listPublishedPosts } from "@/lib/blog/store";

export interface BlogListItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  datePublished: string;
  dateModified: string;
  authorSlug: string;
  authorName: string;
  tags?: string[];
  tldr?: string;
}

/** Every live post, newest first. */
export async function getAllListItems(): Promise<BlogListItem[]> {
  const posts = await listPublishedPosts();
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    readTime: `${p.readingTime} min`,
    datePublished: p.publishedAt!,
    dateModified: p.updatedAt,
    authorSlug: p.author.slug,
    authorName: p.author.name,
    tags: p.tags,
    tldr: p.tldr || undefined,
  }));
}
