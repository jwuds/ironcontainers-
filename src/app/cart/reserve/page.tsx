"use client";

import Link from "next/link";
import { useCart, depositFor } from "@/lib/cart-context";
import { formatPrice } from "@/lib/catalog";

export default function ReservePage() {
  const { items } = useCart();
  const totalDeposit = items.reduce((sum, i) => sum + depositFor(i.price), 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-4xl tracking-wide">No units to reserve</h1>
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

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-accent">
        Step 2 of 3
      </span>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl tracking-wide leading-[0.95]">
        Reserve These Units
      </h1>
      <p className="mt-4 text-text-muted">
        A refundable deposit reserves your unit{items.length > 1 ? "s" : ""} and locks
        today&rsquo;s quoted price for 48&ndash;72 hours while delivery and paperwork
        are finalized. Deposits are fully refundable if the order doesn&rsquo;t proceed.
      </p>

      <div className="mt-6 divide-y divide-border-soft border-y border-border-soft font-mono text-sm">
        {items.map((item) => (
          <div key={item.slug} className="flex justify-between py-3">
            <span className="text-text-muted truncate pr-4">{item.title}</span>
            <span className="text-accent shrink-0">
              {formatPrice(String(depositFor(item.price)))}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between font-mono text-base font-semibold">
        <span>Total deposit due today</span>
        <span className="text-accent">{formatPrice(String(totalDeposit))}</span>
      </div>

      <ul className="mt-6 space-y-2 text-xs text-text-faint">
        <li>&middot; Deposit range: $100&ndash;$500 per unit, based on unit price.</li>
        <li>&middot; Balance is due before delivery, not at reservation.</li>
        <li>&middot; Price lock expires 72 hours after reservation is confirmed.</li>
      </ul>

      <Link
        href="/cart/checkout"
        className="mt-8 inline-flex w-full items-center justify-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
      >
        Continue to Checkout &rarr;
      </Link>
      <Link
        href="/cart"
        className="mt-3 inline-flex w-full items-center justify-center font-mono text-xs uppercase tracking-widest text-text-faint hover:text-accent transition-colors"
      >
        &larr; Back to Cart
      </Link>
    </div>
  );
}
