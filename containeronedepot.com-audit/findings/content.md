# Content Quality & E-E-A-T Audit — containeronedepot.com

Sampled live: `/product/10ft-refrigerated-container-10ft-freezer`, `/product/carrier-undermount-gensets`, `/product/x4-7700-trailer-refrigeration-units`, `/product/1000-gallon-nh3-tanks`, `/product/11600-gallon-industrial-gas-tank-trailer-mc-331-lpg-liquid-tanker`, `/category/tanks`, `/about`, `/contact`, `/blog` and all 4 posts.

## What works

- **The rewritten descriptions are genuinely good.** The full text (recovered from the page's hydration payload) is specific and technical, not generic AI filler: "-25°C to 25°C with about one degree of accuracy," "5-pole 32A power supply, single- and three-phase," "14-gauge steel," "Hastelloy or titanium bolts for ammonia compatibility," plus a real logistics caveat ("ocean freight has a 20ft minimum, so this 10ft container can't ship alone by sea"). This reads like copy written by someone who actually sells this equipment.
- Blog posts, while short, are practical and non-fluffy — the Section 179 post correctly hedges ("this isn't tax advice — talk to your accountant") and the reservation-process post gives real deposit ranges ($100–$500, 48–72hr hold).
- Consistent contact info (phone, email) and a specific, updating inventory count ("212 units listed across 8 categories") in the global footer.
- No factual errors spotted in the sample.

## Findings

1. **Title:** Rewritten descriptions are ~65% invisible to crawlers by default
   **Severity:** Critical
   **Description:** On every sampled page with a description over ~480 characters, the server-rendered `<p>` literally cuts off mid-word (e.g., ends in "...T…") and the remainder only exists inside a `self.__next_f.push()` React hydration script, revealed by clicking a "Read more" button. Measured on the 10ft reefer page: 480 of 1,444 characters (33%) render by default; the other 964 characters (67%) require a click. The one sampled page whose description was short enough to fit (NH3 tank, 477 chars) had no button and rendered fully. So the more spec-dense and useful a rewritten description is, the more of it gets hidden — undermining the whole rewrite effort for indexing/AI-citation purposes, since Googlebot's renderer does not click buttons.
   **Recommendation:** Render the full description in the DOM always; use CSS (`line-clamp`/`max-height`) or a native `<details>/<summary>` for the visual truncation instead of conditionally rendering truncated text.

2. **Title:** About and Contact pages carry almost no trust/E-E-A-T signal
   **Severity:** High
   **Description:** `/about` strips to ~90 words: inventory counts plus phone/email — no company history, founding date, team/owner bios, certifications, or physical address. `/contact` strips to ~60 words: phone, email, and a form, no street address or business registration info. For a site selling high-ticket industrial equipment (tanks, generators, containers), this is thin for the Trustworthiness (30% weight) and Authoritativeness factors.
   **Recommendation:** Add a real About narrative (years in business, staff/owner credentials, certifications handled — ASME/DOT/ISO), and a verifiable physical address plus map/Google Business Profile link on Contact.

3. **Title:** All 4 blog posts are far below topical-coverage floor, no bylines
   **Severity:** High
   **Description:** Stripped word counts: container-grades-explained ~180, section-179 ~150, reefer-buying-guide ~190, reservation-process ~180 — roughly 10-15% of the 1,500-word blog minimum. None has an author name, bio, or credential — just a category tag and date.
   **Recommendation:** Expand posts with concrete detail (worked examples, real numbers) and add named, credentialed author bylines to support Expertise/Experience.

4. **Title:** Category pages have no unique topical copy
   **Severity:** Medium
   **Description:** `/category/tanks` renders a single tagline ("Propane and NH3 storage tanks.") before the product grid — no buying-guide intro, no FAQ, no differentiation from the other 7 category pages.
   **Recommendation:** Add a 150-300 word intro per category (use cases, condition/grade options, links to relevant blog posts).

5. **Title:** Repeated boilerplate CTA sentence across product bodies
   **Severity:** Medium
   **Description:** "Contact our team to confirm current availability" (or a close variant) closes multiple sampled descriptions verbatim, at scale across ~212 pages this is a near-duplicate boilerplate tail.
   **Recommendation:** Vary or remove the closing CTA sentence; the Quote/Reserve buttons already cover that action.

6. **Title:** No visible author/freshness schema in rendered blog output
   **Severity:** Low
   **Description:** Dates are present and current-looking (Feb–May 2026) but no visible "last updated," author, or Article schema signal was detected in the extracted text of the sample.
   **Recommendation:** Add visible author + last-updated markup once bylines exist.

## Score: 52/100

Justification: the underlying rewritten product copy is specific, accurate, and genuinely expert-sounding (a real strength), but a critical rendering issue hides most of it from crawlers by default, and the About/Contact/blog trust layer is too thin to support the Trustworthiness and Authoritativeness weight in E-E-A-T.
