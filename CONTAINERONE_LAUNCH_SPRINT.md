# CONTAINER ONE DEPOT — LAUNCH SPRINT MASTER PROMPT
**Goal: full site optimization → live this week**
Site: ironcontainers.vercel.app → containeronedepot.com
Stack: Next.js / TypeScript / Tailwind / Supabase / Vercel

---

## 0. CONTEXT & LOCKED DECISIONS

You are completing the final launch sprint for Container One Depot, an industrial equipment e-commerce site (shipping containers, refrigerated containers, gensets, tanks, trailers, parts). A site-wide external audit found the site is currently **two sites at once**: the new Container One Depot build (homepage, product, about, blog, cart, contact) and the legacy "Ironhold" build still serving `/catalog` and all `/category/*` routes. This sprint eliminates every legacy remnant, cleans all product data, and makes the site production-ready.

**Locked business decisions (do not revisit, implement exactly):**
- **Pricing rule:** Units priced **under $25,000** display the price and are reservable online. Units **$25,000 and above** are **quote-only** (no price shown, "Request a Quote" CTA). This rule is enforced in one place (a helper like `getDisplayMode(price)`) and used everywhere: cards, product pages, featured grids, structured data.
- **Deposit:** **$1,000 flat, refundable**, per unit reservation. Replace every instance of "small refundable deposit" with the explicit number. Deposit holds price for 48–72 hours while availability is confirmed (matches existing blog post).
- **Real-data-only philosophy:** No placeholder content, no fake stats, no invented testimonials, no stock counts that aren't computed from the live database. Ever.

**Existing design system (already established — extend, don't replace):**
- Industrial charcoal base + safety-orange accent
- Type: Oswald (display), Inter (body), IBM Plex Mono (SKUs, specs, data)
- Voice: direct, jobsite-plain, no marketing fluff. "Heavy equipment, ready to move."

---

## PHASE 1 — KILL IRONHOLD: ONE SITE, ONE BRAND, ONE DATA SOURCE
*Highest priority. Nothing else ships until this is done.*

### 1.1 Migrate /catalog and /category/* to the new design system
- Rebuild `/catalog` and all `/category/[slug]` pages using the Container One Depot layout: new header (top bar with phone, nav, search/cart icons), new footer, new card components.
- Delete or quarantine every legacy Ironhold component, layout, page file, and route so it cannot render anywhere.
- Grep the entire repo for `ironhold` (case-insensitive) — remove from components, metadata, copy, alt text, config, and env. Zero occurrences at the end.

**Acceptance criteria:**
- [ ] Every route on the site renders the same header, footer, nav, and brand.
- [ ] `grep -ri "ironhold" src/` returns nothing.
- [ ] No route shows "Request a Quote" nav CTA from the old header or "© Ironhold Equipment" footer.

### 1.2 Single source of truth for taxonomy and counts
The site currently shows conflicting numbers: 212 (home), 185 (catalog), 280+ (catalog footer), 392 (category meta), 709+ (category footer), and 71 vs 110 for Shipping Containers. This destroys trust instantly.

- **Canonical taxonomy = the 8 new categories:** Shipping Containers, Refrigerated Containers, Offshore & Certified Containers, Refrigeration Units & Gensets, Generators & Power Systems, Tanks, Trailers & Chassis, Accessories & Parts.
- Every unit is assigned to **exactly one** primary category (hard rule below). Related categories are handled with cross-links, never duplicate listings.
  - Reefer *containers* (10/20/40ft boxes) → Refrigerated Containers.
  - Clip-on/underslung refrigeration machinery and gensets → Refrigeration Units & Gensets.
  - Standalone generators, transformers, power systems → Generators & Power Systems.
  - DNV 2.7-1 / certified offshore units → Offshore & Certified Containers (even if also a container).
- All unit counts (homepage stats, category chips, catalog filter counts, about page, footer) are computed from live Supabase queries — a single shared function like `getCategoryCounts()`. No hardcoded numbers anywhere.
- Delete legacy categories/routes (`refrigeration-units`, `gensets-power`) and 301-redirect them to their new equivalents.

**Acceptance criteria:**
- [ ] The same total appears on homepage, catalog, about, and footer, and equals `SELECT count(*) FROM products WHERE status = 'active'`.
- [ ] Category chip counts sum to the total; no product appears in two categories.
- [ ] Old category URLs 301 to new ones.

### 1.3 Domain & routing
- Connect **containeronedepot.com** to the Vercel project (A record / CNAME per Vercel; do NOT change nameservers if email MX records exist on the domain — update A records only, per the established playbook).
- Set the canonical domain; redirect `ironcontainers.vercel.app` and `www` variants to the apex (or chosen canonical) with 308/301.
- Update `NEXT_PUBLIC_SITE_URL`, OG URLs, sitemap base, and Stripe redirect URLs to the production domain.

**Acceptance criteria:**
- [ ] Site loads on containeronedepot.com with valid SSL; vercel.app URL redirects.

---

## PHASE 2 — PRODUCT DATA CLEANUP
*The catalog is the money page; scraped data artifacts must all go.*

### 2.1 Deduplicate the catalog
Legacy scraped listings coexist with clean ones (e.g., two near-identical 1000-gal propane tank listings; the 10ft reefer exists at both `/product/10ft-refrigerated-container-10ft-freezer` and `/product/10ft-refrigerated-container-for-sale-online-best-10ft-freezer-7`).
- Write a dedupe pass: group by normalized title/SKU/specs, keep the best record (best photos, cleanest description, correct price), mark the rest inactive.
- Add a `redirects` table or map: every retired slug → surviving slug, served as 301s (Next.js `redirects()` or middleware reading Supabase).

**Acceptance criteria:**
- [ ] No two active products describe the same unit.
- [ ] Every retired product URL 301s to its surviving equivalent (spot-check 10).

### 2.2 Clean titles, locations, and subcategories
- **Titles:** strip scraped SEO spam ("For Sale Online Best ASME New", "Buy … Online", trailing keyword chains). Title = clean product name, e.g. "1000 Gallon Underground Propane Tank (ASME, New)". Keyword phrases move to meta descriptions only.
- **Locations:** normalize `Charleston_SC` / `Graham_TX` style codes to "Charleston, SC" for display. Store city + state as separate columns; format in one shared component.
- **Subcategories:** replace scraped junk chips ("Insulated & Refrigerated Shipping Container For Sale Online (9)") with a clean facet system: **Size** (10 / 20 / 40 / 45 / 53 ft), **Condition** (New/One-Trip, Cargo Worthy, WWT, Non-Working), **Type** (Standard, High Cube, Double Door, Open Side, Flat Rack, Office/Modified).
- **Descriptions:** remove duplicated keyword-stuffed intro blocks; each product gets one clean short description + one full description. No repeated "For Sale" phrase chains.

**Acceptance criteria:**
- [ ] No active product title contains "for sale", "online", "best", or "buy" as filler.
- [ ] No underscore location codes render anywhere.
- [ ] Category filter chips read as clean facets a human would write.

### 2.3 Fix pricing data + enforce the pricing rule
- Audit all prices: **no $0 or null price may ever display** (the 20ft Non-Working Reefer currently shows "$0" on the homepage). Rule: `price > 0 AND price < 25000` → show price + Reserve; otherwise → quote-only display, price hidden.
- Sale-price pairs (e.g. $6,000 / ~~$6,500~~) keep the strikethrough treatment, applied consistently.
- Homepage "From the yard" featured grid may only include units that pass validation (photos present, clean title, valid price or quote mode).

**Acceptance criteria:**
- [ ] `SELECT * FROM products WHERE status='active' AND (price = 0)` → all rows are quote-only mode, and nothing renders "$0".
- [ ] Every card and product page follows the <$25k price / ≥$25k quote rule.

---

## PHASE 3 — PAGE-BY-PAGE REBUILD & UX
*Design intent: bridge the premium homepage aesthetic with a dense, spec-forward marketplace catalog. Buyers here are contractors and operators — they want filters, specs, and a phone number, not lifestyle scroll-telling. Signature element: IBM Plex Mono spec/SKU treatment carried through cards, filters, and spec tables so the whole catalog reads like equipment documentation.*

### 3.1 Catalog page (`/catalog`)
- Filter sidebar (desktop) / filter drawer (mobile): Category, Size, Condition, Price range, Location, Availability.
- Card grid: consistent 4:3 image ratio, clean title, mono SKU, condition badge, location ("Charleston, SC"), price or "Request Quote" badge, single CTA. 24 per page with pagination (keep) + working sort (A–Z, price asc/desc).
- Search within catalog (title + SKU + category match; Supabase `ilike` or full-text).
- Unique metadata: `Full Catalog — 212 Units In Stock | Container One Depot` (count injected), real meta description. (Current title is literally "Full Catalog | Catalog".)

### 3.2 Category pages (`/category/[slug]`)
- Same card system + facet chips from 2.2.
- 2–3 sentence real intro paragraph per category (buyer-relevant: what the category covers, typical uses, conditions available) — written plainly, no keyword stuffing.
- Unique `<title>` + meta description per category (currently inherits the old Ironhold homepage title).

### 3.3 Product pages (`/product/[slug]`)
- **Unique metadata per product** — title `{Product Name} | Container One Depot`, meta description from the short description. This is currently the site's biggest SEO hole: every product page ships the generic homepage title.
- **Real spec tables.** Minimum fields by type — containers: external/internal dimensions, door opening, tare/max gross weight, condition grade, CSC plate status; reefers: temp range, machinery make/model, working status; gensets/generators: kW, phase, fuel, tier rating, hours; tanks: capacity, spec (ASME/MC-331), new/used; trailers: length, axles, GVWR. Populate from existing data where available; leave a field out rather than fake it.
- Quote-only units: hide price, show "Request a Quote" as the primary CTA opening an **on-page quote form** (name, email, phone, zip, message; pre-filled product + SKU) writing to Supabase `quote_requests` + email notification. Kill the `mailto:` links.
- Priced units: "Reserve This Unit — $1,000 refundable deposit" as primary CTA.
- Delivery module: zip code input → "Freight quoted after reservation — nationwide delivery" message (no fake instant quotes; real freight calc is post-launch).
- Fix breadcrumb category assignment (reefer currently breadcrumbs under Shipping Containers).
- `Product` + `Offer` JSON-LD on every product page (priced units: price + availability; quote units: no price, `InStock` availability only).
- Keep and polish: gallery with thumbnails, "You might also need" cross-sells (only validated products).

### 3.4 Homepage polish
- Fix logo doubling ("CCONTAINER ONE DEPOT." — the monogram C is rendering into the wordmark).
- Header icons: ensure search / phone / cart render as icons with labels, never raw paths (`/search`, `tel:...`, `/cart` are currently visible as text in the SSR output).
- "How it works" step 1: "…reserve it with a **$1,000 refundable deposit**."
- Financing CTA → route to `/financing` page (see 3.7), not mailto.
- Featured grid: validated units only (see 2.3).

### 3.5 About page
- Expand beyond stats: 3–4 short real paragraphs — who runs it, how units are sourced and inspected ("every unit photographed and documented before listing"), the deposit/reservation model, service area. Real yard/equipment photos only. This is the trust page for buyers wiring five figures.

### 3.6 Contact page
- Wire the form to Supabase `contact_messages` + email notification (Resend or existing pattern). Success/error states with plain copy. Add service region line. Verify phone + email consistency site-wide: (434) 292-1444 / sales@containeronedepot.com everywhere.

### 3.7 Financing page (`/financing`)
- Real page replacing the `#financing` anchor + mailto: how it works (apply → decision → fund → delivery), what qualifies, and a pre-qualification form (business name, contact, equipment interest, approximate amount) → Supabase + notification. Only state facts that are true about the actual financing arrangement — no invented rates or approval claims.

### 3.8 Cart & checkout
- Cart line items show: unit, SKU, location, price, and a "$1,000 refundable deposit due today — balance on confirmation" breakdown.
- "What happens after you reserve" strip on cart page (condensed 4-step How It Works).
- Stripe: deposit checkout = $1,000 per unit; metadata includes product ID + slug; success page confirms hold window (48–72h) and next steps; webhook marks unit `reserved` in Supabase so it displays a Reserved badge and can't be double-reserved.
- **End-to-end test in Stripe test mode before launch:** reserve → webhook → status flip → success page → email.

### 3.9 Policy pages (required before taking real deposits)
Create real pages, linked in footer:
- `/shipping` — delivery process, freight coordination, lead times, site-prep expectations.
- `/deposit-policy` — $1,000 refundable deposit terms: hold window, refund conditions and timing, what "confirmation" means.
- `/terms` and `/privacy` — standard e-commerce terms and privacy policy adapted to the business (Stripe requires these to be reachable).

---

## PHASE 4 — SEO / TECHNICAL / QA PASS

### 4.1 SEO infrastructure
- `sitemap.xml` generated from live products + categories + blog + static pages; `robots.txt` pointing to it.
- Canonical tags on every page (product canonicals = surviving slugs from dedupe).
- OG + Twitter meta per page type; OG images at minimum: default brand image site-wide, category-specific where available.
- `Organization` + `LocalBusiness` JSON-LD site-wide (name, phone, hours Mon–Fri 8–6, URL); `BreadcrumbList` on product/category pages; `BlogPosting` on blog posts.
- Verify blog posts have unique titles/meta (they appear correct — confirm) and that the deposit blog post is updated to state $1,000.

### 4.2 Performance & rendering
- All catalog/category/product pages server-rendered or ISR (revalidate ~60s) so counts and reservations stay fresh without full rebuilds.
- `next/image` everywhere with correct `sizes`; hero image priority-loaded; card images lazy.
- Lighthouse targets on mobile: Performance ≥ 85, SEO ≥ 95, Accessibility ≥ 90.

### 4.3 Final QA checklist
- [ ] Click every nav and footer link on mobile + desktop — zero 404s, zero Ironhold remnants.
- [ ] Search, filters, sort, and pagination work on catalog and every category.
- [ ] Quote form, contact form, financing form, newsletter signup all persist to Supabase and send notifications (test each once).
- [ ] Full Stripe test-mode reservation completed end-to-end.
- [ ] All counts consistent and live-computed.
- [ ] No "$0", no underscore locations, no scraped title spam, no lorem/placeholder anywhere.
- [ ] 301s verified: old category slugs, deduped product slugs, vercel.app → production domain.
- [ ] Phone number and email identical in header, footer, about, contact, and JSON-LD.
- [ ] Mobile pass on a real phone: header, filter drawer, gallery swipe, checkout.

---

## EXECUTION ORDER
1. Phase 1 (brand unification + counts + domain) — Day 1–2
2. Phase 2 (data cleanup + pricing rule) — Day 2–3
3. Phase 3 (pages, forms, checkout, policies) — Day 3–5
4. Phase 4 (SEO + QA) — Day 5, then launch

Work phase by phase. Do not start a later phase until the prior phase's acceptance criteria all pass. When data is missing (specs, photos), omit the field — never invent it.
