// Transforms the raw scraper output (output/products.json) into a curated
// catalog for the site: products get slugs + a mapped top-level "group",
// and 7 clean groups replace the 36 raw (often duplicate/SEO-variant) categories.
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '..', 'output');
const SOURCES = ['products.json', 'containerone-products.json'];
const OUT_DIR = path.resolve(__dirname, '..', '..', 'src', 'data');

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

  // containerone (Shopify) product_type / tags
  Container: 'shipping-containers',
  'Custom Container': 'modified-containers',
  Accessories: 'accessories-parts',
  'Refrigerated Shipping Container': 'refrigerated-containers',
};

// Dropped entirely from nav/grouping — junk or genuinely one-off listings.
const DROPPED_CATEGORIES = new Set([
  'c',
  'Container homes',
  'Container pool',
  'Chemical Applicators',
  // containerone tags that are just descriptive facets, not categories —
  // the product's real group already comes from product_type above.
  '1 Trip',
  '20ft Shipping Container',
  '40FT Shipping Container',
  'Multi-Trip',
  'Wind & Water Tight',
  'Cargo Worthy',
  'Economy Grade',
  'Modified Shipping Container',
  'Shipping Container Office',
  'Accessory Kit',
]);

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
    slug: 'modified-containers',
    name: 'Modified & Custom Containers',
    blurb: 'Mobile offices, cabins, and other custom-built container conversions.',
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

function normalizeTitle(title) {
  return (title || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

// The source site republishes the same listing under a fresh URL/slug
// multiple times (WordPress appends -2, -3, ... to dedupe the post slug).
// Same title, same photos, near-identical description — just noise for
// browsing. Collapse each group down to the single best-populated listing.
function dedupeByTitle(raw) {
  const groups = new Map();
  for (const p of raw) {
    const key = normalizeTitle(p.title);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }

  const score = (p) =>
    (p.regularPrice ? 1000 : 0) +
    (p.images?.length || 0) * 10 +
    (p.description?.length || 0) / 1000;

  const deduped = [];
  for (const entries of groups.values()) {
    if (entries.length === 1) {
      deduped.push(entries[0]);
      continue;
    }
    let best = entries[0];
    for (const p of entries.slice(1)) {
      if (score(p) > score(best)) best = p;
    }
    deduped.push(best);
  }
  return deduped;
}

function loadSources() {
  const scraped = [];
  for (const file of SOURCES) {
    const p = path.join(OUTPUT_DIR, file);
    if (!fs.existsSync(p)) continue;
    scraped.push(...JSON.parse(fs.readFileSync(p, 'utf8')));
  }
  return scraped;
}

function main() {
  const scraped = loadSources();
  const raw = dedupeByTitle(scraped);
  const droppedDupes = scraped.length - raw.length;

  // Sort alphabetically up front so slug suffixes (and the default catalog
  // order) are stable and deterministic across rebuilds.
  raw.sort((a, b) => a.title.localeCompare(b.title));

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

  console.log(`Dropped ${droppedDupes} duplicate listings (${scraped.length} scraped -> ${products.length} unique)`);
  console.log(`Wrote ${products.length} products across ${groups.length} groups to ${OUT_DIR}`);
  for (const g of groups) console.log(`  ${g.name}: ${g.count}`);
}

main();
