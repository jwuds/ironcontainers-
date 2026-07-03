// Scraper for Shopify storefronts. Shopify exposes a public products.json
// endpoint on every store, so there's no need for Playwright/HTML scraping —
// this just pages through the JSON API directly. Output shape matches
// scraper.js (src/scraper.js) so build-catalog.js can consume both.
const fs = require('fs');
const path = require('path');
const https = require('https');

const configPath = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..', 'config.json');
const config = require(configPath);
const { withRetry } = require('./lib/retry');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': USER_AGENT }, timeout: 30000 }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Bad JSON from ${url}: ${e.message}`));
        }
      });
    });
    req.on('timeout', () => req.destroy(new Error(`Timeout fetching ${url}`)));
    req.on('error', reject);
  });
}

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', mdash: '—', ndash: '–',
};

function decodeEntities(s) {
  return s.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+\d*);/gi, (m, code) => {
    if (code[0] === '#') {
      const cp = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : m;
    }
    return ENTITIES[code.toLowerCase()] ?? m;
  });
}

// Shopify product bodies are simple HTML (p/br/ul/li/strong/span). Convert
// to the plain-text-with-blank-lines format the site already renders
// (see ExpandableText, which uses whitespace-pre-line).
function htmlToText(html) {
  if (!html) return '';
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '');
  text = decodeEntities(text);
  return text
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const DROP_TAG_RE = /^update_/i;

function buildCategories(product) {
  const cats = [];
  if (product.product_type) cats.push(product.product_type);
  for (const tag of product.tags || []) {
    if (!DROP_TAG_RE.test(tag)) cats.push(tag);
  }
  return [...new Set(cats)];
}

async function scrapeSite(site, existingUrls) {
  const baseUrl = site.baseUrl.replace(/\/+$/, '');
  const products = [];
  for (let page = 1; ; page++) {
    const url = `${baseUrl}/products.json?limit=250&page=${page}`;
    const json = await withRetry(() => fetchJson(url), {
      retries: config.retries,
      baseDelayMs: config.retryBaseDelayMs,
      label: `products.json page ${page}`,
    });
    const batch = json.products || [];
    if (batch.length === 0) break;
    console.log(`  page ${page}: ${batch.length} products`);
    products.push(...batch);
    await sleep(config.requestDelayMs || 300);
    if (batch.length < 250) break;
  }

  const results = [];
  for (const p of products) {
    const description = htmlToText(p.body_html);
    if (!description) continue; // fee/shipping/add-on line items, not real products

    const pageUrl = `${baseUrl}/products/${p.handle}`;
    if (existingUrls.has(pageUrl)) continue;

    const variant = (p.variants && p.variants[0]) || {};
    let regularPrice = variant.price || '';
    let salePrice = '';
    if (variant.compare_at_price && parseFloat(variant.compare_at_price) > parseFloat(variant.price || '0')) {
      regularPrice = variant.compare_at_price;
      salePrice = variant.price;
    }

    results.push({
      url: pageUrl,
      siteName: site.name,
      title: p.title,
      sku: variant.sku || '',
      type: (p.variants || []).length > 1 ? 'variable' : 'simple',
      regularPrice,
      salePrice,
      shortDescription: description,
      description,
      specs: {},
      images: (p.images || []).map((img) => img.src),
      categories: buildCategories(p),
      attributes: [],
    });
  }
  return results;
}

async function main() {
  const outputDir = path.resolve(__dirname, '..', config.outputDir || './output');
  fs.mkdirSync(outputDir, { recursive: true });

  const sites = config.shopifySites || [];
  if (sites.length === 0) {
    console.log('No shopifySites configured — nothing to do.');
    return;
  }

  for (const site of sites) {
    console.log(`\n=== Shopify site: ${site.name} (${site.baseUrl}) ===`);
    const outPath = path.join(outputDir, `${site.name}-products.json`);

    let existing = [];
    if (fs.existsSync(outPath)) {
      existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      console.log(`Resuming: ${existing.length} products already scraped, will be skipped as duplicates.`);
    }
    const existingUrls = new Set(existing.map((p) => p.url));

    const scraped = await scrapeSite(site, existingUrls);
    const merged = [...existing, ...scraped];
    fs.writeFileSync(outPath, JSON.stringify(merged, null, 2));
    console.log(`${site.name}: ${scraped.length} new products, ${merged.length} total. Wrote ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
