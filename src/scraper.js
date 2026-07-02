const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const configPath = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..', 'config.json');
const config = require(configPath);
const { withRetry } = require('./lib/retry');
const { createLimiter } = require('./lib/limiter');
const extract = require('./lib/extract');
const { buildWooCsv } = require('./lib/csv');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const outputDir = path.resolve(__dirname, '..', config.outputDir || './output');
  fs.mkdirSync(outputDir, { recursive: true });
  const productsPath = path.join(outputDir, 'products.json');
  const failedPath = path.join(outputDir, 'failed.json');
  const csvPath = path.join(outputDir, 'woocommerce-import.csv');

  let scraped = [];
  if (fs.existsSync(productsPath)) {
    scraped = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    console.log(`Resuming: ${scraped.length} products already scraped, will be skipped as duplicates.`);
  }
  const scrapedUrls = new Set(scraped.map((p) => p.url));
  const failed = [];

  const browser = await chromium.launch({ headless: config.headless !== false });

  for (const site of config.sites) {
    console.log(`\n=== Site: ${site.name} (${site.baseUrl}) ===`);

    // --- Discover categories ---
    const discoverPage = await browser.newPage();
    let categoryUrls = [];
    try {
      await withRetry(
        () => discoverPage.goto(site.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }),
        { retries: config.retries, baseDelayMs: config.retryBaseDelayMs, label: `homepage ${site.baseUrl}` }
      );
      categoryUrls = await extract.extractCategoryLinks(discoverPage);
    } catch (e) {
      console.warn(`Could not load homepage for ${site.name}: ${e.message}`);
    }
    await discoverPage.close();

    if (site.shopFallbackUrl) categoryUrls.push(site.shopFallbackUrl);
    categoryUrls = [...new Set(categoryUrls)];

    if (categoryUrls.length === 0) {
      console.warn(`No categories or fallback URL for ${site.name} — skipping site.`);
      continue;
    }
    console.log(`Crawling ${categoryUrls.length} category/listing URL(s) for ${site.name}`);

    // --- Crawl listings (with pagination) to collect unique product URLs ---
    const productUrls = new Set();
    const listPage = await browser.newPage();
    for (const catUrl of categoryUrls) {
      let pageUrl = catUrl;
      while (pageUrl) {
        try {
          await withRetry(
            () => listPage.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }),
            { retries: config.retries, baseDelayMs: config.retryBaseDelayMs, label: `listing ${pageUrl}` }
          );
        } catch (e) {
          console.warn(`Failed to load listing page ${pageUrl} after retries: ${e.message}`);
          failed.push({ url: pageUrl, stage: 'listing', error: e.message });
          break;
        }
        const links = await extract.extractProductLinks(listPage);
        let newCount = 0;
        for (const link of links) {
          if (!productUrls.has(link)) {
            productUrls.add(link);
            newCount++;
          }
        }
        console.log(`  ${pageUrl} -> ${links.length} products (${newCount} new)`);
        pageUrl = await extract.findNextPageUrl(listPage);
        await sleep(config.requestDelayMs || 300);
      }
    }
    await listPage.close();

    console.log(`Total unique product URLs discovered for ${site.name}: ${productUrls.size}`);

    const toScrape = [...productUrls].filter((u) => !scrapedUrls.has(u));
    console.log(
      `${productUrls.size - toScrape.length} already scraped (skipped as duplicates), ${toScrape.length} to scrape.`
    );

    // --- Scrape each product page (bounded concurrency, retries, incremental save) ---
    const limit = createLimiter(config.concurrency || 3);
    let done = 0;
    await Promise.all(
      toScrape.map((url) =>
        limit(async () => {
          const page = await browser.newPage();
          try {
            const product = await withRetry(
              async () => {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                return extract.extractProduct(page, url, site.name);
              },
              { retries: config.retries, baseDelayMs: config.retryBaseDelayMs, label: `product ${url}` }
            );
            scraped.push(product);
            scrapedUrls.add(url);
          } catch (e) {
            console.warn(`  FAILED product ${url}: ${e.message}`);
            failed.push({ url, stage: 'product', error: e.message });
          } finally {
            await page.close();
            done++;
            if (done % 10 === 0 || done === toScrape.length) {
              fs.writeFileSync(productsPath, JSON.stringify(scraped, null, 2));
              console.log(`  [${site.name}] progress ${done}/${toScrape.length}`);
            }
            await sleep(config.requestDelayMs || 300);
          }
        })
      )
    );

    fs.writeFileSync(productsPath, JSON.stringify(scraped, null, 2));
  }

  await browser.close();

  fs.writeFileSync(failedPath, JSON.stringify(failed, null, 2));
  const csv = buildWooCsv(scraped);
  fs.writeFileSync(csvPath, csv, 'utf8');

  console.log(`\nDone. ${scraped.length} products scraped, ${failed.length} failures.`);
  console.log(`CSV:   ${csvPath}`);
  console.log(`JSON:  ${productsPath}`);
  if (failed.length) console.log(`Failures: ${failedPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
