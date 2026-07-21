"use client";

import Link from "next/link";
import { useCart, depositFor } from "@/lib/cart-context";
import { formatPrice } from "@/lib/catalog";

function priceLabel(price: number | null) {
  return formatPrice(price != null ? String(price) : null) ?? "Price on request";
}

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
        A refundable deposit reserves your unit{items.length > 1 ? "s" : ""}{" "}
        and locks today&rsquo;s quoted price for 48&ndash;72 hours while delivery and
        paperwork are finalized. Deposits are fully refundable if the order
        doesn&rsquo;t proceed.
      </p>

      <div className="mt-6 divide-y divide-border-soft border-y border-border-soft font-mono text-sm">
        {items.map((item) => (
          <div key={item.slug} className="flex items-baseline justify-between py-3 gap-4">
            <span className="text-text-muted truncate">{item.title}</span>
            <span className="shrink-0 text-right">
              <span className="block text-text-muted">{priceLabel(item.price)}</span>
              <span className="block text-xs text-accent">
                {formatPrice(String(depositFor(item.price)))} deposit
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between font-mono text-base font-semibold">
        <span>Total deposit due today</span>
        <span className="text-accent">{formatPrice(String(totalDeposit))}</span>
      </div>

      <ul className="mt-6 space-y-2 text-xs text-text-faint">
        <li>&middot; Deposit: up to $1,000 per unit (or the item&rsquo;s full price if lower), required to reserve.</li>
        <li>&middot; Balance is due before delivery, not at reservation.</li>
        <li>&middot; Price lock expires 72 hours after reservation is confirmed.</li>
        <li>&middot; Returns accepted within 7 days of delivery; return shipping and any related costs are the customer&rsquo;s responsibility.</li>
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
