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

// ─── Static page dates (last meaningful content update) ───
const pageDates = {
  "/": "2026-04-07T12:00:00-03:00",
  "/sobre": "2026-03-20T10:00:00-03:00",
  "/solucoes": "2026-03-20T10:00:00-03:00",
  "/segmentos": "2026-03-20T10:00:00-03:00",
  "/casos": "2026-03-20T10:00:00-03:00",
  "/contato": "2026-04-07T12:00:00-03:00",
  "/faq": "2026-03-20T10:00:00-03:00",
  "/ferramentas": "2026-04-07T12:00:00-03:00",
  "/blog": "2026-04-07T12:00:00-03:00",
  "/privacidade": "2026-03-19T10:00:00-03:00",
  "/termos": "2026-04-07T12:00:00-03:00",
};

module.exports = {
  siteUrl: "https://lkdigital.odo.br",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  // Exclude non-page files from sitemap
  exclude: [
    "/apple-icon.png",
    "/icon.svg",
    "/favicon.ico",
    "/_next/*",
    "/api/*",
  ],
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
  transform: async (config, path) => {
    // Skip non-page assets
    if (path.match(/\.(png|svg|ico|jpg|jpeg|gif|webp|xml|json|txt)$/)) {
      return null;
    }

    // Homepage — highest priority
    if (path === "/") {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 1.0,
        lastmod: pageDates["/"],
      };
    }

    // Ferramentas — high priority landing page
    if (path === "/ferramentas") {
      return {
        loc: path,
        changefreq: "monthly",
        priority: 0.9,
        lastmod: pageDates["/ferramentas"],
      };
    }

    // Blog listing
    if (path === "/blog") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.9,
        lastmod: pageDates["/blog"],
      };
    }

    // Blog posts — use actual dateModified
    if (path.startsWith("/blog/")) {
      return {
        loc: path,
        changefreq: "monthly",
        priority: 0.8,
        lastmod: blogPostDates[path] || new Date().toISOString(),
      };
    }

    // City pages
    if (path.startsWith("/cidades")) {
      return {
        loc: path,
        changefreq: "monthly",
        priority: 0.7,
        lastmod: "2026-03-20T10:00:00-03:00",
      };
    }

    // Other pages — use known dates or fallback
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: pageDates[path] || "2026-03-20T10:00:00-03:00",
    };
  },
};
