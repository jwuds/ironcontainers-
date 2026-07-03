"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({
  slug,
  title,
  image,
  price,
  className,
  label = "Add to Cart",
}: {
  slug: string;
  title: string;
  image: string | null;
  price: number | null;
  className?: string;
  label?: string;
}) {
  const { items, addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.some((i) => i.slug === slug);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({ slug, title, image, price });
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1400);
      }}
      className={className}
      disabled={inCart}
    >
      {inCart ? "In Cart" : justAdded ? "Added ✓" : label}
    </motion.button>
  );
}
