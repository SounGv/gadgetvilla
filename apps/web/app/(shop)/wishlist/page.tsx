'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/store/wishlist';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlist((s) => s.items);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="container-gv py-20 text-center text-fg-muted">กำลังโหลด…</div>;

  if (items.length === 0) {
    return (
      <div className="container-gv flex flex-col items-center gap-4 py-24 text-center">
        <Heart className="h-14 w-14 text-fg-muted" />
        <h1 className="text-2xl font-extrabold">ยังไม่มีรายการโปรด</h1>
        <p className="text-fg-muted">กดหัวใจที่สินค้าเพื่อบันทึกไว้ที่นี่</p>
        <Link href="/products"><Button variant="accent" size="lg">เลือกซื้อสินค้า</Button></Link>
      </div>
    );
  }

  return (
    <div className="container-gv py-10">
      <h1 className="mb-8 text-3xl font-extrabold">รายการโปรด ({items.length})</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </div>
  );
}
