import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/catalog";
import AddToCartButton from "@/components/AddToCartButton";

export type ProductCardData = Pick<
  Product,
  "slug" | "title" | "images" | "regularPrice" | "salePrice" | "type" | "sku"
>;

export default function ProductCard({
  product,
  index = 0,
}: {
  product: ProductCardData;
  index?: number;
}) {
  const price = formatPrice(product.regularPrice);
  const salePrice = formatPrice(product.salePrice);
  const image = product.images[0] ?? null;
  const numericPrice = Number(product.salePrice || product.regularPrice);
  const cartPrice = Number.isFinite(numericPrice) && numericPrice > 0 ? numericPrice : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col bg-bg-raised border border-border-soft hover:border-accent/60 transition-colors rise-in"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-border-soft group-hover:bg-accent transition-colors z-10" />
      <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-border-soft group-hover:bg-accent transition-colors z-10" />

      <div className="relative aspect-4/3 overflow-hidden bg-bg-raised-2">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-text-faint font-mono text-xs">
            NO IMAGE
          </div>
        )}
        {product.type === "variable" && (
          <span className="absolute bottom-2 left-2 bg-bg/90 border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Multiple options
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 border-t border-border-soft">
        <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {product.title}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 font-mono">
          {price ? (
            <span className="text-accent font-semibold text-sm">
              {salePrice ?? price}
              {salePrice && (
                <span className="ml-1.5 text-text-faint line-through text-xs">
                  {price}
                </span>
              )}
            </span>
          ) : (
            <span className="text-text-muted text-xs uppercase tracking-wider">
              Price on request
            </span>
          )}
          {product.sku && (
            <span className="text-[10px] text-text-faint truncate max-w-[80px]">
              {product.sku}
            </span>
          )}
        </div>
        <AddToCartButton
          slug={product.slug}
          title={product.title}
          image={image}
          price={cartPrice}
          className="w-full border border-border-soft py-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted hover:border-accent hover:text-accent transition-colors disabled:opacity-60 disabled:hover:border-border-soft disabled:hover:text-text-muted"
        />
      </div>
    </Link>
  );
}
