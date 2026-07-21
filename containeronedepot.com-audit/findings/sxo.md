# Search Experience Optimization (SXO)

Score: 40/100 (diagnostic — not folded into overall health score)

Method: Google SERP checks (WebSearch) for four transactional queries relevant to the
catalog — **shipping containers for sale**, **refrigerated shipping container for sale**,
**buy conex box**, plus a direct brand-name/`site:` check for containeronedepot.com —
cross-referenced against live rendering of the homepage, a category page (`/category/
refrigerated-containers`), and a PDP (`/product/10ft-refrigerated-container-10ft-freezer`),
plus source review of `src/app/cart/checkout/page.tsx`, `src/app/cart/reserve/page.tsx`,
`src/components/PaymentMethodDialog.tsx`, `src/lib/{cart-context,blog,faq,site}.ts`,
`src/app/{about,contact}/page.tsx`, and the git history since the prior audit (2026-07-19).
This re-run compares against the prior SXO audit (`containeronedepot.com-audit/findings/
sxo.md`, scored 34/100, four different long-tail queries).

## What Works

- Page-type alignment is still correct: homepage, category, and product templates are
  genuinely transactional PLP/PDP layouts (price, add-to-cart, spec table, breadcrumb),
  matching what dominates the SERP for these queries site-wide (Conexwest, Container One,
  Midstate, Conex Depot, etc. all use the same PLP/PDP pattern).
- Product images are now confirmed self-hosted (`/images/*` — 0 external references found
  in `products.json`); the `conexdepotshipping-` prefix survives only in filenames, not hosting.
- The four confirmed duplicate SKU pairs (including the reefer pair the prior audit named)
  were deleted with 301s in `next.config.ts`; catalog is 208 products (down from 212).
- Blog-to-PDP cross-linking is now wired into the product template (`getRelevantPosts` +
  `GROUP_SPECIFIC_POSTS` map in `src/lib/blog.ts`), surfacing a "Related Guides" module.
- Checkout is materially more trustworthy: flat $1,000 deposit stated consistently
  everywhere (reserve page, checkout, FAQ, blog), payment method is now a required field
  with a visible validation error instead of an easily-skipped optional step, a 7-day
  return policy is stated in three places plus `hasMerchantReturnPolicy` schema, and the
  confirmation screen shows a real order summary.
- Checkout, contact, and newsletter forms now send real server-side email via Resend
  (`src/app/api/{reservation,contact,newsletter}/route.ts`) with honest success/error
  states, replacing `mailto:` links that always claimed success client-side even if the
  visitor had no default mail client configured.
- A real business address (leased yard + virtual mailbox, confirmed with site owner) was
  added to `SITE`, Organization JSON-LD, and both About/Contact pages.

## Findings

1. **Title:** Domain does not surface in Google results for any target query, including its own brand name
   **Severity:** Critical
   **Description:** WebSearch for "shipping containers for sale," "refrigerated shipping
   container for sale," "buy conex box," `site:containeronedepot.com`, and the exact
   phrase `"Container One Depot" shipping containers` returned zero appearances of
   containeronedepot.com anywhere in results. Competing near-identical-brand domains
   (containerone.net, containerone.com, containerdepotco.com, houstoncontainerdepot.com)
   filled the results instead. No amount of on-page page-type or intent alignment can
   convert traffic that never arrives — this is the primary blocker, ahead of any
   template-level SXO work.
   **Recommendation:** Verify indexing status in Search Console (URL Inspection on
   homepage + top PDPs), confirm the sitemap is actually submitted and being crawled,
   and check for `noindex`/canonical/robots issues. Route to `/seo technical` for a full
   indexation diagnosis — this is outside SXO's remit to fix directly.
   **Status vs prior audit:** New (the prior audit's four different long-tail queries did
   show containeronedepot.com PDPs matching the right template; this broader query set and
   a direct brand check surfaced a more fundamental visibility gap not previously tested).

2. **Title:** Brand-name collision with established, better-trusted competitors
   **Severity:** High (escalated from Medium)
   **Description:** Beyond the previously-flagged containerone.net (30+ years, BBB-
   accredited, 300+ locations), this pass surfaced containerone.com and
   containerdepotco.com/houstoncontainerdepot.com as additional near-identical brands
   ranking for the same queries. The site still has no visible trust counter-signal
   (reviews, BBB, years-in-business) to differentiate itself in a comparison-shopping
   moment.
   **Recommendation:** Add real, verifiable trust markers (reviews/testimonials, BBB
   application, years-in-business once true) to PLP/PDP templates; consider brand
   disambiguation in title tags (e.g., explicit city/state or a distinguishing modifier).
   **Status vs prior audit:** Still Open — worsened in scope (more colliding brands
   confirmed), unchanged in remedy (no counter-signals added).

3. **Title:** Product images hotlinked from a competitor domain
   **Severity:** Critical (as scored previously)
   **Description:** Confirmed fixed — `products.json` now resolves 0 image paths to
   `conexdepotshipping.com` or any third-party CDN; all images serve from `/images/*` on
   the site's own domain (commit `d4951fe`).
   **Recommendation:** None outstanding. Consider renaming the `conexdepotshipping-*`
   filename prefix for a cleaner asset-origin story, though this is cosmetic, not
   functional.
   **Status vs prior audit:** Fixed.

4. **Title:** Near-duplicate SKUs cannibalizing exact-match queries
   **Severity:** High (as scored previously)
   **Description:** The specific pair named in the prior audit
   (`10ft-refrigerated-container-10ft-freezer` / `...-10ft-freezer`-plural variant) plus
   three other confirmed-duplicate pairs were deleted with 301 redirects (commit
   `5c17531`). Three additional flagged pairs (two Thermo King genset pairs, one 20ft
   open-top pair, a third 30,000-gal tank listing) were deliberately left unmerged because
   prices differ enough that auto-merging risked guessing wrong.
   **Recommendation:** Manually verify the three remaining pairs and merge or
   differentiate them; audit isn't fully closed catalog-wide.
   **Status vs prior audit:** Fixed for the cited example; Partially Fixed catalog-wide.

5. **Title:** No informational bridge for the researching genset/reefer buyer
   **Severity:** Medium (downgraded from High)
   **Description:** The cross-linking mechanism now exists and correctly serves
   `reefer-container-buying-guide` to any product tagged to the `refrigerated-containers`
   or `refrigeration-gensets` groups. However, the exact product the prior audit used as
   its example — `10ft-refrigerated-container-10ft-freezer` — is tagged only to
   `shipping-containers` in `products.json`, so it still surfaces the generic
   "Container Grades Explained" and "Section 179" posts instead of the reefer guide. This
   is a catalog-tagging gap, not a code gap — the fix works everywhere it's been applied
   correctly.
   **Recommendation:** Audit `groups` tags for all reefer/genset SKUs currently
   mis-tagged under `shipping-containers` only, so they inherit the correct guide.
   **Status vs prior audit:** Partially Fixed.

6. **Title:** Checkout/decision-stage friction and trust gaps
   **Severity:** Medium
   **Description:** Not a named finding in the prior SXO audit, but directly responsive
   to the review requested here. Commits `49fc49d` and `0b364cf` address several
   decision-stage persona pain points: payment method is now required (was silently
   optional), a flat and consistent $1,000 deposit replaces a previously tiered
   $100–$500 range that was inconsistent across pages, the 7-day return policy (customer
   pays return shipping) is now stated in FAQ, reserve page, and `hasMerchantReturnPolicy`
   schema, and a real order summary appears on confirmation. Forms also no longer rely on
   `mailto:` (which could silently fail with no visible error for a visitor without a
   configured mail client) — reservation, contact, and newsletter all now POST to
   server-side API routes that send via Resend and surface real errors.
   **Recommendation:** None code-side; this is a genuine improvement. Confirm
   `RESEND_API_KEY` and a verified sending domain (`RESEND_FROM_EMAIL`) are actually set in
   Vercel production — per `RESEND_SETUP.md`, without them the forms fail loudly (which is
   correct behavior) but reservations won't reach the sales team either way.
   **Status vs prior audit:** New / Resolved (was not a named prior finding, but closes a
   real gap; verify production env vars to confirm it's live-functional, not just
   code-complete).

7. **Title:** No E-E-A-T trust markers (reviews, BBB, years-in-business) anywhere on site
   **Severity:** Medium
   **Description:** The About/Contact expansion (commit `d5f17b3`) added mission/vision/
   values, industries served, and a real leased-yard address to Organization schema — a
   genuine, honest improvement (the commit explicitly declined to fabricate founding-year
   or "thousands supplied" claims). But no reviews, testimonials, or third-party badges
   exist on the homepage, PLP, or PDP where a comparison-shopping persona would look for
   them, leaving finding #2's brand-collision risk uncountered at the moment of decision.
   **Recommendation:** Pursue real, verifiable third-party trust signals (BBB application,
   Google Business Profile reviews once the physical yard has traffic, delivery-area proof)
   rather than on-page claims alone — route to `/seo content` for E-E-A-T strategy.
   **Status vs prior audit:** Still Open (partial mitigation via address/Organization
   schema; core gap — no reviews/BBB — unchanged).

## Limitations

No crawler, rank-tracking, or Search Console access; SERP checks are point-in-time
WebSearch results, not verified top-10 screenshots or a guaranteed match to Google's
actual index (the zero-visibility finding above should be confirmed via Search Console
URL Inspection before treating it as certain). Checkout confirmation screen and the live
Resend email send were reviewed via source code only, not exercised end-to-end with a
real cart and a live `RESEND_API_KEY`, since that requires client-side cart state and a
configured production secret this review has no access to. Live-rendering scripts
referenced in the standard SXO workflow (`scripts/render_page.py`, `scripts/parse_html.py`)
are not present in this repository; WebFetch was used against the live production URLs
instead.

Next: `/seo technical` for the indexation/visibility diagnosis (finding #1, now the
top-priority blocker), `/seo content` for E-E-A-T strategy (findings #2, #7).
