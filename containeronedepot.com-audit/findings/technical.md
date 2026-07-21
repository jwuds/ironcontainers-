# Technical SEO
Score: 86/100

Re-audited live: 2026-07-21 (prior audit: 2026-07-19). Live headers/HTML fetched directly from `https://www.containeronedepot.com/`; root causes cross-checked against local repo (`next.config.ts`, `src/app/sitemap.ts`, `src/app/category/[slug]/page.tsx`, `src/data/catalog-meta.json`, git history).

## What Works

- **Crawlability**: `robots.txt` unchanged and clean — `Allow: /`, `Disallow: /cart`, `Disallow: /search`, `Sitemap: https://www.containeronedepot.com/sitemap.xml`.
- **Security headers (new)**: `next.config.ts` now has a `headers()` block applied to `/:path*`. Verified live on `/`, `/about`, `/blog`, product and category pages: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, plus sitewide `Strict-Transport-Security: max-age=63072000`.
- **Sitemap lastmod (fixed, and done correctly)**: 222 of 225 sitemap URLs now carry `<lastmod>`. Critically, this isn't a "stamp with `new Date()` on every build" shortcut — `src/app/sitemap.ts` reads a `catalogLastModified` timestamp from `src/data/catalog-meta.json` (`generatedAt`), which `build-catalog.js` only rewrites when catalog data actually changes. Verified in git history: `generatedAt` was `2026-07-19T22:30:02.748Z` after the lastmod feature landed (commit `88b8741`), then bumped to `2026-07-19T23:23:33.291Z` in the very next commit (`c7d77c0`) that actually edited 21 product titles — i.e., the timestamp tracks real content changes, not deploys. Blog posts carry their own per-post `date`. This is good practice and should be preserved.
- **HTTPS/domain consolidation**: `http://www.` and bare `https://` apex both correctly land on `https://www.` in a single 308; HSTS unchanged.
- **Rendering**: Homepage and product pages are still edge-cached, prerendered (`X-Nextjs-Prerender: 1`, `Cache-Control: public, max-age=0, must-revalidate`, `X-Vercel-Cache: HIT`), full content present in raw HTML with no JS execution required.
- **URL structure / canonicals**: Unchanged and correct — clean hyphenated slugs, self-referencing canonicals on sampled pages (`/`, category, product).
- **Structured data**: JSON-LD (`BreadcrumbList`, `CollectionPage` on category templates) still present and confirmed live.
- **Mobile**: Correct responsive viewport meta confirmed on homepage and category page.
- **New since last audit — `/llms.txt`**: A curated, boilerplate-stripped index for LLM crawlers (brand summary, purchase policy, all 8 categories with counts, blog guides) is now live at `/llms.txt` (200, added in commit `88b8741`). Not part of the original scope but a positive agent-UX/AI-crawler signal worth noting.
- **Legacy redirect handling**: `retiredProductSlugs` map in `next.config.ts` unchanged, still correctly 308-redirects 5 retired product slugs to survivors.

## Findings

1. **Title**: Content-Security-Policy still missing (only 4 of 5 recommended headers shipped)
   **Severity**: Medium
   **Description**: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` are now live sitewide (confirmed via direct header fetch on `/`, `/about`, `/blog`, category and product pages). No `Content-Security-Policy` header is present anywhere. The `next.config.ts` comment explains why: a real CSP needs a per-request nonce issued via middleware to allow Next's hydration scripts without `unsafe-inline`, which the team has deliberately deferred as a separate, more carefully tested change rather than shipping something broken or a no-op `unsafe-inline` policy.
   **Recommendation**: Add Next.js middleware that generates a per-request nonce, injects it into the CSP header and into script tags via `next/script`'s nonce support, and ship a baseline policy (`default-src 'self'; script-src 'self' 'nonce-{x}'; img-src 'self' cdn.shopify.com conexdepotshipping.com data:; style-src 'self' 'unsafe-inline'; frame-ancestors 'self'`), tuned to the actual asset hosts in `next.config.ts` (`cdn.shopify.com`, `conexdepotshipping.com`). This is a legitimate, non-trivial engineering task — the deferral itself is reasonable, but it's still an open gap on a commerce site collecting contact/quote-form data.
   **Status vs 2026-07-19 audit**: Partially Fixed (4/5 headers shipped; CSP remains the one deliberately-deferred gap).

2. **Title**: Category pages remain fully dynamic and uncached, forced by `searchParams` usage
   **Severity**: Medium
   **Description**: All 8 sampled category pages (`shipping-containers`, `refrigerated-containers`, etc.) still serve `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` with `X-Vercel-Cache: MISS` and no `X-Nextjs-Prerender` header, even for the bare URL with no query string. Root cause identified in `src/app/category/[slug]/page.tsx`: the page has `generateStaticParams()` for the 8 category slugs (which would normally enable static/ISR generation), but the component also destructures and reads `searchParams` (for the `sub`, `sort`, and `page` filter/sort/pagination UI) on every render. In the Next.js App Router, any component that reads `searchParams` opts the entire route into per-request dynamic rendering — including requests with no query string at all — which overrides the static params list. This means the 8 highest link-equity hub pages, which fan out to all 208 products, are rendered fresh on every single crawl and every single visit.
   **Recommendation**: Split the page: keep the base `/category/[slug]` render (product grid, JSON-LD, headings) statically generated/ISR'd with `export const revalidate = 3600`, and move the `searchParams`-dependent filter/sort/pagination logic into a client component wrapped in `<Suspense>` (or adopt Partial Prerendering — `experimental.ppr` — once stable in this Next.js version) so the static shell is prerendered and only the interactive filter bar/grid re-renders client-side or via a dynamic "hole." Verify with `next build` output that `/category/[slug]` reports as SSG/ISR (`○`/`◐`), not fully dynamic (`ƒ`).
   **Status vs 2026-07-19 audit**: Still Open (root cause now identified — not previously diagnosed).

3. **Title**: Sitemap `lastmod` missing on 3 static pages (`/about`, `/contact`, `/blog`)
   **Severity**: Low
   **Description**: 222 of 225 sitemap URLs now have `<lastmod>` (see What Works). The 3 exceptions are `about`, `contact`, and the `/blog` index — `src/app/sitemap.ts` simply omits `lastModified` for these three `staticRoutes` entries. Minor, but these are exactly the kind of low-change-frequency pages where a stable `lastmod` is cheap to add and helps crawl prioritization.
   **Recommendation**: Give `about` and `contact` a static `lastModified` tied to their last real content edit (git commit date or a manual constant), and give `/blog` the max date across `getAllPosts()` so it reflects the newest post.
   **Status vs 2026-07-19 audit**: Mostly Fixed (was 4/229 with lastmod; now 222/225, only these 3 statics remain — this is effectively resolved and can be closed with a small follow-up).

4. **Title**: Non-www apex still requires two redirect hops over plain HTTP
   **Severity**: Low
   **Description**: Re-verified live: `http://containeronedepot.com/` → `https://containeronedepot.com/` (308) → `https://www.containeronedepot.com/` (308), still 2 hops. `http://www.containeronedepot.com/` and `https://containeronedepot.com/` are each a single clean 308 to the canonical `https://www.` URL. This is DNS/edge-layer routing (Vercel domain config), not something visible in `next.config.ts`.
   **Recommendation**: Unchanged from prior audit — collapse `http://containeronedepot.com/` to a single redirect straight to `https://www.containeronedepot.com/` in Vercel's domain/DNS settings.
   **Status vs 2026-07-19 audit**: Still Open.

5. **Title**: No IndexNow key file or integration
   **Severity**: Low
   **Description**: `https://www.containeronedepot.com/.well-known/indexnow.txt` and the conventional root-level `/{key}.txt` both return 404 (checked `.well-known/indexnow.txt` directly; no key file found in `public/` in the repo either). No evidence of push-based indexing to Bing/Yandex/Naver/Seznam.
   **Recommendation**: Unchanged from prior audit — generate an IndexNow key, host it at the site root, and call the IndexNow API on product publish/price-change/retirement events (ties in naturally with the existing `retiredProductSlugs` redirect map and `build-catalog.js` regeneration step).
   **Status vs 2026-07-19 audit**: Still Open.

6. **Title**: `/cart` and `/search` are disallowed via robots.txt but still resolve 200 with no `noindex`
   **Severity**: Info
   **Description**: Re-verified live: both routes return `200 OK` with no `X-Robots-Tag` header and no `<meta name="robots">` tag in the HTML `<head>`. Blocked from crawling via `Disallow`, but not from indexing — an external link to either would still let Google index the bare URL ("indexed, though blocked by robots.txt").
   **Recommendation**: Unchanged from prior audit — add `<meta name="robots" content="noindex">` to both routes, or confirm via Google Search Console that no such warning has appeared after this additional crawl cycle.
   **Status vs 2026-07-19 audit**: Still Open.

## Category Score: 86/100

Justification: The single largest gap from the prior audit — a total absence of security headers — is now 80% closed (4 of 5 headers shipped correctly; only the CSP, which genuinely requires more careful nonce-based middleware work, remains open). The sitemap `lastmod` gap is essentially resolved, and resolved *correctly* — tied to real catalog-regeneration timestamps pulled from `build-catalog.js`/`catalog-meta.json` rather than a blanket "now" stamp, with git history confirming it updates only on real content changes. The one substantive open item is the category-page caching regression, whose root cause (page-wide dynamic rendering triggered by `searchParams` consumption for filter/sort/pagination) is now identified and gives the team a concrete, scoped fix. Remaining Low items (apex redirect hops, IndexNow, cart/search noindex) are unchanged, low-cost, and low-impact.
