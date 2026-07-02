function normalizeUrl(u) {
  try {
    const parsed = new URL(u);
    parsed.hash = '';
    if (!parsed.pathname.endsWith('/')) parsed.pathname += '/';
    return parsed.toString();
  } catch {
    return u;
  }
}

async function textOrEmpty(page, selector) {
  return page
    .$eval(selector, (el) => el.textContent.replace(/\s+/g, ' ').trim())
    .catch(() => '');
}

function cleanPrice(s) {
  const cleaned = (s || '').replace(/[^0-9.]/g, '');
  return cleaned;
}

async function extractCategoryLinks(page) {
  const links = await page
    .$$eval('a[href*="/product-category/"]', (els) => els.map((e) => e.href.split('?')[0]))
    .catch(() => []);
  return [...new Set(links.map(normalizeUrl))];
}

async function extractProductLinks(page) {
  let links = await page
    .$$eval('a.woocommerce-loop-product__link, a.woocommerce-LoopProduct-link', (els) =>
      els.map((e) => e.href)
    )
    .catch(() => []);
  if (links.length === 0) {
    links = await page
      .$$eval('.product > a[href*="/product/"]', (els) => els.map((e) => e.href))
      .catch(() => []);
  }
  if (links.length === 0) {
    links = await page
      .$$eval('.products a[href*="/product/"]', (els) => els.map((e) => e.href))
      .catch(() => []);
  }
  return [...new Set(links.map(normalizeUrl))];
}

async function findNextPageUrl(page) {
  let href = await page.$eval('a.next.page-numbers, a.next', (el) => el.href).catch(() => null);
  if (href) return href;

  href = await page
    .$$eval('a.page-numbers', (els) => {
      const el = els.find((e) => /^(→|»|next)$/i.test((e.textContent || '').trim()));
      return el ? el.href : null;
    })
    .catch(() => null);
  if (href) return href;

  const cur = await page
    .$eval('.page-numbers.current, span.page-numbers.current', (el) => parseInt(el.textContent.trim(), 10))
    .catch(() => null);
  if (cur) {
    href = await page
      .$$eval(
        'a.page-numbers',
        (els, target) => {
          const el = els.find((e) => parseInt((e.textContent || '').trim(), 10) === target);
          return el ? el.href : null;
        },
        cur + 1
      )
      .catch(() => null);
    if (href) return href;
  }

  return null;
}

async function extractSpecs(page) {
  const specs = {};
  const tableSelectors = [
    '#tab-additional_information table',
    '.woocommerce-product-attributes',
    '#tab-specification table',
    '#tab-specifications table',
  ];
  for (const sel of tableSelectors) {
    const rows = await page
      .$$eval(`${sel} tr`, (trs) =>
        trs.map((tr) => {
          const th = tr.querySelector('th');
          const td = tr.querySelector('td');
          return [th ? th.textContent.trim() : '', td ? td.textContent.replace(/\s+/g, ' ').trim() : ''];
        })
      )
      .catch(() => []);
    for (const [k, v] of rows) {
      if (k && v) specs[k] = v;
    }
  }
  return specs;
}

async function extractVariationAttributes(page) {
  const rows = await page
    .$$eval('form.variations_form .variations tr', (trs) =>
      trs.map((tr) => {
        const label =
          tr.querySelector('th label')?.textContent.trim() || tr.querySelector('th')?.textContent.trim() || '';
        const select = tr.querySelector('select');
        const values = select
          ? [...select.options].map((o) => o.textContent.trim()).filter((v) => v && !/choose/i.test(v))
          : [];
        return [label, values];
      })
    )
    .catch(() => []);
  return rows.filter(([k, v]) => k && v.length);
}

async function extractImages(page) {
  let imgs = await page
    .$$eval('.woocommerce-product-gallery__image a', (els) => els.map((e) => e.href))
    .catch(() => []);
  if (imgs.length === 0) {
    imgs = await page
      .$$eval('.woocommerce-product-gallery__image img', (els) =>
        els.map((e) => e.getAttribute('data-large_image') || e.src)
      )
      .catch(() => []);
  }
  const seen = new Set();
  const out = [];
  for (const src of imgs) {
    if (!src) continue;
    const base = src.replace(/-\d+x\d+(?=\.\w{2,4}(\?.*)?$)/, '');
    if (seen.has(base)) continue;
    seen.add(base);
    out.push(src);
  }
  return out;
}

async function extractCategories(page) {
  let cats = await page
    .$$eval('.posted_in a', (els) => els.map((e) => e.textContent.trim()))
    .catch(() => []);
  if (cats.length === 0) {
    const crumbs = await page
      .$$eval('.woocommerce-breadcrumb a', (els) => els.map((e) => e.textContent.trim()))
      .catch(() => []);
    cats = crumbs.filter((c) => c && c.toLowerCase() !== 'home');
  }
  return cats;
}

async function extractPrices(page) {
  const saleAmt =
    (await textOrEmpty(page, '.summary .price ins .woocommerce-Price-amount bdi')) ||
    (await textOrEmpty(page, '.summary .price ins .woocommerce-Price-amount'));
  const regAmtWhenSale =
    (await textOrEmpty(page, '.summary .price del .woocommerce-Price-amount bdi')) ||
    (await textOrEmpty(page, '.summary .price del .woocommerce-Price-amount'));
  const singleAmt =
    (await textOrEmpty(page, '.summary .price .woocommerce-Price-amount bdi')) ||
    (await textOrEmpty(page, '.summary .price .woocommerce-Price-amount'));

  if (saleAmt && regAmtWhenSale) {
    return { regularPrice: cleanPrice(regAmtWhenSale), salePrice: cleanPrice(saleAmt) };
  }
  return { regularPrice: cleanPrice(singleAmt), salePrice: '' };
}

async function extractProduct(page, url, siteName) {
  const title =
    (await textOrEmpty(page, '.product_title')) ||
    (await textOrEmpty(page, 'h1.entry-title')) ||
    (await textOrEmpty(page, 'h1'));

  const { regularPrice, salePrice } = await extractPrices(page);

  const shortDescription =
    (await textOrEmpty(page, '.woocommerce-product-details__short-description')) ||
    (await textOrEmpty(page, '.product-short-description'));

  let description =
    (await textOrEmpty(page, '#tab-description')) || (await textOrEmpty(page, '.woocommerce-Tabs-panel--description'));
  if (/^description\b/i.test(description)) {
    description = description.replace(/^description\s*/i, '').trim();
  }

  const specs = await extractSpecs(page);
  const images = await extractImages(page);
  const categories = await extractCategories(page);
  const sku = await textOrEmpty(page, '.sku');
  const isVariable = (await page.$('form.variations_form')) !== null;
  const type = isVariable ? 'variable' : 'simple';
  const variationAttrs = isVariable ? await extractVariationAttributes(page) : [];

  const attributesByName = new Map();
  for (const [k, v] of Object.entries(specs)) attributesByName.set(k.toLowerCase(), [k, v]);
  for (const [k, v] of variationAttrs) attributesByName.set(k.toLowerCase(), [k, v]);
  const attributes = [...attributesByName.values()];

  if (!title) {
    throw new Error('Could not extract product title — page may not have loaded correctly');
  }

  return {
    url,
    siteName,
    title,
    sku,
    type,
    regularPrice,
    salePrice,
    shortDescription,
    description,
    specs,
    images,
    categories,
    attributes,
  };
}

module.exports = {
  normalizeUrl,
  extractCategoryLinks,
  extractProductLinks,
  findNextPageUrl,
  extractProduct,
};
