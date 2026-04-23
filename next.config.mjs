/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent trailing slash redirects — Google wastes crawl budget on /path/ → /path
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  async redirects() {
    return [
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
