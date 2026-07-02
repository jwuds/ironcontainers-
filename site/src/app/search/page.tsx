import { getAllProducts, getGroups } from "@/lib/catalog";
import SearchClient, { type SearchItem } from "@/components/SearchClient";

export const metadata = { title: "Search | Catalog" };

export default function SearchPage() {
  const products = getAllProducts();
  const groups = getGroups();

  const items: SearchItem[] = products.map((p) => ({
    slug: p.slug,
    title: p.title,
    images: p.images.slice(0, 1),
    regularPrice: p.regularPrice,
    salePrice: p.salePrice,
    type: p.type,
    sku: p.sku,
    groups: p.groups,
    rawCategories: p.rawCategories,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="font-display text-5xl sm:text-6xl tracking-wide mb-8">
        Search the catalog
      </h1>
      <SearchClient
        items={items}
        groupOptions={groups.map((g) => ({ slug: g.slug, name: g.name }))}
      />
    </div>
  );
}
