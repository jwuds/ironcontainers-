import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, getGroups } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE.name}: how we grade and list shipping containers, refrigerated units, gensets, tanks, and trailers, with nationwide delivery.`,
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    name: "Integrity",
    detail:
      "Every listing states its condition grade plainly — Cargo Worthy, Wind & Water Tight, Economy, or New/One-Trip — so what you see is what you're quoted for.",
  },
  {
    name: "Quality",
    detail:
      "Specs, dimensions, and certifications are drawn from real manufacturer and inspection data, not marketing copy.",
  },
  {
    name: "Sustainability",
    detail:
      "A shipping container taken out of ocean freight rotation still has decades of useful life left in it. Selling used units into storage, construction, and conversion projects keeps that steel in service instead of the scrap yard.",
  },
  {
    name: "Reliability",
    detail: "You get the unit and grade you ordered, delivered on the schedule we quote.",
  },
  {
    name: "Customer First",
    detail:
      "A refundable deposit locks your price for 48–72 hours while we confirm the unit and arrange delivery — no pressure to commit before you're ready.",
  },
];

const INDUSTRIES = [
  "Construction",
  "Agriculture",
  "Energy",
  "Manufacturing",
  "Government",
  "Education",
  "Retail",
  "Residential",
  "Disaster Relief",
  "Self Storage",
  "Industrial Facilities",
];

export default function AboutPage() {
  const groups = getGroups();
  const totalUnits = getAllProducts().length;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
      <span className="font-mono text-xs uppercase tracking-widest text-accent">
        About
      </span>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl tracking-wide leading-[0.95]">
        {SITE.name}
      </h1>
      <p className="mt-5 text-text-muted text-base sm:text-lg max-w-xl">
        {SITE.tagline}. We list {totalUnits} units across {groups.length}{" "}
        categories &mdash; shipping containers, refrigerated units, gensets,
        tanks, and trailers &mdash; with nationwide delivery.
      </p>
      <p className="mt-4 text-text-muted max-w-xl">
        Every listing carries a clear condition grade and real specs up
        front, so you can compare units and buy with confidence instead of
        chasing down details after the fact. A refundable deposit locks
        your price while we confirm the unit and arrange delivery to your
        site.
      </p>

      <div className="mt-14">
        <h2 className="font-display text-2xl tracking-wide mb-2">Mission</h2>
        <p className="text-text-muted">
          To provide dependable, fairly priced shipping containers and
          industrial equipment that deliver long-term value, backed by
          honest grading and straightforward service.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl tracking-wide mb-2">Vision</h2>
        <p className="text-text-muted">
          To be a trusted supplier of shipping containers and industrial
          equipment, known for transparent pricing, clear condition
          grading, and dependable nationwide delivery.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl tracking-wide mb-4">
          What we stand for
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.name} className="border border-border-soft bg-bg-raised p-4">
              <p className="font-semibold text-sm text-accent">{v.name}</p>
              <p className="mt-1 text-sm text-text-muted leading-relaxed">{v.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl tracking-wide mb-3">
          Industries we serve
        </h2>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((i) => (
            <span
              key={i}
              className="font-mono text-[11px] uppercase tracking-wider text-text-muted border border-border-soft px-2.5 py-1"
            >
              {i}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="font-display text-2xl tracking-wide mb-4">Browse inventory</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {groups.map((g) => (
            <Link
              key={g.slug}
              href={`/category/${g.slug}`}
              className="border border-border-soft bg-bg-raised px-4 py-3 hover:border-accent/60 transition-colors"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-faint">
                {String(g.count).padStart(3, "0")} units
              </span>
              <p className="mt-0.5 font-semibold text-sm">{g.name}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-text-faint mb-3">
          Get in touch
        </p>
        <ul className="space-y-2 text-sm text-text-muted">
          <li>
            {SITE.address.street}, {SITE.address.city}, {SITE.address.state}{" "}
            {SITE.address.zip}
          </li>
          <li>{SITE.hours}</li>
          <li>
            <a href={`tel:${SITE.phone}`} className="hover:text-accent transition-colors">
              {SITE.phoneDisplay}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${SITE.email}`}
              className="hover:text-accent transition-colors"
            >
              {SITE.email}
            </a>
          </li>
        </ul>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
        >
          Contact Us &rarr;
        </Link>
      </div>
    </div>
  );
}
