import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { getAllProducts, getGroups } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { CartProvider } from "@/lib/cart-context";
import CartButton from "@/components/CartButton";
import AnnouncementBar from "@/components/AnnouncementBar";
import MobileNav from "@/components/MobileNav";
import DesktopNav from "@/components/DesktopNav";
import NewsletterForm from "@/components/NewsletterForm";

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
  title: `${SITE.name} | Containers, Refrigeration & Industrial Gear`,
  description: `${getAllProducts().length} units in stock: shipping containers, refrigerated units, gensets, tanks, and trailers. Request a quote or buy online.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const groups = getGroups();
  const totalUnits = getAllProducts().length;

  return (
    <html
      lang="en"
      className={`${bebas.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <CartProvider>
        <AnnouncementBar />
        <div className="h-1.5 hazard-stripe" />
        <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex h-16 items-center gap-6">
              <Link href="/" className="flex items-center gap-2 min-w-0 shrink">
                <Image
                  src="/logo-mark-256.png"
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 shrink-0 object-contain"
                  priority
                />
                <span className="font-display text-lg sm:text-2xl tracking-wide truncate">
                  {SITE.name.toUpperCase()}<span className="text-accent">.</span>
                </span>
              </Link>
              <DesktopNav groups={groups} />
              <div className="ml-auto flex items-center gap-1 shrink-0">
                <Link
                  href="/search"
                  aria-label="Search"
                  className="grid h-11 w-11 place-items-center text-text-muted hover:text-text transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                      d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm11 16-5.6-5.6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
                <a
                  href={`tel:${SITE.phone}`}
                  aria-label={`Call ${SITE.phoneDisplay}`}
                  className="grid h-11 w-11 place-items-center text-text-muted hover:text-accent transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                      d="M4 4.5c0-.6.4-1 1-1h2.4c.5 0 .9.3 1 .8l.8 3a1 1 0 0 1-.3 1L7.4 9.8a12 12 0 0 0 5.8 5.8l1.5-1.5a1 1 0 0 1 1-.3l3 .8c.5.1.8.5.8 1V18c0 .6-.4 1-1 1h-1C9.4 19 4 13.6 4 6.5v-1Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <CartButton />
                <MobileNav groups={groups} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border bg-bg-raised">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2">
                  <Image
                    src="/logo-mark-256.png"
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 shrink-0 object-contain"
                  />
                  <span className="font-display text-2xl tracking-wide">
                    {SITE.name.toUpperCase()}<span className="text-accent">.</span>
                  </span>
                </div>
                <p className="mt-3 text-sm text-text-muted max-w-xs">
                  {SITE.tagline}. Nationwide delivery.
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-text-faint mb-3">
                  Products
                </p>
                <ul className="space-y-2">
                  {groups.map((g) => (
                    <li key={g.slug}>
                      <Link
                        href={`/category/${g.slug}`}
                        className="text-sm text-text-muted hover:text-accent transition-colors"
                      >
                        {g.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/catalog"
                      className="text-sm text-text-muted hover:text-accent transition-colors"
                    >
                      Full Catalog
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-text-faint mb-3">
                  Company
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/blog"
                      className="text-sm text-text-muted hover:text-accent transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-sm text-text-muted hover:text-accent transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm text-text-muted hover:text-accent transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
                <p className="font-mono text-xs uppercase tracking-widest text-text-faint mt-6 mb-3">
                  Support
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/#financing"
                      className="text-sm text-text-muted hover:text-accent transition-colors"
                    >
                      Financing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#how-it-works"
                      className="text-sm text-text-muted hover:text-accent transition-colors"
                    >
                      Shipping Info
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-text-faint mb-3">
                  Stay in the loop
                </p>
                <ul className="space-y-2 text-sm text-text-muted mb-4">
                  <li>{SITE.hours}</li>
                  <li>
                    <a href={`tel:${SITE.phone}`} className="hover:text-accent transition-colors">
                      {SITE.phoneDisplay}
                    </a>
                  </li>
                </ul>
                <NewsletterForm />
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-border-soft flex flex-col sm:flex-row gap-2 justify-between text-xs text-text-faint font-mono">
              <span>&copy; {new Date().getFullYear()} {SITE.name}</span>
              <span>{totalUnits} units listed across {groups.length} categories</span>
            </div>
          </div>
        </footer>
        </CartProvider>
      </body>
    </html>
  );
}
