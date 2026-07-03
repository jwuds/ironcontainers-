import { SITE } from "@/lib/site";
import type { Product, Group } from "@/lib/catalog";

/** Absolute URL for a path or already-absolute asset. */
export function absoluteUrl(path: string): string {
  if (!path) return SITE.url;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Strip HTML/entities and clamp a description for meta tags. */
export function metaDescription(text: string, max = 160): string {
  const clean = text
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/** Product JSON-LD (schema.org/Product) with Offer pricing + availability. */
export function productJsonLd(product: Product) {
  const price = product.salePrice || product.regularPrice;
  const images = product.images.slice(0, 6).map(absoluteUrl);
  const offers =
    price && Number(price) > 0
      ? {
          "@type": "Offer",
          priceCurrency: "USD",
          price: Number(price).toFixed(2),
          availability: "https://schema.org/InStock",
          url: absoluteUrl(`/product/${product.slug}`),
          seller: { "@type": "Organization", name: SITE.name },
        }
      : {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(`/product/${product.slug}`),
          seller: { "@type": "Organization", name: SITE.name },
        };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: metaDescription(product.shortDescription || product.description, 300),
    image: images.length ? images : undefined,
    sku: product.sku || undefined,
    category: product.rawCategories[0] || undefined,
    brand: { "@type": "Brand", name: SITE.name },
    offers,
  };
}

/** BreadcrumbList JSON-LD. */
export function breadcrumbJsonLd(
  crumbs: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** CollectionPage JSON-LD for a category. */
export function collectionJsonLd(group: Group, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: group.name,
    description: group.blurb,
    url: absoluteUrl(`/category/${group.slug}`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 30).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/product/${p.slug}`),
        name: p.title,
      })),
    },
  };
}

/** Organization + WebSite JSON-LD for the whole site. */
export function organizationJsonLd() {
  const { contact } = SITE;
  const hasAddress = Boolean(contact.address.city || contact.address.street);
  const isRealPhone = !contact.phone.includes("000-0000");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    email: contact.email,
    ...(isRealPhone ? { telephone: contact.phone } : {}),
    ...(hasAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: contact.address.street || undefined,
            addressLocality: contact.address.city || undefined,
            addressRegion: contact.address.region || undefined,
            postalCode: contact.address.postalCode || undefined,
            addressCountry: contact.address.country,
          },
        }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
