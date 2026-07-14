'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PackageOpen, AlertCircle, SlidersHorizontal } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductCard, type ProductCardData } from './product-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const brands = [
  { value: '', label: 'ทุกแบรนด์' },
  { value: 'fantech', label: 'Fantech' },
  { value: 'ugreen', label: 'UGREEN' },
];
const brandChip: Record<string, string> = {
  '': 'border-accent bg-accent text-accent-fg',
  fantech: 'border-fantech bg-fantech text-white',
  ugreen: 'border-accent2 bg-accent2 text-accent2-fg',
};
const sorts = [
  { value: 'popular', label: 'ยอดนิยม' },
  { value: 'new', label: 'ใหม่ล่าสุด' },
  { value: 'price_asc', label: 'ราคาต่ำ-สูง' },
  { value: 'price_desc', label: 'ราคาสูง-ต่ำ' },
];

interface Filters {
  brand: string;
  sort: string;
}

async function fetchProducts(filters: Filters): Promise<ProductCardData[]> {
  const { data } = await api.get('/products', { params: filters });
  return data.items ?? data;
}

function Skeleton() {
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

export function ProductListClient() {
  const [filters, setFilters] = useState<Filters>({ brand: '', sort: 'popular' });
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  });

  return (
    <div className="container-gv py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">สินค้าทั้งหมด</h1>
          <p className="text-fg-muted">Fantech &amp; UGREEN ของแท้ ประกันศูนย์ไทย</p>
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-fg-muted" />
          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {brands.map((b) => (
          <button
            key={b.value}
            onClick={() => setFilters((f) => ({ ...f, brand: b.value }))}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-bold transition-colors',
              filters.brand === b.value
                ? (brandChip[b.value] ?? 'border-accent bg-accent text-accent-fg')
                : 'border-border bg-card text-fg-muted hover:text-fg'
            )}
          >
            {b.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card py-20 text-center">
          <AlertCircle className="h-10 w-10 text-fg-muted" />
          <p className="text-fg-muted">โหลดสินค้าไม่สำเร็จ</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            ลองใหม่
          </Button>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card py-20 text-center">
          <PackageOpen className="h-10 w-10 text-fg-muted" />
          <p className="font-semibold">ไม่พบสินค้า</p>
          <p className="text-sm text-fg-muted">
            สินค้าจะแสดงเมื่อเชื่อม BigSeller และเพิ่มสินค้าจริงเข้าระบบ
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
