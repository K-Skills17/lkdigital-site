/**
 * Contentful CMS client — uses native fetch (no SDK required)
 * Content Delivery API: https://www.contentful.com/developers/docs/references/content-delivery-api/
 *
 * Required env vars (add to .env.local):
 *   CONTENTFUL_SPACE_ID      — found in Settings > API keys
 *   CONTENTFUL_ACCESS_TOKEN  — Content Delivery API token
 *   CONTENTFUL_PREVIEW_TOKEN — Content Preview API token (optional, for drafts)
 *
 * Content model — create a content type with ID "blogPost" and these fields:
 *   title        Short text (required)
 *   slug         Short text (required, unique)
 *   description  Short text (required)
 *   category     Short text (required)
 *   readTime     Short text (required, e.g. "9 min")
 *   tags         Array of Short text
 *   content      Long text / Markdown (required)
 *   coverImage   Media (optional)
 *   publishedAt  Date (optional — falls back to sys.createdAt)
 */

import type { BlogPost } from "./blog";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const PREVIEW_TOKEN = process.env.CONTENTFUL_PREVIEW_TOKEN;

const BASE_URL = SPACE_ID
  ? `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master`
  : null;

const PREVIEW_URL = SPACE_ID
  ? `https://preview.contentful.com/spaces/${SPACE_ID}/environments/master`
  : null;

export function isContentfulConfigured(): boolean {
  return Boolean(SPACE_ID && ACCESS_TOKEN);
}

// ---------------------------------------------------------------------------
// Raw Contentful API types
// ---------------------------------------------------------------------------

interface ContentfulSys {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface ContentfulAsset {
  sys: ContentfulSys;
  fields: {
    title: string;
    file: {
      url: string;
      contentType: string;
      details: { size: number; image?: { width: number; height: number } };
    };
  };
}

interface ContentfulBlogPostFields {
  title: string;
  slug: string;
  description: string;
  category: string;
  readTime: string;
  tags?: string[];
  content: string;
  coverImage?: { sys: { id: string } };
  publishedAt?: string;
}

interface ContentfulBlogPostEntry {
  sys: ContentfulSys;
  fields: ContentfulBlogPostFields;
}

interface ContentfulCollection<T> {
  total: number;
  skip: number;
  limit: number;
  items: T[];
  includes?: {
    Asset?: ContentfulAsset[];
  };
}

// ---------------------------------------------------------------------------
// Internal fetch helper — uses Next.js ISR caching
// ---------------------------------------------------------------------------

async function contentfulFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
  preview = false
): Promise<T | null> {
  if (!isContentfulConfigured()) return null;

  const token = preview ? PREVIEW_TOKEN : ACCESS_TOKEN;
  const base = preview ? PREVIEW_URL : BASE_URL;
  if (!token || !base) return null;

  const searchParams = new URLSearchParams({ access_token: token, ...params });
  const url = `${base}${endpoint}?${searchParams.toString()}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });

    if (!res.ok) {
      console.error(`Contentful fetch error: ${res.status} ${res.statusText}`);
      return null;
    }

    return res.json() as Promise<T>;
  } catch (err) {
    console.error("Contentful fetch failed:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Transform Contentful entry → BlogPost
// ---------------------------------------------------------------------------

function transformEntry(
  entry: ContentfulBlogPostEntry,
  assets: ContentfulAsset[] = []
): BlogPost {
  const f = entry.fields;

  let coverImage: string | undefined;
  if (f.coverImage) {
    const asset = assets.find((a) => a.sys.id === f.coverImage!.sys.id);
    if (asset) coverImage = `https:${asset.fields.file.url}`;
  }

  return {
    slug: f.slug,
    title: f.title,
    description: f.description,
    category: f.category,
    readTime: f.readTime,
    date: f.publishedAt ?? entry.sys.createdAt,
    tags: f.tags ?? [],
    content: f.content,
    coverImage,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Fetch all blog posts from Contentful, newest first. Returns null on error/unconfigured. */
export async function fetchAllPostsFromCMS(): Promise<BlogPost[] | null> {
  const data = await contentfulFetch<
    ContentfulCollection<ContentfulBlogPostEntry>
  >("/entries", {
    content_type: "blogPost",
    order: "-fields.publishedAt,-sys.createdAt",
    limit: "200",
    include: "2",
  });

  if (!data) return null;

  const assets = data.includes?.Asset ?? [];
  return data.items.map((entry) => transformEntry(entry, assets));
}

/** Fetch a single blog post by slug. Returns null if not found or unconfigured. */
export async function fetchPostBySlugFromCMS(
  slug: string
): Promise<BlogPost | null> {
  const data = await contentfulFetch<
    ContentfulCollection<ContentfulBlogPostEntry>
  >("/entries", {
    content_type: "blogPost",
    "fields.slug": slug,
    limit: "1",
    include: "2",
  });

  if (!data || data.items.length === 0) return null;

  const assets = data.includes?.Asset ?? [];
  return transformEntry(data.items[0], assets);
}
