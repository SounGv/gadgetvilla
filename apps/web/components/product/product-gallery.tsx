'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/lib/types';

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex gap-3 md:flex-col">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`ภาพที่ ${i + 1}`}
            className={cn(
              'relative h-16 w-16 overflow-hidden rounded-md border bg-bg-subtle transition-colors',
              i === active ? 'border-accent' : 'border-border hover:border-fg-muted'
            )}
          >
            {img.url && <Image src={img.url} alt={img.alt ?? name} fill className="object-contain p-1" />}
          </button>
        ))}
      </div>
      <div className="relative aspect-square flex-1 overflow-hidden rounded-lg border border-border bg-bg-subtle">
        {current?.url ? (
          <Image
            src={current.url}
            alt={current.alt ?? name}
            fill
            priority
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-contain p-8"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-fg-muted">ไม่มีรูปภาพ</div>
        )}
      </div>
    </div>
  );
}
