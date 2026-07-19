import type { MetadataRoute } from "next";
import { getAllProducts, getGroups } from "@/lib/catalog";
import { getAllPosts } from "@/lib/blog";
import { SITE } from "@/lib/site";
import catalogMeta from "@/data/catalog-meta.json";

// The real timestamp the catalog was last regenerated at — not `new
// Date()`, which would restamp every product/category "just modified"
// on every single crawl and teach Google to ignore lastmod entirely.
const catalogLastModified = new Date(catalogMeta.generatedAt);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "daily", priority: 1, lastModified: catalogLastModified },
    { url: `${SITE.url}/catalog`, changeFrequency: "daily", priority: 0.9, lastModified: catalogLastModified },
    { url: `${SITE.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/blog`, changeFrequency: "weekly", priority: 0.6 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = getGroups().map((g) => ({
    url: `${SITE.url}/category/${g.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
    lastModified: catalogLastModified,
  }));

  const productRoutes: MetadataRoute.Sitemap = getAllProducts().map((p) => ({
    url: `${SITE.url}/product/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: catalogLastModified,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
