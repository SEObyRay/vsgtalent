import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  port: 3001,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "levy-racing-backend.local", pathname: "/**" },
      { protocol: "https", hostname: "levy-racing-backend.local", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
      { protocol: "https", hostname: "wordpress-474222-5959679.cloudwaysapps.com", pathname: "/**" },
      { protocol: "https", hostname: "vsgtalent.nl", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  turbopack: {
    root: __dirname,
  },
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Belangrijke rewrite voor lokale ontwikkeling en productie
        // Deze heeft hogere prioriteit en wordt als eerste toegepast
        {
          source: "/wp-content/uploads/:path*",
          destination: "https://wordpress-474222-5959679.cloudwaysapps.com/wp-content/uploads/:path*",
          // Deze headers zorgen ervoor dat CORS problemen worden opgelost voor lokale ontwikkeling
          has: [
            {
              type: 'host',
              value: '(localhost|127\\.0\\.0\\.1)(:\\d+)?',
            },
          ],
        },
        // Extra rewrite voor directe Cloudways URLs omleiding in lokale ontwikkeling
        {
          source: "/cloudways-media/:path*",
          destination: "https://wordpress-474222-5959679.cloudwaysapps.com/wp-content/uploads/:path*",
        },
      ],
      afterFiles: [
        // Fallback rewrite als bovenstaande niet matchen
        {
          source: "/wp-content/uploads/:path*",
          destination: "https://wordpress-474222-5959679.cloudwaysapps.com/wp-content/uploads/:path*",
        },
      ],
    };
  },
  async headers() {
    return [
      // Default headers voor alle routes
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // CORS headers voor ontwikkeling met wp-content/uploads/*
      {
        source: "/wp-content/uploads/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
      // CORS headers voor cloudways-media proxy route
      {
        source: "/cloudways-media/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
