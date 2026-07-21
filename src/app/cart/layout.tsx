import type { Metadata } from "next";

// /cart, /cart/checkout, and /cart/reserve are all disallowed in
// robots.txt (crawl-blocked), but that alone doesn't stop Google from
// indexing the bare URL if something external links to it ("indexed,
// though blocked by robots.txt"). noindex closes that gap explicitly.
// cart/page.tsx is a Client Component and can't export metadata itself,
// so this lives in the shared layout instead.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
