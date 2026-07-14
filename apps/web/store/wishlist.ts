'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductCardData } from '@/components/product/product-card';

interface WishlistState {
  items: ProductCardData[];
  toggle: (p: ProductCardData) => void;
  has: (slug: string) => boolean;
  remove: (slug: string) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (p) =>
        set((s) =>
          s.items.some((i) => i.slug === p.slug)
            ? { items: s.items.filter((i) => i.slug !== p.slug) }
            : { items: [...s.items, p] }
        ),
      has: (slug) => get().items.some((i) => i.slug === slug),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
    }),
    { name: 'gv_wishlist' }
  )
);
