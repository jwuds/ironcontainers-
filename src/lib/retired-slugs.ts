// Retired product slugs -> surviving slug, for products removed as
// duplicates during catalog cleanup. Consumed by next.config.ts (to serve
// 301s so old links/search results don't 404) and src/app/sitemap.ts (to
// exclude retired slugs that are still present in products.json but would
// otherwise be listed alongside their own redirect).
export const retiredProductSlugs: Record<string, string> = {
  "thermo-king-sg-3000-clip-on-gensets-1": "thermo-king-sg-3000-clip-on-gensets",
  "10ft-refrigerated-containers-10ft-freezer": "10ft-refrigerated-container-10ft-freezer",
  "30000-gallon-skid-tanks-asme-storage-tanks-on-skids": "30000-gallon-propane-tanks-asme-storage-skids-tanks",
  "carrier-clip-on-genset": "carrier-clip-on-generator-set",
  "20ft-flat-rack-shipping-containers-20ft": "20ft-flat-rack-container-20ft",
};
