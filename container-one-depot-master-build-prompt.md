# Container One Depot — Master Build Prompt

**Domain:** containeronedepot.com
**Current codebase:** ironcontainers.vercel.app (Next.js/Vite + React, Supabase, Vercel)
**Purpose of this document:** hand this directly to Claude Code as the build/refactor spec. Sections are ordered by priority — fix bugs first, then structure, then commerce features.

---

## 1. Mission & Positioning (source of truth for all copy/design decisions)

Container One Depot is not a local container yard. It is a technology company building the easiest place in America to buy, customize, and get delivered industrial containers and equipment — operating as a **dealer network / marketplace / inventory aggregator**, not an inventory owner.

Every design and copy decision should answer one question: *does this make Container One Depot feel like the most trusted place in America to buy a shipping container?*

**Brand personality:** Industrial. Modern. American. Premium. Professional. Avoid looking like a scrapyard. Avoid looking like a corporate government site.

**Voice:** Knowledgeable, helpful, direct, no hype, no spammy sales copy. Write like someone who has worked around containers for 20 years.

**Trust first, sales second.** Homepage 3-second test: a visitor should think *"these people know containers, have inventory across the country, and can get one delivered to me fast."*

---

## 2. Buyer Personas (design and copy target, in priority order)

1. **Commercial Contractors** — general contractors, construction companies, infrastructure, temporary site storage. Highest lifetime value. Repeat/fleet buyers. Needs: fleet purchasing support, financing, fast quotes.
2. **Farms & Agricultural Businesses** — equipment/feed/chemical storage, workshop conversion. Seasonal purchases. Needs: reefer/cold-storage messaging, ag-specific use cases.
3. **Homeowners & Small Businesses** — backyard storage, garages, tiny homes, retail storage. Highest search volume. Needs: simplicity, clear pricing, financing.

A quiet 4th segment exists inside current inventory (tanks, gensets, offshore/DNV containers, trailers): **industrial/energy/logistics buyers**. Serve this segment with its own page voice — do not force container-brand language onto tank/genset/offshore listings.

---

## 3. Critical Bug Fixes (do these first — trust depends on it)

- [ ] **Site-wide brand find/replace:** every instance of "IIRONHOLD" (note existing typo) and "Ironhold Equipment" → "Container One Depot" — header, footer, meta tags, page titles, structured data.
- [ ] **Unit count mismatch:** catalog page currently shows a different total unit count than the site-wide footer stat. Recount from actual category totals and make the number consistent everywhere it appears.
- [ ] **Category cross-contamination:** standard shipping containers, 10ft containers, and reefer units currently appear as subcategories nested inside "Trailers & Chassis." Reassign to the correct top-level category per Section 4.
- [ ] **Miscategorized items:** CAT Material Handlers currently listed under "Gensets & Power" — this is heavy equipment, not a power unit. Move to its own subcategory or a future "Heavy Equipment" line.
- [ ] **Duplicate/near-duplicate listings:** multiple SEO-stuffed title variants of the same product exist (e.g., a single 1000-gallon propane tank listed 3x under different titles). Dedupe to one canonical listing per real unit.
- [ ] **Inconsistent pricing display:** listings currently show price range, single price, "Multiple options," or "Request Quote" with no clear logic. Standardize per Section 6 (Live & Dynamic Pricing).
- [ ] **Broken product route:** at least one homepage-linked product URL returns a 404. Audit all product links for dead routes.
- [ ] **Product title cleanup:** replace scraped-marketplace-style titles ("Best 10ft Freezer For Sale Online") with a clean, consistent naming convention: `[Size] [Type] [Grade/Condition] [Product Name] ([Internal SKU])` — e.g., "20ft Standard Cargo Worthy Shipping Container (20STCW)."

---

## 4. Catalog Structure — 8 Categories

Merge the current product data/display components with the new structure below. Keep existing product card/grid components where they already work well; reorganize the taxonomy and filters around them.

1. **Shipping Containers** (dry only) — subcats: by size (10/20/40ft), by condition (New One-Trip / Used WWT / Used Cargo Worthy / Economy).
2. **Refrigerated Containers** (reefer containers only) — same size/condition subcats. Lead category-page messaging with concrete use cases: pharmaceutical, fresh produce, farm/ag cold storage.
3. **Offshore & Certified Containers** — DNV-certified units (dry, half-height, open-top, refrigerated). Different sales motion: no self-serve add-to-cart — route to a "Contact a Specialist" flow. Trust signals here are certification docs and inspection reports, not lifestyle photography.
4. **Refrigeration Units & Gensets** — Thermo King + Carrier, split by mount type (Clip-On / Undermount). Primary placement is as a **cross-sell/attach item on Refrigerated Container product pages** ("This container is compatible with...") — not a cold standalone category buyers land on directly.
5. **Generators & Power Systems** — standalone CAT generators only (material handlers excluded — see bug fix above).
6. **Tanks** — ASME/propane/skid tanks, subcat by gallon size (small <2,000 gal / mid / bulk 18–30k gal). Own page voice — ag/industrial tank-buyer language, not container-brand messaging.
7. **Trailers & Chassis** — LPG tankers, reefer trailers, and chassis as three clear subcats. Lower nav priority — this serves existing fleet buyers more than new-customer acquisition.
8. **Accessories & Parts** — transformers and small components only.

---

## 5. Visual System

- **Palette:** dark charcoal base, steel gray mid-tones, white as an active design element (not filler), single orange accent used sparingly (CTAs, price highlights, status badges). No gradients, no rainbow category colors.
- **Typography:** confident geometric sans for headlines (not a default like Inter), clean readable body font. Tabular/mono treatment for numeric data (prices, dimensions, delivery estimates, SKUs) so specs read as engineered, not decorative.
- **Photography:** consistent color grading and cropping across all listings until real dealer photography exists. Kill any remaining scraped-marketplace-style imagery/titles.
- **Inspiration:** Caterpillar (material honesty), John Deere commercial (industrial premium), Tesla (simplicity), Stripe (clean information density). Explicitly avoid the cluttered-dealer-website look (Conex Depot, generic Shopify themes).

---

## 6. Commerce Mechanics

### Live & dynamic pricing
- Prices are live and subject to discounts — no static pricing. Product data layer must support real-time price + discount fields per listing.
- Every product card and product page shows a clear current price (never blank/"Request Quote" as the default state — reserve "Request Quote" only for units genuinely requiring custom freight/config, e.g., offshore/DNV).

### Hot Sale section (homepage)
- Dedicated homepage section pulling from real aging/overstock dealer inventory — frame as "Dealer Overstock" / "Yard Clearance," not generic fake-urgency banners.
- Should be dynamically populated (e.g., units flagged by age-in-inventory or a manual "featured discount" flag), not hardcoded.

### Deposit & reservation system (standard model — no pay-after-delivery)
- Refundable deposit ($100–$500 range, configurable per unit price tier) reserves a unit and **locks the live quoted price for 48–72 hours**.
- UI framing: "Reserve This Unit" rather than "Deposit Required."
- Deposit flow integrates with Stripe (or existing payment processor) for standard deposit-then-balance structure.

### Appointment-based yard visits
- Simple booking calendar tied to dealer/depot location.
- Positioned as a **premium option** ("Prefer to see it in person? Schedule a yard visit"), not a requirement or a default expectation — maintain the strictness of the deposit model even though visits are offered.

### Financing (strong emphasis, no rental)
- Financing messaging prominent site-wide (top banner and product pages), not buried in a footer link.
- 60-second pre-qualification widget embedded directly on product pages (soft credit check flow).
- Include Section 179 tax deduction messaging targeted at commercial/contractor and farm buyers — a genuine differentiator competitors are not using.
- No rental/rent-to-own options anywhere on the site (explicitly excluded).

### Fleet/commercial quote builder
- Lets a contractor build a multi-unit, multi-location cart and receive one consolidated quote — serves the repeat/fleet buyer persona directly.

### Container Configurator
- Visual builder: size → condition → add-ons (roll-up door, windows, paint color, shelving) with live price updates as selections change.
- This is a flagship interactive feature — prioritize for the homepage and category pages, not buried in a sub-menu.

### Post-purchase order tracking
- Status flow: Ordered → Dealer Confirmed → In Transit → Delivered, with SMS/email updates at each stage.

---

## 7. AI Chat Concierge (homepage + product pages)

- Wired to live inventory data — must answer real queries like "what's my cheapest 40ft near Dallas right now," not generic scripted responses.
- Intent routing:
  - Storage/use-case questions → recommend size + grade.
  - Commercial/fleet questions → hand off to human sales/quote builder.
  - DNV/offshore questions → hand off to the specialist contact flow (Section 4, Category 3).
- Should also explain grade differences (Cargo Worthy vs WWT vs Economy vs New/1-Trip) conversationally on request.
- A homepage "What do you need?" 60-second quiz (use case: storage / workshop / cold storage / jobsite / tiny home) should feed context into the chat and route to the correct category.

---

## 8. Explicitly Out of Scope (for this build phase)

- No rental or rent-to-own listings anywhere.
- No SEO-focused work this phase (location pages, blog content, keyword optimization) — defer to a later phase once core experience/commerce is solid.
- No pay-after-delivery model — deposits are the standard, non-negotiable flow.

---

## 9. Build Priority Order

1. Brand find/replace + bug fixes (Section 3) — do not proceed to new features on top of broken trust signals.
2. Catalog restructure into 8 categories (Section 4), merging existing display components with new taxonomy.
3. Visual system tokens (Section 5) applied globally.
4. Live/dynamic pricing + Hot Sale section (Section 6).
5. Deposit/reservation flow + appointment booking (Section 6).
6. Financing widget + Section 179 messaging (Section 6).
7. AI Chat Concierge + homepage quiz (Section 7).
8. Container Configurator.
9. Fleet quote builder + order tracking.

---

*End of master build prompt. Provide this file in full to Claude Code as the working spec; iterate section by section rather than attempting the full build in one pass.*
