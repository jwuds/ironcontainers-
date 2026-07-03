"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export default function ReserveButton({
  slug,
  title,
  image,
  price,
}: {
  slug: string;
  title: string;
  image: string | null;
  price: number | null;
}) {
  const { addItem } = useCart();
  const router = useRouter();

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        addItem({ slug, title, image, price });
        router.push("/cart/reserve");
      }}
      className="mt-2 inline-flex w-full items-center justify-center border border-accent text-accent font-semibold px-6 py-3 clip-corner-sm hover:bg-accent hover:text-accent-ink transition-colors"
    >
      Reserve This Unit &rarr;
    </motion.button>
  );
}
