"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export default function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative grid h-11 w-11 place-items-center text-text-muted hover:text-text transition-colors"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M4 6h2l1.6 9.2A2 2 0 0 0 9.6 17h7a2 2 0 0 0 2-1.7L20 8H6.4M8 6l-.7-2.3A1 1 0 0 0 6.3 3H4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.4" fill="currentColor" />
        <circle cx="17" cy="20" r="1.4" fill="currentColor" />
      </svg>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-accent-ink text-[10px] font-mono font-semibold"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
