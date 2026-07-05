"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section";
} & Omit<HTMLMotionProps<"div">, "children">) {
  const MotionTag = as === "section" ? motion.section : motion.div;
  return (
    <MotionTag
      initial={{ opacity: 1, y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0, margin: "200px 0px 200px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
