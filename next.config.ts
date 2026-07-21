import type { NextConfig } from "next";
import path from "path";
import { retiredProductSlugs } from "./src/lib/retired-slugs";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Product photography is now self-hosted under /public/images (migrated
  // off the third-party hosts that used to trigger Vercel's per-request
  // re-encoding quota). Same-origin images are optimized once and cached
  // by Vercel's edge, not re-billed per request, so the optimizer is safe
  // to re-enable here.
  async redirects() {
    return Object.entries(retiredProductSlugs).map(([from, to]) => ({
      source: `/product/${from}`,
      destination: `/product/${to}`,
      permanent: true,
    }));
  },
  // CSP without nonces, on purpose. A nonce-based CSP is stricter but
  // requires every page to render dynamically per-request (no static
  // generation, no ISR, no CDN caching — see the Next.js CSP guide) —
  // that would undo the static-rendering work on the category/product/
  // home pages and directly regress the site's weakest audit category
  // (Performance). Everything here is already self-hosted (fonts via
  // next/font, images under /public, no third-party scripts/analytics),
  // so 'self' + 'unsafe-inline' still meaningfully restricts fetch/embed/
  // frame/object targets without sacrificing caching. Revisit nonces only
  // if a future third-party script requirement forces the trade-off.
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data:;
      font-src 'self';
      connect-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim();

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: cspHeader },
        ],
      },
    ];
  },
};

export default nextConfig;
