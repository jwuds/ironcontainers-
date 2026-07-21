#!/usr/bin/env node
// Fetches every URL listed in sitemap.xml and reports anything that isn't
// a clean 200 — redirects, 404s, 5xxs. A spot-check sample can miss a
// stray redirected URL sitting in a 200+-URL sitemap (that's exactly how
// the thermo-king-sg-3000-clip-on-gensets-1 entry slipped through a prior
// audit's sampling); this checks all of them.
//
// Usage:
//   node scraper/scripts/check-sitemap-urls.js
//   node scraper/scripts/check-sitemap-urls.js https://www.containeronedepot.com
//   node scraper/scripts/check-sitemap-urls.js http://localhost:3005

const BASE_URL = process.argv[2] || 'https://www.containeronedepot.com';
const CONCURRENCY = 8;

async function fetchSitemapUrls() {
  const res = await fetch(`${BASE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap.xml: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error('Sitemap parsed to zero URLs — aborting.');
  return urls;
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { redirect: 'manual' });
    return { url, status: res.status, location: res.headers.get('location') };
  } catch (err) {
    return { url, status: null, error: err.message };
  }
}

async function runPool(items, worker, concurrency) {
  const results = [];
  let i = 0;
  async function next() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, next));
  return results;
}

async function main() {
  const urls = await fetchSitemapUrls();
  console.log(`Checking ${urls.length} sitemap URLs against ${BASE_URL}...`);

  const results = await runPool(urls, checkUrl, CONCURRENCY);

  const ok = results.filter((r) => r.status === 200);
  const redirects = results.filter((r) => r.status && r.status >= 300 && r.status < 400);
  const errors = results.filter((r) => !r.status || r.status >= 400);

  console.log(`\n${ok.length}/${urls.length} returned 200.`);

  if (redirects.length > 0) {
    console.log(`\n${redirects.length} URL(s) redirect instead of returning 200 — these shouldn't be in the sitemap:`);
    for (const r of redirects) {
      console.log(`  ${r.status} ${r.url} -> ${r.location}`);
    }
  }

  if (errors.length > 0) {
    console.log(`\n${errors.length} URL(s) failed:`);
    for (const r of errors) {
      console.log(`  ${r.status ?? 'ERROR'} ${r.url}${r.error ? ` (${r.error})` : ''}`);
    }
  }

  if (redirects.length === 0 && errors.length === 0) {
    console.log('\nAll clear — every sitemap URL returns 200.');
  } else {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Sitemap check failed:', err.message);
  process.exitCode = 1;
});
