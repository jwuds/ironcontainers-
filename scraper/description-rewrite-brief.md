# Description rewrite brief — read this fully before writing anything

## What's going on

Container One Depot's product catalog was built by scraping several different container/equipment marketplace sites. For a lot of products, the raw scraped `description` field isn't one company's clean copy — it's a **concatenation of marketing text from multiple different third-party businesses** that happened to sell a similar unit. You'll see names bleed through like "Conex Depot," "Long Beach Off-Coast Depot/Port," "Mobile Modular," "CRS," "Space-wise," "Trident," "Interport," "BLT Tanks." None of these are Container One Depot. They are competitors or unrelated sellers whose page text got scraped into this one blob.

Because of that concatenation, the raw text often:
- **Contradicts itself** — e.g. one product's description states three different temperature ranges, two different weights, or conflicting warranty terms, because each came from a different source company's page.
- **Includes rental/leasing language** ("we rent at a 30-day billing plan," "leasing terms") — Container One Depot **never rents**. It sells only, backed by a refundable deposit that locks a live price for 48–72 hours. Any rental mention in the source must be dropped entirely, not softened.
- **Includes another company's self-promotion** ("30 years of experience," "America's leading manufacturer," "official warranty service") — never attribute this to Container One Depot.

Your job is not to summarize this blob shorter — it's to **read all of it, extract every genuine, product-specific fact, and write one coherent, accurate, full-length description in Container One Depot's voice**, discarding everything that's contradictory noise, rental language, or another company's branding.

## Rules

1. **Strip third-party companies.** Never mention Conex Depot, Long Beach Off-Coast, Mobile Modular, CRS, Space-wise, Trident, Interport, BLT Tanks, or similar reseller/competitor names. (Real OEM equipment brands — Thermo King, Carrier, CAT, Polar, Manchester Tank, Flame King, etc. — are fine to keep; those are manufacturers, not competing resellers.)
2. **Strip all rental/leasing language**, no exceptions. Container One Depot sells only.
3. **Resolve contradictions by picking the single most specific, product-matched figure** — usually the one that's repeated most consistently across the blob, or that most precisely matches this product's exact size/model/condition — and drop the conflicting alternates. Never present two different numbers for the same spec as if both are true.
4. **Never fabricate.** If a fact isn't in the source text, don't include it. Don't invent a Container One Depot-specific process (e.g. "we repaint every used unit") unless it's already established elsewhere — general industry facts (e.g. what PTI testing is) are fine to reference generically, but don't claim it as something "we" specifically do unless the source is unambiguous that it's part of *this* purchase.
5. **No price in the description text.** Pricing is live/dynamic and rendered separately on the page.
6. **Write it full-length and thorough** — this is the main correction from the last pass. Don't compress to 3 generic sentences. Cover every real, distinguishing fact that exists: dimensions/weight, capacity, temperature range or power spec (for reefers/gensets/electrical), included features and accessories, certifications (ISO, CSC, DNV, ASME, EPA/CARB, etc.), warranty terms if stated clearly and non-contradictorily, and genuine use cases. Length should follow the real amount of distinct, accurate information available — a product with rich genuine detail should get a full multi-sentence, possibly multi-paragraph description; a product where the source is thin should stay honestly shorter rather than padded with filler.
7. **Brand voice**: knowledgeable, trust-first, no hype ("amazing," "unbeatable," "best-in-class" are banned), plain and direct, active voice, Oxford comma, em dash (—) for asides. Grade terms (Cargo Worthy, Wind & Water Tight, Economy, New/One-Trip) always capitalized. Never use "For Sale" / "Buy X Online" framing — that's the spammy marketplace pattern we're specifically moving away from.
8. **Do not touch `shortDescription` or `title`** — only produce the `description` field.

## Calibration example

This is the exact product a stakeholder flagged as the quality bar. Source blob (abbreviated) included: three different temperature ranges (-25/25°C repeated twice consistently; -40/30°C and -40/10°C appearing once each from other bled-in sources), conflicting capacity figures (13 m³ repeated twice consistently vs. 15.95m/563 cu.ft and 12.5 m³ each appearing once), rental billing language, and self-promotion from at least four different unrelated companies.

**Product**: 10ft Refrigerated Container 10ft Freezer (slug: `10ft-refrigerated-container-10ft-freezer`)

**Rewritten description:**

> The smallest reefer in our lineup, this 10ft refrigerated container offers roughly 13 m³ of thermally regulated space — a practical size for event cooling, tight jobsites, and construction sites where a full 20ft or 40ft reefer would be overkill. It holds a working range of -25°C to 25°C with about one degree of accuracy, and humidity is separately adjustable between 50% and 99% for goods that need more than just temperature control. The unit runs on a 5-pole 32A power supply, with single- and three-phase options available depending on your site.
>
> Construction is 14-gauge steel with reinforced corner posts, a stainless steel and aluminum interior that's easy to keep clean, and a flat or T-grid floor. Fully lockable double doors are standard, with a butcher-door configuration available and an internal emergency release so no one can get trapped inside — doors ship uninstalled and are fitted on arrival. You can also choose standard barn doors or a lighter 6-foot roll-up door if you don't want to deal with the heavier barn-door swing. The unit weighs approximately 2,870 lbs and carries a valid CSC plate for freight use.
>
> One sizing note: ocean freight has a 20ft minimum, so this 10ft container can't ship alone by sea — only paired with another 10ft unit or as mixed cargo. Available in new and used condition. Contact our team to confirm current availability and door configuration.

Notice what happened: every genuine spec made it in (capacity, temperature, humidity, power, construction, interior finish, door options, weight, CSC certification, the ocean-freight sizing caveat). The three conflicting temperature/capacity figures got resolved to the one repeated consistently. Rental billing language, "30 years experience," and four different company names are gone entirely. Nothing was invented.

## Output format

Write your output as a single JSON file at the path you're given, structured as:

```json
{
  "product-slug-1": { "description": "..." },
  "product-slug-2": { "description": "..." }
}
```

One entry per product in your input file, keyed by the exact `slug` field. Only the `description` key — do not include `shortDescription`.
