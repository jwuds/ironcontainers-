"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const href = `mailto:sales@${SITE.domain}?subject=${encodeURIComponent(
      `Contact form: ${form.name || "Website visitor"}`
    )}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )}`;
    window.location.href = href;
    setSubmitted(true);
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
        <li>{SITE.hours}</li>
        <li>
          <a href={`tel:${SITE.phone}`} className="hover:text-accent transition-colors">
            {SITE.phoneDisplay}
          </a>
        </li>
        <li>
          <a
            href={`mailto:sales@${SITE.domain}`}
            className="hover:text-accent transition-colors"
          >
            sales@{SITE.domain}
          </a>
        </li>
      </ul>

      {submitted ? (
        <p className="mt-10 text-text-muted">
          We&rsquo;ve opened an email to {SITE.name} sales with your message.
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
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
          >
            Send Message &rarr;
          </motion.button>
        </form>
      )}
    </div>
  );
}
