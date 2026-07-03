"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart, depositFor } from "@/lib/cart-context";
import { formatPrice } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", zip: "" });
  const totalDeposit = items.reduce((sum, i) => sum + depositFor(i.price), 0);

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-4xl tracking-wide">Reservation Requested</h1>
        <p className="mt-4 text-text-muted">
          We&rsquo;ve opened an email to {SITE.name} sales with your reservation details.
          A team member will follow up to confirm your units and collect the{" "}
          {formatPrice(String(totalDeposit))} deposit &mdash; your quoted price is locked
          for the next 72 hours.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-4xl tracking-wide">Nothing to check out</h1>
        <p className="mt-3 text-text-muted">Add a unit to your cart first.</p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
        >
          Browse Catalog &rarr;
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      `Reservation request from ${form.name || "(no name given)"}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "n/a"}`,
      `Delivery ZIP: ${form.zip || "n/a"}`,
      "",
      "Units:",
      ...items.map((i) => `- ${i.title} (deposit ${formatPrice(String(depositFor(i.price)))})`),
      "",
      `Total deposit due: ${formatPrice(String(totalDeposit))}`,
    ];
    const href = `mailto:sales@${SITE.domain}?subject=${encodeURIComponent(
      `Reservation request (${items.length} unit${items.length === 1 ? "" : "s"})`
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = href;
    setSubmitted(true);
    clear();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-accent">
        Step 3 of 3
      </span>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl tracking-wide leading-[0.95]">
        Checkout
      </h1>
      <p className="mt-4 text-text-muted">
        Give us a few details and we&rsquo;ll reach out to confirm your reservation and
        collect the {formatPrice(String(totalDeposit))} deposit. Online deposit payment
        is coming soon &mdash; for now this routes straight to our sales team.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-text-faint">
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="mt-1 w-full border border-border-soft bg-bg-raised px-3 py-2 text-sm focus:border-accent outline-none transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-text-faint">
              Delivery ZIP
            </label>
            <input
              type="text"
              value={form.zip}
              onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
              className="mt-1 w-full border border-border-soft bg-bg-raised px-3 py-2 text-sm focus:border-accent outline-none transition-colors"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-between font-mono text-sm">
          <span className="text-text-muted">Total deposit due</span>
          <span className="text-accent font-semibold">{formatPrice(String(totalDeposit))}</span>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
        >
          Submit Reservation Request &rarr;
        </motion.button>
      </form>
      <Link
        href="/cart/reserve"
        className="mt-3 inline-flex w-full items-center justify-center font-mono text-xs uppercase tracking-widest text-text-faint hover:text-accent transition-colors"
      >
        &larr; Back
      </Link>
    </div>
  );
}
