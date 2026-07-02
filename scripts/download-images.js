// Downloads every unique product image referenced in site/src/data/products.json
// into site/public/images/, then rewrites products.json + groups.json to point
// at the local files instead of the remote conexdepot.com / conexdepotshipping.com
// URLs. Run this after build-catalog.js. Resumable: already-downloaded files are
// skipped on re-run.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const https = require("https");

const DATA_DIR = path.resolve(__dirname, "..", "site", "src", "data");
const IMAGES_DIR = path.resolve(__dirname, "..", "site", "public", "images");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");
const GROUPS_PATH = path.join(DATA_DIR, "groups.json");

const CONCURRENCY = 8;
const RETRIES = 3;

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

function localFileNameFor(url) {
  const u = new URL(url);
  const hostPrefix = u.hostname.replace(/^www\./, "").split(".")[0];
  const base = path.basename(u.pathname).split("?")[0];
  const ext = path.extname(base) || ".jpg";
  const stem = base
    .slice(0, base.length - ext.length)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 8);
  return `${hostPrefix}-${stem}-${hash}${ext}`;
}

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        download(res.headers.location, destPath).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const tmp = destPath + ".part";
      const file = fs.createWriteStream(tmp);
      res.pipe(file);
      file.on("finish", () => {
        file.close((err) => {
          if (err) return reject(err);
          fs.renameSync(tmp, destPath);
          resolve();
        });
      });
      file.on("error", reject);
    });
    req.on("timeout", () => req.destroy(new Error(`Timeout fetching ${url}`)));
    req.on("error", reject);
  });
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
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
  const groups = JSON.parse(fs.readFileSync(GROUPS_PATH, "utf8"));

  const urlToLocal = new Map();
  for (const p of products) {
    for (const url of p.images) {
      if (!urlToLocal.has(url)) urlToLocal.set(url, `/images/${localFileNameFor(url)}`);
    }
  }
  for (const g of groups) {
    if (g.heroImage && !urlToLocal.has(g.heroImage)) {
      urlToLocal.set(g.heroImage, `/images/${localFileNameFor(g.heroImage)}`);
    }
  }

  const entries = [...urlToLocal.entries()];
  console.log(`${entries.length} unique images to fetch.`);

  const limit = createLimiter(CONCURRENCY);
  let done = 0;
  let failed = 0;
  const failedUrls = [];

  await Promise.all(
    entries.map(([url, localPath]) =>
      limit(async () => {
        const destPath = path.join(IMAGES_DIR, path.basename(localPath));
        if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
          done++;
          return;
        }
        try {
          await withRetry(() => download(url, destPath), RETRIES, url);
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

  console.log(`Done. ${done} downloaded/present, ${failed} failed.`);

  // Rewrite products/groups to local paths. Any URL that failed to download
  // is dropped rather than left pointing at a dead local file.
  for (const p of products) {
    p.images = p.images.map((u) => urlToLocal.get(u)).filter((local) => {
      const dest = path.join(IMAGES_DIR, path.basename(local));
      return fs.existsSync(dest);
    });
  }
  for (const g of groups) {
    if (g.heroImage) {
      const local = urlToLocal.get(g.heroImage);
      const dest = local ? path.join(IMAGES_DIR, path.basename(local)) : null;
      g.heroImage = dest && fs.existsSync(dest) ? local : null;
    }
  }
  // Groups with no heroImage (because it failed) fall back to the first
  // product in that group that still has a local image.
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

  console.log(`Rewrote products.json and groups.json with local /images/ paths.`);
}

main();
