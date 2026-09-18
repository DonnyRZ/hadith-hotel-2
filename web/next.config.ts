import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    // Serve the default locale ([locale]=en) without a middleware rewrite.
    // Next 16.2+ leaks next-intl's "/" → "/en" rewrite as `307 Location: /`.
    return [
      { source: "/", destination: "/en" },
      {
        source: "/:path((?!id|ru|uz|en|api|_next|_vercel).*)",
        destination: "/en/:path",
      },
    ];
  },
  images: {
    // Cache-bust via ?v= on public URLs (SiteImage uses unoptimized for local paths).
    minimumCacheTTL: 60,
    localPatterns: [
      { pathname: "/images/**", search: "" },
      { pathname: "/images/**", search: "?v=*" },
      { pathname: "/videos/**", search: "" },
      { pathname: "/videos/**", search: "?v=*" },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
