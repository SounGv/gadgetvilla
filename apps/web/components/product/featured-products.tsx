'use client';

import { useQuery } from '@tanstack/react-query';
import { PackageOpen, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductCard, type ProductCardData } from './product-card';
import { Button } from '@/components/ui/button';

async function fetchFeatured(): Promise<ProductCardData[]> {
  const { data } = await api.get('/products', { params: { featured: true, limit: 8 } });
  let items: ProductCardData[] = data.items ?? data ?? [];
  // ถ้ายังไม่มีสินค้าที่ตั้ง featured → โชว์สินค้าล่าสุดแทน (หน้าแรกจะได้ไม่ว่าง)
  if (!items.length) {
    const res = await api.get('/products', { params: { sort: 'new', limit: 8 } });
    items = res.data.items ?? res.data ?? [];
  }
  return items;
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-square animate-pulse bg-bg-subtle" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-bg-subtle" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-bg-subtle" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-bg-subtle" />
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchFeatured,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card py-16 text-center">
        <AlertCircle className="h-10 w-10 text-fg-muted" />
        <p className="text-fg-muted">โหลดสินค้าไม่สำเร็จ</p>
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          ลองใหม่
        </Button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card py-16 text-center">
        <PackageOpen className="h-10 w-10 text-fg-muted" />
        <p className="font-semibold">ยังไม่มีสินค้า</p>
        <p className="text-sm text-fg-muted">
          สินค้าจะแสดงเมื่อเชื่อม BigSeller และเพิ่มสินค้าจริงเข้าระบบ
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {data.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
