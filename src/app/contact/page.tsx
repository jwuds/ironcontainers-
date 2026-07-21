"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-20">
      <span className="font-mono text-xs uppercase tracking-widest text-accent">
        Contact
      </span>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl tracking-wide leading-[0.95]">
        Get in touch
      </h1>
      <ul className="mt-5 space-y-2 text-sm text-text-muted">
        <li>
          {SITE.address.street}, {SITE.address.city}, {SITE.address.state}{" "}
          {SITE.address.zip}
        </li>
        <li>{SITE.hours}</li>
        <li>
          <a href={`tel:${SITE.phone}`} className="hover:text-accent transition-colors">
            {SITE.phoneDisplay}
          </a>
        </li>
        <li>
          <a
            href={`mailto:${SITE.email}`}
            className="hover:text-accent transition-colors"
          >
            {SITE.email}
          </a>
        </li>
      </ul>

      <ul className="mt-8 grid gap-2 sm:grid-cols-2 text-sm text-text-muted">
        <li>&middot; Clear condition grading on every listing</li>
        <li>&middot; Nationwide delivery, coordinated to your site</li>
        <li>&middot; Transparent, quote-locked pricing</li>
        <li>&middot; Commercial and residential orders</li>
        <li>&middot; Support before and after your purchase</li>
        <li>&middot; Refundable deposit, no pressure to commit</li>
      </ul>

      {status === "sent" ? (
        <p className="mt-10 text-text-muted">
          Sent &mdash; a message with your details has gone to {SITE.name}. We&rsquo;ll
          get back to you shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-text-faint">
              Full Name
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full border border-border-soft bg-bg-raised px-3 py-2 text-sm focus:border-accent outline-none transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-text-faint">
              Email
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1 w-full border border-border-soft bg-bg-raised px-3 py-2 text-sm focus:border-accent outline-none transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-text-faint">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="mt-1 w-full border border-border-soft bg-bg-raised px-3 py-2 text-sm focus:border-accent outline-none transition-colors"
            />
          </div>
          {status === "error" && (
            <p className="text-sm text-red-400">
              Something went wrong sending your message &mdash; please try again or
              call {SITE.phoneDisplay}.
            </p>
          )}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={status === "sending"}
            className="mt-2 inline-flex w-full items-center justify-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Send Message →"}
          </motion.button>
        </form>
      )}
    </div>
  );
}
