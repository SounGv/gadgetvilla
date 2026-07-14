'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Rating } from '@/components/ui/rating';
import type { ProductDetail } from '@/lib/types';

const tabs = ['รายละเอียด', 'สเปก', 'ดาวน์โหลด', 'รีวิว'] as const;

export function ProductTabs({ product }: { product: ProductDetail }) {
  const [active, setActive] = useState<(typeof tabs)[number]>('รายละเอียด');

  return (
    <div className="mt-16">
      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={cn(
              'relative px-5 py-3 text-sm font-bold transition-colors',
              active === t ? 'text-fg' : 'text-fg-muted hover:text-fg'
            )}
          >
            {t}
            {active === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />}
          </button>
        ))}
      </div>

      <div className="py-8">
        {active === 'รายละเอียด' && (
          <div className="space-y-8">
            {product.description && (
              <p className="max-w-3xl whitespace-pre-line text-fg-muted">{product.description}</p>
            )}
            <div className="grid gap-6 md:grid-cols-2">
              {product.features.map((f, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-6">
                  <h4 className="font-bold">{f.title}</h4>
                  {f.body && <p className="mt-2 text-sm text-fg-muted">{f.body}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 'สเปก' && (
          <div className="max-w-3xl overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {product.specs.map((s, i) => (
                  <tr key={i} className={cn(i % 2 ? 'bg-bg-subtle' : 'bg-card')}>
                    <td className="w-1/3 border-b border-border px-4 py-3 font-semibold">{s.key}</td>
                    <td className="border-b border-border px-4 py-3 text-fg-muted">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {product.specs.length === 0 && <p className="p-6 text-fg-muted">ไม่มีข้อมูลสเปก</p>}
          </div>
        )}

        {active === 'ดาวน์โหลด' && (
          <div className="max-w-3xl space-y-3">
            {product.downloads.length === 0 && <p className="text-fg-muted">ไม่มีไฟล์ดาวน์โหลด</p>}
            {product.downloads.map((d, i) => (
              <a
                key={i}
                href={d.fileUrl}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-fg-muted"
              >
                <div>
                  <p className="font-semibold">{d.title}</p>
                  <p className="text-xs uppercase tracking-wide text-fg-muted">
                    {d.type}
                    {d.version ? ` · v${d.version}` : ''}
                  </p>
                </div>
                <Download className="h-5 w-5 text-accent" />
              </a>
            ))}
          </div>
        )}

        {active === 'รีวิว' && (
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-extrabold">{product.rating.toFixed(1)}</span>
              <div>
                <Rating value={product.rating} />
                <p className="text-sm text-fg-muted">{product.reviewCount} รีวิว</p>
              </div>
            </div>
            {product.reviews.length === 0 && (
              <p className="text-fg-muted">ยังไม่มีรีวิว — เป็นคนแรกที่รีวิวสินค้านี้</p>
            )}
            {product.reviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{r.author}</span>
                  <Rating value={r.rating} />
                </div>
                {r.title && <p className="mt-2 font-semibold">{r.title}</p>}
                {r.body && <p className="mt-1 text-sm text-fg-muted">{r.body}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
