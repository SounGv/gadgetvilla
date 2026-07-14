'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartLine {
  variantId: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

interface CartState {
  items: CartLine[];
  add: (line: Omit<CartLine, 'quantity'>, qty?: number) => void;
  remove: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (line, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.variantId === line.variantId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.variantId === line.variantId ? { ...i, quantity: i.quantity + qty } : i
              ),
            };
          }
          return { items: [...s.items, { ...line, quantity: qty }] };
        }),
      remove: (variantId) =>
        set((s) => ({ items: s.items.filter((i) => i.variantId !== variantId) })),
      setQty: (variantId, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: Math.max(1, qty) } : i
          ),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: 'gv_cart' }
  )
);
