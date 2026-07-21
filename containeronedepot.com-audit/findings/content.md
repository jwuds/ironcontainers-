# Content Quality

Score: 74/100

Re-audit of containeronedepot.com against the 2026-07-19 baseline. Sampled live: `/about`, `/contact`, `/blog` + all 4 posts, `/category/tanks`, `/product/10ft-refrigerated-container-10ft-freezer`, `/product/1000-gallon-nh3-tanks`, `/llms.txt`. Both commits named in the brief (`d5f17b3` address/trust content, `c7d77c0` title fixes) were verified live via rendered HTML, not just via git log. Two of the prior audit's top findings (the Critical truncation bug and the High-severity About/Contact thinness) are now fixed on production; the blog-depth/byline gap remains open, and category pages are unchanged.

## What Works

- **The crawler-hiding truncation bug is genuinely fixed.** On the 10ft reefer product page, the full ~1,400-character description (all three paragraphs — cooling range, construction specs, the ocean-freight sizing caveat) is now present verbatim in the server-rendered `<p>` tag. Truncation is done with `line-clamp-6` CSS on that same element plus a "Read more" toggle button, not conditional rendering — exactly the fix the prior audit recommended. Crawlers reading raw HTML now see 100% of the copy, not the ~33% measured previously.
- **Real business address and expanded trust content shipped to production.** `/about` and `/contact` both now render "4120 Underwood Road, La Porte, TX 77571," Mission/Vision/Values framing, a "what we stand for" list (Integrity, Quality, Sustainability, Reliability, Customer First), an "Industries we serve" list, and a concrete trust-signal list on Contact (grading system, deposit process, delivery, support). This is a real, verified production upgrade to Trustworthiness/Authoritativeness, not just a git commit that never deployed.
- **Product titles are cleaner.** The 10ft reefer product now renders as "10ft Refrigerated Container / Freezer" (was "...Container 10ft Freezer"). Per the commit message, the fix also confirmed zero exact-duplicate titles/meta descriptions across all 208 products — a positive baseline the prior audit hadn't explicitly checked.
- **New since the prior audit, not previously flagged:** every product page now carries a "Common Questions" FAQ block (confirmed live on the NH3 tank page: deposit process, delivery/cost, return policy, Section 179 write-off) plus "Related Guides" links into the blog — good for AI citation readiness (discrete, quotable Q&A pairs) and internal topical linking. A public `/llms.txt` is also live, cleanly listing categories, guides, and buying-process facts in structured Markdown.
- Rewritten product descriptions remain specific and technical (PSI ratings, PP/316 stainless fittings, Hastelloy/titanium bolts for ammonia compatibility, exact weights) — no factual errors spotted in the sample.

## Findings

1. **Title:** Blog remains thin, still only 4 posts, still no bylines
   **Severity:** High
   **Description:** `/blog` and `/llms.txt` both confirm only 4 posts live, dated Feb–May 2026 — no post has been added since the prior audit. Listing-page teasers are one sentence each; no evidence in the git log or rendered output of an author name, bio, or credential being added to any post. No commit since the last audit touches blog content depth or authorship.
   **Recommendation:** Expand each post toward the ~1,500-word blog floor with worked examples/numbers, and add a named, credentialed byline (even "Written by [name], [X years] in industrial equipment sales/logistics") to support Expertise and Experience signals.
   **Status vs prior audit:** Still Open

2. **Title:** Rewritten descriptions were crawler-hidden by truncation — now fully server-rendered
   **Severity:** Was Critical
   **Description:** Verified live on the 10ft reefer PDP: the complete description (all facts previously only recoverable from the hydration payload — "5-pole 32A," "14-gauge steel," the ocean-freight 20ft-minimum caveat) is present in the initial server HTML inside a `<p class="... line-clamp-6">`, with visual truncation handled by CSS `line-clamp` and a "Read more" toggle rather than by omitting text from the DOM.
   **Recommendation:** No further action needed; this pattern (CSS-clamp + full text in the DOM) should be the standard for any future truncated-text components on the site.
   **Status vs prior audit:** Fixed

3. **Title:** About/Contact carried almost no trust/E-E-A-T signal — now substantially expanded and live
   **Severity:** Was High
   **Description:** Confirmed live rendering of a real street address, mission/vision/values, "what we stand for," industries served, and a Contact trust-signal list. The commit message is explicit that founding-year claims, "thousands supplied," and named certifications/licensing/insurance were deliberately left out because they aren't confirmed to be real — an honest choice, but it means Authoritativeness signals (third-party recognition, credentials, licensing) are still absent, just no longer overstated.
   **Recommendation:** If the business does hold any real certifications, licenses, or insurance, add them explicitly — this is the single highest-leverage remaining Trustworthiness gap. Otherwise, no further action; do not fabricate credentials.
   **Status vs prior audit:** Fixed (core gap closed; the residual sub-issue — no verifiable third-party credentials — is tracked as a new, distinct finding below)

4. **Title:** Product titles with awkwardly repeated words
   **Severity:** Was Medium (SERP snippet quality)
   **Description:** Verified live: the flagged 10ft reefer title now reads "10ft Refrigerated Container / Freezer." Commit `c7d77c0` also reports 39 titles and 25 meta descriptions are long enough to truncate in search snippets — left as-is per the commit, a minor cosmetic issue, not a content-quality defect.
   **Recommendation:** Low priority: trim the 39/25 long titles/descriptions toward ~60/155 characters when convenient.
   **Status vs prior audit:** Fixed (the repeated-word issue); the truncation-length sub-item is a new, low-severity note not previously tracked

5. **Title:** Category pages still have no unique topical copy
   **Severity:** Medium
   **Description:** `/category/tanks` was re-checked live and is unchanged from the prior audit: a single tagline ("Propane and NH3 storage tanks.") above the product grid, no buying-guide intro, no FAQ, no differentiation from the other 7 category pages. No commit in the intervening log touches category pages.
   **Recommendation:** Add a 150–300 word intro per category (use cases, grade/condition options, links to relevant blog guides) — the new FAQ pattern already used on product pages would translate well here.
   **Status vs prior audit:** Still Open

6. **Title:** Repeated boilerplate CTA sentence across product bodies
   **Severity:** Medium
   **Description:** "Contact our team to confirm current availability" still closes the sampled NH3 tank description verbatim, same as the reefer page. At 208-product scale this remains a near-duplicate boilerplate tail, though its relative weight is now lower since each product page also carries a unique 4-question FAQ block underneath it.
   **Recommendation:** Vary or remove the closing CTA sentence; the Quote/Reserve buttons and new FAQ block already cover that action.
   **Status vs prior audit:** Still Open

7. **Title:** No verifiable third-party credentials, licensing, or certifications anywhere on site
   **Severity:** Medium
   **Description:** Confirmed via live About/Contact content and the commit message: the business explicitly has no confirmed ASME/DOT/ISO licensing, insurance, or founding-year history to publish, and chose honesty over fabrication. This caps the Authoritativeness/Trustworthiness ceiling for a high-ticket industrial equipment seller regardless of copy quality elsewhere.
   **Recommendation:** If any real credentials exist (business license, bonding/insurance, industry association membership, BBB profile), surface them. If genuinely none exist yet, consider pursuing at least a Google Business Profile with reviews and a BBB listing — both independently verifiable off-site signals.
   **Status vs prior audit:** New (surfaced as a distinct, more precise finding now that the generic "thin About/Contact" issue is resolved)

8. **Title:** No visible author/freshness schema in rendered blog output
   **Severity:** Low
   **Description:** Unchanged from prior audit: blog post dates render but no visible "last updated," author name, or Article-schema-driven byline was found in the sampled output.
   **Recommendation:** Add visible author + last-updated markup once bylines exist (see Finding 1).
   **Status vs prior audit:** Still Open

## E-E-A-T Breakdown (approximate)

| Factor | Weight | Score | Notes |
|---|---|---|---|
| Experience | 20% | 65/100 | Specific, technical product copy reads as first-hand expertise; no first-hand narrative content (case studies, delivery photos, customer stories) |
| Expertise | 25% | 60/100 | Accurate, jargon-correct product specs; undermined by zero named authors anywhere on the site |
| Authoritativeness | 25% | 55/100 | No third-party citations, reviews, or credentials; real address is a modest positive |
| Trustworthiness | 30% | 80/100 | Real address, transparent grading system, clear deposit/return policy, FAQ blocks, consistent contact info — the strongest factor post-fix |

## AI Citation Readiness: 78/100

Strong structural gains since the prior audit: full description text now in the DOM (was the biggest blocker), per-product FAQ blocks with likely FAQPage schema, `/llms.txt`, and cross-links to blog guides. Remaining gap: category pages and blog posts lack the same structured, quotable density the product pages now have.
