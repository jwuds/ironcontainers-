import Image from "next/image";
import Link from "next/link";
import { getAllProducts, getGroups } from "@/lib/catalog";
import CategoryTile from "@/components/CategoryTile";
import ProductCard from "@/components/ProductCard";
import WhyBuyGrid from "@/components/WhyBuyGrid";
import IndustriesGrid from "@/components/IndustriesGrid";
import HowItWorks from "@/components/HowItWorks";
import PartnerLogos from "@/components/PartnerLogos";
import TransformationsTeaser from "@/components/TransformationsTeaser";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

export default function Home() {
  const groups = getGroups();
  const products = getAllProducts();
  const totalUnits = products.length;

  const heroImage =
    groups.find((g) => g.slug === "refrigerated-containers")?.heroImage ??
    groups[0]?.heroImage;

  const featured = groups
    .map((g) => products.find((p) => p.groups.includes(g.slug) && p.images.length > 0))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div>
      {/* Hero */}
      <section className="relative grain overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          {heroImage && (
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/10 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
              <span className="h-1.5 w-1.5 bg-accent" />
              {totalUnits} units in stock &middot; nationwide delivery
            </span>
            <h1 className="mt-4 font-display text-6xl sm:text-8xl leading-[0.9] tracking-wide max-w-3xl">
              Heavy equipment,{" "}
              <span className="text-accent">ready to move.</span>
            </h1>
            <p className="mt-5 max-w-xl text-text-muted text-base sm:text-lg">
              Quality shipping containers, generators, tanks, refrigerated units
              and industrial equipment &mdash; in stock and ready to ship now.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/catalog"
                className="inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner hover:bg-accent-hover transition-colors hover:-translate-y-0.5 active:translate-y-0 transition-transform"
              >
                Shop Inventory
              </Link>
              {featured[0] && (
                <Link
                  href={`/product/${featured[0].slug}`}
                  className="inline-flex items-center border border-border px-6 py-3 font-semibold text-text hover:border-accent hover:text-accent transition-colors hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  Reserve a Unit
                </Link>
              )}
            </div>
            <p className="mt-5 font-mono text-xs uppercase tracking-widest text-text-muted">
              &#10003; In Stock &nbsp; &#10003; Financing Available &nbsp; &#10003; Inspected Equipment
            </p>
          </Reveal>
        </div>

        {/* Nameplate stat strip */}
        <Reveal
          as="div"
          delay={0.25}
          className="relative border-t border-border-soft bg-bg/60 backdrop-blur"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-border-soft font-mono">
            {[
              { label: "Units listed", value: String(totalUnits) },
              { label: "Categories", value: String(groups.length) },
              { label: "Delivery", value: "Nationwide" },
              { label: "Financing", value: "Available" },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-4 sm:py-5 first:pl-0">
                <div className="text-xl sm:text-2xl text-accent">{stat.value}</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-faint mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Category grid */}
      <Reveal as="section" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl sm:text-4xl tracking-wide">
            Shop by category
          </h2>
          <Link
            href="/catalog"
            className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:auto-rows-[180px]">
          {groups.map((g, i) => (
            <CategoryTile key={g.slug} group={g} index={i} large={i === 0} />
          ))}
        </div>
      </Reveal>

      <Reveal>
        <WhyBuyGrid />
      </Reveal>
      <Reveal>
        <IndustriesGrid />
      </Reveal>

      <Reveal as="section" className="border-t border-border py-16 sm:py-20">
        <TransformationsTeaser />
      </Reveal>

      {/* Featured products */}
      <Reveal as="section" className="border-t border-border bg-bg-raised/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-3xl sm:text-4xl tracking-wide">
              From the yard
            </h2>
            <Link
              href="/catalog"
              className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
            >
              View Full Inventory &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} reserveFlow />
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <HowItWorks />
      </Reveal>

      {/* Financing + Final CTA */}
      <Reveal
        as="section"
        id="financing"
        className="border-t border-border bg-accent text-accent-ink"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest">
              Financing
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl tracking-wide max-w-lg">
              Need it now? Get financed today.
            </h2>
            <p className="mt-3 max-w-lg text-sm sm:text-base text-accent-ink/80">
              Flexible financing for qualified buyers on containers, gensets,
              tanks, and trailers.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-3">
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                "Financing pre-qualification"
              )}`}
              className="inline-flex items-center bg-bg text-text font-semibold px-8 py-4 clip-corner hover:bg-bg-raised transition-colors hover:-translate-y-0.5 active:translate-y-0 transition-transform"
            >
              Get Pre-Qualified &rarr;
            </a>
            <Link
              href="/catalog"
              className="inline-flex items-center font-semibold px-2 py-1 text-accent-ink/90 hover:text-accent-ink underline underline-offset-4"
            >
              Browse Inventory
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Partner logos, just above the footer */}
      <Reveal as="section" className="border-t border-border">
        <div className="py-16 sm:py-20">
          <PartnerLogos />
        </div>
      </Reveal>
    </div>
  );
}
