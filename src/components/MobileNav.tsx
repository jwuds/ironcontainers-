"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Group } from "@/lib/catalog";

export default function MobileNav({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Portal target (document.body) doesn't exist during SSR; this only
    // flips after hydration so the portal never renders on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="grid h-11 w-11 place-items-center text-text-muted hover:text-text transition-colors lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M4 6h16M4 12h16M4 18h16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-xs bg-bg border-l border-border overflow-y-auto"
              aria-label="Main menu"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                <span className="font-mono text-xs uppercase tracking-widest text-text-faint">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center text-text-muted hover:text-text transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <ul className="py-2">
                <li>
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center min-h-[44px] px-4 text-sm font-medium hover:text-accent hover:bg-bg-raised transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShopOpen((v) => !v)}
                    aria-expanded={shopOpen}
                    className="flex w-full items-center justify-between min-h-[44px] px-4 text-sm font-medium hover:text-accent hover:bg-bg-raised transition-colors"
                  >
                    Shop
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-4 w-4 transition-transform ${shopOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {shopOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-bg-raised/40"
                      >
                        {groups.map((g) => (
                          <li key={g.slug}>
                            <Link
                              href={`/category/${g.slug}`}
                              onClick={() => setOpen(false)}
                              className="flex items-center justify-between min-h-[44px] pl-8 pr-4 text-sm text-text-muted hover:text-accent transition-colors"
                            >
                              {g.name}
                              <span className="font-mono text-[10px] text-text-faint">
                                {g.count}
                              </span>
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href="/catalog"
                            onClick={() => setOpen(false)}
                            className="flex items-center min-h-[44px] pl-8 pr-4 text-sm text-accent"
                          >
                            Full Catalog &rarr;
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
                <li>
                  <Link
                    href="/#financing"
                    onClick={() => setOpen(false)}
                    className="flex items-center min-h-[44px] px-4 text-sm font-medium hover:text-accent hover:bg-bg-raised transition-colors"
                  >
                    Financing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/transformations"
                    onClick={() => setOpen(false)}
                    className="flex items-center min-h-[44px] px-4 text-sm font-medium hover:text-accent hover:bg-bg-raised transition-colors"
                  >
                    Transformations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    onClick={() => setOpen(false)}
                    className="flex items-center min-h-[44px] px-4 text-sm font-medium hover:text-accent hover:bg-bg-raised transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="flex items-center min-h-[44px] px-4 text-sm font-medium hover:text-accent hover:bg-bg-raised transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="flex items-center min-h-[44px] px-4 text-sm font-medium hover:text-accent hover:bg-bg-raised transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
                </motion.nav>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
