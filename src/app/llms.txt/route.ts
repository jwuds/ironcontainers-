import { getGroups, getAllProducts } from "@/lib/catalog";
import { getAllPosts } from "@/lib/blog";
import { SITE } from "@/lib/site";

// Machine-readable index for LLM crawlers: what this site is, its main
// sections, and where to find policy answers — not an exhaustive product
// dump (that's what /sitemap.xml is for).
export function GET() {
  const groups = getGroups();
  const posts = getAllPosts();
  const productCount = getAllProducts().length;

  const lines = [
    `# ${SITE.name}`,
    `> ${SITE.tagline}. ${productCount} units in stock across ${groups.length} categories: shipping containers, refrigerated containers, offshore/DNV-certified units, refrigeration units and gensets, generators, tanks, and trailers/chassis. Sells direct — new and used units, purchase only (no rentals).`,
    "",
    "## How buying works",
    `- A refundable deposit locks the listed price for 48–72 hours while the unit and delivery are confirmed: ${SITE.url}/blog/how-our-reservation-process-works`,
    `- Contact: ${SITE.email} / ${SITE.phoneDisplay} (${SITE.hours})`,
    "",
    "## Categories",
    ...groups.map(
      (g) => `- [${g.name}](${SITE.url}/category/${g.slug}): ${g.blurb} (${g.count} units)`
    ),
    "",
    "## Guides",
    ...posts.map((p) => `- [${p.title}](${SITE.url}/blog/${p.slug}): ${p.excerpt}`),
    "",
    "## Full catalog",
    `- Complete, current product list: ${SITE.url}/sitemap.xml`,
  ];

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
