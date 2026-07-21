import Image from "next/image";
import Link from "next/link";
import transformations from "@/data/transformations.json";

export default function TransformationsTeaser() {
  const featured = transformations.filter((t) => t.featured);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            Design Inspiration
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl tracking-wide">
            See what&rsquo;s possible
          </h2>
        </div>
        <Link
          href="/transformations"
          className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
        >
          View Transformations &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {featured.map((t) => (
          <Link
            key={t.slug}
            href="/transformations"
            className="group relative aspect-square clip-corner-sm overflow-hidden border border-border-soft bg-bg-raised transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60"
          >
            <Image
              src={t.src}
              alt={t.caption}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 to-transparent px-3 pt-8 pb-2.5">
              <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-text">
                {t.caption}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
