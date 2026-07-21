import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getGroupBySlug,
  getGroups,
  getProductsByGroup,
  getRelatedGroups,
  getSubCategories,
} from "@/lib/catalog";
import { getRelevantPosts } from "@/lib/blog";
import CategoryBrowser, { CategoryBrowserFallback } from "@/components/CategoryBrowser";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { PAGE_SIZE } from "@/lib/category-constants";

export function generateStaticParams() {
  return getGroups().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = getGroupBySlug(slug);
  if (!group) return {};
  const count = getProductsByGroup(slug).length;
  return {
    title: `${group.name} — ${count} Unit${count === 1 ? "" : "s"} In Stock`,
    description: `${group.blurb} Browse ${count} unit${count === 1 ? "" : "s"} in stock with nationwide delivery.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

// No `searchParams` prop here on purpose: reading it would force this
// entire route dynamic on every request, including the 8 bare category
// URLs with no query string — the only category URLs actually in the
// sitemap/canonicalized (filtered/sorted/paginated variants below always
// canonicalize back to this bare URL, so they were never meant to be
// independently indexed). Filter/sort/pagination state now lives in
// CategoryBrowser, a Client Component that reads the URL itself, so this
// page can stay a static, cacheable shell. See CategoryBrowser.tsx.
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = getGroupBySlug(slug);
  if (!group) notFound();

  const items = getProductsByGroup(slug);
  const subCats = getSubCategories(slug);
  const guides = getRelevantPosts([slug]);
  const relatedGroups = getRelatedGroups(slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: group.name,
        item: `${SITE.url}/category/${slug}`,
      },
    ],
  };

  // Capped to the first page's worth of products — matches what's
  // actually rendered by default (CategoryBrowserFallback / page 1)
  // rather than dumping all N products into the JSON-LD payload.
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${group.name} — ${SITE.name}`,
    description: group.blurb,
    url: `${SITE.url}/category/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.slice(0, PAGE_SIZE).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE.url}/product/${p.slug}`,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <nav className="font-mono text-xs text-text-faint mb-4">
        <Link href="/" className="hover:text-accent transition-colors">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-text-muted">{group.name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl tracking-wide">
            {group.name}
          </h1>
          <p className="mt-2 text-text-muted max-w-xl">{group.blurb}</p>
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-text-faint whitespace-nowrap">
          {items.length} unit{items.length === 1 ? "" : "s"}
        </span>
      </div>

      {group.intro && (
        <p className="mb-10 max-w-3xl text-text-muted leading-relaxed">{group.intro}</p>
      )}

      <Suspense
        fallback={
          <CategoryBrowserFallback products={items} groupSlug={slug} subCats={subCats} />
        }
      >
        <CategoryBrowser products={items} groupSlug={slug} subCats={subCats} />
      </Suspense>

      {guides.length > 0 && (
        <div className="mt-16 pt-10 border-t border-border max-w-3xl">
          <h2 className="font-mono text-xs uppercase tracking-widest text-text-faint mb-3">
            Related Guides
          </h2>
          <ul className="flex flex-col gap-2">
            {guides.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm text-accent hover:text-accent-hover transition-colors underline underline-offset-2"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatedGroups.length > 0 && (
        <div className="mt-10 pt-10 border-t border-border">
          <h2 className="font-mono text-xs uppercase tracking-widest text-text-faint mb-4">
            Related Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedGroups.map((g) => (
              <Link
                key={g.slug}
                href={`/category/${g.slug}`}
                className="px-4 py-2 border border-border-soft text-sm text-text-muted hover:border-accent hover:text-accent transition-colors"
              >
                {g.name} &rarr;
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
