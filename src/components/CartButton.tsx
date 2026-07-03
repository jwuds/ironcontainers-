"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export default function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      className="relative text-sm font-medium text-text-muted hover:text-text transition-colors"
    >
      Cart
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute -right-2.5 -top-2.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-accent-ink text-[10px] font-mono font-semibold"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
