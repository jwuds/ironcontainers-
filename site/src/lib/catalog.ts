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
  sourceUrl: string;
  siteName: string;
};

export type Group = {
  slug: string;
  name: string;
  blurb: string;
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

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByGroup(slug: string): Product[] {
  return products.filter((p) => p.groups.includes(slug));
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

export function formatPrice(value: string | null): string | null {
  if (!value) return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
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
