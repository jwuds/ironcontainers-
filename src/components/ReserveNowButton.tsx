"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export default function ReserveNowButton({
  slug,
  title,
  image,
  price,
  className,
}: {
  slug: string;
  title: string;
  image: string | null;
  price: number | null;
  className?: string;
}) {
  const { addItem } = useCart();
  const router = useRouter();

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({ slug, title, image, price });
        router.push("/cart/reserve");
      }}
      className={className}
    >
      Reserve Now
    </motion.button>
  );
}
