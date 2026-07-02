# WooCommerce Product Scraper

Playwright scraper for WooCommerce storefronts. Discovers every product category,
crawls all paginated listings, scrapes each product page, and exports everything to
a WooCommerce-import-ready CSV.

Configured out of the box for:
- `conexdepotshipping.com` — full WooCommerce catalog, discovered via `/product-category/*` taxonomy pages (~34 categories).
- `www.conexdepot.com` — smaller catalog with no browsable category archive; scraped via its `?post_type=product` shop listing instead (category names are still captured per-product from each product page's breadcrumb).

## Setup

```
npm install
```

(`postinstall` runs `playwright install chromium` automatically.)

## Run

```
npm start
```

or

```
node src/scraper.js [path/to/config.json]
```

If no config path is given it uses `config.json` in the project root.

## What it does

1. **Category discovery** — loads each site's homepage and collects every
   `/product-category/...` link. If none are found, falls back to the site's
   `shopFallbackUrl` from `config.json`.
2. **Pagination** — for each category/listing URL, follows the real "next page"
   link found on the page (works with any WooCommerce pagination URL scheme,
   not a guessed pattern) until there is no next page.
3. **Product discovery + dedup** — collects every product URL from every listing
   page into a single set, so a product that appears in multiple categories is
   only scraped once.
4. **Product scraping** — for each product page, extracts:
   - Title, SKU, price (regular + sale)
   - Short description and full description
   - Specifications (the "Additional Information" attributes table)
   - Variable-product attribute options (e.g. size/condition dropdowns)
   - Full-resolution gallery image URLs (deduped — WordPress' `-300x300`/`-150x150`
     thumbnail variants are collapsed to one entry per source image)
   - Assigned categories (from the product page itself, so this works even on
     sites without a browsable category archive)
5. **Retries** — every navigation (listing or product page) retries up to
   `retries` times with exponential backoff before being logged as a failure.
6. **Resume / duplicate-skipping** — results are saved incrementally to
   `output/products.json`. Re-running the scraper loads that file first and
   skips any URL already present, so an interrupted run can just be re-run to
   pick up where it left off.
7. **CSV export** — writes `output/woocommerce-import.csv` using the standard
   WooCommerce Product CSV Importer column set (`Type`, `SKU`, `Name`,
   `Regular price`, `Sale price`, `Categories`, `Images`, dynamic
   `Attribute N name/value(s)/visible/global` columns, etc.), ready to import
   via **WooCommerce → Products → Import**.

## Output files (`output/`)

- `products.json` — raw scraped data (source of truth; resumable)
- `woocommerce-import.csv` — WooCommerce Product CSV Importer format
- `failed.json` — URLs that failed after all retries, with the error message

## Config (`config.json`)

| Field              | Meaning                                                          |
|---------------------|-------------------------------------------------------------------|
| `sites`             | Array of `{ name, baseUrl, shopFallbackUrl }` to scrape           |
| `concurrency`       | Number of product pages scraped in parallel                       |
| `retries`           | Max attempts per page navigation                                   |
| `retryBaseDelayMs`  | Base delay for exponential backoff between retries                 |
| `requestDelayMs`    | Fixed pause between requests (politeness delay)                    |
| `headless`          | Run Chromium headless (`true`) or visibly (`false`)                 |
| `outputDir`         | Where `products.json` / CSV / `failed.json` are written             |

To point this at another WooCommerce site, add an entry to `sites` with its
homepage as `baseUrl` and a shop/archive URL as `shopFallbackUrl` (used both as
a fallback when no `/product-category/` links are found, and as an extra
catch-all listing so uncategorized products aren't missed).

## Known limitations

- Variable products are exported as a single parent row with attribute
  **options** (from the variation dropdowns) — per-variation SKU/price
  combinations are not expanded into separate CSV rows.
- Category discovery relies on WooCommerce's default `/product-category/`
  permalink structure and the "Additional Information" attributes tab; heavily
  customized themes may need selector tweaks in `src/lib/extract.js`.
