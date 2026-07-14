import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE.name} sales: ${SITE.phoneDisplay}, ${SITE.hours}. Ask about a unit, financing, or delivery.`,
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
