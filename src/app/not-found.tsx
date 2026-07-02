import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
        404
      </p>
      <h1 className="font-display text-6xl tracking-wide mb-4">
        Unit not found
      </h1>
      <p className="text-text-muted mb-8">
        That page doesn&rsquo;t exist, or the listing has been removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
      >
        Back to homepage
      </Link>
    </div>
  );
}
