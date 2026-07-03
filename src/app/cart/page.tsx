"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, depositFor } from "@/lib/cart-context";
import { formatPrice } from "@/lib/catalog";

export default function CartPage() {
  const { items, removeItem } = useCart();
  const subtotal = items.reduce((sum, i) => sum + (i.price ?? 0), 0);
  const totalDeposit = items.reduce((sum, i) => sum + depositFor(i.price), 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-4xl tracking-wide">Your cart is empty</h1>
        <p className="mt-3 text-text-muted">
          Browse the catalog and add a unit to start a reservation.
        </p>
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
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="font-display text-4xl sm:text-5xl tracking-wide leading-[0.95]">
        Your Cart
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        {items.length} unit{items.length === 1 ? "" : "s"} selected
      </p>

      <div className="mt-8 divide-y divide-border-soft border-y border-border-soft">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4 py-4"
            >
              <div className="relative h-16 w-20 shrink-0 overflow-hidden bg-bg-raised-2">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.slug}`}
                  className="text-sm font-medium hover:text-accent transition-colors line-clamp-2"
                >
                  {item.title}
                </Link>
                <p className="mt-1 font-mono text-xs text-text-faint">
                  {formatPrice(item.price != null ? String(item.price) : null) ?? "Price on request"}
                  {" · "}
                  {formatPrice(String(depositFor(item.price)))} deposit
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.slug)}
                className="font-mono text-xs uppercase tracking-widest text-text-faint hover:text-accent transition-colors shrink-0"
              >
                Remove
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 p-4 border border-border-soft bg-bg-raised space-y-2 font-mono text-sm">
        <div className="flex justify-between text-text-muted">
          <span>Estimated subtotal</span>
          <span>{formatPrice(String(subtotal)) ?? "—"}</span>
        </div>
        <div className="flex justify-between text-accent font-semibold text-base">
          <span>Total refundable deposit due</span>
          <span>{formatPrice(String(totalDeposit))}</span>
        </div>
      </div>

      <Link
        href="/cart/reserve"
        className="mt-6 inline-flex w-full items-center justify-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
      >
        Continue to Reservation &rarr;
      </Link>
    </div>
  );
}
