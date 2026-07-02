// Transforms the raw scraper output (output/products.json) into a curated
// catalog for the site: products get slugs + a mapped top-level "group",
// and 7 clean groups replace the 36 raw (often duplicate/SEO-variant) categories.
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'output', 'products.json');
const OUT_DIR = path.resolve(__dirname, '..', 'site', 'src', 'data');

// Raw scraped category name -> group slug. Anything not listed here falls
// into "accessories-parts" as a catch-all, except the junk/one-off ones
// explicitly dropped below.
const CATEGORY_TO_GROUP = {
  'Standard Shipping Containers': 'shipping-containers',
  '10 Foot Shipping Containers': 'shipping-containers',
  '20 foot shipping containers': 'shipping-containers',
  'New Containers': 'shipping-containers',
  'Used Containers': 'shipping-containers',
  'High Cube Shipping Containers': 'shipping-containers',
  'Insulated & Refrigerated Shipping Container For Sale Online': 'shipping-containers',
  'Flat Rack Containers': 'shipping-containers',

  'Buy Refrigerated Shipping Containers Online': 'refrigerated-containers',

  'Thermo King Refrigeration Units': 'refrigeration-units',
  'Carrier Trailer Refrigeration Units for Sale': 'refrigeration-units',
  'Carrier Trailer Refrigeration Units': 'refrigeration-units',
  'T-Series: Self-powered Truck Refrigeration Unit': 'refrigeration-units',
  'Multi-Temp Trailer Refrigeration Units': 'refrigeration-units',
  'Carrier Supra Truck Refrigeration Units': 'refrigeration-units',
  'Clip on generator for Refrigerated Units': 'refrigeration-units',

  'Carrier Undermount Genset': 'gensets-power',
  'Carrier Undermount Genset For Sale Online': 'gensets-power',
  'Undermount Gensets For Sale': 'gensets-power',
  'Undermount Gensets For Sale Online with Delivery': 'gensets-power',
  'Thermo King Undermount Gensets for Sale': 'gensets-power',
  'CAT ELECTRIC POWER SYSTEMS': 'gensets-power',
  'CAT Product Line - CAT Products For Sale': 'gensets-power',
  'Cat Equipment Sets': 'gensets-power',
  GENSET: 'gensets-power',

  'Buy Propane Gas Tank Online - Propane Tanks For Sale': 'tanks',
  'NH3 Tanks': 'tanks',

  '(LPG) Transport Trailer': 'trailers-chassis',
  'Refrigerated Trailers For Sale': 'trailers-chassis',
  'Container Chassis For Sale': 'trailers-chassis',
  'DNV Offshore Containers': 'trailers-chassis',

  'Accessories and Parts': 'accessories-parts',
};

// Dropped entirely from nav/grouping — junk or genuinely one-off listings.
const DROPPED_CATEGORIES = new Set(['c', 'Container homes', 'Container pool', 'Chemical Applicators']);

const GROUPS = [
  {
    slug: 'shipping-containers',
    name: 'Shipping Containers',
    blurb: 'Standard, high cube, and specialty containers — new and used.',
  },
  {
    slug: 'refrigerated-containers',
    name: 'Refrigerated Containers',
    blurb: 'Reefer containers for cold-chain storage and transport.',
  },
  {
    slug: 'refrigeration-units',
    name: 'Refrigeration Units',
    blurb: 'Thermo King and Carrier trailer/truck refrigeration units.',
  },
  {
    slug: 'gensets-power',
    name: 'Gensets & Power Systems',
    blurb: 'Undermount gensets and CAT electric power systems.',
  },
  {
    slug: 'tanks',
    name: 'Tanks',
    blurb: 'Propane and NH3 storage tanks.',
  },
  {
    slug: 'trailers-chassis',
    name: 'Trailers & Chassis',
    blurb: 'LPG transport trailers, refrigerated trailers, chassis, and offshore containers.',
  },
  {
    slug: 'accessories-parts',
    name: 'Accessories & Parts',
    blurb: 'Parts and accessories for containers and equipment.',
  },
];

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function mapGroups(categories) {
  const groups = new Set();
  for (const c of categories) {
    if (DROPPED_CATEGORIES.has(c)) continue;
    groups.add(CATEGORY_TO_GROUP[c] || 'accessories-parts');
  }
  return [...groups];
}

function main() {
  const raw = JSON.parse(fs.readFileSync(SRC, 'utf8'));

  const slugCounts = new Map();
  const products = raw.map((p, idx) => {
    let base = slugify(p.title) || `product-${idx}`;
    const count = slugCounts.get(base) || 0;
    slugCounts.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${count}`;

    return {
      slug,
      title: p.title,
      sku: p.sku && p.sku !== 'N/A' ? p.sku : null,
      type: p.type,
      regularPrice: p.regularPrice || null,
      salePrice: p.salePrice || null,
      shortDescription: p.shortDescription,
      description: p.description,
      specs: Object.entries(p.specs || {}),
      images: p.images || [],
      rawCategories: p.categories || [],
      groups: mapGroups(p.categories || []),
      sourceUrl: p.url,
      siteName: p.siteName,
    };
  });

  const groupCounts = {};
  for (const p of products) for (const g of p.groups) groupCounts[g] = (groupCounts[g] || 0) + 1;

  const groups = GROUPS.map((g) => ({
    ...g,
    count: groupCounts[g.slug] || 0,
    heroImage: products.find((p) => p.groups.includes(g.slug) && p.images.length > 0)?.images[0] || null,
  }));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'products.json'), JSON.stringify(products));
  fs.writeFileSync(path.join(OUT_DIR, 'groups.json'), JSON.stringify(groups, null, 2));

  console.log(`Wrote ${products.length} products across ${groups.length} groups to ${OUT_DIR}`);
  for (const g of groups) console.log(`  ${g.name}: ${g.count}`);
}

main();
