/** @type {import('next-sitemap').IConfig} */
const fs = require("fs");
const path = require("path");

// ─── Auto-read blog posts from content/blog/*.json ───
function getEngineBlogPages() {
  const dir = path.join(__dirname, "content", "blog");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
        return {
          loc: `/blog/${data.slug}`,
          changefreq: "monthly",
          priority: 0.8,
          lastmod: data.dateModified || data.datePublished,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

// ─── Static pages (non-blog) ───
const staticPages = [
  { loc: "/", changefreq: "weekly", priority: 1.0, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/sobre", changefreq: "monthly", priority: 0.8, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/solucoes", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/segmentos", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/casos", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/contato", changefreq: "monthly", priority: 0.8, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/ferramentas", changefreq: "monthly", priority: 0.9, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/blog", changefreq: "daily", priority: 0.9, lastmod: new Date().toISOString() },
  { loc: "/faq", changefreq: "monthly", priority: 0.6, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/privacidade", changefreq: "yearly", priority: 0.3, lastmod: "2026-03-19T10:00:00-03:00" },
  { loc: "/termos", changefreq: "yearly", priority: 0.3, lastmod: "2026-04-07T12:00:00-03:00" },
];

// ─── Static blog posts (initial 6, before engine existed) ───
const staticBlogPosts = [
  { loc: "/blog/seo-local-dentistas-guia-completo", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-28T14:00:00-03:00" },
  { loc: "/blog/google-meu-negocio-dentista", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-25T10:00:00-03:00" },
  { loc: "/blog/google-ads-odontologia", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-22T10:00:00-03:00" },
  { loc: "/blog/marketing-implantodontia", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/blog/regras-cfo-publicidade", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-18T10:00:00-03:00" },
  { loc: "/blog/ia-busca-dentistas", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-18T10:00:00-03:00" },
];

// ─── City pages ───
const cityPages = [
  "sao-paulo", "rio-de-janeiro", "belo-horizonte", "brasilia", "curitiba",
  "porto-alegre", "salvador", "recife", "fortaleza", "campinas",
  "florianopolis", "goiania", "manaus", "belem", "vitoria",
].map((city) => ({
  loc: `/cidades/${city}`,
  changefreq: "monthly",
  priority: 0.7,
  lastmod: "2026-03-20T10:00:00-03:00",
}));

// ─── Translated pages ───
const translatedPages = [
  { loc: "/en", changefreq: "monthly", priority: 0.6, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/en/about", changefreq: "monthly", priority: 0.5, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/en/solutions", changefreq: "monthly", priority: 0.5, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/en/contact", changefreq: "monthly", priority: 0.5, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/en/tools", changefreq: "monthly", priority: 0.5, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/fr", changefreq: "monthly", priority: 0.6, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/fr/a-propos", changefreq: "monthly", priority: 0.5, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/fr/solutions", changefreq: "monthly", priority: 0.5, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/fr/contact", changefreq: "monthly", priority: 0.5, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/fr/outils", changefreq: "monthly", priority: 0.5, lastmod: "2026-04-08T12:00:00-03:00" },
];

module.exports = {
  siteUrl: "https://lkdigital.odo.br",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 5000,
  // Exclude everything from auto-discovery (we define all paths manually + dynamically)
  exclude: ["/**"],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
    ],
  },
  additionalPaths: async () => {
    // Auto-discover engine blog posts + merge with everything else
    const engineBlogPages = getEngineBlogPages();

    // Deduplicate: engine posts take precedence for lastmod accuracy
    const engineSlugs = new Set(engineBlogPages.map((p) => p.loc));
    const dedupedStaticBlog = staticBlogPosts.filter((p) => !engineSlugs.has(p.loc));

    return [
      ...staticPages,
      ...dedupedStaticBlog,
      ...engineBlogPages,
      { loc: "/cidades", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
      ...cityPages,
      ...translatedPages,
    ];
  },
};
