import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | Container One Depot",
  description: "Buying guides, financing info, and how-tos for containers, refrigeration units, and industrial equipment.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20">
      <span className="font-mono text-xs uppercase tracking-widest text-accent">
        Blog
      </span>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl tracking-wide leading-[0.95]">
        Guides &amp; Updates
      </h1>
      <p className="mt-4 text-text-muted max-w-xl">
        Buying guides, financing basics, and how our process works.
      </p>

      <div className="mt-12 divide-y divide-border-soft border-t border-border-soft">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block py-6 hover:bg-bg-raised/40 transition-colors"
          >
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-text-faint">
              <span className="text-accent">{post.tag}</span>
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl tracking-wide group-hover:text-accent transition-colors">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-text-muted max-w-2xl">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
