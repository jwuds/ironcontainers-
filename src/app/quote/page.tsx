import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getGroupBySlug, getProductBySlug } from "@/lib/catalog";
import QuoteForm from "@/components/QuoteForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell us what you need moved and get a no-obligation quote with nationwide delivery — shipping containers, refrigeration, gensets, tanks, and trailers.",
  alternates: { canonical: "/quote" },
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; category?: string }>;
}) {
  const { product: productSlug, category: categorySlug } = await searchParams;
  const product = productSlug ? getProductBySlug(productSlug) : undefined;
  const group = categorySlug ? getGroupBySlug(categorySlug) : undefined;
  const heroImage = product?.images[0] ?? group?.heroImage ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <nav className="font-mono text-xs text-text-faint mb-4">
        <Link href="/" className="hover:text-accent transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-muted">Request a Quote</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            Get a price
          </span>
          <h1 className="mt-2 font-display text-4xl sm:text-6xl tracking-wide leading-[0.95]">
            {product ? "Quote this unit." : "Tell us what you need moved."}
          </h1>
          <p className="mt-4 max-w-md text-text-muted">
            Send us the details and a specialist will follow up with pricing,
            availability, and delivery — usually within one business day. No
            obligation, no account required.
          </p>

          {heroImage && (
            <div className="relative mt-6 hidden aspect-[4/3] w-full overflow-hidden border border-border-soft lg:block">
              <Image
                src={heroImage}
                alt={product?.title ?? group?.name ?? ""}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          )}

          <ul className="mt-6 space-y-2 text-sm text-text-muted">
            {[
              "Nationwide freight coordination",
              "Financing available for qualifying buyers",
              "Bulk and repeat-order pricing",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-6 font-mono text-xs text-text-faint">
            Prefer to talk?{" "}
            <a
              href={`tel:${SITE.contact.phone}`}
              className="text-accent hover:underline"
            >
              {SITE.contact.phoneDisplay}
            </a>
          </p>
        </div>

        <div>
          <QuoteForm
            productSlug={product?.slug}
            productTitle={product?.title}
            category={group?.slug ?? product?.groups[0]}
          />
        </div>
      </div>
    </div>
  );
}
