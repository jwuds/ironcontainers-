# Backlink Profile

Score: 8/100 (diagnostic — off-page, not folded into overall health score)

## Method

Re-run of the 2026-07-19 backlink audit, 2 days later, same methodology, for consistency
tracking. `python3 scripts/backlinks_auth.py --check --json` confirms **Tier 0** (Common
Crawl + verification crawler only; Moz, Bing Webmaster, and DataForSEO keys are not
configured in this environment). No known/claimed backlinks exist to feed into
`verify_backlinks.py` (none surfaced in the prior audit either), so the verification
crawler had nothing to check this round.

`commoncrawl_graph.py` was run for both `containeronedepot.com` and the brand-collision
competitor `containerone.net` (to check for co-citation/referring-domain overlap). Both
queries ran for several minutes with no result and no error — they hung against the CC
index rather than completing. Per the skill's error-handling guidance ("if Common Crawl
download times out, skip CC metrics and note the timeout"), CC metrics are **skipped this
round**. That timeout is distinct from the prior audit's finding: the prior run completed
three CDX queries and got a confirmed zero-captures result (0.50 confidence); this run
simply did not get a fresh reading either way, so it neither confirms nor contradicts the
prior zero.

## What Works

- Site remains live, crawlable, and technically healthy per the prior audit (HTTP 200,
  permissive robots.txt, well-formed sitemap.xml) — nothing here would block link
  discovery once outreach/citation activity starts.
- OEM brand mentions (Carrier, Thermo King, Caterpillar, Kubota) remain present across the
  catalog per the prior audit — still the most realistic near-term citation/co-marketing
  angle, unexploited but unchanged.
- No evidence of toxic, spammy, or manipulative link-building activity — the profile is
  clean by virtue of being empty, not by virtue of having been cleaned up.

## Findings

**Zero discoverable backlink/crawl footprint (unconfirmed this round due to CC timeout)**
Severity: Info
Description: The prior audit confirmed zero Common Crawl and Wayback captures via three
completed CDX queries. This round's Common Crawl query for containeronedepot.com did not
complete within a reasonable wait (several minutes, no output, no error) and was abandoned
rather than yielding a fresh confirmed reading. The domain is now ~18 days old (rebranded
2026-07-03); since CC's index refreshes quarterly, no material change would be expected
even had the query completed on schedule.
Recommendation: Re-attempt the CC query in a follow-up session (a stale cache or network
path may have caused the hang); if it continues to time out, fall back to lighter-weight
Wayback Machine CDX spot-checks. Do not re-baseline numerically until either CC succeeds or
60-90 days have passed, per the prior audit's original recommendation.
Status vs prior audit: Unchanged / unverifiable this round — no regression implied, just no
fresh confirmation. Score held at 8/100 since there is no new signal in either direction.

**Brand-collision competitor (containerone.net) co-citation check could not run**
Severity: Medium
Description: This audit was asked to specifically flag the known brand-collision
competitor "Container One" (containerone.net) if it appeared in any referring-domain or
co-citation context. The Common Crawl query for containerone.net also timed out with no
data, so no co-citation signal (shared referring domains, ambiguous anchor text, etc.) was
obtainable this round. This remains an open, unresolved risk: if third parties link to
"Container One" using ambiguous or shortened anchor text, some authority or referral
traffic could be misattributed given the near-identical brand name.
Recommendation: Re-run `commoncrawl_graph.py containerone.net --json` in a follow-up
session with a longer timeout budget, and consider a manual web search for
"Container One" + "Container One Depot" co-mentions to catch early confusion before it
compounds. This is a brand-disambiguation watch item, not a technical fix to
containeronedepot.com itself.
Status vs prior audit: New check, no data obtained — this specific co-citation angle was
not checked in the 2026-07-19 audit (containerone.net is named there only as a likely
established competitor, not queried directly), so this is the first attempt and it did not
return usable data.

**No physical address published limits local SEO citation building**
Severity: Medium
Description: Per the prior audit, `site.ts` exposed only a phone number, no street address,
which blocks structured local citations (Google Business Profile, BBB, directory NAP
listings) that require consistent NAP data. Not re-verified against current site code this
round since this re-run focused on off-page/CC signals, but no change is expected or
reported elsewhere.
Recommendation: Unchanged from prior — if a real yard/office/depot address exists, publish
full NAP consistently in the footer and `LocalBusiness` schema, then pursue GBP and core
citation aggregators. If broker/drop-ship only with no location, skip local citations and
focus on industry-directory and digital PR tracks instead.
Status vs prior audit: Unchanged — carried forward as still open, not re-verified this
round.

**Realistic near-term tier: industry directories + OEM/dealer citations (0-3 months)**
Severity: High
Description: Unchanged opportunity from the prior audit — the catalog's extensive Carrier,
Thermo King, Caterpillar, and Kubota mentions remain low-competition, high-relevance link
inventory that hasn't required competing for authority against 10-year-old incumbents, and
there is no evidence any of it has been actioned in the two days since the prior audit.
Recommendation: Unchanged from prior — submit to container/modular/equipment resale
directories (trade association listings, ISBU/container industry directories,
MachineryTrader/IronPlanet-style marketplace company profiles) and inquire about
authorized-dealer or reseller listings from OEM regional distributors, only where a genuine
relationship exists.
Status vs prior audit: Unchanged, still not actioned.

**Do not attempt head-to-head competitive link building yet**
Severity: Critical
Description: Unchanged from the prior audit — established competitors (Conex Depot, Mobile
Modular, Long Beach Off-Coast, and the brand-collision competitor Container One /
containerone.net) almost certainly carry a decade-plus of accumulated referring domains.
Two days is far too short a window for any material shift in that gap, and this audit found
no evidence of one (nor could it obtain fresh comparative data this round due to the CC
timeout).
Recommendation: Continue reallocating effort to on-site content/technical SEO and the
directory/OEM tactics above. Revisit competitive gap analysis once Moz or Bing Webmaster
credentials are configured (Tier 1/2) or the domain has 90+ days of indexed history — Bing's
`compare` tool would be particularly well-suited to the containerone.net brand-collision
question once available.
Status vs prior audit: Unchanged — reaffirmed, not contradicted, by this run.

## Data source summary

| Source | Confidence | Freshness | Status this round |
|---|---|---|---|
| `backlinks_auth.py --check` | — | Live | Confirmed Tier 0 (CC + verify only; Moz/Bing/DataForSEO not configured) |
| Common Crawl domain graph (containeronedepot.com) | — | Quarterly | Timed out, no data — not a confirmed zero this round |
| Common Crawl domain graph (containerone.net) | — | Quarterly | Timed out, no data — co-citation check inconclusive |
| `verify_backlinks.py` | — | Live | Not run — no known/claimed backlink list exists to verify |
| Prior audit (2026-07-19) CC + Wayback CDX | 0.50 | Quarterly/Continuous | Zero captures (carried forward as last confirmed reading) |
| Direct HTTP/robots/sitemap check (prior audit) | 0.95 | Live | Site healthy, crawlable (not re-verified this round, out of scope) |
| Moz / Bing Webmaster / DataForSEO | — | — | Not configured in this environment |
