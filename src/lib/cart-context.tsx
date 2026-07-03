"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  title: string;
  image: string | null;
  price: number | null;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "c1d-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed/unavailable storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((i) => i.slug === item.slug) ? prev : [...prev, item]));
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, addItem, removeItem, clear, count: items.length }),
    [items, addItem, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

// $100-$500 refundable deposit range, tiered by unit price, per the
// deposit & reservation spec. Units with no scraped price fall back to a
// flat request-quote deposit rather than blocking the reservation flow.
export function depositFor(price: number | null): number {
  if (price == null) return 100;
  if (price < 3000) return 100;
  if (price < 10000) return 250;
  if (price < 30000) return 400;
  return 500;
}
