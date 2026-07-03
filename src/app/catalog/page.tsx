import Link from "next/link";
import { getAllProducts, getGroups } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Full Catalog",
  description:
    "Browse every unit in stock — shipping containers, refrigerated units, gensets, tanks, and trailers. Filter by category and sort by price.",
  alternates: { canonical: "/catalog" },
};

const PAGE_SIZE = 24;

type SortKey = "default" | "price-asc" | "price-desc";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string; sort?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const groups = getGroups();
  const allProducts = getAllProducts();

  let items = allProducts;
  if (sp.group) {
    items = items.filter((p) => p.groups.includes(sp.group!));
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
    const merged = { group: sp.group, sort: sp.sort, page: sp.page, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return `/catalog${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <nav className="font-mono text-xs text-text-faint mb-4">
        <Link href="/" className="hover:text-accent transition-colors">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-text-muted">Full Catalog</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl tracking-wide">
            Full Catalog
          </h1>
          <p className="mt-2 text-text-muted max-w-xl">
            Every unit we have listed, in one place.
          </p>
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-text-faint whitespace-nowrap">
          {items.length} unit{items.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href={buildHref({ group: undefined, page: undefined })}
          className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
            !sp.group
              ? "bg-accent text-accent-ink border-accent"
              : "border-border text-text-muted hover:border-accent hover:text-accent"
          }`}
        >
          All categories
        </Link>
        {groups.map((g) => (
          <Link
            key={g.slug}
            href={buildHref({ group: g.slug === sp.group ? undefined : g.slug, page: undefined })}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
              sp.group === g.slug
                ? "bg-accent text-accent-ink border-accent"
                : "border-border text-text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {g.name} ({g.count})
          </Link>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 mb-8 font-mono text-xs uppercase tracking-wider text-text-faint">
        <span>Sort:</span>
        {[
          { key: "default", label: "A-Z" },
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
    </div>
  );
}
