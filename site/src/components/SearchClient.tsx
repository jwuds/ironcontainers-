"use client";

import { useMemo, useState } from "react";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";

export type SearchItem = ProductCardData & {
  groups: string[];
  rawCategories: string[];
};

export default function SearchClient({
  items,
  groupOptions,
}: {
  items: SearchItem[];
  groupOptions: { slug: string; name: string }[];
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      if (group && !item.groups.includes(group)) return false;
      if (terms.length === 0) return true;
      const haystack = `${item.title} ${item.rawCategories.join(" ")} ${
        item.sku ?? ""
      }`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [items, query, group]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, SKU, or category…"
          autoFocus
          className="flex-1 bg-bg-raised border border-border px-4 py-3 font-mono text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setGroup(null)}
          className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
            !group
              ? "bg-accent text-accent-ink border-accent"
              : "border-border text-text-muted hover:border-accent hover:text-accent"
          }`}
        >
          All categories
        </button>
        {groupOptions.map((g) => (
          <button
            key={g.slug}
            onClick={() => setGroup(g.slug === group ? null : g.slug)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
              group === g.slug
                ? "bg-accent text-accent-ink border-accent"
                : "border-border text-text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <p className="font-mono text-xs uppercase tracking-widest text-text-faint mb-4">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <p className="text-text-muted py-16 text-center">
          No units match your search.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {results.slice(0, 60).map((item, i) => (
            <ProductCard key={item.slug} product={item} index={i} />
          ))}
        </div>
      )}
      {results.length > 60 && (
        <p className="mt-6 text-center text-xs text-text-faint font-mono">
          Showing first 60 of {results.length} — refine your search to narrow results.
        </p>
      )}
    </div>
  );
}
