# SEO Health Audit — containeronedepot.com
Audited live: 2026-07-19

## Executive Summary

**SEO Health Score: 60/100** (7 of 8 on-site categories scored; Performance still running, will shift this number once in. SXO and Backlinks are shown separately as diagnostic context, not folded into this score.)

**Business type:** E-commerce — industrial equipment reseller (shipping containers, refrigeration units, tanks, generators, trailers/chassis), ~212 SKUs across 8 categories, competing against established resellers the catalog was originally sourced from.

This audit doubled as a live incident response: three specialists independently converged on the same three critical bugs from different angles (visual, schema, e-commerce, content), all of which were root-caused and fixed during the audit itself — see "Fixed during this audit" below. The remaining findings are genuine, open work.

### Top 5 findings
1. Three critical, sitewide bugs — broken product images (Vercel quota), broken JSON-LD image URLs, and crawler-invisible descriptions — were found and fixed live during this audit.
2. Product photos are hotlinked from third-party domains, not self-hosted — flagged independently by three specialists as a reliability, trust, and duplicate-content risk.
3. A near-identical, much more established competitor ("Container One" — containerone.net, 30+ years, BBB-accredited) already ranks page-1 for shared target queries — a brand-collision problem no on-site fix solves alone.
4. Zero FAQ content or FAQPage schema anywhere — the single highest-leverage gap for AI Overview/ChatGPT citation.
5. About/Contact pages and the blog carry very thin trust signal (no address, no bylines, no credentials) for a high-ticket B2B/B2C seller.

### Top 5 quick wins
1. Publish `/llms.txt` (~1-2 hrs)
2. Add security headers via `next.config.ts` `headers()` — none exist today
3. Populate sitemap `<lastmod>` sitewide (4 of 229 URLs have it)
4. Merge the near-duplicate `10ft-refrigerated-container-10ft-freezer` / `...-containers-10ft-freezer` listings
5. Add a 3-5 item FAQ block + FAQPage schema per product template

---

## Fixed during this audit

| Fix | Affected |
|---|---|
| Added `images.remotePatterns` for both image hosts | Was 500ing every page using `next/image` |
| Added `images.unoptimized` | Every product photo was broken (Vercel 402 quota) |
| Fixed JSON-LD image URL concatenation bug | Broken structured-data images on all 212 products |
| `ExpandableText` now always renders full text (CSS line-clamp, not JS-sliced text) | ~67% of every rewritten description was invisible to crawlers |
| Removed `rawCategories` chip row from product pages | Was showing raw scraped marketplace taxonomy strings publicly |
| Cleared 44 bogus `sku` values ("Graham_TX" etc. — a warehouse-location code scraped into the sku field) | Was displaying as a fake SKU on 44 product pages |
| Removed `sourceUrl`/`siteName` from the compiled public `products.json` | Was exposing literal competitor page URLs for all 212 products in this public GitHub repo |
| Untracked raw scrape output, scraper config, and the rewrite brief from the public repo | Named the specific competitor sites this catalog was sourced from |

---

## Category Scores

| Category | Score | Note |
|---|---|---|
| Technical SEO | 78/100 | Solid fundamentals; no security headers, category pages uncached |
| Sitemap | 88/100 | Structurally clean; missing `lastmod` on 225/229 URLs |
| Content Quality & E-E-A-T | 52/100 | Good copy, was crawler-invisible (fixed); thin trust layer |
| Schema / Structured Data | 62/100 | Architecturally correct; image bug fixed, availability still hardcoded |
| Performance (CWV) | pending | Audit still running |
| Visual / Mobile UX | 42/100* | *Pre-fix score — both Critical findings (images) now resolved |
| AI Search Readiness (GEO) | 58/100 | Strong SSR foundation; no FAQ, no llms.txt |
| E-commerce / Product Data | 46/100* | *Same image-schema bug as above, now resolved |
| *SXO (diagnostic, not scored)* | 34/100 | Why rankings are stuck — see below |
| *Backlinks (diagnostic, not scored)* | 8/100 | Expected for a 2-week-old rebrand |

Full detail for every category, finding, and recommendation: see `findings/*.md` and `audit-data.json`.

---

## Why rankings are actually stuck (SXO + Backlinks synthesis)

The technical/on-page work matters, but two structural facts explain most of the "not even top 50" gap independent of anything fixable in code this week:

1. **Zero backlink/crawl footprint.** No Common Crawl or Wayback captures exist for this domain at any date — expected for a ~2-week-old rebrand, but it means every off-page ranking signal starts at absolute zero against competitors with a decade-plus of accumulated links.
2. **Structural similarity to the source network.** For several target queries, the SERP is dominated by the very sites this catalog was originally scraped from (conexoffcoast.com, longbeachoffcoastdepot.com, conexdepotshipping.com), using the same template pattern. Google has limited reason to newly rank a young domain's version of content it already indexes elsewhere — reinforced by hotlinked, non-original product photos.
3. **Brand-name collision.** "Container One" (containerone.net) is an established, BBB-accredited competitor with a near-identical name already ranking on shared queries — a positioning problem, not a technical one.

None of this means the on-site work is wasted — it's the necessary foundation for when authority starts accumulating — but it sets realistic expectations: this is a 60-90 day-minimum runway before ranking movement, not a switch that flips this week.
