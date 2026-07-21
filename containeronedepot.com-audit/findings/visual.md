# Visual / Mobile

Score: 80/100

Pages tested: Homepage, Category (`/category/shipping-containers`), Product (`/product/1000-gallon-underground-propane-tanks`), Checkout (`/cart/checkout`, both empty-cart and with-item states). Viewports: 1920x1080 (desktop), 375x812 (mobile). Screenshots in `screenshots/` (viewport + full-page captures per page, plus `checkout-desktop-payment-modal.png` and `checkout-*-empty-*.png`).

## What Works
- The critical site-wide image failure from the prior audit is resolved: every product photo on the homepage, category grid, and product gallery now loads (HTTP 200) from `www.containeronedepot.com/images/...` — confirmed self-hosted, not hotlinked from `conexdepotshipping.com`/`cdn.shopify.com` anymore. Filenames still carry the legacy `conexdepotshipping-`/`cdn-` prefix, but that's cosmetic (URL slug only) and does not affect reliability.
- Product page gallery (10 thumbnails + main image) renders fully and correctly on both desktop and mobile for the propane tank product tested.
- Zero broken images, zero console errors, zero failed network requests, and no horizontal scroll detected across all 8 page/viewport combinations tested (programmatically verified via `scrollWidth`/`clientWidth` and `naturalWidth` checks).
- The new `/cart/checkout` page (commit 49fc49d) renders cleanly on both desktop and mobile: clear "STEP 3 OF 3" progress indicator, dark theme consistent with the rest of the site, no overlapping elements, no layout shift.
- The "Choose Payment Method" modal (Credit Card / PayPal / Apple Pay / Zelle / Bank Transfer) is well-designed, centers correctly, and dims the background without breaking layout on desktop.
- Homepage hero (H1 "Heavy Equipment, Ready to Move." + CTAs "Shop Inventory"/"Reserve a Unit") remains visible above the fold on both breakpoints, consistent with prior audit.
- Category filter/sort UI remains functional with per-filter counts on both breakpoints.

## Findings

- **Title:** Product images broken site-wide (HTTP 402)
  **Severity:** Critical (prior)
  **Description:** Previously every product photo returned HTTP 402 from the Next.js image optimizer, sourced from third-party domains.
  **Recommendation:** N/A — resolved.
  **Status vs prior audit:** Fixed. Verified all sampled images on home, category, and product pages return HTTP 200 from `containeronedepot.com/images/`, with zero broken `<img>` elements detected via `naturalWidth` checks.

- **Title:** Product gallery unusable
  **Severity:** Critical (prior)
  **Description:** Direct consequence of the above — gallery showed only broken-image icons.
  **Recommendation:** N/A — resolved.
  **Status vs prior audit:** Fixed. The 10-image gallery on the propane tank product page loads fully on both desktop and mobile.

- **Title:** Checkout has no order summary despite commit description
  **Severity:** High
  **Description:** Commit 49fc49d's message references adding an "order summary," but the rendered `/cart/checkout` page (both with an item added to cart and empty) shows no product name, thumbnail, quantity, or line-item price anywhere in the DOM. The only visible reference to the cart contents is a small "1" badge on the header cart icon; the main content only shows a flat "Total deposit due: $1,000" with no connection to which unit was reserved. A shopper reviewing this page before submitting a $1,000 deposit has no on-screen confirmation of what they're actually buying.
  **Recommendation:** Add a visible order-summary panel/card showing the reserved unit's name, thumbnail, and price alongside the deposit total before the "Submit Reservation Request" button.
  **Status vs prior audit:** New finding (checkout page not covered in prior audit).

- **Title:** No visible return policy text on checkout
  **Severity:** Medium
  **Description:** Commit 49fc49d's message also references a "return policy," but a full-text and full-HTML search of the rendered checkout page (with item in cart) for "return" or "policy" returned zero matches on both desktop and mobile. The only related disclosure is a one-line note under the payment method field: "card details are never stored or sent."
  **Recommendation:** Either surface the return/deposit policy text on the checkout page itself (e.g., near the deposit total or as a linked modal) or confirm it lives elsewhere (product page, footer) and link to it explicitly from checkout, since this is a $1,000 non-trivial deposit commitment.
  **Status vs prior audit:** New finding.

- **Title:** Category grid thumbnails have a multi-second render delay
  **Severity:** Low
  **Description:** Immediately after page load (and even after a scroll-triggered lazy-load pass with a ~1s wait), category grid card images render as flat dark placeholder boxes with no visible photo content, even though the underlying `<img>` elements report full `naturalWidth`/`naturalHeight` and `opacity: 1`. Waiting ~8 seconds after load resolves this and all images render correctly. This is not a broken-image bug, but the perceived-performance delay is long enough that a user could reasonably believe images are broken during that window.
  **Recommendation:** Investigate whether this is a CSS transition/blur-placeholder fade-in with too long a duration, or a lazy-loading threshold that's too conservative; consider prioritizing above-the-fold category card images with `loading="eager"`/`fetchpriority="high"` for the first row.
  **Status vs prior audit:** New finding (related to, but distinct from, the prior 402 issue).

- **Title:** "Add to Cart" tap target undersized on mobile category cards
  **Severity:** High (prior)
  **Description:** Prior audit measured 147x29px on mobile category cards, under the 48px minimum.
  **Recommendation:** Increase button min-height to 44-48px on mobile card layouts.
  **Status vs prior audit:** Not re-verified this round — precise bounding-box measurement was not completed before this report was due. Visual inspection of the new mobile category screenshot shows the button still appears visually short relative to the card; recommend re-measuring in a follow-up pass.

- **Title:** "Request a Quote"/"Reserve This Unit" buttons near minimum tap-target threshold
  **Severity:** Medium (prior)
  **Description:** Prior audit measured 48px/50px height with thin separation.
  **Recommendation:** Bump both buttons to ~52-56px with more vertical gap.
  **Status vs prior audit:** Not re-verified this round (measurement script did not complete in time). Not visually flagged as broken in this round's screenshots, but exact pixel heights were not re-measured.

- **Title:** Category filter chips dense on mobile
  **Severity:** Low (prior)
  **Description:** Prior audit found 13 stacked filter chips pushing the product grid down ~1.5 viewport-heights on mobile.
  **Recommendation:** Collapse into an expandable "Filters" drawer/accordion on mobile.
  **Status vs prior audit:** Still Open. New mobile category screenshot shows the same pattern — 12+ stacked filter chips visible before any product card appears in the viewport.

- **Title:** Location label formatting ("Graham_TX")
  **Severity:** Low (prior)
  **Description:** Product cards previously showed underscore-separated location strings.
  **Recommendation:** Format with a comma/space when rendering.
  **Status vs prior audit:** Not re-evaluated this round — not visible in the specific cards captured; needs a targeted re-check on a product/category card that includes a location label.
