"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      "Newsletter signup"
    )}&body=${encodeURIComponent(`Please add this email to the list: ${email}`)}`;
    window.location.href = href;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-w-0 flex-1 border border-border-soft bg-bg px-3 py-2 text-sm focus:border-accent outline-none transition-colors"
      />
      <button
        type="submit"
        className="shrink-0 bg-accent text-accent-ink font-semibold text-sm px-3 py-2 clip-corner-sm hover:bg-accent-hover transition-colors"
      >
        Sign up
      </button>
    </form>
  );
}
