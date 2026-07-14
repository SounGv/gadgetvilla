'use client';

import { useQuery } from '@tanstack/react-query';
import { PackageOpen } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductCard, type ProductCardData } from './product-card';

async function fetchByBrand(brand: string): Promise<ProductCardData[]> {
  const { data } = await api.get('/products', { params: { brand, limit: 24 } });
  return data.items ?? data;
}

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-square animate-pulse bg-bg-subtle" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-bg-subtle" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-bg-subtle" />
      </div>
    </div>
  );
}

export function BrandProducts({ brand }: { brand: string }) {
  const { data, isLoading } = useQuery({ queryKey: ['brand', brand], queryFn: () => fetchByBrand(brand) });

  if (isLoading)
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card py-20 text-center">
        <PackageOpen className="h-10 w-10 text-fg-muted" />
        <p className="font-semibold">ยังไม่มีสินค้า</p>
        <p className="text-sm text-fg-muted">สินค้าจะแสดงเมื่อเชื่อม BigSeller</p>
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {data.map((p) => <ProductCard key={p.slug} product={p} />)}
    </div>
  );
}
