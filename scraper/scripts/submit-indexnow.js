#!/usr/bin/env node
// Pushes the live sitemap's URL list to IndexNow (Bing, Yandex, Seznam,
// Naver, and other participating engines) so new/changed pages get
// discovered without waiting for the next pull-based crawl.
//
// This site has no live CMS/webhook — the catalog is rebuilt manually via
// `npm run catalog:build` — so this is a separate, deliberate step: run it
// after deploying a change you want indexed sooner, not on every build.
// Usage:
//   node scraper/scripts/submit-indexnow.js
//   node scraper/scripts/submit-indexnow.js https://www.containeronedepot.com/product/some-slug ...
//
// Requires the key file at public/<key>.txt to already be deployed (it's
// committed to the repo, so any normal deploy publishes it).

const KEY = 'a488bcf49d9948e58608fafcca2d7d5e';
const HOST = 'www.containeronedepot.com';
const SITE_URL = `https://${HOST}`;
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function fetchSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap.xml: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error('Sitemap parsed to zero URLs — aborting.');
  return urls;
}

async function submit(urlList) {
  // IndexNow bulk limit is 10,000 URLs per request; this catalog is far
  // under that, so a single request is fine.
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });
  return res;
}

async function main() {
  const argUrls = process.argv.slice(2);
  const urlList = argUrls.length > 0 ? argUrls : await fetchSitemapUrls();

  console.log(`Submitting ${urlList.length} URL(s) to IndexNow...`);
  const res = await submit(urlList);

  // IndexNow returns 200 or 202 on success; 200 with no body is typical.
  if (res.status === 200 || res.status === 202) {
    console.log(`Success (${res.status}). Submitted ${urlList.length} URLs.`);
  } else {
    const body = await res.text().catch(() => '');
    console.error(`IndexNow returned ${res.status}: ${body}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('IndexNow submission failed:', err.message);
  process.exitCode = 1;
});
