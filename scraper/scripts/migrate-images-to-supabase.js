// One-off migration: compress every file in public/images/ to a web-sized
// WebP, upload it to the Supabase Storage "product-images" bucket, then
// rewrite products.json/groups.json to point at the public Supabase URL
// instead of the local /images/ path. This also fixes the ~25 files that
// were saved with a .webp extension but actually held JPEG bytes (a bug in
// download-images.js), since everything gets re-encoded from real content
// regardless of its old extension.
//
// Run: node --env-file=.env.local scraper/scripts/migrate-images-to-supabase.js
// Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the environment.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DATA_DIR = path.resolve(__dirname, "..", "..", "src", "data");
const IMAGES_DIR = path.resolve(__dirname, "..", "..", "public", "images");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");
const GROUPS_PATH = path.join(DATA_DIR, "groups.json");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "product-images";
const CONCURRENCY = 8;

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

function publicUrlFor(objectPath) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${objectPath}`;
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

async function main() {
  const files = fs.readdirSync(IMAGES_DIR).filter((f) => !f.startsWith("."));
  console.log(`${files.length} local images to migrate.`);

  const limit = createLimiter(CONCURRENCY);
  const localToPublicUrl = new Map(); // "/images/foo.jpg" -> supabase public url
  let done = 0;
  let failed = 0;
  let origTotal = 0;
  let newTotal = 0;

  await Promise.all(
    files.map((file) =>
      limit(async () => {
        const srcPath = path.join(IMAGES_DIR, file);
        const stem = file.slice(0, file.length - path.extname(file).length);
        const objectPath = `${stem}.webp`;
        try {
          const origSize = fs.statSync(srcPath).size;
          const buffer = await sharp(srcPath)
            .resize({ width: 1600, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
          await uploadBuffer(objectPath, buffer);
          origTotal += origSize;
          newTotal += buffer.length;
          localToPublicUrl.set(`/images/${file}`, publicUrlFor(objectPath));
          done++;
        } catch (e) {
          failed++;
          console.warn(`  FAILED ${file}: ${e.message}`);
        }
        if ((done + failed) % 100 === 0) {
          console.log(`  progress ${done + failed}/${files.length} (${failed} failed)`);
        }
      })
    )
  );

  console.log(`Done. ${done} uploaded, ${failed} failed.`);
  console.log(`Size: ${(origTotal / 1024 / 1024).toFixed(1)}MB -> ${(newTotal / 1024 / 1024).toFixed(1)}MB`);

  if (failed > 0) {
    console.error("Aborting data rewrite because some uploads failed. Re-run to retry (upload is upsert-safe).");
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
  const groups = JSON.parse(fs.readFileSync(GROUPS_PATH, "utf8"));

  let unresolved = 0;
  for (const p of products) {
    p.images = p.images.map((local) => {
      const mapped = localToPublicUrl.get(local);
      if (!mapped) { unresolved++; return local; }
      return mapped;
    });
  }
  for (const g of groups) {
    if (g.heroImage) {
      const mapped = localToPublicUrl.get(g.heroImage);
      if (mapped) g.heroImage = mapped;
      else unresolved++;
    }
  }
  if (unresolved > 0) {
    console.warn(`${unresolved} references could not be resolved to a migrated file (left as-is).`);
  }

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products));
  fs.writeFileSync(GROUPS_PATH, JSON.stringify(groups, null, 2));
  console.log("Rewrote products.json and groups.json with Supabase public URLs.");
}

main();
