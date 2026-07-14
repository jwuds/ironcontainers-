import type { NextConfig } from "next";
import path from "path";

// Retired product slugs -> surviving slug, for products removed as
// duplicates during catalog cleanup. Served as 301s so old links/search
// results don't 404.
const retiredProductSlugs: Record<string, string> = {
  "thermo-king-sg-3000-clip-on-gensets-1": "thermo-king-sg-3000-clip-on-gensets",
};

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
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
