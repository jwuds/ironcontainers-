import type { NextConfig } from "next";
import path from "path";

// Retired product slugs -> surviving slug, for products removed as
// duplicates during catalog cleanup. Served as 301s so old links/search
// results don't 404.
const retiredProductSlugs: Record<string, string> = {
  "thermo-king-sg-3000-clip-on-gensets-1": "thermo-king-sg-3000-clip-on-gensets",
  "10ft-refrigerated-containers-10ft-freezer": "10ft-refrigerated-container-10ft-freezer",
  "30000-gallon-skid-tanks-asme-storage-tanks-on-skids": "30000-gallon-propane-tanks-asme-storage-skids-tanks",
  "carrier-clip-on-genset": "carrier-clip-on-generator-set",
  "20ft-flat-rack-shipping-containers-20ft": "20ft-flat-rack-container-20ft",
};

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "conexdepotshipping.com" },
    ],
    // All product photography is hotlinked from the two hosts above rather
    // than self-hosted, so Vercel's optimizer was re-encoding every one of
    // them on every request and blew through the plan's image-optimization
    // quota (requests started 402ing site-wide). Serve them as-is until
    // the images are migrated to self-hosted/pre-optimized storage.
    unoptimized: true,
  },
  async redirects() {
    return Object.entries(retiredProductSlugs).map(([from, to]) => ({
      source: `/product/${from}`,
      destination: `/product/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
