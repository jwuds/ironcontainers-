# GEO / AI-Search Readiness Audit — containeronedepot.com

**GEO Health Score: 58/100**
Citability 16/25, Structural Readability 15/20, Multi-Modal 6/15, Authority 12/20, Technical Accessibility 17/20 — strong SSR foundation and fact-dense prose let down by zero FAQ/comparison structure, no llms.txt, and weak off-site entity presence.

## What Works

- **robots.txt is fully permissive**: `User-Agent: * / Allow: /` with only `/cart` and `/search` disallowed. GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended are all implicitly allowed — no explicit blocks found for any AI crawler.
- **Server-side rendering confirmed**: raw `curl` (no JS execution) returns full product copy, spec `<dl>` lists, and JSON-LD in the initial HTML response. Nothing here requires a headless browser to read — ideal for crawler access.
- **Product & Organization JSON-LD present** on product pages (schema.org `Product`, `Organization`, `BreadcrumbList`), giving entity/price grounding.
- **Genuinely rewritten, fact-dense prose**: the two spot-checked pages (10ft reefer, Carrier undermount gensets) lead with concrete, source-near-subject facts — e.g., "15 kW output," "-25°C to 25°C," "50-gallon integral fuel tank," "EPA Tier 4," "28–34% fuel savings" — stated as direct declarative sentences, not buried in adjectives.
- Spec sections use semantic `<dl>/<dt>/<dd>` markup rather than free-text tables, which is easy for extraction pipelines to parse into key-value facts.

## Findings

- **{title: "llms.txt missing (404)", severity: High, description: "Confirmed via curl: https://www.containeronedepot.com/llms.txt returns HTTP 404. No machine-readable index of key pages/products/policies exists for LLM crawlers to prioritize.", recommendation: "Publish /llms.txt listing top category and product URLs, shipping/warranty/quote policy summaries, and a one-line brand description. Low effort, ~1-2 hrs."}**

- **{title: "No FAQ section or FAQPage schema anywhere checked", severity: High, description: "Neither spot-checked product page has a Q&A block; site-wide /faq returns 404. Only H2s found were generic labels ('Full Description', 'Specifications', 'You might also need') — no question-form headings anywhere, which are what AI Overviews and ChatGPT most readily lift as direct answers.", recommendation: "Add a 3-5 item FAQ block per product template (e.g. 'What temperature range can this unit hold?', 'Is this container new or used-refurbished?') with FAQPage JSON-LD. Medium effort — one shared component, populate per product from existing spec data."}**

- **{title: "Long undifferentiated paragraphs exceed optimal citation length", severity: Medium, description: "The gensets description runs two paragraphs of ~90 and ~130+ words each covering multiple distinct facts (three emissions series, mounting hardware, FuelWise tech) in a single block, rather than one self-contained 134-167 word passage per discrete fact/question. A model citing 'fuel savings %' or 'EPA compliance' must extract mid-paragraph, increasing misattribution/paraphrase risk vs. verbatim citation.", recommendation: "Break Full Description into short, single-topic sub-paragraphs or bolded mini-headers per fact cluster (compliance, mounting, fuel efficiency). Low-medium effort — content restructuring, no new copywriting needed since facts already exist."}**

- **{title: "No comparison content between similar SKUs", severity: Medium, description: "212 products but no visible comparison tables (e.g., 10ft vs 20ft vs 40ft reefer, or Series 55 vs 13 vs 5 gensets) despite the genset page itself listing three near-identical variants in prose. This is exactly the long-tail 'which one should I buy' query type the site is targeting.", recommendation: "Add a small comparison table per product family (dimensions/capacity/price/use-case columns). Medium effort, high payoff for long-tail buying-research queries."}**

- **{title: "Malformed image URL in Product JSON-LD", severity: Medium, description: "The `image` field concatenates the domain twice: \"https://www.containeronedepot.comhttps://conex...\" — a broken URL. This can cause structured-data validation failures and image-based citation/snippet loss in Google AI Overviews, which weight product images.", recommendation: "Fix the JSON-LD image URL builder (likely a template string missing separation logic). Low effort, quick win."}**

- **{title: "Weak off-site entity/brand signals", severity: Medium, description: "No evidence found of Wikipedia entity, Reddit discussion, YouTube presence, or notable backlink profile for 'Container One Depot' — the strongest documented correlations with AI citation (YouTube ~0.737, Reddit high, Wikipedia high) are currently unaddressed. Organization JSON-LD exists but has no sameAs links to social/knowledge-graph profiles.", recommendation: "Add `sameAs` array to Organization schema linking LinkedIn/YouTube/Google Business Profile; publish 2-3 short YouTube walkthroughs of top SKUs; seed genuine Reddit/forum answers linking back. Higher effort, longer-term."}**

- **{title: "No visible author/dateline or last-updated signal on product pages", severity: Low, description: "Product pages show price and specs but no 'last verified/updated' date, and no named technical author — reduces freshness/E-E-A-T signals AI systems weight for currency-sensitive specs like emissions compliance.", recommendation: "Add a small 'Specs verified as of [date]' line, auto-populated from CMS updatedAt. Low effort."}**
