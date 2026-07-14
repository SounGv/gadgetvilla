'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, BadgeCheck, Truck } from 'lucide-react';
import { cn, formatTHB } from '@/lib/utils';
import { useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';

export interface ProductCardData {
  id?: string;
  slug: string;
  name: string;
  category: string;
  brand: 'fantech' | 'ugreen';
  price: number;
  compareAtPrice?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  badge?: 'new' | 'hot' | 'sale';
  variantId?: string;
  sku?: string;
  stock?: number;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const addToCart = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.items.some((i) => i.slug === product.slug));

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;
  const inStock = (product.stock ?? 0) > 0;
  const freeShip = product.price >= 1000;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.variantId || !inStock) return;
    addToCart({
      variantId: product.variantId,
      slug: product.slug,
      name: product.name,
      sku: product.sku ?? product.slug,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  };
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWish(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ease-out-expo hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl"
      >
        <div className="relative aspect-square overflow-hidden bg-bg-subtle">
          <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1">
            {discount ? (
              <span className="rounded-md bg-fantech px-2 py-0.5 text-[11px] font-extrabold text-white">-{discount}%</span>
            ) : product.badge === 'new' ? (
              <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-extrabold text-accent-fg">ใหม่</span>
            ) : null}
            <span className="inline-flex items-center gap-0.5 rounded-md bg-brand/80 px-1.5 py-0.5 text-[10px] font-bold text-brand-fg backdrop-blur">
              <BadgeCheck className="h-3 w-3" /> ของแท้
            </span>
          </div>

          <button
            type="button"
            onClick={toggle}
            aria-label="เพิ่มในรายการโปรด"
            className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full border border-border bg-card/80 backdrop-blur transition-colors hover:text-fantech"
          >
            <Heart className={cn('h-4 w-4', mounted && wished ? 'fill-fantech text-fantech' : 'text-fg-muted')} />
          </button>

          <span
            className={cn(
              'absolute bottom-3 left-3 z-10 text-[10px] font-extrabold tracking-wide',
              product.brand === 'fantech' ? 'text-fantech' : 'text-accent2'
            )}
          >
            {product.brand.toUpperCase()}
          </span>

          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-contain p-6 transition-transform duration-500 ease-out-expo group-hover:scale-110"
            />
          ) : (
            <div className="grid h-full place-items-center text-fg-muted">
              <ShoppingCart className="h-10 w-10 opacity-30" />
            </div>
          )}

          <button
            type="button"
            onClick={quickAdd}
            disabled={!inStock}
            className="absolute inset-x-3 bottom-3 z-10 translate-y-[140%] rounded-full bg-accent py-2 text-[13px] font-bold text-accent-fg opacity-0 shadow-lg transition-all duration-300 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShoppingCart className="h-4 w-4" /> {inStock ? 'หยิบใส่ตะกร้า' : 'สินค้าหมด'}
            </span>
          </button>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-[11px] uppercase tracking-wide text-fg-muted">{product.category}</p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.6em] text-[14.5px] font-bold leading-snug">{product.name}</h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-fg-muted">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {product.rating ?? 5} <span>({product.reviewCount ?? 0})</span>
            <span className={cn('ml-auto font-semibold', inStock ? 'text-accent2' : 'text-error')}>
              {inStock ? 'พร้อมส่ง' : 'สินค้าหมด'}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="tabular text-lg font-extrabold text-fg">{formatTHB(product.price)}</span>
            {product.compareAtPrice ? (
              <span className="tabular text-sm text-fg-muted line-through">{formatTHB(product.compareAtPrice)}</span>
            ) : null}
          </div>
          {freeShip ? (
            <span className="mt-2 inline-flex w-fit items-center gap-1 rounded bg-accent2/10 px-1.5 py-0.5 text-[11px] font-semibold text-accent2">
              <Truck className="h-3 w-3" /> ส่งฟรี
            </span>
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
}
