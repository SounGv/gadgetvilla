'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, PackageOpen } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductCard, type ProductCardData } from '@/components/product/product-card';

type TabKey = 'best' | 'flash' | 'new' | 'bundle';

const tabs: { key: TabKey; label: string; params: Record<string, string> }[] = [
  { key: 'best', label: 'BEST SELLER', params: { featured: 'true', limit: '6' } },
  { key: 'flash', label: 'FLASH SALE', params: { sort: 'new', limit: '6' } },
  { key: 'new', label: 'NEW ARRIVAL', params: { sort: 'new', limit: '6' } },
  { key: 'bundle', label: 'BUNDLE DEALS', params: { limit: '6' } },
];

async function fetchTab(params: Record<string, string>): Promise<ProductCardData[]> {
  const { data } = await api.get('/products', { params });
  let items: ProductCardData[] = data.items ?? data ?? [];
  if (!items.length) {
    const res = await api.get('/products', { params: { sort: 'new', limit: '6' } });
    items = res.data.items ?? res.data ?? [];
  }
  return items;
}

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-square animate-pulse bg-bg-subtle" />
      <div className="space-y-2 p-4"><div className="h-3 w-1/3 animate-pulse rounded bg-bg-subtle" /><div className="h-4 w-3/4 animate-pulse rounded bg-bg-subtle" /><div className="h-5 w-1/2 animate-pulse rounded bg-bg-subtle" /></div>
    </div>
  );
}

export function ProductTabs() {
  const [tab, setTab] = useState<TabKey>('best');
  const current = tabs.find((t) => t.key === tab)!;
  const { data, isLoading } = useQuery({ queryKey: ['home-tab', tab], queryFn: () => fetchTab(current.params) });

  return (
    <section className="bg-bg">
      <div className="container-gv pb-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border">
          <div className="flex flex-wrap gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative px-4 py-3 text-sm font-extrabold tracking-wide transition-colors ${tab === t.key ? 'text-accent2' : 'text-fg-muted hover:text-fg'}`}
              >
                {t.label}
                {tab === t.key ? <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent2" /> : null}
              </button>
            ))}
          </div>
          <Link href="/products" className="inline-flex items-center gap-1 text-sm font-bold text-accent2 hover:opacity-80">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : data && data.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {data.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card py-16 text-center">
            <PackageOpen className="h-9 w-9 text-fg-muted" />
            <p className="font-semibold">ยังไม่มีสินค้าในหมวดนี้</p>
            <p className="text-sm text-fg-muted">นำเข้าสินค้าจาก BigSeller ที่หน้า /admin เพื่อแสดงผล</p>
          </div>
        )}
      </div>
    </section>
  );
}
