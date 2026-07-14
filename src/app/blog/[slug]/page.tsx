import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
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

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `${SITE.url}/blog/${slug}`,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
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
      <div className="mt-8 space-y-5 text-text-muted leading-relaxed">
        {post.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <Link
          href="/catalog"
          className="inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
        >
          Browse Inventory &rarr;
        </Link>
      </div>
    </div>
  );
}
