'use client';

import { useQuery } from '@tanstack/react-query';
import { Flame } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductCard, type ProductCardData } from '@/components/product/product-card';

async function fetchPromo(): Promise<ProductCardData[]> {
  const { data } = await api.get('/products', { params: { limit: 24 } });
  const items: ProductCardData[] = data.items ?? data;
  return items.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
}

export function PromoProducts() {
  const { data, isLoading } = useQuery({ queryKey: ['promo'], queryFn: fetchPromo });

  if (isLoading) return <p className="py-16 text-center text-fg-muted">กำลังโหลดดีล…</p>;
  if (!data || data.length === 0)
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card py-20 text-center">
        <Flame className="h-10 w-10 text-fg-muted" />
        <p className="font-semibold">ยังไม่มีโปรโมชั่นตอนนี้</p>
        <p className="text-sm text-fg-muted">ดีลจะแสดงเมื่อมีสินค้าตั้งราคาลด</p>
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {data.map((p) => <ProductCard key={p.slug} product={p} />)}
    </div>
  );
}
