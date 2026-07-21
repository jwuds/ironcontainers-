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
    intro:
      "Standard shipping containers come in three common sizes — 20ft, 40ft, and 40ft high cube — and cover most storage, conversion, and shipping needs. A 40ft high cube adds roughly a foot of interior height over a standard 40ft box, which matters for tall equipment storage or container-home conversions where headroom is tight. Condition and grade vary more than size: a New/One-Trip unit looks close to factory-fresh, while Cargo Worthy units are inspected and certified to ship freight again, and Wind & Water Tight units trade cosmetic wear for a lower price on units that just need to keep contents dry. See our container grades guide below for the full breakdown of what each grade means before you buy. Whether you need a jobsite storage box, a permanent structure, or a container ready to move freight, filtering by sub-category on this page narrows the list to the configuration that fits.",
  },
  {
    slug: 'refrigerated-containers',
    name: 'Refrigerated Containers',
    blurb: 'Reefer containers for cold-chain storage and transport.',
    intro:
      "Refrigerated containers (reefers) pair an insulated steel box with a self-contained refrigeration unit — typically Thermo King or Carrier — capable of holding a set temperature range independent of the weather outside. Mount type is the main configuration choice: clip-on units bolt to the outside of the container and are easier to access for service, while undermount units sit beneath the floor and free up a few extra inches of interior length. Reefers are a common fit for farm and produce cold storage, pharmaceutical and other precision cold-chain applications (which should confirm calibration and temperature-logging capability before relying on a unit for regulated storage), and any operation that needs mobile or semi-permanent temperature-controlled space. Our reefer buying guide below covers what to check on a unit's maintenance history before you commit to one.",
  },
  {
    slug: 'offshore-certified',
    name: 'Offshore & Certified Containers',
    blurb: 'DNV 2.7-1 certified dry, half-height, open-top, and refrigerated units.',
    intro:
      "DNV 2.7-1 is the offshore container certification standard used across the oil, gas, and marine industry for units that will be lifted by crane, transported by vessel, or used on an offshore platform — it covers structural testing well beyond what a standard ISO shipping container is built or certified for. Containers in this category carry that certification across several configurations: standard dry units, half-height units for heavier, denser cargo, open-top units for oversized loads, and refrigerated units for offshore cold storage. If a project requires DNV-certified equipment for regulatory or insurance reasons, confirming the specific certification documentation and inspection date on the unit you're buying is worth doing before reservation, not after.",
  },
  {
    slug: 'refrigeration-gensets',
    name: 'Refrigeration Units & Gensets',
    blurb: 'Thermo King and Carrier refrigeration units and undermount gensets.',
    intro:
      "This category covers the refrigeration hardware itself — Thermo King and Carrier clip-on and undermount units — separate from the insulated containers they attach to. It's the place to look if a reefer container's onboard refrigeration unit needs replacing rather than replacing the whole container, or if you're building out a custom cold-storage setup and sourcing the refrigeration unit and container separately. Clip-on units are the easier swap since they bolt to the outside and don't require floor work; undermount units take more installation effort but preserve interior container length. Check compatibility (mount type, container size, power requirements) against your existing setup before ordering a replacement unit.",
  },
  {
    slug: 'generators-power',
    name: 'Generators & Power Systems',
    blurb: 'Standalone CAT electric power systems.',
    intro:
      "Standalone CAT generators and power systems in this category are built for continuous or standby electric power rather than being tied to a specific refrigeration unit — common uses include backup power for a facility, primary power at a remote site with no grid connection, and temporary power for construction or event sites. Sizing a generator correctly for your actual load (not just nameplate capacity) is the main decision point; if you're not sure what capacity your application needs, our team can help you think through it before you reserve a unit.",
  },
  {
    slug: 'tanks',
    name: 'Tanks',
    blurb: 'Propane and NH3 storage tanks.',
    intro:
      "Propane and NH3 (anhydrous ammonia) storage tanks in this category are typically ASME-certified — the American Society of Mechanical Engineers standard that governs pressure vessel design and testing for tanks like these. Configurations include above-ground and underground propane tanks in a range of capacities, and NH3 tanks sized for agricultural fertilizer applications. Above-ground tanks are simpler to install and inspect; underground tanks free up surface space but require excavation and typically a riser for access. Confirm local code and fire-marshal setback requirements for your installation site before choosing between above-ground and underground, since those rules vary by jurisdiction and aren't something we can advise on directly.",
  },
  {
    slug: 'trailers-chassis',
    name: 'Trailers & Chassis',
    blurb: 'LPG transport trailers, refrigerated trailers, and container chassis.',
    intro:
      "This category covers the equipment that moves containers and bulk product rather than storing it: LPG transport trailers built to move propane and similar gases over the road, refrigerated trailers for mobile cold-chain transport, and container chassis for hauling shipping containers by truck. Chassis compatibility depends on container size and corner-casting type, so confirm your container's dimensions match the chassis you're pairing it with before ordering both together.",
  },
  {
    slug: 'accessories-parts',
    name: 'Accessories & Parts',
    blurb: 'Parts and accessories for containers and equipment.',
    intro:
      "Accessories and parts round out a container or equipment purchase without requiring a whole new unit: lock boxes and security hardware, roll-up door framing kits, vents, window and shutter kits, and other components sized for standard container and equipment configurations. If you're not sure whether a part fits your specific unit, check the spec listing on the part's product page or ask before ordering — fitment varies enough across container generations that a general-purpose part isn't always a drop-in fit.",
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
// "Atlanta_GA", or multi-word cities like "Los_Angeles_CA") sitting in the
// scraped sku field instead of a real SKU — a source-side data-entry
// mixup, not a product code. Never show it as if it were a SKU.
function isLocationCodeNotSku(sku) {
  return /^[A-Za-z]+(_[A-Za-z]+)*_[A-Z]{2}$/.test(sku);
}

// dedupeByTitle only collapses exact-normalized-title matches. These pairs
// describe the same physical listing (identical price and specs, confirmed
// by hand) under wording different enough to survive that pass — singular
// vs. plural, "GenSet" vs. "Generator Set", etc. Drop the duplicate outright
// rather than just redirect it away, so it stops existing as a catalog
// entry, not just as a route. Pair with a 301 in next.config.ts for any
// inbound link to the dropped slug.
const KNOWN_DUPLICATE_TITLES = new Set([
  '10ft Refrigerated Containers 10ft Freezer', // dup of "10ft Refrigerated Container 10ft Freezer"
  '30000 Gallon Skid Tanks ASME Storage Tanks on Skids', // dup of "30000 Gallon Propane Tanks ASME Storage Skids Tanks"
  'Carrier Clip-On GenSet', // dup of "Carrier Clip-On Generator Set"
  '20ft Flat Rack Shipping Containers 20ft', // dup of "20ft Flat Rack Container 20ft"
]);

// Display-title corrections, keyed by the slug they apply to (slugs are
// derived from the ORIGINAL cleaned title before this map runs, so fixing
// a title here never changes its URL). These specific 21 titles repeat a
// word awkwardly (e.g. "10ft Refrigerated Container 10ft Freezer") — bad
// for SERP snippet readability and CTR. Rewritten to say the same thing
// once, keeping every distinguishing detail (size, cert, condition, SKU).
const TITLE_FIXES = {
  '10ft-refrigerated-container-10ft-freezer': '10ft Refrigerated Container / Freezer',
  '1000-gallon-above-ground-propane-tanks-asme-new-tanks': '1000 Gallon Above Ground Propane Tank, ASME New',
  '10ft-high-cube-shipping-container-high-cube-10ft': '10ft High Cube Shipping Container',
  '10ft-shipping-container-standard-10ft': '10ft Standard Shipping Container',
  '18000-gallon-skid-tanks-asme-storage-skids-tanks': '18,000 Gallon ASME Skid Tank',
  '18000-gallon-skid-tanks-asme-storage-tanks-on-skids': '18,000 Gallon ASME Storage Tank on Skids',
  '20ft-dnv-offshore-open-top-containers-dnv-2-7-1-certified-units': '20ft DNV 2.7-1 Certified Offshore Open Top Container',
  '20ft-dnv-refrigerated-containers-certified-dnv-2-7-1-standard': '20ft DNV 2.7-1 Certified Refrigerated Container',
  '20ft-double-door-shipping-containers-buy-standard-shipping-containers': '20ft Double Door Standard Shipping Container',
  '20ft-flat-rack-container-20ft': '20ft Flat Rack Container',
  '20ft-shipping-containers-quality-standard-shipping-containers': '20ft Standard Shipping Container',
  '30000-gallon-propane-tanks-asme-storage-skids-tanks': '30,000 Gallon ASME Propane Skid Tank',
  '30000-gallon-skid-tanks-asme-storage-skids-tanks': '30,000 Gallon ASME Storage Skid Tank',
  '40ft-double-door-shipping-containers-buy-standard-shipping-containers': '40ft Double Door Standard Shipping Container',
  '40ft-open-side-shipping-containers-standard-40ft-full-side-access-container': '40ft Open Side Shipping Container (Full Side Access)',
  '500-gallon-above-ground-propane-tanks-new-certified-tanks': '500 Gallon Above Ground Propane Tank, New & Certified',
  '500-gallon-propane-tanks-new-certified-tanks': '500 Gallon Propane Tank, New & Certified',
  '500-gallon-underground-propane-tanks-new-certified-tanks': '500 Gallon Underground Propane Tank, New & Certified',
  'thermo-king-sb-210-units-sb-210-units': 'Thermo King SB-210 & SB-210+ Units',
  'used-1000-gallon-propane-tanks-used-asme-dot-tanks': 'Used 1000 Gallon Propane Tank, ASME & DOT',
  'used-500-gallon-propane-tanks-scrap-tanks': 'Used 500 Gallon Propane Tank (Scrap/Salvage)',
};

function main() {
  const scraped = loadSources().filter((p) => !isIncompleteSourceListing(p));
  const deduped = dedupeByTitle(scraped);
  const raw = deduped.filter((p) => !KNOWN_DUPLICATE_TITLES.has(cleanTitle(p.title)));
  const droppedDupes = scraped.length - deduped.length + (deduped.length - raw.length);

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
      title: TITLE_FIXES[slug] || title,
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
  // Real (not fabricated) sitemap lastmod signal: the moment this catalog
  // was actually regenerated, stable across requests until the next rebuild
  // — not a live "now" stamped on every crawl, which trains Google to
  // distrust the field.
  fs.writeFileSync(
    path.join(OUT_DIR, 'catalog-meta.json'),
    JSON.stringify({ generatedAt: new Date().toISOString() }, null, 2)
  );

  console.log(`Dropped ${droppedDupes} duplicate listings (${scraped.length} scraped -> ${products.length} unique)`);
  console.log(`Applied ${overrideCount}/${Object.keys(overrides).length} curated content overrides`);
  console.log(`Wrote ${products.length} products across ${groups.length} groups to ${OUT_DIR}`);
  for (const g of groups) console.log(`  ${g.name}: ${g.count}`);
}

main();
