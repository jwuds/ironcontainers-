import productsData from "@/data/products.json";
import groupsData from "@/data/groups.json";

export type Product = {
  slug: string;
  title: string;
  sku: string | null;
  type: string;
  regularPrice: string | null;
  salePrice: string | null;
  shortDescription: string;
  description: string;
  specs: [string, string][];
  images: string[];
  rawCategories: string[];
  groups: string[];
};

export type Group = {
  slug: string;
  name: string;
  blurb: string;
  intro?: string;
  count: number;
  heroImage: string | null;
};

const products = productsData as Product[];
const groups = groupsData as Group[];

export function getGroups(): Group[] {
  return groups;
}

export function getGroupBySlug(slug: string): Group | undefined {
  return groups.find((g) => g.slug === slug);
}

// Editorial adjacency between categories — real product-line relationships
// (a reefer buyer may need a replacement genset; a tank buyer may need an
// LPG transport trailer), not derived from the data. Used to cross-link
// category pages so crawl paths between related categories don't rely
// solely on the flat footer list.
const RELATED_GROUPS: Record<string, string[]> = {
  "shipping-containers": ["offshore-certified", "refrigerated-containers"],
  "refrigerated-containers": ["refrigeration-gensets", "shipping-containers"],
  "offshore-certified": ["shipping-containers", "refrigerated-containers"],
  "refrigeration-gensets": ["refrigerated-containers", "generators-power"],
  "generators-power": ["refrigeration-gensets"],
  tanks: ["trailers-chassis"],
  "trailers-chassis": ["tanks", "shipping-containers"],
  "accessories-parts": ["shipping-containers"],
};

export function getRelatedGroups(slug: string): Group[] {
  return (RELATED_GROUPS[slug] ?? [])
    .map((s) => getGroupBySlug(s))
    .filter((g): g is Group => Boolean(g));
}

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByGroup(slug: string): Product[] {
  return products.filter((p) => p.groups.includes(slug));
}

// Products worth comparing side-by-side with this one — same specific
// sub-category (e.g. "40FT Shipping Container"), not just the same broad
// group, so the table stays a real apples-to-apples comparison instead of
// a grab-bag. Picks whichever of this product's rawCategories has the
// fewest total members (excluding categories with only this one product
// in them), so a product tagged into both a broad and a narrow category
// compares against the narrow one.
export function getComparableProducts(product: Product, limit = 6): Product[] {
  let bestCategory: string | null = null;
  let bestCount = Infinity;
  for (const cat of product.rawCategories) {
    const count = products.filter((p) => p.rawCategories.includes(cat)).length;
    if (count > 1 && count < bestCount) {
      bestCategory = cat;
      bestCount = count;
    }
  }
  if (!bestCategory) return [];
  return products
    .filter((p) => p.slug !== product.slug && p.rawCategories.includes(bestCategory!))
    .sort((a, b) => {
      const av = Number(a.regularPrice) || Infinity;
      const bv = Number(b.regularPrice) || Infinity;
      return av - bv;
    })
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.slug !== product.slug && p.groups.some((g) => product.groups.includes(g))
    )
    .slice(0, limit);
}

export function getSubCategories(groupSlug: string): { name: string; count: number }[] {
  const inGroup = getProductsByGroup(groupSlug);
  const counts = new Map<string, number>();
  for (const p of inGroup) {
    for (const c of p.rawCategories) {
      counts.set(c, (counts.get(c) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

const SPAM_MARKERS = [
  /\bfor sale\b/i,
  /\bbuy\b[^.!?]*\bonline\b/i,
  /\bnear me\b/i,
  /\bwholesale prices?\b/i,
  /\bjoin thousands\b/i,
  /\bdiscover the unparalleled\b/i,
  /\bthe top choice for\b/i,
  /\band save!/i,
  /\bunparalleled benefits\b/i,
];

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function isCleanSentence(s: string): boolean {
  if (s.length < 30 || s.length > 260) return false;
  if (SPAM_MARKERS.some((re) => re.test(s))) return false;
  return /\b(the|and|with|for|is|are|this|our|of|to|a|an)\b/i.test(s);
}

/**
 * Scraped product copy often opens with a run-on chain of repeated
 * keyword variants ("Buy X Online X for Sale X..."). This extracts the
 * first genuinely clean, spam-marker-free sentence(s) instead, without
 * inventing any new copy.
 */
export function getCleanExcerpt(
  text: string | null | undefined,
  fallback: string,
  maxLen = 155
): string {
  if (!text) return fallback;
  const sentences = splitSentences(text);
  const clean = sentences.filter(isCleanSentence);
  const source = clean.length ? clean : sentences;
  if (!source.length) return fallback;

  let out = source[0];
  for (let i = 1; i < source.length; i++) {
    const next = `${out} ${source[i]}`;
    if (next.length > maxLen) break;
    out = next;
  }
  if (out.length > maxLen) {
    out = out.slice(0, maxLen - 1).replace(/\s+\S*$/, "") + "…";
  }
  return out;
}

export function formatPrice(value: string | null): string | null {
  if (!value) return null;
  const num = Number(value);
  // A handful of scraped listings carry "0.00" for missing pricing data,
  // not an actual $0 price — treat non-positive the same as absent so
  // callers fall back to "Price on request" instead of showing "$0".
  if (Number.isNaN(num) || num <= 0) return null;
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function searchProducts(query: string, limit = 50): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products
    .filter((p) => {
      const haystack = `${p.title} ${p.rawCategories.join(" ")} ${p.sku ?? ""}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    })
    .slice(0, limit);
}
