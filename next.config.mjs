/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent trailing slash redirects — Google wastes crawl budget on /path/ → /path
  trailingSlash: false,
  experimental: {
    // Read at runtime, so they must be bundled with the serverless functions:
    // db/seed/blog-posts.json (first-use import + fallback) and db/schema.sql
    // (the "Criar tabelas" button in /painel/blog).
    outputFileTracingIncludes: {
      "/**/*": ["./db/seed/**/*", "./db/schema.sql"],
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  async redirects() {
    return [
      // RAIO-X alias — /diagnostico → /raio-x
      {
        source: "/diagnostico",
        destination: "/raio-x",
        permanent: false,
      },
      // Retired funnels and tools, replaced by the lead magnets (docs/lead-magnets-integration.md)
      { source: "/unicornio", destination: "/raio-x", permanent: true },
      { source: "/raio-x/resultado", destination: "/raio-x", permanent: true },
      { source: "/raio-x/privacidade", destination: "/privacidade", permanent: true },
      { source: "/ferramentas/diagnostico-google", destination: "/ferramentas/checklist-google", permanent: true },
      { source: "/ferramentas/diagnostico-clinica", destination: "/raio-x", permanent: true },
      // Legacy /insights → /blog redirects
      {
        source: "/insights",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/insights/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Serve favicon.ico from icon.svg (prevents 404 — Google requests this on every crawl)
      { source: "/favicon.ico", destination: "/icon.svg" },
      // Apple touch icon variants — all serve the same icon
      { source: "/apple-touch-icon.png", destination: "/icon.svg" },
      { source: "/apple-touch-icon-precomposed.png", destination: "/icon.svg" },
      { source: "/apple-touch-icon-120x120.png", destination: "/icon.svg" },
      { source: "/apple-touch-icon-152x152.png", destination: "/icon.svg" },
    ];
  },
};

export default nextConfig;
