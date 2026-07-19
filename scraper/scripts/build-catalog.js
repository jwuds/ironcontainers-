// Transforms the raw scraper output (output/*.json) into a curated catalog
// for the site: products get slugs + a mapped top-level "group", and the
// 50+ raw (often duplicate/SEO-variant) categories collapse into 8 clean
// groups per the Container One Depot taxonomy.
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '..', 'output');
const SOURCES = ['products.json', 'containerone-products.json'];
const OUT_DIR = path.resolve(__dirname, '..', '..', 'src', 'data');
const OVERRIDES_PATH = path.resolve(__dirname, '..', 'content-overrides.json');

// Hand-curated SEO copy, keyed by slug. Slugs are deterministic (derived
// from the cleaned scraped title, sorted alphabetically) so this survives
// re-running the scraper as long as source titles don't change. Only
// shortDescription/description are overridable here — title and slug stay
// scraper-derived so URLs never move. See scraper/content-overrides.json
// and scraper/README.md for how to add/update entries.
function loadOverrides() {
  if (!fs.existsSync(OVERRIDES_PATH)) return {};
  return JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'));
}

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

  // DNV-certified offshore units get their own category regardless of
  // dry/refrigerated status — see the exclusive override in mapGroups().
  'DNV Offshore Containers': 'offshore-certified',

  // Attachable refrigeration equipment (Thermo King / Carrier) and their
  // undermount gensets live together — they're cross-sell items on
  // Refrigerated Container pages, not a standalone destination category.
  'Thermo King Refrigeration Units': 'refrigeration-gensets',
  'Carrier Trailer Refrigeration Units for Sale': 'refrigeration-gensets',
  'Carrier Trailer Refrigeration Units': 'refrigeration-gensets',
  'T-Series: Self-powered Truck Refrigeration Unit': 'refrigeration-gensets',
  'Multi-Temp Trailer Refrigeration Units': 'refrigeration-gensets',
  'Carrier Supra Truck Refrigeration Units': 'refrigeration-gensets',
  'Clip on generator for Refrigerated Units': 'refrigeration-gensets',
  'Carrier Undermount Genset': 'refrigeration-gensets',
  'Carrier Undermount Genset For Sale Online': 'refrigeration-gensets',
  'Undermount Gensets For Sale': 'refrigeration-gensets',
  'Undermount Gensets For Sale Online with Delivery': 'refrigeration-gensets',
  'Thermo King Undermount Gensets for Sale': 'refrigeration-gensets',
  GENSET: 'refrigeration-gensets',

  // Standalone CAT generators only — CAT Material Handlers (heavy
  // equipment, not a power unit) shares no other category with these and
  // is caught by the "Cat Equipment Sets" -> accessories-parts line below.
  'CAT ELECTRIC POWER SYSTEMS': 'generators-power',
  'CAT Product Line - CAT Products For Sale': 'generators-power',

  'Buy Propane Gas Tank Online - Propane Tanks For Sale': 'tanks',
  'NH3 Tanks': 'tanks',

  '(LPG) Transport Trailer': 'trailers-chassis',
  'Refrigerated Trailers For Sale': 'trailers-chassis',
  'Container Chassis For Sale': 'trailers-chassis',

  'Accessories and Parts': 'accessories-parts',
  'Cat Equipment Sets': 'accessories-parts',

  // containerone (Shopify) product_type / tags
  Container: 'shipping-containers',
  'Custom Container': 'shipping-containers',
  Accessories: 'accessories-parts',
  'Refrigerated Shipping Container': 'refrigerated-containers',
};

// Categories where a match should *replace* all other group assignments
// rather than add to them — DNV/offshore units need their own distinct
// sales motion (Contact a Specialist, cert docs) instead of also showing
// up as regular Shipping/Refrigerated Container listings.
const EXCLUSIVE_CATEGORIES = {
  'DNV Offshore Containers': 'offshore-certified',
};

// Dropped entirely from nav/grouping — junk or genuinely one-off listings,
// or (for the containerone tags) descriptive facets whose product already
// gets its real group from product_type above.
const DROPPED_CATEGORIES = new Set([
  'c',
  'Container homes',
  'Container pool',
  'Chemical Applicators',
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
    blurb: 'Standard, high cube, and specialty dry containers — new and used.',
  },
  {
    slug: 'refrigerated-containers',
    name: 'Refrigerated Containers',
    blurb: 'Reefer containers for cold-chain storage and transport.',
  },
  {
    slug: 'offshore-certified',
    name: 'Offshore & Certified Containers',
    blurb: 'DNV 2.7-1 certified dry, half-height, open-top, and refrigerated units.',
  },
  {
    slug: 'refrigeration-gensets',
    name: 'Refrigeration Units & Gensets',
    blurb: 'Thermo King and Carrier refrigeration units and undermount gensets.',
  },
  {
    slug: 'generators-power',
    name: 'Generators & Power Systems',
    blurb: 'Standalone CAT electric power systems.',
  },
  {
    slug: 'tanks',
    name: 'Tanks',
    blurb: 'Propane and NH3 storage tanks.',
  },
  {
    slug: 'trailers-chassis',
    name: 'Trailers & Chassis',
    blurb: 'LPG transport trailers, refrigerated trailers, and container chassis.',
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
  for (const c of categories) {
    if (EXCLUSIVE_CATEGORIES[c]) return [EXCLUSIVE_CATEGORIES[c]];
  }
  const groups = new Set();
  for (const c of categories) {
    if (DROPPED_CATEGORIES.has(c)) continue;
    groups.add(CATEGORY_TO_GROUP[c] || 'accessories-parts');
  }
  return [...groups];
}

// Strips scraped-marketplace SEO filler ("Buy X Online Best... For Sale")
// down to a clean, readable title. Deliberately conservative — it only
// removes generic marketing words, never size/grade/condition qualifiers,
// so it can't accidentally merge two genuinely different products.
const FILLER_PATTERNS = [
  /^buy\s+/i,
  /\bonline\b/gi,
  /\bfor sale\b/gi,
  /\bbest\b/gi,
  /\bwith delivery\b/gi,
  /\bin stock\b/gi,
];

function cleanTitle(title) {
  let t = title || '';
  for (const re of FILLER_PATTERNS) t = t.replace(re, ' ');
  t = t.replace(/\s{2,}/g, ' ').replace(/\s+([.,])/g, '$1').trim();
  t = t.replace(/[.,]+$/g, '').trim();
  return t || title;
}

function normalizeTitle(title) {
  return cleanTitle(title).replace(/\s+/g, ' ').toLowerCase();
}

// The source sites republish the same listing under multiple SEO-stuffed
// title variants (WordPress slug suffixes, or plain copy-paste variants
// like "Best ASME New" vs "For Sale Online Best ASME New"). Once filler
// words are stripped, same-product variants collapse to the same key.
// Collapse each group down to the single best-populated listing.
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

// One source site never exposes a static price on its product pages, so
// every listing scraped from it has no regularPrice — 27 incomplete
// shipping-container stubs with no pricing signal at all. Drop them
// rather than show blank/quote-only cards. (Source identity lives in
// scraper/config.json, which is intentionally not committed.)
function isIncompleteSourceListing(p) {
  return p.siteName === 'conexdepot' && !p.regularPrice;
}

// Some source listings have a warehouse-location tag ("Graham_TX",
// "Atlanta_GA") sitting in the scraped sku field instead of a real SKU —
// a source-side data-entry mixup, not a product code. Never show it as if
// it were a SKU.
function isLocationCodeNotSku(sku) {
  return /^[A-Za-z]+_[A-Z]{2}$/.test(sku);
}

function main() {
  const scraped = loadSources().filter((p) => !isIncompleteSourceListing(p));
  const raw = dedupeByTitle(scraped);
  const droppedDupes = scraped.length - raw.length;

  // Sort alphabetically up front so slug suffixes (and the default catalog
  // order) are stable and deterministic across rebuilds.
  raw.sort((a, b) => a.title.localeCompare(b.title));

  const overrides = loadOverrides();
  let overrideCount = 0;

  const slugCounts = new Map();
  const products = raw.map((p, idx) => {
    const title = cleanTitle(p.title);
    let base = slugify(title) || `product-${idx}`;
    const count = slugCounts.get(base) || 0;
    slugCounts.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${count}`;

    const override = overrides[slug];
    if (override) overrideCount++;

    return {
      slug,
      title,
      sku: p.sku && p.sku !== 'N/A' && !isLocationCodeNotSku(p.sku) ? p.sku : null,
      type: p.type,
      regularPrice: p.regularPrice || null,
      salePrice: p.salePrice || null,
      shortDescription: override?.shortDescription ?? p.shortDescription,
      description: override?.description ?? p.description,
      specs: Object.entries(p.specs || {}),
      images: p.images || [],
      rawCategories: p.categories || [],
      groups: mapGroups(p.categories || []),
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
  console.log(`Applied ${overrideCount}/${Object.keys(overrides).length} curated content overrides`);
  console.log(`Wrote ${products.length} products across ${groups.length} groups to ${OUT_DIR}`);
  for (const g of groups) console.log(`  ${g.name}: ${g.count}`);
}

main();
