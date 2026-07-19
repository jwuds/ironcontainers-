import Link from "next/link";
import type { Group } from "@/lib/catalog";
import SafeImage from "@/components/SafeImage";

export default function CategoryTile({
  group,
  index = 0,
  large = false,
}: {
  group: Group;
  index?: number;
  large?: boolean;
}) {
  return (
    <Link
      href={`/category/${group.slug}`}
      className={`group relative flex flex-col justify-end overflow-hidden border border-border-soft hover:border-accent/60 transition-colors rise-in ${
        large ? "sm:col-span-2 sm:row-span-2 min-h-[320px]" : "min-h-[180px]"
      }`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {group.heroImage ? (
        <SafeImage
          src={group.heroImage}
          alt={group.name}
          fill
          sizes={large ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, 25vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-bg-raised-2" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-1 hazard-stripe opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 p-4 sm:p-5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
          {String(group.count).padStart(3, "0")} units
        </span>
        <h3
          className={`font-display tracking-wide leading-none mt-1 ${
            large ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {group.name}
        </h3>
        {large && (
          <p className="mt-2 max-w-xs text-sm text-text-muted hidden sm:block">
            {group.blurb}
          </p>
        )}
      </div>
    </Link>
  );
}
