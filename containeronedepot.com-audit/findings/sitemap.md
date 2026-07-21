# Sitemap
Score: 90/100

## What Works
- Valid, well-formed XML (`xml.etree` parse succeeds); single flat `<urlset>`, served correctly as `application/xml` at `/sitemap.xml`, 225 URLs (46.9KB) — far under the 50,000 URL / 50MB per-file limit, no index needed.
- URL count matches live structure: 1 home + 1 catalog + 1 about + 1 contact + 1 blog index + 8 categories + 208 products + 4 blog posts = **225**. (Brief's "5 blog posts" appears to count the `/blog` index page itself; there are 4 actual posts + 1 index.)
- No duplicate `<loc>` entries (confirmed programmatically across all 225 URLs).
- `/cart` and `/search` — both disallowed in robots.txt — are correctly excluded from the sitemap (both live 200 pages, correctly kept out of the crawl path/sitemap per robots directives).
- `Sitemap: https://www.containeronedepot.com/sitemap.xml` correctly declared in robots.txt, and robots.txt itself returns 200.
- Spot-checked 28 URLs across every type (home, catalog, about, contact, blog index, all 8 categories, 15 product samples including old and newly-added SKUs, all 4 blog posts) — 26 returned HTTP 200; the 2 non-200s were the specific redirect issues detailed in Findings #2 and #3 below, not silent failures.
- **`lastmod` fix has landed successfully**: 222 of 225 URLs (98.7%) now carry `<lastmod>`, up from 4 of 229 (1.7%) in the prior audit — see Finding #1 for remaining gaps and an accuracy caveat.
- **Prior near-duplicate SKU pair resolved correctly**: `/product/10ft-refrigerated-containers-10ft-freezer` (plural) now issues a 308 permanent redirect to `/product/10ft-refrigerated-container-10ft-freezer` (singular), and only the singular canonical remains in the sitemap. This is the textbook-correct fix (301/308 + sitemap cleanup).

## Findings

1. **Title:** `lastmod` missing on 3 static pages; remaining 222 URLs share one identical, non-content-derived timestamp
   **Severity:** Low
   **Description:** `/about`, `/contact`, and `/blog` (index) still have no `<lastmod>` at all. Separately, all 218 other non-blog URLs (home, catalog, 8 categories, 208 products) share the exact same timestamp — `2026-07-19T23:23:33.291Z` — down to the millisecond. That date coincides with the prior audit date, suggesting this is a single build/generation timestamp (e.g., "now" at deploy time or a one-time fix date) rather than a true per-page last-edited/price-updated date. The 4 blog posts remain the only URLs with genuinely differentiated, accurate dates (2026-05-12 through 2026-02-09).
   **Recommendation:** Add `lastmod` to the 3 remaining static pages (build/content date is fine). For products/categories, derive `lastmod` from the actual DB `updatedAt` field (price change, spec edit, stock status) rather than a global build timestamp — an identical value across 218 URLs gives Google no real freshness signal and looks auto-generated, which is exactly the "Low: all identical lastmod" anti-pattern.
   **Status vs prior audit:** Partially Fixed (coverage jumped from 4/229 to 222/225, a major improvement, but accuracy/differentiation on non-blog URLs is not yet solved — the original complaint was both presence and legitimacy of the signal).

2. **Title:** Prior near-duplicate product pair (10ft-refrigerated-container(s)) — 301/308-merged correctly
   **Severity:** N/A (resolved)
   **Description:** Verified live: the plural slug 308-redirects to the singular canonical, and only the canonical is listed in the sitemap. No further action needed.
   **Recommendation:** None — fix confirmed working as intended.
   **Status vs prior audit:** Fixed.

3. **Title:** New redirected URL included in sitemap: `thermo-king-sg-3000-clip-on-gensets-1`
   **Severity:** Medium
   **Description:** `/product/thermo-king-sg-3000-clip-on-gensets-1` is present in the current sitemap but returns a 308 redirect to `/product/thermo-king-sg-3000-clip-on-gensets`, which is *also* separately listed in the sitemap. This is the same class of issue as the previously-flagged near-duplicate pair (a `-1`-suffixed slug variant that now redirects to its canonical), except this instance was not caught/cleaned up — likely a newer product-catalog change (e.g., a slug rename) that wasn't reflected in the sitemap generator's exclusion of redirected URLs.
   **Recommendation:** Remove `thermo-king-sg-3000-clip-on-gensets-1` from the sitemap; keep only the canonical `thermo-king-sg-3000-clip-on-gensets`. Add a sitemap-generation safeguard that filters out any URL whose live response is a 3xx before publishing (this would have caught both this case and the original 10ft-refrigerated-container pair automatically).
   **Status vs prior audit:** New (same underlying pattern as the fixed finding, but a fresh, unaddressed instance).

4. **Title:** Deprecated `<priority>` and `<changefreq>` present on every URL
   **Severity:** Info
   **Description:** Both tags remain on all 225 URLs. Google has confirmed since 2023 that both are ignored for crawling/ranking purposes; they add bytes/noise without benefit.
   **Recommendation:** Safe to remove entirely; optional cleanup, not required.
   **Status vs prior audit:** Still Open (unchanged, as expected — this was flagged Info/no-action-required last time too).

5. **Title:** No sitemap index structure
   **Severity:** Info
   **Description:** Flat `<urlset>` remains appropriate at 225 URLs (limit is 50,000).
   **Recommendation:** No action required; revisit only if product count grows 5–10x toward the tens of thousands.
   **Status vs prior audit:** Still Open / not applicable (no change needed, as previously noted).

6. **Title:** Coverage/crawl cross-check — no missing pages detected in spot-check
   **Severity:** Low
   **Description:** All expected page types and counts are present (225 URLs matching live structure exactly). Spot-check of 28 URLs across all types found no 404s or noindex issues; the only non-200 responses were the two known redirect cases (Findings #2 fixed-case and #3 new-case). Full exhaustive 225-URL crawl was not performed — this remains sampling-based.
   **Recommendation:** Run a full automated crawl (Screaming Frog or scripted `curl` loop over all 225 URLs) periodically to catch any additional redirected/404 entries beyond what sampling surfaces — Finding #3 shows sampling alone can miss individual bad entries in a 200+ URL list.
   **Status vs prior audit:** Partially Fixed (spot-check methodology unchanged/still sampling, but this round's sampling did surface one real defect the prior round's did not, which supports doing a full crawl rather than a sample next time).

## Quality Gate Check
208 product pages and 8 category pages are catalog/product listings with real specs (not location-swapped doorway pages) — the location-page quality gate does not apply here. No location pages detected in this sitemap.

## Score: 90/100
Improved from 88/100. The major prior gap (missing `lastmod`) is now resolved in coverage (98.7%), and the flagged near-duplicate SKU pair was correctly 301/308-merged. Score is capped below 95 by two remaining issues: (1) the new redirected URL (`thermo-king-sg-3000-clip-on-gensets-1`) still sitting in the sitemap — the exact defect class that was supposed to be fixed — and (2) `lastmod` values on 218 URLs being a single non-differentiated timestamp rather than genuine per-page freshness data.
