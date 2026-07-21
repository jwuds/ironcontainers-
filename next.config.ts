import type { NextConfig } from "next";
import path from "path";
import { retiredProductSlugs } from "./src/lib/retired-slugs";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Product photography is hosted on Supabase Storage and pre-compressed
  // to web-sized WebP at upload time (see scraper/scripts/migrate-images-
  // to-supabase.js and download-images.js). Vercel's Image Optimization
  // has a monthly source-image quota that this catalog exceeds regardless
  // of whether images are same-origin or remote — hitting it makes
  // /_next/image return 402 and product photos render as broken. Since
  // images already arrive at the right size/format, the optimizer would
  // only add quota risk with no benefit, so it's disabled entirely.
  images: {
    unoptimized: true,
  },
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
  // (Performance). Everything here is self-hosted or served from Supabase
  // Storage (fonts via next/font, product images from *.supabase.co, no
  // third-party scripts/analytics), so 'self' + 'unsafe-inline' plus the
  // Supabase img-src still meaningfully restricts fetch/embed/frame/object
  // targets without sacrificing caching. Revisit nonces only if a future
  // third-party script requirement forces the trade-off.
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://yeoccarjwixvenjwnrtq.supabase.co;
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
