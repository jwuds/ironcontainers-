# Backlink Profile & Off-Page Authority — containeronedepot.com

**Category score: 8/100** — expected and fine for a brand-new domain; the number reflects zero discoverable link equity today, not a fixable defect.

## Current state

No paid backlink API (Moz/Bing/DataForSEO) credentials were found in this environment (`scripts/backlinks_auth.py` does not exist here), so this assessment relies entirely on free, directly-verified signals. No live web-search tool was available either, so "no third-party mentions found" below means "none surfaced via the checks run," not "confirmed zero across the entire web."

Verified directly:
- **Common Crawl**: queried the 3 most recent CDX indexes (2026-25, 2026-21, 2025-51) for `containeronedepot.com` and `*.containeronedepot.com` — **zero captures in all three**. The domain has not yet been picked up by CC's crawl seeds. Confidence: 0.50 (domain-level, absence-of-data signal).
- **Wayback Machine CDX**: zero archived snapshots at any point in time. Confidence: 0.50.
- **Site itself**: live, returns HTTP 200, `robots.txt` is permissive (`Allow: /`), sitemap.xml exists and is well-formed. So the domain is crawlable — it simply hasn't accumulated inbound links or third-party crawl attention yet.
- **Git history**: the "Rebrand to Container One Depot" commit (2026-07-03) confirms this is a relaunch, ~2 weeks old at time of audit. Any backlink equity from a prior brand/domain does not carry over.
- **Site content**: no physical street address found in code (`src/lib/site.ts` has phone only, no NAP address) — limits local-citation tactics unless a real yard/office address exists to publish.
- **OEM mentions present in catalog data**: Carrier, Thermo King, Caterpillar (CAT), Kubota appear extensively as unit specs/brands across `products.json` — these are potential co-marketing/citation angles, not yet exploited.
- Note: several product image URLs in `products.json` still point to `conexdepotshipping.com` (a named competitor) — not a backlink issue per se, but flag for the technical/content workstream since it's an external hotlink dependency, not evidence of any link relationship.

## Findings / Recommendations

- **title**: Zero discoverable backlink or crawl footprint
  **severity**: Info
  **description**: No Common Crawl or Wayback captures exist for the domain at any date. This is expected for a 2-week-old rebrand and is not itself an error — but it means literally every off-page signal (referring domains, anchor text, authority) starts at zero.
  **recommendation**: Do not attempt a numeric DA/backlink-count target yet. Re-baseline in 60-90 days once Search Console shows discovery, then bring in Moz/DataForSEO for a real quantitative read.

- **title**: No physical address published limits local SEO citation building
  **severity**: Medium
  **description**: `site.ts` exposes only a phone number, no street address. Structured local citations (Google Business Profile, BBB, industry directories that require NAP) need a consistent address to be effective.
  **recommendation**: If there is a real yard/office/depot location, publish full NAP consistently in the footer and schema.org `LocalBusiness` markup, then pursue GBP + core citation aggregators (Yelp, BBB, Data Axle). If the business is broker/drop-ship only with no location, skip local citations and focus on industry-directory + digital PR tracks instead.

- **title**: Realistic near-term tier: industry directories + OEM/dealer citations (0-3 months)
  **severity**: High
  **description**: The catalog already references Carrier, Thermo King, Caterpillar, and Kubota by name across hundreds of listings. This is low-competition, high-relevance link inventory that doesn't require competing for authority against 10-year-old incumbents.
  **recommendation**: Submit to container/modular/equipment resale directories (e.g., trade association member listings, ISBU/container industry directories, used-equipment marketplaces like MachineryTrader/IronPlanet company profiles), and inquire about authorized-dealer or reseller listing pages from Thermo King/Carrier regional distributors if a genuine dealer relationship exists. Only pursue if the relationship is real — do not claim OEM affiliation without one.

- **title**: Digital PR / earned-link angle worth testing (3-6 months)
  **severity**: Medium
  **description**: Industrial equipment resale has natural news hooks (shipping container housing trends, cold-chain/reefer container shortages, disaster-relief/temporary structure demand) that trade press and local business journals will cover.
  **recommendation**: One or two data-backed pitches (e.g., "reefer container resale pricing trends") to trade outlets (Freight Waves, construction/logistics trade blogs) is realistic. Do not budget for national consumer press — it's the wrong audience and unlikely to land for a 2-week-old brand.

- **title**: Do not attempt head-to-head competitive link building yet
  **severity**: Critical
  **description**: Conex Depot, Mobile Modular, and Long Beach Off-Coast likely carry a decade-plus of accumulated referring domains. No realistic 3-6 month tactic closes that gap, and chasing their exact link sources (guest posts on generic "business" blogs, PBN-adjacent directories) risks low-quality link penalties with no offsetting authority gain this early.
  **recommendation**: Reallocate that effort into on-site content/technical SEO and the directory/OEM tactics above; revisit competitive gap analysis (Bing `compare` or DataForSEO) once the domain has 90+ days of indexed history to compare against.

## Data source summary

| Source | Confidence | Freshness | Status |
|---|---|---|---|
| Common Crawl CDX (3 indexes) | 0.50 | Quarterly | Zero captures |
| Wayback Machine CDX | 0.50 | Continuous | Zero captures |
| Direct HTTP/robots/sitemap check | 0.95 | Live | Site healthy, crawlable |
| Moz / Bing / DataForSEO | — | — | Not configured in this environment |
| Live web search for mentions | — | — | Tool unavailable this session — recommend manual follow-up |
