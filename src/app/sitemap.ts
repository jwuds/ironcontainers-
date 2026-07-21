import type { MetadataRoute } from "next";
import { getAllProducts, getGroups } from "@/lib/catalog";
import { getAllPosts } from "@/lib/blog";
import { SITE } from "@/lib/site";
import { retiredProductSlugs } from "@/lib/retired-slugs";
import catalogMeta from "@/data/catalog-meta.json";

// The real timestamp the catalog was last regenerated at — not `new
// Date()`, which would restamp every product/category "just modified"
// on every single crawl and teach Google to ignore lastmod entirely.
const catalogLastModified = new Date(catalogMeta.generatedAt);

// Last real content edit per `git log -1 --format=%aI -- <file>`, not a
// blanket "now" stamp. Update these two constants by hand the next time
// about/page.tsx or contact/page.tsx content actually changes.
const ABOUT_LAST_MODIFIED = new Date("2026-07-20T00:09:49+01:00");
const CONTACT_LAST_MODIFIED = new Date("2026-07-21T01:23:51+01:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const blogLastModified = getAllPosts().reduce<Date>((latest, post) => {
    const postDate = new Date(post.dateModified ?? post.date);
    return postDate > latest ? postDate : latest;
  }, new Date(0));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "daily", priority: 1, lastModified: catalogLastModified },
    { url: `${SITE.url}/catalog`, changeFrequency: "daily", priority: 0.9, lastModified: catalogLastModified },
    { url: `${SITE.url}/about`, changeFrequency: "monthly", priority: 0.5, lastModified: ABOUT_LAST_MODIFIED },
    { url: `${SITE.url}/contact`, changeFrequency: "monthly", priority: 0.5, lastModified: CONTACT_LAST_MODIFIED },
    { url: `${SITE.url}/blog`, changeFrequency: "weekly", priority: 0.6, lastModified: blogLastModified },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = getGroups().map((g) => ({
    url: `${SITE.url}/category/${g.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
    lastModified: catalogLastModified,
  }));

  // Exclude any product slug that next.config.ts already redirects away —
  // still present in products.json (kept for review, see retired-slugs.ts),
  // but listing a URL that only ever 3xx's teaches crawlers to distrust
  // the sitemap.
  const productRoutes: MetadataRoute.Sitemap = getAllProducts()
    .filter((p) => !(p.slug in retiredProductSlugs))
    .map((p) => ({
      url: `${SITE.url}/product/${p.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: catalogLastModified,
    }));

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: post.dateModified ?? post.date,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
