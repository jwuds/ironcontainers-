import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { getGroups } from "@/lib/catalog";
import { SITE } from "@/lib/site";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${SITE.name} Equipment | Containers, Refrigeration & Industrial Gear`,
  description:
    "392 units in stock: shipping containers, refrigerated units, gensets, tanks, and trailers. Request a quote or buy online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const groups = getGroups();

  return (
    <html
      lang="en"
      className={`${bebas.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <div className="h-1.5 hazard-stripe" />
        <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex h-16 items-center justify-between gap-6">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <span className="grid h-8 w-8 place-items-center bg-accent text-accent-ink font-display text-xl clip-corner-sm">
                  {SITE.initial}
                </span>
                <span className="font-display text-2xl tracking-wide">
                  {SITE.name.toUpperCase()}<span className="text-accent">.</span>
                </span>
              </Link>
              <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
                {groups.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/category/${g.slug}`}
                    className="px-3 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors whitespace-nowrap"
                  >
                    {g.name}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/search"
                  className="text-sm font-medium text-text-muted hover:text-text transition-colors"
                >
                  Search
                </Link>
                <Link
                  href="/#quote"
                  className="hidden sm:inline-flex items-center bg-accent text-accent-ink font-semibold text-sm px-4 py-2 clip-corner-sm hover:bg-accent-hover transition-colors"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border bg-bg-raised">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="col-span-2 sm:col-span-1">
                <span className="font-display text-2xl tracking-wide">
                  {SITE.name.toUpperCase()}<span className="text-accent">.</span>
                </span>
                <p className="mt-3 text-sm text-text-muted max-w-xs">
                  {SITE.tagline}. Nationwide delivery.
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-text-faint mb-3">
                  Catalog
                </p>
                <ul className="space-y-2">
                  {groups.slice(0, 4).map((g) => (
                    <li key={g.slug}>
                      <Link
                        href={`/category/${g.slug}`}
                        className="text-sm text-text-muted hover:text-accent transition-colors"
                      >
                        {g.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-text-faint mb-3">
                  More
                </p>
                <ul className="space-y-2">
                  {groups.slice(4).map((g) => (
                    <li key={g.slug}>
                      <Link
                        href={`/category/${g.slug}`}
                        className="text-sm text-text-muted hover:text-accent transition-colors"
                      >
                        {g.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-text-faint mb-3">
                  Contact
                </p>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li>Mon&ndash;Fri, 8am&ndash;6pm</li>
                  <li>
                    <Link
                      href="/#quote"
                      className="hover:text-accent transition-colors"
                    >
                      Request a Quote &rarr;
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-border-soft flex flex-col sm:flex-row gap-2 justify-between text-xs text-text-faint font-mono">
              <span>&copy; {new Date().getFullYear()} {SITE.name} Equipment</span>
              <span>{groups.reduce((n, g) => n + g.count, 0)}+ units listed across {groups.length} categories</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
