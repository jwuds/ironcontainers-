# SXO Findings — containeronedepot.com

Method: live rendering of PDP/PLP templates (`src/app/product/[slug]`, `src/app/category/[slug]`), catalog data (`src/data/products.json`, `groups.json`), and Google SERP checks for four realistic long-tail buyer queries matched to actual inventory: **10ft refrigerated container for sale**, **40ft high cube cargo worthy shipping container**, **carrier undermount genset for reefer container**, **30000 gallon propane skid tank**.

## What Works

- Page type is correctly a product page for 3 of 4 queries — the SERP for these terms is dominated by transactional PDPs/PLPs (Conexwest, Midstate, Container Alliance, Long Beach Off-Coast), and containeronedepot.com already has an exact-match SKU (`40hccw`, `30000-gallon-skid-tanks…`) sitting on the right template.
- The reserve-and-quote flow (48–72hr refundable deposit + `mailto` quote CTA) gives an urgent/immediate-need buyer a fast, low-friction path — a real differentiator versus pure "contact us" forms.
- Product, Breadcrumb, and CollectionPage JSON-LD are implemented on every PDP/PLP.
- A genuine buying-guide content layer exists (`reefer-container-buying-guide`, `container-grades-explained` in `src/lib/blog.ts`) that could serve awareness-stage searchers if it were surfaced.

## Findings

1. **Title:** Product content is near-duplicate of the scraped source network already ranking for these queries
   **Severity:** Critical
   **Description:** For "30000 gallon propane skid tank," the SERP is saturated with sibling sites (conexoffcoast.com, longbeachoffcoastdepot.com, conextcontainerdepot.com, conexdepotshipping.com) using the same "Buy X Online" title pattern and near-identical spec copy this catalog was built from. Google has little reason to rank a newer domain's copy of content it already indexes elsewhere.
   **Recommendation:** Rewrite descriptions with unique framing per product (use case, delivery logistics, financing angle) rather than spec-restated prose; differentiate title tags from the "Buy X Online" template used site-wide by competitors.

2. **Title:** Product images are hotlinked directly from conexdepotshipping.com
   **Severity:** Critical
   **Description:** Confirmed live on the 30,000-gallon skid tank PDP and throughout `products.json` — images resolve to `conexdepotshipping.com` (and in one category to a Shopify CDN), not the site's own domain. This reinforces the duplicate-content signal, creates an availability dependency on a third-party host, and undermines trust/originality (E-E-A-T) for a site positioning itself as the direct seller.
   **Recommendation:** Re-host all product imagery on containeronedepot.com's own CDN/storage with unique filenames and alt text.

3. **Title:** Near-duplicate SKUs cannibalize the exact "10ft refrigerated container" query
   **Severity:** High
   **Description:** Two catalog entries — `10ft-refrigerated-container-10ft-freezer` and `10ft-refrigerated-containers-10ft-freezer` — are singular/plural duplicates with overlapping titles, competing against each other rather than consolidating ranking signal.
   **Recommendation:** Merge into one canonical PDP with a 301 from the duplicate; audit catalog for other near-duplicate slugs.

4. **Title:** No informational bridge for the researching buyer on the genset/reefer query
   **Severity:** High
   **Description:** For "carrier undermount genset for reefer container," the SERP mixes SKU-level PDPs with explainer content ("Reefer 101: What Is a Genset in Trucking"). The site's own `reefer-container-buying-guide` blog post exists but is not linked from any genset or reefer PDP (confirmed in `product/[slug]/page.tsx` — no blog cross-link component). A first-time buyer lands on spec-only copy with no context on clip-on vs. undermount.
   **Recommendation:** Add a contextual "Learn more" module linking genset/reefer PDPs to the relevant buying-guide post, and vice versa.

5. **Title:** Brand-name collision with an established, better-trusted competitor
   **Severity:** Medium
   **Description:** "Container One" (containerone.net) — 30+ years, BBB-accredited, 300+ locations — already ranks page-1 for the cargo-worthy query with a near-identical brand name to "Container One Depot." The comparison-shopping repeat buyer has no visible trust counter-signal (no reviews, years-in-business, or BBB) to offset this.
   **Recommendation:** Add trust markers (reviews/testimonials, years-in-business, delivery-area proof) to PDP/PLP templates; consider brand disambiguation in title tags.

## Limitations
No crawler/rank-tracking access; SERP snapshots are point-in-time WebSearch results, not verified top-10 screenshots. Live indexing status of individual PDPs was not checked via Search Console.

## SXO Gap Score: 34/100
Page-type alignment is genuinely good, but duplicate sourced content, hotlinked competitor imagery, and cannibalized SKUs are structural risks that likely suppress ranking regardless of on-page intent-matching.

Next: `/seo content` for the E-E-A-T/duplicate-content gap, `/seo page` for the cannibalized SKU audit.
