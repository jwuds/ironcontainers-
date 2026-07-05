import Link from "next/link";
import { getAllProducts, getGroups } from "@/lib/catalog";
import { SITE } from "@/lib/site";

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

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
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

      <div className="mt-12 border-t border-border pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-text-faint mb-3">
          Get in touch
        </p>
        <ul className="space-y-2 text-sm text-text-muted">
          <li>{SITE.hours}</li>
          <li>
            <a href={`tel:${SITE.phone}`} className="hover:text-accent transition-colors">
              {SITE.phoneDisplay}
            </a>
          </li>
          <li>
            <a
              href={`mailto:sales@${SITE.domain}`}
              className="hover:text-accent transition-colors"
            >
              sales@{SITE.domain}
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
