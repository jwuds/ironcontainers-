# Container One Depot — Homepage Rebuild Prompt

## Context
Site: ironcontainers.vercel.app (Container One Depot)
Stack: Next.js / TypeScript / Tailwind / Supabase / Vercel
Business: Industrial equipment marketplace — shipping containers, refrigerated containers, generators, tanks, trailers, accessories.
Goal: Rebuild the homepage into a high-conversion, "buy now" e-commerce experience while keeping every trust element factually accurate (no fabricated stats, reviews, or brand endorsements).

## Hard Rules
- Do NOT invent statistics, ratings, testimonials, or brand-partner logos. Every number shown must come from real Supabase data (unit counts, category counts) or be left out.
- "Buy Now" language requires a working purchase flow (cart → checkout → payment → freight/shipping calculation). Do not ship "Buy Now" copy on top of a dead-end contact form. If checkout isn't ready yet, flag this and use "Add to Cart" until it is.
- Keep the existing dark industrial theme (near-black background, orange/amber accent, condensed bold display type) already established on the site.
- Mobile-first. Current traffic is mobile-heavy based on existing screenshots.

## Build Order (top to bottom)

### 1. Announcement Bar
Thin bar, full width, above header. Sticky optional (can scroll away).
Content: "🚚 Nationwide Delivery • 💰 Financing Available • 📞 Call Now: [PHONE NUMBER]"
- Phone number should be a `tel:` link.
- Background: dark, accent-orange text or thin orange top border.

### 2. Header (sticky)
Row: Logo — Search icon — Phone icon (tel: link, visible at all screen sizes, not just desktop) — Cart icon with item count badge — Hamburger (☰)

Hamburger menu (slide-out or dropdown), in this order:
- Home
- Shop (expandable submenu)
  - Shipping Containers
  - Refrigerated Containers
  - Generators & Power Systems
  - Tanks
  - Trailers & Chassis
  - Accessories & Parts
- Financing
- About
- Contact

Pull category names and live counts from Supabase categories table — do not hardcode.

### 3. Hero
- Headline: "Heavy Equipment. Ready To Move." (two-line, second line in accent orange, matches existing style)
- Subtext: "Quality shipping containers, generators, tanks, refrigerated units and industrial equipment — in stock and ready to ship now."
- Primary CTA button (orange, filled): "Shop Inventory" → links to /catalog
- Secondary CTA button (outline): "Buy Now" → links to top-selling/featured product or catalog with buy-now filter
- Trust line under buttons: "✓ In Stock  ✓ Financing Available  ✓ Inspected Equipment"

### 4. Trust Bar
Real data only, pulled live from Supabase:
- [X] Units In Stock
- [X] Categories
- "Nationwide" / Delivery
- "Available" / Financing

Keep the existing stat-bar visual style (large number, small label underneath).

### 5. Shop by Category
Keep exactly as currently built — 8-category grid with live unit counts and category hero images. No changes.

### 6. Why Buy From Container One Depot (NEW)
Icon row/grid, 5 items:
- 🚚 Nationwide Shipping
- 🏗 Commercial-Grade Equipment
- 💰 Financing Options
- ✔ Quality-Inspected Inventory
- 📞 Direct Line to a Real Person

Each: icon, short bold label, one-line supporting sentence. Use existing dark card style from the site.

### 7. Industries We Serve (NEW)
Card grid, 7 industries:
Construction, Agriculture, Oil & Gas, Warehousing, Events, Government, Manufacturing

Each card: relevant icon or small photo, industry name only (keep copy minimal — this section's job is visual recognition, not explanation).

### 8. From the Yard (Featured Inventory)
Keep existing "one per category" layout and logic.
Changes:
- Change button label from "Add to Cart" to **"Buy Now"** on every product card.
- "Buy Now" adds item to cart AND routes directly to checkout (skip cart review step) — true buy-now flow, not just a relabeled add-to-cart.
- Add conditional urgency tags based on real inventory data (only show if true):
  - "Only 1 Left" — when stock_quantity === 1
  - "Ships This Week" — when a ship-ready flag/field is true
  - "Multiple Units Available" — when stock_quantity > 1 (already partially present)
- Keep strike-through pricing where a sale price exists (already implemented).
- Section CTA button: "View Full Inventory" → /catalog

### 9. How It Works (NEW)
4-step horizontal (desktop) / vertical (mobile) flow with connecting arrows/lines:
① Browse & Buy Now
② We Confirm & Prep Your Unit
③ Nationwide Delivery Arranged
④ Equipment Delivered

Each step: number badge, short title, one-line description.

### 10. Financing + Final CTA (merged)
Full-width dark section, high contrast (can use accent orange background instead of near-black for pop against the rest of the page).
- Headline: "Need It Now? Get Financed Today."
- Subtext: "Flexible financing for qualified buyers. Buy now, pay over time."
- Two buttons: "Check Financing" (links to /financing) and "Buy Now" (links to /catalog)

### 11. Footer
Standard 4-column footer:
- Products (category links)
- Company (About, Contact)
- Support (Financing, FAQ if built, Shipping Info)
- Newsletter signup (email capture)
Keep existing footer content/legal lines (© year, unit/category counts) — just restructure into columns if not already.

## Explicitly Deferred to Phase 2 (do not build now)
- Featured Brands / manufacturer logos — requires confirming authorized dealer status first (trademark risk otherwise).
- Customer Testimonials — only add once real reviews exist with real company names.
- Blog / Latest Articles section.
- Nationwide Delivery Map (visual US map with pins).
- Compare Products / Recently Viewed.
- FAQ section.
- Popular Searches block.

## Technical Notes
- All dynamic counts (units, categories, stock flags) must come from Supabase — no hardcoded numbers anywhere on this page.
- Ensure "Buy Now" cart/checkout logic is tested end-to-end (add item → checkout → payment → confirmation) before deploying this copy change; if checkout isn't production-ready, use "Add to Cart" as a placeholder and flag this explicitly in the PR/commit message.
- Maintain existing JSON-LD / structured data on the homepage (Organization + ItemList for featured products) and extend it to cover the new sections where applicable (e.g., FAQPage schema when FAQ ships in Phase 2).
- Confirm mobile tap targets on hamburger submenu items are large enough (min 44px height) given the six shop sub-links.
- Phone number in header and announcement bar should be the same real business number, wrapped in `tel:` links both places.
