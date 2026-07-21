"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className="text-sm text-text-muted">Thanks — you&rsquo;re on the list.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
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
          disabled={status === "sending"}
          className="shrink-0 bg-accent text-accent-ink font-semibold text-sm px-3 py-2 clip-corner-sm hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {status === "sending" ? "Signing up..." : "Sign up"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-400">
          Something went wrong &mdash; please try again or email{" "}
          <a href={`mailto:${SITE.email}`} className="underline">
            {SITE.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
