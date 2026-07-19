# SEO Health Audit — containeronedepot.com
Audited live: 2026-07-19
Last updated: 2026-07-19 (post Phase 1)

## Executive Summary

**SEO Health Score: 60/100** (7 of 8 on-site categories scored; Performance still running, will shift this number once in. SXO and Backlinks are shown separately as diagnostic context, not folded into this score.)

**Business type:** E-commerce — industrial equipment reseller (shipping containers, refrigeration units, tanks, generators, trailers/chassis), 208 SKUs across 8 categories (212 at audit time, 4 confirmed duplicates removed since — see Phase 1 below), competing against established resellers the catalog was originally sourced from.

This audit doubled as a live incident response: three specialists independently converged on the same three critical bugs from different angles (visual, schema, e-commerce, content), all of which were root-caused and fixed during the audit itself — see "Fixed during this audit" below. Phase 1 of the resulting action plan is now also complete — see "Phase 1 — complete" below. The remaining findings are genuine, open work.

### Top 5 findings
1. Three critical, sitewide bugs — broken product images (Vercel quota), broken JSON-LD image URLs, and crawler-invisible descriptions — were found and fixed live during this audit.
2. Product photos are hotlinked from third-party domains, not self-hosted — flagged independently by three specialists as a reliability, trust, and duplicate-content risk. (Still open — see Phase 2.)
3. A near-identical, much more established competitor ("Container One" — containerone.net, 30+ years, BBB-accredited) already ranks page-1 for shared target queries — a brand-collision problem no on-site fix solves alone.
4. Zero FAQ content or FAQPage schema anywhere — the single highest-leverage gap for AI Overview/ChatGPT citation. (Phase 2.)
5. About/Contact pages and the blog carry very thin trust signal (no address, no bylines, no credentials) for a high-ticket B2B/B2C seller. (Phase 2.)

### Top 5 quick wins — status
1. ~~Publish `/llms.txt`~~ — not yet done, Phase 2
2. ✅ Add security headers via `next.config.ts` `headers()` — **done**
3. ~~Populate sitemap `<lastmod>` sitewide~~ — not yet done, Phase 2
4. ✅ Merge the near-duplicate `10ft-refrigerated-container-10ft-freezer` pair — **done**, plus 3 more confirmed duplicates found and removed
5. ~~Add a 3-5 item FAQ block + FAQPage schema~~ — not yet done, Phase 2

---

## Fixed during this audit (initial pass)

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

## Phase 1 — complete

| Fix | Detail |
|---|---|
| Deleted 4 confirmed duplicate listings | 10ft reefer pair, 30,000-gal skid tank pair, Carrier clip-on genset pair, 20ft flat-rack pair — all verified by identical price + specs before merging. Catalog: 212 → 208. 301s added for the dropped slugs. |
| Added baseline security headers | X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy. Full CSP deferred — needs per-request nonce middleware, a separate carefully-tested change. |
| **Not done — availability schema** | Needs a real stock/inventory data source to fix honestly; this catalog has none (one-time scrape, not a live feed). Not fabricating a stock value just to close the item. |
| **Left open — 3 pricing-conflict pairs** | 2 Thermo King genset pairs + 1 open-top pair have meaningfully different prices between near-identical listings. Could be genuinely different units or bad source data — needs your call, not a guess on live pricing. |

---

## Category Scores

| Category | Score | Note |
|---|---|---|
| Technical SEO | 78/100 | Measured pre-Phase-1; security headers finding is now resolved |
| Sitemap | 88/100 | Structurally clean; missing `lastmod` on 225/229 URLs |
| Content Quality & E-E-A-T | 52/100 | Good copy, was crawler-invisible (fixed); thin trust layer |
| Schema / Structured Data | 62/100 | Architecturally correct; image bug fixed, availability still hardcoded (no data source to fix it properly) |
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
