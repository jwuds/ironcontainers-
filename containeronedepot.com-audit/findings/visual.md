# Visual Analysis — containeronedepot.com

Pages tested: Homepage, Product (`/product/10ft-refrigerated-container-10ft-freezer`), Category (`/category/shipping-containers`). Viewports: 1440x900 (desktop), 390x844 (mobile). Screenshots in `screenshots/` (viewport + scroll-segment captures per page).

## What works
- Hero on both desktop and mobile leads with a bold H1 ("Heavy Equipment, Ready to Move."), a one-line value prop, and two clear CTAs ("Shop Inventory" / "Reserve a Unit") — all visible above the fold on both breakpoints.
- Dark theme with orange accent and monospace label chips ("212 UNITS IN STOCK", trust badges) reads clean and on-brand; no overlapping elements or broken grid at either width.
- Mobile nav collapses correctly to a hamburger icon; no horizontal scroll on any of the three pages at 390px (verified via `scrollWidth`/`clientWidth`).
- Product page CTA stack ("Request a Quote" primary, "Reserve This Unit" secondary) is well-differentiated visually and the layout reflows sensibly to a single column on mobile.
- Category filter/sort UI is functional and readable, with counts per filter, on both breakpoints.

## Findings

- **Title:** Product images are broken site-wide (HTTP 402 from Next.js image optimizer)
  **Severity:** Critical
  **Description:** Every product photo — main gallery image, all thumbnails, and related-product cards — renders as a broken-image icon on the homepage, product page, and category page, on both desktop and mobile. This is not a screenshot-stitching artifact; confirmed via network inspection that Next.js's `/_next/image` optimization endpoint is returning **402 Payment Required** for every remote image (sources are `conexdepotshipping.com` and `cdn.shopify.com`). This is consistent with a Vercel image-optimization usage/billing limit being exceeded.
  **Recommendation:** Check the hosting billing/usage dashboard immediately for image optimization quota; as a stopgap, disable Next.js image optimization for these remote domains (`unoptimized: true` or serve pre-optimized URLs) so raw images load while the quota/billing issue is resolved.

- **Title:** Product gallery is unusable
  **Severity:** Critical
  **Description:** Direct consequence of the above — the entire image gallery (7 thumbnails, main image, zoom) shows only broken-image placeholders on the reefer container product page, so shoppers cannot see the product they're being asked to pay $3,100+ for or request a quote on.
  **Recommendation:** Same fix as above; add an `onError` fallback placeholder graphic in the meantime so broken images at least render a branded "image unavailable" state instead of a raw broken-icon glyph.

- **Title:** "Add to Cart" tap target undersized on mobile category cards
  **Severity:** High
  **Description:** Measured bounding box for the "ADD TO CART" button on category product cards at 390px width is 147x29px — well under the 48px minimum touch-target height (WCAG 2.5.5 / Apple & Google guidance).
  **Recommendation:** Increase button min-height to 44-48px with more vertical padding on mobile card layouts.

- **Title:** "Request a Quote" button sits exactly at the minimum tap-target threshold
  **Severity:** Medium
  **Description:** Measured height is 48px on mobile (product page) — technically meets the bare minimum but has no comfortable margin, especially with an icon/arrow-adjacent "Reserve This Unit" button directly below it (measured 50px) separated by only a thin rule.
  **Recommendation:** Bump both buttons to ~52-56px height and add a touch few more px of vertical gap between them to reduce mis-tap risk.

- **Title:** Category filter chips are short and dense on mobile
  **Severity:** Low
  **Description:** Filter chip height measured at 30px on mobile; 13 stacked filter chips plus sort controls push the actual product grid down roughly 1.5 viewport-heights before the first product card appears, meaning users must scroll significantly before seeing inventory.
  **Recommendation:** Consider collapsing filters into an expandable "Filters" drawer/accordion on mobile so products appear closer to the top, and increase chip height to ~44px for easier tapping.

- **Title:** Location label formatting ("Graham_TX")
  **Severity:** Low
  **Description:** Product cards show location as `Graham_TX` with an underscore instead of "Graham, TX" — a data-formatting artifact visible on category and related-product cards.
  **Recommendation:** Format location field with a comma/space when rendering (e.g., `city.replace('_', ', ')`).

- **Title:** No real fixed-header/hero overlap bug found
  **Severity:** Info
  **Description:** Per the known sticky-header caveat, in-viewport screenshots before/after scroll were checked; no genuine overlap between header and hero content was observed at either breakpoint.
  **Recommendation:** None needed.

## Category Score: 42/100
Layout, typography, and information architecture are solid on both desktop and mobile, but a site-wide critical image-loading failure (HTTP 402) makes the product gallery and every product thumbnail non-functional right now, which caps the score regardless of otherwise good responsive design.
