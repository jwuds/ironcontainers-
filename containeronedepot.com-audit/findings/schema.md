# Schema & Structured Data

Score: 78/100

Pages checked (live, raw HTML fetch — confirmed server-rendered, no SPA hydration gap): homepage, `/about`, `/contact`, `/category/shipping-containers`, `/product/1000-gallon-underground-propane-tanks`, `/product/10ft-refrigerated-container-10ft-freezer`, `/blog`, `/blog/container-grades-explained`. Cross-referenced against source in `src/app/product/[slug]/page.tsx`, `src/app/category/[slug]/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/layout.tsx`, `src/lib/faq.ts`, `src/data/products.json`.

## What Works

- **Product image URLs now resolve correctly.** The `${SITE.url}${img}` concatenation bug is fixed — `page.tsx` now does `img.startsWith("http") ? img : \`${SITE.url}${img}\``, and the live JSON-LD `image` array on both spot-checked products (1000-gallon propane tank, 10ft reefer) is fully self-hosted (`/images/...`) and confirmed to return HTTP 200.
- **Merchant Center brand-type fix confirmed live**: `brand` is now `{"@type": "Brand", "name": "Container One Depot"}` (was `Organization`, which Merchant Center rejects for this field).
- **`OfferShippingDetails` confirmed live** on every Offer, with `shippingDestination: {"@type": "DefinedRegion", "addressCountry": "US"}`. No fabricated flat `shippingRate` — correct call given freight is quoted per unit.
- **FAQPage schema is now live sitewide on product pages** (new since the last audit). Verified well-formed JSON-LD (`Question`/`acceptedAnswer`/`Answer` structure correct) and — critically — verified it **matches the visible "Common Questions" section** on the rendered page verbatim on both spot-checked products, including the conditional "available new or used?" question that only appears when a `condition` spec exists (65/208 products). No hallucinated/invisible content.
- **Organization schema present site-wide** (home, about, contact, category, product, blog) with `name`, `url`, `logo` (absolute), and a `ContactPoint` with phone/email/areaServed.
- **BreadcrumbList** correct on product and category pages — absolute URLs, correct `position`/`item` nesting.
- **hasMerchantReturnPolicy** present and internally consistent (`merchantReturnDays: 7` matches the FAQ's stated "7 days" return policy and the site's actual return-policy copy).
- No deprecated types in use (no HowTo, no SpecialAnnouncement); FAQPage use is appropriate per current guidance (no SERP feature, but aids AI/LLM citation).
- All 208 catalog products carry a numeric price, so the "Offer omitted" code path remains untriggered in production.

## Findings

1. **Title:** `availability` still hardcoded to `InStock` regardless of real stock
   **Severity:** High
   **Description:** Unchanged from prior audit. `products.json` still has no stock-status field; every Offer unconditionally emits `"availability": "https://schema.org/InStock"`. A sold-out/discontinued unit would still declare in-stock, risking Google structured-data accuracy flags.
   **Recommendation:** Add a `stockStatus` field to the catalog pipeline; map to `InStock`/`OutOfStock`/`PreOrder`.
   **Status vs prior audit:** Still Open.

2. **Title:** BlogPosting schema missing `image` and `publisher.logo`
   **Severity:** Medium
   **Description:** New finding (blog wasn't in the prior audit's fetch scope). `/blog/container-grades-explained` emits a `BlogPosting` block with `headline`, `description`, `datePublished`, `author`, `publisher` — but `publisher` is a bare `{"@type": "Organization", "name": ...}` with no `logo` (an `ImageObject`), and there is no top-level `image`. Google's Article/BlogPosting rich-result guidelines require `publisher.logo` and recommend `image`; without them the post is ineligible for Article-type rich results even though the type is otherwise correctly used.
   **Recommendation:** Add `image: [absolute URL]` (a hero image or fallback OG image) and `publisher.logo: {"@type": "ImageObject", "url": "https://www.containeronedepot.com/logo-mark-256.png"}` to the `blogPostingJsonLd` object in `src/app/blog/[slug]/page.tsx`.
   **Status vs prior audit:** New.

3. **Title:** Offer block still silently omitted for "price on request" products (latent)
   **Severity:** Medium
   **Description:** Unchanged. Code path (`cartPrice` truthy check) is untouched; currently 0/208 products trigger it (verified via `products.json`), but if a future SKU is added with no price, its Product schema would have no `offers`/`review`/`aggregateRating` and fail Product rich-result eligibility entirely.
   **Recommendation:** Same as before — flag internally for manual pricing before publish, or emit a `priceSpecification`-based "call for quote" pattern instead of omitting `offers`.
   **Status vs prior audit:** Still Open.

4. **Title:** Organization schema missing `sameAs`
   **Severity:** Low
   **Description:** Unchanged — no social/profile URLs linked from the Organization block on any page.
   **Recommendation:** Add `sameAs` array once verified business profiles exist (LinkedIn, Facebook, BBB, etc.); don't fabricate.
   **Status vs prior audit:** Still Open.

5. **Title:** CollectionPage lacks an `ItemList` of products
   **Severity:** Low
   **Description:** Unchanged — `/category/shipping-containers` still emits `CollectionPage` with only `name`/`description`/`url`, no `mainEntity` `ItemList`.
   **Recommendation:** Add `mainEntity: {"@type": "ItemList", "itemListElement": [...]}` referencing product URLs/positions — helps AI/LLM parsing of category-to-product relationships.
   **Status vs prior audit:** Still Open.

6. **Title:** `sku` field contains a data-quality anomaly on at least one product
   **Severity:** Low
   **Description:** New finding. Only 11/208 products carry a `sku` value at all. Ten look like genuine part numbers (`door3068`, `rollupdoor468`, `officekit20`, etc.), but `40ft-high-cube-1-trip-blue-shipping-container-40hc1tripblue` has `sku: "Los_Angeles_CA"` — a location string, not a SKU. This flows straight into the Product JSON-LD `sku` property, publishing incorrect structured data for that one listing.
   **Recommendation:** Fix the source value in `src/data/products.json` (or wherever this record originates in the scraper/import pipeline) — either supply a real SKU or omit the field for that product, consistent with the `sku: product.sku || undefined` fallback already in `page.tsx`.
   **Status vs prior audit:** New.

7. **Title:** No `WebSite`/opening-hours schema on homepage despite data already existing
   **Severity:** Low
   **Description:** New observation. `SITE.hours` ("Mon–Fri, 8am–6pm") is rendered in the footer but never surfaced in structured data. Homepage also has no `WebSite` entity (which would let Organization and WebSite be linked via `@id`, and is a prerequisite if a Sitelinks Searchbox is ever desired).
   **Recommendation:** Optional enhancement — add `openingHoursSpecification` to the Organization block using existing `SITE.hours`, and consider a lightweight `WebSite` JSON-LD block on the homepage with `url`/`name`. Low priority, no urgent risk.
   **Status vs prior audit:** New (opportunity, not a defect).

8. **Title:** FAQPage answer content is largely boilerplate, identical across most of the 208 product pages
   **Severity:** Info
   **Description:** 3 of the 4 (or 4 of 5, when a `condition` spec exists) FAQ entries — deposit process, delivery, return policy, Section 179 — are word-for-word identical across nearly every product page; only the conditional "new or used" question varies per product. This is schema-valid and matches visible content (no spec violation), but as a content-uniqueness signal for AI/LLM citation, near-duplicate FAQPage blocks across the catalog dilute per-page distinctiveness.
   **Recommendation:** No schema change needed. If GEO/AI-citation performance is a priority, consider adding one product-specific FAQ (e.g., derived from a spec field like dimensions/capacity) per listing to increase uniqueness — optional, not a defect.
   **Status vs prior audit:** New (informational; FAQPage itself is a net-new, correctly-implemented addition since the last audit).

## Score: 78/100

The Critical image-URL bug, the Merchant Center brand-type error, and the missing-FAQPage gap from the prior audit are all confirmed fixed and verified live. Remaining deductions are one High (hardcoded `InStock` availability — an accuracy/policy risk under Google's structured-data guidelines), one latent Medium (Offer omission on future price-on-request SKUs), one live Medium (BlogPosting missing `publisher.logo`/`image`, blocking Article rich-result eligibility), and several Low-severity completeness/data-quality gaps (`sameAs`, `ItemList`, one bad `sku` value, unused opening-hours data).
