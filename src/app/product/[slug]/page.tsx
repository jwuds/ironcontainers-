import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatPrice,
  getAllProducts,
  getCleanExcerpt,
  getGroupBySlug,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/catalog";
import Gallery from "@/components/Gallery";
import SpecTable from "@/components/SpecTable";
import ExpandableText from "@/components/ExpandableText";
import ProductCard from "@/components/ProductCard";
import ReserveButton from "@/components/ReserveButton";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const fallback = `${product.title} — in stock at ${SITE.name}, nationwide delivery available.`;
  const description = getCleanExcerpt(
    product.shortDescription || product.description,
    fallback
  );
  return {
    title: product.title,
    description,
    alternates: { canonical: `/product/${slug}` },
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const price = formatPrice(product.regularPrice);
  const salePrice = formatPrice(product.salePrice);
  const primaryGroup = product.groups[0] ? getGroupBySlug(product.groups[0]) : undefined;
  const isOffshore = product.groups.includes("offshore-certified");
  const related = getRelatedProducts(product, 4);
  const numericPrice = Number(product.salePrice || product.regularPrice);
  const cartPrice = Number.isFinite(numericPrice) && numericPrice > 0 ? numericPrice : null;
  const canonicalUrl = `${SITE.url}/product/${product.slug}`;
  const cleanDescription = getCleanExcerpt(
    product.shortDescription || product.description,
    `${product.title} — in stock at ${SITE.name}, nationwide delivery available.`,
    300
  );

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: cleanDescription,
    image: product.images.map((img) =>
      img.startsWith("http") ? img : `${SITE.url}${img}`
    ),
    sku: product.sku || undefined,
    url: canonicalUrl,
    brand: { "@type": "Organization", name: SITE.name },
    ...(cartPrice
      ? {
          offers: {
            "@type": "Offer",
            url: canonicalUrl,
            priceCurrency: "USD",
            price: cartPrice,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      ...(primaryGroup
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: primaryGroup.name,
              item: `${SITE.url}/category/${primaryGroup.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: primaryGroup ? 3 : 2,
        name: product.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <nav className="font-mono text-xs text-text-faint mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-accent transition-colors">
          Home
        </Link>
        <span>/</span>
        {primaryGroup && (
          <>
            <Link
              href={`/category/${primaryGroup.slug}`}
              className="hover:text-accent transition-colors"
            >
              {primaryGroup.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-text-muted truncate max-w-[200px] sm:max-w-none">
          {product.title}
        </span>
      </nav>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
        <Gallery images={product.images} title={product.title} />

        <div>
          {product.rawCategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.rawCategories.map((c) => (
                <span
                  key={c}
                  className="font-mono text-[10px] uppercase tracking-wider text-text-faint border border-border-soft px-2 py-0.5"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display text-4xl sm:text-5xl tracking-wide leading-[0.95]">
            {product.title}
          </h1>

          {product.sku && (
            <p className="mt-2 font-mono text-xs text-text-faint">
              SKU: {product.sku}
            </p>
          )}

          <div className="mt-6 p-4 border border-border-soft bg-bg-raised">
            {price ? (
              <div className="flex items-baseline gap-3 font-mono">
                <span className="text-3xl text-accent font-semibold">
                  {salePrice ?? price}
                </span>
                {salePrice && (
                  <span className="text-lg text-text-faint line-through">
                    {price}
                  </span>
                )}
              </div>
            ) : (
              <p className="font-mono text-sm uppercase tracking-widest text-text-muted">
                Price on request
              </p>
            )}
            {product.type === "variable" && (
              <p className="mt-1 text-xs text-text-faint">
                Multiple configurations available &mdash; final price confirmed on quote.
              </p>
            )}
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                `Quote request: ${product.title}`
              )}`}
              className="mt-4 inline-flex w-full items-center justify-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
            >
              {isOffshore ? "Contact a Specialist" : price ? "Request a Quote" : "Get Pricing"}
            </a>
            {!isOffshore && (
              <ReserveButton
                slug={product.slug}
                title={product.title}
                image={product.images[0] ?? null}
                price={cartPrice}
              />
            )}
          </div>

          {product.shortDescription && (
            <div className="mt-6">
              <ExpandableText text={product.shortDescription} />
            </div>
          )}

          {product.specs.length > 0 && (
            <div className="mt-8">
              <SpecTable specs={product.specs} />
            </div>
          )}
        </div>
      </div>

      {product.description && product.description !== product.shortDescription && (
        <div className="mt-14 max-w-3xl">
          <h2 className="font-display text-2xl tracking-wide mb-3">
            Full Description
          </h2>
          <ExpandableText text={product.description} />
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-border">
          <h2 className="font-display text-3xl tracking-wide mb-6">
            You might also need
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
