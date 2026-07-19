# Action Plan — containeronedepot.com

## Already done (during the audit, 2026-07-19)
- [x] Fixed broken product images sitewide (Vercel image-optimizer 402)
- [x] Fixed malformed JSON-LD image URLs on all 212 products
- [x] Fixed crawler-invisible product descriptions (ExpandableText)
- [x] Removed scraped-taxonomy tags from product pages
- [x] Cleared 44 bogus SKU values (warehouse-location codes)
- [x] Removed competitor-URL data (sourceUrl/siteName) from the public catalog
- [x] Untracked raw scrape output/config/brief from the public repo

## Phase 1: Critical Fixes (this week)
- [ ] Merge the near-duplicate `10ft-refrigerated-container-10ft-freezer` / `10ft-refrigerated-containers-10ft-freezer` listings (301 the loser); audit the other 5 flagged near-duplicate pairs from the earlier content-overrides review (30,000-gal skid tank trio, two clip-on genset pairs, flat-rack pair, open-top pair)
- [ ] Add security headers (`headers()` in `next.config.ts`): CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [ ] Add a stock/availability field to the catalog pipeline so JSON-LD `availability` isn't hardcoded `InStock`

## Phase 2: High-Impact Improvements (weeks 2-3)
- [ ] Publish `/llms.txt`
- [ ] Add a 3-5 item FAQ block + FAQPage schema per product template
- [ ] Populate sitemap `lastmod` sitewide from real content-modified timestamps
- [ ] Convert the 8 category pages to static/ISR rendering (currently fully dynamic, uncached — the highest-link-equity pages on the site)
- [ ] Self-host product images (user has confirmed rights to the source photography) — fixes the hotlink dependency and duplicate-content signal in one move
- [ ] Cross-link genset/reefer product pages to the existing buying-guide blog posts
- [ ] Add real trust content to About (history, credentials, address) and Contact (physical address)

## Phase 3: Content & Authority (month 2+)
- [ ] Expand the 4 blog posts to genuine depth (currently 10-15% of a reasonable floor) and add named author bylines
- [ ] Add unique 150-300 word intro copy to each of the 8 category pages
- [ ] Add comparison tables across near-identical SKU families (genset series, container size tiers)
- [ ] Vary/remove the repeated boilerplate closing sentence across product descriptions
- [ ] Submit to container/equipment industry directories and pursue genuine OEM dealer citations (Carrier, Thermo King, CAT, Kubota already referenced extensively)
- [ ] Address the brand-name collision with containerone.net (positioning/differentiation, not a code fix)
- [ ] One or two data-backed digital-PR pitches to trade press (reefer resale pricing trends, etc.)

## Phase 4: Monitoring & Iteration (ongoing)
- [ ] Re-run this audit in 30 days to re-measure Performance (pending this pass) and confirm the fixes shipped today held
- [ ] Re-baseline backlink/crawl footprint at 60-90 days once Search Console shows discovery
- [ ] Do not attempt head-to-head competitive link-building against 10+ year incumbents until there's 90+ days of indexed history to measure against

---
*Full findings and evidence: `FULL-AUDIT-REPORT.md`, `findings/*.md`, `audit-data.json`.*
