# E-commerce SEO Audit — containeronedepot.com

Data source: On-page analysis (static) — direct fetch of prerendered HTML/JSON-LD and inspection of `src/data/products.json` and `src/app/product/[slug]/page.tsx`. No DataForSEO Merchant calls were made (script/cost-guardrail tooling referenced in the agent brief was not present in this repo; live marketplace comparison was skipped rather than run unchecked).

## What works

- Site is server-prerendered (Next.js SSG, `X-Nextjs-Prerender: 1`), so all 212 products and 8 categories are present in raw HTML with no JS-dependency for core content.
- `sitemap.xml` lists all 229 canonical URLs (products, categories, core pages); `robots.txt` is clean, allowing all crawl except `/cart` and `/search`.
- Product pages carry `Product`, `Organization`, and `BreadcrumbList` JSON-LD with `name`, `description`, `brand`, and a populated `Offer` (`price`, `priceCurrency`, `availability`) — every one of the 212 catalog entries has a numeric `regularPrice`; "Price on request" is only a fallback UI string and was not observed triggering anywhere in the data.
- Category pages expose real, crawlable server-rendered links for grade/type sub-filtering (e.g. `/category/shipping-containers?sub=Cargo+Worthy`, `?sub=Economy+Grade`), and these correctly canonicalize back to the base category URL — a sound pattern that avoids duplicate-content bloat from facets.
- Some condition/grade variants do get distinct, keyword-rich slugs (`20ft-standard-cargo-worthy-shipping-container-20stcw`, `20ft-standard-economy-grade-shipping-container-20stused`), which is good for long-tail capture.

## Findings

- **Product schema image URLs are broken (malformed absolute URLs)** — Critical. `src/app/product/[slug]/page.tsx:73` builds `image` as `` `${SITE.url}${img}` `` without checking whether `img` is already absolute. Every catalog image is a full external URL, so the emitted schema reads e.g. `https://www.containeronedepot.comhttps://conexdepotshipping.com/wp-content/uploads/...jpg`. Confirmed via `curl` (DNS resolution failure, no valid host). Google cannot fetch these for Product rich results or a Merchant Center feed, even though the on-page `<img>` tags (proxied via `/_next/image`) render correctly. **Fix**: guard the template with `img.startsWith("http") ? img : `${SITE.url}${img}``; deploy and request re-indexing for all 212 product URLs.

- **No self-hosted product images; entire catalog hotlinks third-party domains** — High. All 1,892 + 246 image references resolve to `conexdepotshipping.com` (appears to be a separate supplier/reseller's WordPress site) and `cdn.shopify.com`, not the containeronedepot.com origin. This creates dependency risk (images can vanish/change without notice), blocks WebP/AVIF control, and undermines Merchant Center's origin-trust signals. **Fix**: mirror images to owned storage/CDN, serve WebP, add descriptive `alt` (existing alt text is decent, e.g. "20ft Standard Economy Grade Shipping Container (20STUSED)").

- **No GTIN/MPN/SKU in Product schema** — High. `sku` is `null` for every sampled product and no `gtin`/`mpn`/`identifier_exists` is emitted. Google Merchant Center requires a unique product identifier (or explicit `identifier_exists: false`) for Shopping listings; without it, feed submission will be rejected or products flagged as "missing identifier." **Fix**: populate `sku` from internal unit IDs, or add `identifier_exists: false` plus `brand`+`mpn` combination where applicable.

- **New/Used and other condition variants are collapsed into one page, one price, one Offer** — High. 94 of 212 products are `type: "variable"` (e.g. the 10ft reefer) with `specs: [["Condition","New, Used"]]` as flat text, a single `regularPrice`, and copy that says "Contact our team to confirm current availability." There is no per-condition slug and no JS toggle — the variant simply isn't modeled, so the schema price cannot represent both conditions and search engines can't index "used 10ft reefer" as a distinct entity, despite the site doing this correctly for some grades (Cargo Worthy, Economy) on other product lines. **Fix**: standardize on distinct slugs/Offers per condition-grade combination, consistent with the pattern already used elsewhere in the catalog.

- **No true faceted filtering (size/condition/grade) on category pages** — Medium. Category pages offer only pre-built "sub=" grouping links, not a combined filter UI; buyers can't cross-filter by size + condition + grade. This is a UX/conversion gap more than a crawlability one, since the existing sub-links are server-rendered and indexable.

## Score: 46/100

Crawl infrastructure (SSG, sitemap, robots) is solid, but a live schema bug voids product image eligibility for every listing, missing identifiers block Merchant Center feed acceptance, and inconsistent variant modeling undermines both pricing accuracy and Shopping readiness.
