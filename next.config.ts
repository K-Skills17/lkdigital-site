import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  images: {
    remotePatterns: [
      // Contentful CDN — for all CMS-managed images
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.eu.ctfassets.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.us.ctfassets.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
