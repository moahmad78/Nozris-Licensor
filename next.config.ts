import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security: Hide Next.js header
  compress: true, // Performance: Enable Gzip compression
  productionBrowserSourceMaps: false, // Security: Hide source code
  images: {
    formats: ['image/avif', 'image/webp'], // Performance: Modern formats
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
