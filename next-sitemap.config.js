/** @type {import('next-sitemap').IConfig} */

// ─── Static pages (non-blog) ───
const staticPages = [
  { loc: "/", changefreq: "weekly", priority: 1.0, lastmod: "2026-07-14T12:00:00-03:00" },
  { loc: "/sobre", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-05T12:00:00-03:00" },
  { loc: "/solucoes", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-05T12:00:00-03:00" },
  { loc: "/segmentos", changefreq: "monthly", priority: 0.7, lastmod: "2026-06-05T12:00:00-03:00" },
  { loc: "/casos", changefreq: "monthly", priority: 0.7, lastmod: "2026-06-05T12:00:00-03:00" },
  { loc: "/contato", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-05T12:00:00-03:00" },
  { loc: "/ferramentas", changefreq: "monthly", priority: 0.9, lastmod: "2026-10-02T12:00:00-03:00" },
  // Free tools — migrated from standalone *.vercel.app projects onto the site
  ...[
    "auditoria-site", "diagnostico-google", "simulador-convenios",
    "calculadora-precificacao", "diagnostico-clinica", "calculadora-agenda",
  ].map((slug) => ({ loc: `/ferramentas/${slug}`, changefreq: "monthly", priority: 0.8, lastmod: "2026-10-02T12:00:00-03:00" })),
  { loc: "/blog", changefreq: "daily", priority: 0.9, lastmod: "2026-07-14T12:00:00-03:00" },
  { loc: "/faq", changefreq: "monthly", priority: 0.6, lastmod: "2026-06-05T12:00:00-03:00" },
  // privacidade and termos are noindex — excluded from sitemap
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
  lastmod: "2026-06-05T12:00:00-03:00",
}));


module.exports = {
  siteUrl: "https://lkdigital.odo.br",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 5000,
  // Exclude everything from auto-discovery (we define all paths manually + dynamically)
  exclude: ["/**"],
  robotsTxtOptions: {
    additionalSitemaps: ["https://lkdigital.odo.br/sitemap-blog.xml"],
    policies: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/", "/raio-x/resultado", "/raio-x/privacidade", "/demo", "/unicornio", "/painel", "/ferramentas/auditoria-site/relatorio"] },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
    ],
  },
  // Blog posts live in the database and change without a deploy, so they get
  // their own live sitemap (src/app/sitemap-blog.xml/route.ts).
  additionalPaths: async () => {
    return [
      ...staticPages,
      { loc: "/cidades", changefreq: "monthly", priority: 0.7, lastmod: "2026-06-05T12:00:00-03:00" },
      ...cityPages,
    ];
  },
};
