import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";
import transformations from "@/data/transformations.json";

export const metadata: Metadata = {
  title: "Transformations",
  description: `Design inspiration for shipping container conversions — see what's possible with a refurbished container from ${SITE.name}.`,
  alternates: { canonical: "/transformations" },
};

export default function TransformationsPage() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 pb-10 sm:pt-20 sm:pb-12 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            Design Inspiration
          </span>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl tracking-wide leading-[0.95]">
            Transformations
          </h1>
          <p className="mt-5 text-text-muted text-base sm:text-lg max-w-2xl mx-auto">
            A look at what a shipping container can become &mdash; cabins,
            offices, additions, and full container homes. These images show
            the range of what&rsquo;s possible with a conversion, not a
            catalog of finished company jobs. Have a project in mind? We can
            help you source and grade the units to build it.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner hover:bg-accent-hover transition-colors hover:-translate-y-0.5 active:translate-y-0 transition-transform"
          >
            Start Your Project &rarr;
          </Link>
        </div>
      </section>

      <Reveal as="section" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:balance]">
          {transformations.map((t, i) => (
            <div
              key={t.slug}
              className="group relative mb-4 break-inside-avoid clip-corner-sm overflow-hidden border border-border-soft bg-bg-raised transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60"
              style={{ animationDelay: `${(i % 6) * 60}ms` }}
            >
              <Image
                src={t.src}
                alt={t.caption}
                width={t.width}
                height={t.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 to-transparent px-3 pt-8 pb-2.5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-text">
                  {t.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <section className="border-t border-border bg-bg-raised/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl tracking-wide">
              Ready to build something like this?
            </h2>
            <p className="mt-2 text-text-muted max-w-lg">
              Browse graded, in-stock containers ready for your conversion, or
              talk to us about sourcing the right unit for your project.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner hover:bg-accent-hover transition-colors hover:-translate-y-0.5 active:translate-y-0 transition-transform"
            >
              Browse Inventory
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center border border-border px-6 py-3 font-semibold text-text hover:border-accent hover:text-accent transition-colors hover:-translate-y-0.5 active:translate-y-0 transition-transform"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
