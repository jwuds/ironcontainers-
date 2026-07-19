# Technical SEO Audit — containeronedepot.com
Audited live: 2026-07-19

## What Works

- **Crawlability**: `robots.txt` is clean — allows all, disallows only `/cart` and `/search` (both correctly non-indexable utility routes, not content). Sitemap is referenced correctly.
- **Canonicals**: Both sampled pages self-reference correctly — product page canonical is `https://www.containeronedepot.com/product/10ft-refrigerated-container-10ft-freezer`, category page is `https://www.containeronedepot.com/category/shipping-containers`. No meta-robots noindex or X-Robots-Tag found on either.
- **HTTPS/domain consolidation**: `http://` and bare-apex requests both eventually land on `https://www.` via 308s; HSTS (`max-age=63072000`) is set sitewide. No mixed content detected (no `http://` asset/resource references in sampled HTML).
- **Rendering**: Pages are server-rendered (Next.js prerender/SSR) — full title, canonical, JSON-LD, and body content are present in raw HTML with no JS execution required. Product pages serve from Vercel's edge cache (`X-Vercel-Cache: PRERENDER`/`HIT`).
- **URL structure**: Clean, descriptive, lowercase, hyphenated slugs (`/product/10ft-refrigerated-container-10ft-freezer`, `/category/shipping-containers`) with no query-string or ID-based paths.
- **Structured data**: JSON-LD block present on both product and category templates.
- **Mobile**: Correct `<meta name="viewport" content="width=device-width, initial-scale=1">` on sampled pages.
- **Sitemap integrity**: 229 URLs, zero duplicates, no `/cart` or `/search` leakage, spot-checked product URLs all return 200.
- **Legacy redirect handling**: retired product slug (`thermo-king-sg-3000-clip-on-gensets-1`) correctly 308s to its surviving slug — good practice as the catalog gets deduped.

## Findings

1. **Title**: No security headers beyond HSTS (missing CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
   **Severity**: High
   **Description**: Direct header fetch on `/`, the product page, and the category page shows only `Strict-Transport-Security`. No `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`. `next.config.ts` has no `headers()` function defined at all. Not a direct ranking factor, but Google's security signals, clickjacking exposure, and MIME-sniffing risk all apply to a live commerce site collecting contact/quote form data.
   **Recommendation**: Add a `headers()` block in `next.config.ts` (or Vercel `vercel.json`) setting `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` (or CSP `frame-ancestors 'self'`), `Referrer-Policy: strict-origin-when-cross-origin`, and a baseline CSP scoped to Next.js/Vercel + Shopify CDN image host.

2. **Title**: Category pages are fully dynamic, not cached (`Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`, `X-Vercel-Cache: MISS`)
   **Severity**: Medium
   **Description**: Unlike the homepage and product pages (which are prerendered/edge-cached — `X-Nextjs-Prerender: 1`, `HIT`/`PRERENDER`), the sampled category page (`/category/shipping-containers`) is served `private, no-store` on every request with a cache MISS, and lacks the `X-Nextjs-Prerender` header entirely — meaning it's rendered fresh per-request (likely due to a dynamic API call, cookie read, or `no-store` fetch upstream). This directly risks LCP/TTFB for the exact pages (8 category templates) that carry the highest link equity and are the primary internal-linking hubs to all 212 products.
   **Recommendation**: Convert category pages to static generation with ISR (`export const revalidate = 3600` or similar) or fix whatever dynamic data source (cookies, `cache: 'no-store'` fetch, `headers()`/`cookies()` call) is forcing dynamic rendering. Verify with `next build` output that these routes are marked SSG/ISR, not `ƒ` (dynamic).

3. **Title**: Sitemap `lastmod` present on only 4 of 229 URLs (all blog posts)
   **Severity**: Medium
   **Description**: The homepage, catalog, about, contact, all 8 category pages, and all ~212 product pages have no `<lastmod>`. Only the 4 blog posts carry it. This matches the brief's flag — without `lastmod`, crawlers can't efficiently prioritize re-crawls of pages that actually changed (e.g., price/availability updates on product pages), which matters more for a young domain with a limited crawl budget competing against established resellers.
   **Recommendation**: Populate `lastmod` sitewide from each page's real content-modified timestamp (product/category data update time; static `lastmod` for about/contact tied to deploy or content-edit date). Avoid stamping every URL with "now" on every deploy — that trains Google to distrust the field.

4. **Title**: Non-www apex requires two redirect hops over plain HTTP
   **Severity**: Low
   **Description**: `http://containeronedepot.com/` → `https://containeronedepot.com/` (308) → `https://www.containeronedepot.com/` (308) — 2 hops. `http://www.containeronedepot.com/` is a single clean hop. Any external link or citation using the bare apex over HTTP costs an extra round trip and dilutes a small amount of link equity/crawl efficiency.
   **Recommendation**: Collapse to a single redirect from `http://containeronedepot.com/` straight to `https://www.containeronedepot.com/` at the edge/DNS layer.

5. **Title**: No IndexNow key file or integration
   **Severity**: Low
   **Description**: No `/{key}.txt` IndexNow verification file found in `/public`, and no evidence of push-based indexing to Bing/Yandex. For a young domain trying to accelerate discovery of ~212 product pages, relying solely on pull-based crawling (sitemap + robots) is slower than necessary.
   **Recommendation**: Generate an IndexNow key, host the verification file at the site root, and submit new/updated product URLs on publish/price-change via the IndexNow API (single call covers Bing, Yandex, Naver, Seznam).

6. **Title**: `/cart` and `/search` are disallowed but publicly resolve with 200 and no noindex
   **Severity**: Info
   **Description**: Both routes return `200 OK` and are blocked only via `Disallow`, not `noindex`. Since `Disallow` prevents crawling (not indexing), if either URL ever gets an external link, Google can still index the bare URL with no snippet ("indexed, though blocked by robots.txt" in GSC). Low risk today given no external links to these utility pages, but worth pre-empting.
   **Recommendation**: Add `<meta name="robots" content="noindex">` to `/cart` and `/search` in addition to the robots.txt disallow, or leave as-is if GSC shows no such warnings after a few crawl cycles.

## Category Score: 78/100

Justification: Fundamentals (crawlability, canonicals, HTTPS/HSTS, SSR content, clean URLs, valid deduped sitemap) are solid and better than most young e-commerce sites, but the complete absence of security headers, dynamic/uncached category templates on the site's highest-value hub pages, and missing sitemap `lastmod` sitewide are real, fixable deductions.
