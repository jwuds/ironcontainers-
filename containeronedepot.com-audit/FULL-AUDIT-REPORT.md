# SEO Health Audit — containeronedepot.com
Audited live: 2026-07-21 (prior audit: 2026-07-19)

## Executive Summary

**SEO Health Score: 75/100** (up from 60/100 — simple average of 8 scored on-site categories: Technical, Sitemap, Content, Schema, Performance, Visual/Mobile, GEO, E-commerce. Performance is included this time, having not finished on 2026-07-19. SXO and Backlinks remain diagnostic/off-page context, not folded into this score.)

**Business type:** E-commerce — industrial equipment reseller (shipping containers, refrigerated containers, tanks, generators, trailers/chassis), direct-to-buyer, 208 SKUs across 8 categories.

This re-audit verified every fix claimed in commits since 2026-07-19 by re-reading live production HTML/headers/JSON-LD rather than trusting commit messages — several claims checked out exactly as described, one ("checkout order summary") did not, and a new regression (`images.unoptimized: true` left over from the old hotlinking workaround) was found actively hurting mobile performance. A new, more fundamental issue also surfaced: the SXO specialist found **zero appearances of containeronedepot.com in Google search results for any target query, including a direct search for the brand name itself.**

### Top 5 findings
1. **Critical, newly surfaced — zero search visibility.** containeronedepot.com does not appear in Google results for any of 4 target queries or a direct brand-name search; near-identical competitor domains fill the results instead. This needs a Search Console indexation check before any other fix matters — see Action Plan Phase 1.
2. **Critical performance regression from an incomplete fix.** `next.config.ts` still sets `images.unoptimized: true`, a leftover from the old third-party-hotlinking workaround. Now that images are self-hosted, this flag serves every image at full resolution with no responsive sizing or WebP/AVIF — mobile LCP is 10.6s–18.5s (Performance score: 48/100).
3. **New checkout bugs undermine the trust improvements this audit was sent to validate.** The flat $1,000 deposit exceeds the sale price on 12 low-ticket accessory SKUs, the checkout page shows no visible order summary despite the commit message claiming one, and no return-policy text appears anywhere on the $1,000-deposit page.
4. **Merchant Center blockers persist.** 197 of 208 products (95%) still lack a GTIN/MPN/SKU identifier, and 91 of 208 (44%) collapse New/Used condition into a single price/Offer — both keep blocking or demoting Shopping listings.
5. **The fixes that did land are real and verified.** All three Critical bugs from 2026-07-19 (broken product images, malformed JSON-LD image URLs, crawler-hidden truncated descriptions) are confirmed still fixed on production. Both top GEO gaps from that audit are shipped (`/llms.txt` live, FAQPage schema + visible FAQ on every product page). GEO jumped 58→79, Content 52→74, Schema 62→78.

### Top 5 quick wins
1. Remove `images.unoptimized: true` from `next.config.ts` — expected 60-90% image payload reduction, the direct fix for mobile LCP (~1-2 hrs + re-encode)
2. Cap the checkout deposit at item price for the 12 sub-$1,000 accessory SKUs in `depositFor()` (~1 hr)
3. Add a visible order-summary panel + return-policy text to `/cart/checkout` (~2-3 hrs)
4. Remove the stray `thermo-king-sg-3000-clip-on-gensets-1` redirected URL still sitting in the sitemap (~30 min)
5. Check Google Search Console URL Inspection on the homepage and top PDPs — free to check, could be the single highest-impact discovery of this audit (~30 min)

---

## Category Scores

| Category | Score (2026-07-21) | Score (2026-07-19) | Change |
|---|---|---|---|
| Sitemap | 90/100 | 88/100 | +2 |
| Technical SEO | 86/100 | 78/100 | +8 |
| Visual / Mobile | 80/100 | 42/100 | +38 |
| AI Search Readiness (GEO) | 79/100 | 58/100 | +21 |
| Schema / Structured Data | 78/100 | 62/100 | +16 |
| Content Quality | 74/100 | 52/100 | +22 |
| E-commerce SEO | 64/100 | 46/100 | +18 |
| Performance (CWV) | 48/100 | — (didn't finish) | new |
| *SXO (diagnostic, not scored)* | 40/100 | 34/100 | +6 |
| *Backlinks (diagnostic, not scored)* | 8/100 | 8/100 | unchanged |

Full detail for every category, finding, and recommendation: see `findings/*.md` and `audit-data.json`.

---

## What actually got fixed since 2026-07-19 (verified live, not just via commit log)

| Claimed fix | Commit | Verified? |
|---|---|---|
| Self-hosted product images, graceful fallback | `d4951fe` | ✅ Confirmed — 0 hotlinked references, 0 broken images across all pages tested |
| Merchant Center brand type + shippingDetails | `8174c6e` | ✅ Confirmed live in JSON-LD |
| 21 product titles fixed | `c7d77c0` | ✅ Confirmed; also verified zero exact-duplicate titles/descriptions catalog-wide |
| Real business address + About/Contact trust content | `d5f17b3` | ✅ Confirmed live, both pages |
| Flat $1,000 deposit, required payment method, return policy, order summary | `49fc49d` | ⚠️ **Partially false.** Deposit and required-payment-method landed; return-policy text and order summary do **not** appear on the live checkout page despite the commit message |
| Real server-side email via Resend | `0b364cf` | ✅ Confirmed — reservation/contact/newsletter all POST to API routes |
| (Not a commit — carried config) `images.unoptimized: true` | — | ❌ Never reverted after self-hosting landed; now the top Performance finding |

Also newly shipped, not previously flagged as a target: `/llms.txt`, per-product FAQ blocks + FAQPage schema, blog-to-PDP cross-linking (`getRelevantPosts`), and 4 confirmed-duplicate SKU pairs 301/308-merged (1 of 4 similar pairs — `thermo-king-sg-3000-clip-on-gensets-1` — still needs the same treatment).

---

## Why rankings are actually stuck (SXO + Backlinks synthesis)

The on-site work this cycle was substantial and verified — but two structural facts likely explain most of the ranking gap independent of anything fixable in code:

1. **Zero confirmed Google visibility.** The SXO specialist's WebSearch checks against 4 target queries plus a direct brand-name search returned zero appearances of containeronedepot.com anywhere in results. This is a bigger, more fundamental problem than any on-page finding above — **it should be verified via Search Console URL Inspection before investing further in on-page work**, since it's possible (though unconfirmed) that pages aren't indexed at all yet for a domain this young (~18 days since rebrand).
2. **Zero backlink/crawl footprint, still unconfirmed either direction this round.** Common Crawl queries timed out rather than completing; the prior audit's confirmed-zero result is carried forward as the last known state. Not unusual for an 18-day-old domain.
3. **Brand-name collision, now confirmed against more competitors.** Beyond `containerone.net`, this pass surfaced `containerone.com`, `containerdepotco.com`, and `houstoncontainerdepot.com` also ranking for the same queries, with no on-site trust counter-signal (reviews, BBB, years-in-business) to differentiate.

None of this makes the on-site work wasted — it's the necessary foundation for when the domain does get indexed and starts accumulating authority — but the Search Console check in Phase 1 should happen before anything else, since no amount of on-page polish converts traffic that never arrives.
