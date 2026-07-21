import Link from "next/link";
import { formatPrice, type Product } from "@/lib/catalog";

function conditionOf(product: Product): string | null {
  return product.specs.find(([label]) => /condition/i.test(label))?.[1] ?? null;
}

export default function ComparisonTable({
  current,
  comparables,
}: {
  current: Product;
  comparables: Product[];
}) {
  if (comparables.length === 0) return null;

  const rows = [current, ...comparables];
  const anyCondition = rows.some((p) => conditionOf(p));

  return (
    <div className="border border-border-soft overflow-x-auto">
      <div className="bg-bg-raised-2 px-4 py-2 border-b border-border-soft">
        <span className="font-mono text-xs uppercase tracking-widest text-text-faint">
          Compare Similar Options
        </span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-soft text-left font-mono text-[10px] uppercase tracking-widest text-text-faint">
            <th className="px-4 py-2 font-normal">Unit</th>
            {anyCondition && <th className="px-4 py-2 font-normal">Condition</th>}
            <th className="px-4 py-2 font-normal text-right">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-soft">
          {rows.map((p) => {
            const isCurrent = p.slug === current.slug;
            const price = formatPrice(p.salePrice) ?? formatPrice(p.regularPrice);
            return (
              <tr key={p.slug} className={isCurrent ? "bg-bg-raised" : undefined}>
                <td className="px-4 py-2.5">
                  {isCurrent ? (
                    <span className="font-medium">{p.title} (this unit)</span>
                  ) : (
                    <Link
                      href={`/product/${p.slug}`}
                      className="hover:text-accent transition-colors"
                    >
                      {p.title}
                    </Link>
                  )}
                </td>
                {anyCondition && (
                  <td className="px-4 py-2.5 text-text-muted">{conditionOf(p) ?? "—"}</td>
                )}
                <td className="px-4 py-2.5 text-right font-mono text-accent">
                  {price ?? "Price on request"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
