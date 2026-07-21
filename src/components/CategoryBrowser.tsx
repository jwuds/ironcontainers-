"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/catalog";
import { PAGE_SIZE } from "@/lib/category-constants";

type SortKey = "default" | "price-asc" | "price-desc";
type SubCat = { name: string; count: number };
type Sp = { sub?: string; sort?: string; page?: string };

function computeView(products: Product[], groupSlug: string, sp: Sp) {
  let items = products;
  if (sp.sub) {
    items = items.filter((p) => p.rawCategories.includes(sp.sub!));
  }

  const sort: SortKey =
    sp.sort === "price-asc" || sp.sort === "price-desc" ? sp.sort : "default";
  if (sort !== "default") {
    items = [...items].sort((a, b) => {
      const av = Number(a.regularPrice) || (sort === "price-asc" ? Infinity : -Infinity);
      const bv = Number(b.regularPrice) || (sort === "price-asc" ? Infinity : -Infinity);
      return sort === "price-asc" ? av - bv : bv - av;
    });
  }

  const page = Math.max(1, Number(sp.page) || 1);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { sub: sp.sub, sort: sp.sort, page: sp.page, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return `/category/${groupSlug}${qs ? `?${qs}` : ""}`;
  };

  return { pageItems, page, totalPages, sort, sp, buildHref, totalCount: items.length };
}

function CategoryBrowserView({
  products,
  groupSlug,
  subCats,
  sp,
}: {
  products: Product[];
  groupSlug: string;
  subCats: SubCat[];
  sp: Sp;
}) {
  const { pageItems, page, totalPages, sort, buildHref } = computeView(products, groupSlug, sp);

  return (
    <>
      {subCats.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href={buildHref({ sub: undefined, page: undefined })}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
              !sp.sub
                ? "bg-accent text-accent-ink border-accent"
                : "border-border text-text-muted hover:border-accent hover:text-accent"
            }`}
          >
            All
          </Link>
          {subCats.slice(0, 12).map((c) => (
            <Link
              key={c.name}
              href={buildHref({ sub: c.name, page: undefined })}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
                sp.sub === c.name
                  ? "bg-accent text-accent-ink border-accent"
                  : "border-border text-text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {c.name} ({c.count})
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mb-8 font-mono text-xs uppercase tracking-wider text-text-faint">
        <span>Sort:</span>
        {[
          { key: "default", label: "Featured" },
          { key: "price-asc", label: "Price ↑" },
          { key: "price-desc", label: "Price ↓" },
        ].map((s) => (
          <Link
            key={s.key}
            href={buildHref({ sort: s.key === "default" ? undefined : s.key, page: undefined })}
            className={`px-2.5 py-1 border transition-colors ${
              sort === s.key
                ? "border-accent text-accent"
                : "border-border-soft hover:border-accent hover:text-accent"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {pageItems.length === 0 ? (
        <p className="text-text-muted py-16 text-center">
          No units match this filter right now.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {pageItems.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2 font-mono text-sm">
          {page > 1 && (
            <Link
              href={buildHref({ page: String(page - 1) })}
              className="px-3 py-1.5 border border-border hover:border-accent hover:text-accent transition-colors"
            >
              &larr; Prev
            </Link>
          )}
          <span className="px-3 py-1.5 text-text-muted">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildHref({ page: String(page + 1) })}
              className="px-3 py-1.5 border border-border hover:border-accent hover:text-accent transition-colors"
            >
              Next &rarr;
            </Link>
          )}
        </div>
      )}
    </>
  );
}

// Server-renderable default view (no sub-filter, default sort, page 1) —
// passed as the <Suspense> fallback so it's part of the static shell.
// Identical markup to the post-hydration client view below when the URL
// has no query string, so there's no visible flash for the common case.
export function CategoryBrowserFallback({
  products,
  groupSlug,
  subCats,
}: {
  products: Product[];
  groupSlug: string;
  subCats: SubCat[];
}) {
  return (
    <CategoryBrowserView products={products} groupSlug={groupSlug} subCats={subCats} sp={{}} />
  );
}

// Reads the real URL query string client-side, so this component (and
// only this component) opts into client rendering below its <Suspense>
// boundary — the rest of the category page stays a static, cacheable
// server shell instead of the whole route being forced dynamic by
// reading `searchParams` in the page itself.
export default function CategoryBrowser({
  products,
  groupSlug,
  subCats,
}: {
  products: Product[];
  groupSlug: string;
  subCats: SubCat[];
}) {
  const searchParams = useSearchParams();
  const sp: Sp = {
    sub: searchParams.get("sub") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    page: searchParams.get("page") ?? undefined,
  };
  return (
    <CategoryBrowserView products={products} groupSlug={groupSlug} subCats={subCats} sp={sp} />
  );
}
