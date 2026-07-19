# Structured Data (Schema.org) Audit — containeronedepot.com

Pages checked (live, fetched raw HTML — schema is server-rendered, no SPA hydration gap): homepage, `/about`, `/product/10ft-refrigerated-container-10ft-freezer`, `/product/carrier-undermount-gensets`, `/category/shipping-containers`.

## What Works

- **Organization schema is present site-wide** (home, about, every product, every category page), not missing as initially suspected. Includes `name`, `url`, `logo` (absolute URL), and a `ContactPoint` with phone/email/areaServed. This is solid for brand entity recognition.
- **BreadcrumbList** is emitted correctly on product and category pages, with absolute URLs and correct `position`/`item` structure.
- **Product + Offer** schema uses `https://schema.org` context, valid `@type`, and (when triggered) a correctly-shaped `Offer` with `priceCurrency: "USD"`, numeric `price`, and `availability`.
- All 212 catalog products currently carry a numeric `regularPrice`/`salePrice` in the data source, so the "Offer omitted entirely" scenario is not currently live — but see Finding 3.
- No deprecated types (HowTo, FAQPage-as-rich-result expectation, SpecialAnnouncement) in use.

## Findings

1. **Title:** Product image URLs in JSON-LD are broken (domain concatenation bug)
   **Severity:** Critical
   **Description:** `src/app/product/[slug]/page.tsx` builds the `image` array as `` `${SITE.url}${img}` ``, but `product.images` in `src/data/products.json` already stores full absolute URLs from the old WordPress host (`https://conexdepotshipping.com/...`). The result on every single product page is a malformed URL: e.g. `"https://www.containeronedepot.comhttps://conexdepotshipping.com/wp-content/uploads/2025/06/10ft-Refrigerated-Container-For-Sale.jpg"`. Confirmed on both fetched product pages, and the images array field applies identically to all 212 products. Note this does **not** affect the visible gallery (`Gallery.tsx` uses `images` unmodified), so it's invisible in the browser — only the JSON-LD is broken.
   **Recommendation:** In `page.tsx`, only prefix `SITE.url` when the image path is relative: `img.startsWith("http") ? img : \`${SITE.url}${img}\``. This is a one-line fix affecting all product pages simultaneously.

2. **Title:** `availability` is hardcoded to `InStock` regardless of real stock
   **Severity:** High
   **Description:** The Offer block always sets `"availability": "https://schema.org/InStock"`. `products.json` has no `stockStatus`/`inStock` field to drive this, so a sold-out or discontinued item would still declare `InStock`, which violates Google's structured-data policy on accuracy and risks manual action if flagged.
   **Recommendation:** Add a stock field to the catalog data pipeline (even a manual boolean) and map to `InStock` / `OutOfStock` / `PreOrder` accordingly; default new/unknown items to `PreOrder` or omit `offers` rather than assume `InStock`.

3. **Title:** Offer block is silently omitted for "price on request" products (latent, not yet triggered)
   **Severity:** Medium
   **Description:** `page.tsx` only emits `offers` when `cartPrice` is truthy (`Number.isFinite(numericPrice) && numericPrice > 0`). No current product hits this path, but the "Price on request" UI copy exists specifically for this case, meaning it's an anticipated future state. A Product with no `offers` fails Google's Product rich-result eligibility entirely (an `offers`, `review`, or `aggregateRating` is required).
   **Recommendation:** When no numeric price exists, still emit an `Offer` with `availability` and a `priceSpecification`/`price: "0.00"` placeholder is discouraged — instead use `"availability": "https://schema.org/InStock"` plus omit `price` only if paired with `priceSpecification` referencing "call for quote," or simplest: keep emitting `offers` but flag internally that these SKUs need manual pricing before rich-result eligibility applies.

4. **Title:** Organization schema missing `sameAs`
   **Severity:** Low
   **Description:** No social/profile URLs are linked from the Organization block (no LinkedIn, Facebook, etc. found in the codebase), weakening entity disambiguation for Google's Knowledge Graph.
   **Recommendation:** Add `sameAs` array once verified business social profiles exist; skip otherwise rather than inventing placeholder links.

5. **Title:** CollectionPage lacks an ItemList of products
   **Severity:** Low
   **Description:** `/category/shipping-containers` emits `CollectionPage` with only `name`/`description`/`url` — no `mainEntity` `ItemList` linking to the products shown, a missed opportunity for AI/LLM parsing of category-to-product relationships (no Google SERP feature at stake).
   **Recommendation:** Add `mainEntity: { "@type": "ItemList", "itemListElement": [...] }` referencing product URLs.

6. **Title:** No FAQPage/Review schema present
   **Severity:** Info
   **Description:** No FAQ or review content exists on the site, so nothing to flag or fabricate. Correct as-is.
   **Recommendation:** None required; if FAQ content is added later, it aids AI citation but confers no Google SERP benefit (retired May 2026).

## Score: 62/100

Sitewide Organization + Breadcrumb + Product/Offer coverage is architecturally correct, but a Critical, 100%-of-catalog image URL bug and a hardcoded-availability accuracy issue undermine Product rich-result eligibility until fixed.
