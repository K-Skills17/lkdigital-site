// GET /sitemap-blog.xml — live sitemap of published blog posts (listed in
// robots.txt next to the static sitemap). Posts change without a deploy, so
// this is generated from the database on request and cached by the CDN for 5
// minutes. (revalidatePath doesn't reliably purge route handlers in Next 14.)

import { publishedSlugs } from "@/lib/blog/store";

export const dynamic = "force-dynamic";

const BASE = "https://lkdigital.odo.br";

export async function GET() {
  const posts = await publishedSlugs();
  const urls = posts
    .map(
      (p) =>
        `<url><loc>${BASE}/blog/${p.slug}</loc><lastmod>${p.updatedAt}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
