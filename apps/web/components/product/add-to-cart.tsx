'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTHB, cn } from '@/lib/utils';
import { useCart } from '@/store/cart';
import type { ProductDetail, ProductVariant } from '@/lib/types';

export function AddToCart({ product }: { product: ProductDetail }) {
  const add = useCart((s) => s.add);
  const [variant, setVariant] = useState<ProductVariant>(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!variant) return null;

  const handleAdd = () => {
    add(
      {
        variantId: variant.id,
        slug: product.slug,
        name: `${product.name} · ${variant.name}`,
        sku: variant.sku,
        price: variant.price,
        imageUrl: product.images[0]?.url,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const outOfStock = variant.inStock !== undefined && variant.inStock <= 0;

  return (
    <div className="space-y-5">
      <div className="flex items-baseline gap-3">
        <span className="tabular text-3xl font-extrabold">{formatTHB(variant.price)}</span>
        {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
          <span className="tabular text-lg text-fg-muted line-through">
            {formatTHB(variant.compareAtPrice)}
          </span>
        )}
      </div>

      {product.variants.length > 1 && (
        <div>
          <p className="mb-2 text-sm font-semibold">ตัวเลือก</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariant(v)}
                className={cn(
                  'rounded-md border px-4 py-2 text-sm font-semibold transition-colors',
                  v.id === variant.id
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border hover:border-fg-muted'
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-border">
          <button aria-label="ลด" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center">
            <Minus className="h-4 w-4" />
          </button>
          <span className="tabular w-10 text-center font-bold">{qty}</span>
          <button aria-label="เพิ่ม" onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className={cn('text-sm font-semibold', outOfStock ? 'text-error' : 'text-accent2')}>
          {outOfStock ? 'สินค้าหมด' : 'พร้อมส่ง'}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="accent" size="lg" disabled={outOfStock} onClick={handleAdd} className="flex-1">
          {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
          {added ? 'เพิ่มแล้ว' : 'ใส่ตะกร้า'}
        </Button>
        <Button variant="primary" size="lg" disabled={outOfStock} className="flex-1">
          ซื้อเลย
        </Button>
      </div>
    </div>
  );
}
