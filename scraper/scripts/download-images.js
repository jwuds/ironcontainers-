// Fetches every unique product image referenced in ../src/data/products.json,
// compresses it to a web-sized WebP, and uploads it to the Supabase Storage
// "product-images" bucket, then rewrites products.json + groups.json to point
// at the public Supabase URL instead of the remote conexdepot.com /
// conexdepotshipping.com URL. Run this after build-catalog.js. Resumable:
// images already present in the bucket are skipped on re-run.
//
// Images are uploaded straight to Supabase rather than saved into
// public/images/ so the git repo doesn't grow with every new photo batch,
// and so Vercel's Image Optimization quota (see next.config.ts) is never
// involved — Supabase serves the already-compressed file directly.
//
// Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the environment, e.g.:
//   node --env-file=.env.local scraper/scripts/download-images.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const https = require("https");
const sharp = require("sharp");

const DATA_DIR = path.resolve(__dirname, "..", "..", "src", "data");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");
const GROUPS_PATH = path.join(DATA_DIR, "groups.json");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "product-images";

const CONCURRENCY = 8;
const RETRIES = 3;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

function createLimiter(concurrency) {
  let active = 0;
  const queue = [];
  const runNext = () => {
    if (active >= concurrency || queue.length === 0) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    Promise.resolve()
      .then(fn)
      .then(
        (v) => { active--; resolve(v); runNext(); },
        (e) => { active--; reject(e); runNext(); }
      );
  };
  return (fn) => new Promise((resolve, reject) => { queue.push({ fn, resolve, reject }); runNext(); });
}

function objectPathFor(url) {
  const u = new URL(url);
  const hostPrefix = u.hostname.replace(/^www\./, "").split(".")[0];
  const base = path.basename(u.pathname).split("?")[0];
  const ext = path.extname(base);
  const stem = (ext ? base.slice(0, base.length - ext.length) : base)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 8);
  return `${hostPrefix}-${stem}-${hash}.webp`;
}

function publicUrlFor(objectPath) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${objectPath}`;
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        fetchBuffer(res.headers.location).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
    req.on("timeout", () => req.destroy(new Error(`Timeout fetching ${url}`)));
    req.on("error", reject);
  });
}

async function objectExists(objectPath) {
  const res = await fetch(publicUrlFor(objectPath), { method: "HEAD" });
  return res.ok;
}

async function uploadBuffer(objectPath, buffer) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${objectPath}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      "Content-Type": "image/webp",
      "x-upsert": "true",
    },
    body: buffer,
  });
  if (!res.ok) {
    throw new Error(`upload failed (${res.status}): ${await res.text()}`);
  }
}

async function withRetry(fn, retries, label) {
  let lastErr;
  for (let i = 1; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < retries) await new Promise((r) => setTimeout(r, 800 * i));
    }
  }
  throw new Error(`${label}: ${lastErr.message}`);
}

async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
  const groups = JSON.parse(fs.readFileSync(GROUPS_PATH, "utf8"));

  const urlToObjectPath = new Map();
  for (const p of products) {
    for (const url of p.images) {
      if (!urlToObjectPath.has(url)) urlToObjectPath.set(url, objectPathFor(url));
    }
  }
  for (const g of groups) {
    if (g.heroImage && !urlToObjectPath.has(g.heroImage)) {
      urlToObjectPath.set(g.heroImage, objectPathFor(g.heroImage));
    }
  }

  const entries = [...urlToObjectPath.entries()];
  console.log(`${entries.length} unique images to fetch.`);

  const limit = createLimiter(CONCURRENCY);
  let done = 0;
  let failed = 0;
  const failedUrls = [];

  await Promise.all(
    entries.map(([url, objectPath]) =>
      limit(async () => {
        try {
          if (await objectExists(objectPath)) {
            done++;
            return;
          }
          const raw = await withRetry(() => fetchBuffer(url), RETRIES, url);
          const compressed = await sharp(raw)
            .resize({ width: 1600, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
          await uploadBuffer(objectPath, compressed);
          done++;
        } catch (e) {
          failed++;
          failedUrls.push({ url, error: e.message });
          console.warn(`  FAILED ${url}: ${e.message}`);
        }
        if ((done + failed) % 100 === 0) {
          console.log(`  progress ${done + failed}/${entries.length} (${failed} failed)`);
        }
      })
    )
  );

  console.log(`Done. ${done} uploaded/present, ${failed} failed.`);

  // Rewrite products/groups to Supabase public URLs. Any URL that failed is
  // dropped rather than left pointing at a dead object.
  for (const p of products) {
    p.images = p.images
      .map((u) => ({ u, objectPath: urlToObjectPath.get(u) }))
      .filter(({ objectPath }) => !failedUrls.some((f) => urlToObjectPath.get(f.url) === objectPath))
      .map(({ objectPath }) => publicUrlFor(objectPath));
  }
  for (const g of groups) {
    if (g.heroImage) {
      const objectPath = urlToObjectPath.get(g.heroImage);
      const ok = objectPath && !failedUrls.some((f) => urlToObjectPath.get(f.url) === objectPath);
      g.heroImage = ok ? publicUrlFor(objectPath) : null;
    }
  }
  // Groups with no heroImage (because it failed) fall back to the first
  // product in that group that still has an image.
  for (const g of groups) {
    if (!g.heroImage) {
      const withImage = products.find((p) => p.groups.includes(g.slug) && p.images.length > 0);
      g.heroImage = withImage ? withImage.images[0] : null;
    }
  }

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products));
  fs.writeFileSync(GROUPS_PATH, JSON.stringify(groups, null, 2));
  fs.writeFileSync(
    path.join(__dirname, "..", "output", "failed-image-downloads.json"),
    JSON.stringify(failedUrls, null, 2)
  );

  console.log(`Rewrote products.json and groups.json with Supabase public URLs.`);
}

main();
