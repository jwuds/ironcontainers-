"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Group } from "@/lib/catalog";

export default function DesktopNav({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav className="hidden lg:flex items-center gap-1">
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
        >
          Shop
          <svg
            viewBox="0 0 24 24"
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path
              d="M6 9l6 6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-1 w-64 border border-border bg-bg shadow-xl py-2 z-50"
            >
              {groups.map((g) => (
                <Link
                  key={g.slug}
                  href={`/category/${g.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between min-h-[40px] px-4 text-sm text-text-muted hover:text-accent hover:bg-bg-raised transition-colors"
                >
                  {g.name}
                  <span className="font-mono text-[10px] text-text-faint">{g.count}</span>
                </Link>
              ))}
              <Link
                href="/catalog"
                onClick={() => setOpen(false)}
                className="flex items-center min-h-[40px] px-4 text-sm text-accent border-t border-border-soft mt-1 pt-2"
              >
                Full Catalog &rarr;
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Link
        href="/#financing"
        className="px-3 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
      >
        Financing
      </Link>
      <Link
        href="/transformations"
        className="px-3 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
      >
        Transformations
      </Link>
      <Link
        href="/blog"
        className="px-3 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
      >
        Blog
      </Link>
      <Link
        href="/about"
        className="px-3 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
      >
        About
      </Link>
      <Link
        href="/contact"
        className="px-3 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
      >
        Contact
      </Link>
    </nav>
  );
}
