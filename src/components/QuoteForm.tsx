"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  productSlug?: string;
  productTitle?: string;
  category?: string;
  source?: string;
};

const fieldClass =
  "mt-1 w-full border border-border-soft bg-bg-raised px-3 py-2 text-sm text-text focus:border-accent outline-none transition-colors";
const labelClass =
  "font-mono text-xs uppercase tracking-widest text-text-faint";

export default function QuoteForm({ productSlug, productTitle, category, source }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    quantity: "1",
    message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity) || 1,
          productSlug,
          productTitle,
          category,
          source: source ?? (productSlug ? "product_page" : "quote_page"),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-border-soft bg-bg-raised p-6 sm:p-8">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          Request received
        </span>
        <h3 className="mt-2 font-display text-2xl sm:text-3xl tracking-wide">
          We&rsquo;re on it.
        </h3>
        <p className="mt-3 text-sm text-text-muted">
          Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""} — your quote request is
          in. A specialist will reach out
          {productTitle ? ` about the ${productTitle}` : ""} within one business day.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
        >
          Keep browsing &rarr;
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-border-soft bg-bg-raised p-6 sm:p-8 space-y-4"
    >
      {productTitle && (
        <div className="border-l-2 border-accent pl-3 py-1">
          <div className="font-mono text-[10px] uppercase tracking-widest text-text-faint">
            Requesting a quote for
          </div>
          <div className="text-sm text-text font-semibold">{productTitle}</div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="qf-name" className={labelClass}>
            Full Name
          </label>
          <input
            id="qf-name"
            required
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="qf-email" className={labelClass}>
            Email
          </label>
          <input
            id="qf-email"
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="qf-phone" className={labelClass}>
            Phone
          </label>
          <input
            id="qf-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="qf-zip" className={labelClass}>
            Delivery ZIP
          </label>
          <input
            id="qf-zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            value={form.zip}
            onChange={(e) => update("zip", e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="qf-qty" className={labelClass}>
            Quantity
          </label>
          <input
            id="qf-qty"
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="qf-message" className={labelClass}>
          What do you need? {productTitle ? "" : "(unit type, use case, timeline)"}
        </label>
        <textarea
          id="qf-message"
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder={
            productTitle
              ? "Delivery timeline, condition, modifications, or any questions…"
              : "Tell us the unit type, quantity, delivery location, and timeline…"
          }
          className={`${fieldClass} resize-y`}
        />
      </div>

      {status === "error" && error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Request a Quote →"}
      </motion.button>

      <p className="text-xs text-text-faint">
        No obligation. We typically respond within one business day.
      </p>
    </form>
  );
}
