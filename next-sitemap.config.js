/** @type {import('next-sitemap').IConfig} */

// ─── Blog post dates for accurate lastmod ───
const blogPostDates = {
  "/blog/seo-local-dentistas-guia-completo": "2026-03-28T14:00:00-03:00",
  "/blog/google-meu-negocio-dentista": "2026-03-25T10:00:00-03:00",
  "/blog/google-ads-odontologia": "2026-03-22T10:00:00-03:00",
  "/blog/marketing-implantodontia": "2026-03-20T10:00:00-03:00",
  "/blog/regras-cfo-publicidade": "2026-03-18T10:00:00-03:00",
  "/blog/ia-busca-dentistas": "2026-03-18T10:00:00-03:00",
};

// ─── All site pages with their lastmod dates ───
const allPages = [
  { loc: "/", changefreq: "weekly", priority: 1.0, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/sobre", changefreq: "monthly", priority: 0.8, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/solucoes", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/segmentos", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/casos", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/contato", changefreq: "monthly", priority: 0.8, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/ferramentas", changefreq: "monthly", priority: 0.9, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/blog", changefreq: "daily", priority: 0.9, lastmod: "2026-04-08T12:00:00-03:00" },
  { loc: "/faq", changefreq: "monthly", priority: 0.6, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/privacidade", changefreq: "yearly", priority: 0.3, lastmod: "2026-03-19T10:00:00-03:00" },
  { loc: "/termos", changefreq: "yearly", priority: 0.3, lastmod: "2026-04-07T12:00:00-03:00" },
  // Blog posts (static 6)
  { loc: "/blog/seo-local-dentistas-guia-completo", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-28T14:00:00-03:00" },
  { loc: "/blog/google-meu-negocio-dentista", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-25T10:00:00-03:00" },
  { loc: "/blog/google-ads-odontologia", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-22T10:00:00-03:00" },
  { loc: "/blog/marketing-implantodontia", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/blog/regras-cfo-publicidade", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-18T10:00:00-03:00" },
  { loc: "/blog/ia-busca-dentistas", changefreq: "monthly", priority: 0.8, lastmod: "2026-03-18T10:00:00-03:00" },
  // City pages
  { loc: "/cidades", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/sao-paulo", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/rio-de-janeiro", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/belo-horizonte", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/brasilia", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/curitiba", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/porto-alegre", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/salvador", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/recife", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/fortaleza", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/campinas", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/florianopolis", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/goiania", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/manaus", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/belem", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  { loc: "/cidades/vitoria", changefreq: "monthly", priority: 0.7, lastmod: "2026-03-20T10:00:00-03:00" },
  // Translated pages
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
  // Exclude everything from auto-discovery (we define all paths manually)
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
  // Manually specify all paths since App Router dynamic pages aren't auto-discovered
  additionalPaths: async () => {
    return allPages;
  },
};
