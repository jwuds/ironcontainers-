import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getPrimaryGroupForPost } from "@/lib/blog";
import { getGroupBySlug } from "@/lib/catalog";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Container One Depot`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const primaryGroupSlug = getPrimaryGroupForPost(slug);
  const primaryGroup = primaryGroupSlug ? getGroupBySlug(primaryGroupSlug) : undefined;

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    ...(post.dateModified ? { dateModified: post.dateModified } : {}),
    url: `${SITE.url}/blog/${slug}`,
    image: `${SITE.url}/opengraph-image`,
    // Not a named individual — this catalog has no verified author
    // credentials to attach to a real person, so we attribute to the
    // team rather than fabricate a byline. See containeronedepot.com-audit
    // findings/content.md.
    author: { "@type": "Organization", name: `${SITE.name} Equipment Team` },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/logo-mark-256.png` },
    },
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-20">
      <JsonLd data={blogPostingJsonLd} />
      <Link
        href="/blog"
        className="font-mono text-xs uppercase tracking-widest text-text-faint hover:text-accent transition-colors"
      >
        &larr; All articles
      </Link>
      <div className="mt-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-text-faint">
        <span className="text-accent">{post.tag}</span>
        <span>
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl tracking-wide leading-[0.95]">
        {post.title}
      </h1>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-text-faint">
        By {SITE.name} Equipment Team
        {post.dateModified && post.dateModified !== post.date && (
          <>
            {" "}
            &middot; Updated{" "}
            {new Date(post.dateModified).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </>
        )}
      </p>
      <div className="mt-8 space-y-8 text-text-muted leading-relaxed">
        {post.body.map((section, i) => (
          <section key={i}>
            <h2 className="font-display text-xl sm:text-2xl tracking-wide text-text mb-3">
              {section.heading}
            </h2>
            <div className="space-y-4">
              {section.paragraphs.map((paragraph, j) => (
                <p key={j}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 border-t border-border pt-8 flex flex-wrap gap-3">
        {primaryGroup && (
          <Link
            href={`/category/${primaryGroup.slug}`}
            className="inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
          >
            Shop {primaryGroup.name} &rarr;
          </Link>
        )}
        <Link
          href="/catalog"
          className={
            primaryGroup
              ? "inline-flex items-center border border-border text-text-muted font-semibold px-6 py-3 clip-corner-sm hover:border-accent hover:text-accent transition-colors"
              : "inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
          }
        >
          Browse Full Catalog &rarr;
        </Link>
      </div>
    </div>
  );
}
