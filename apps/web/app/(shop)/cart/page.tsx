'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { formatTHB } from '@/lib/utils';

const FREE_SHIPPING_MIN = 990;

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, setQty, remove, subtotal } = useCart();
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="container-gv py-20 text-center text-fg-muted">กำลังโหลด…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-gv flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag className="h-14 w-14 text-fg-muted" />
        <h1 className="text-2xl font-extrabold">ตะกร้าว่าง</h1>
        <p className="text-fg-muted">ยังไม่มีสินค้าในตะกร้า</p>
        <Link href="/products">
          <Button variant="accent" size="lg">
            เลือกซื้อสินค้า
          </Button>
        </Link>
      </div>
    );
  }

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_MIN ? 0 : 50;
  const total = sub + shipping;

  return (
    <div className="container-gv py-10">
      <h1 className="mb-8 text-3xl font-extrabold">ตะกร้าสินค้า ({items.length})</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-bg-subtle">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-2" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold leading-snug">{item.name}</p>
                    <p className="text-xs text-fg-muted">SKU: {item.sku}</p>
                  </div>
                  <button
                    aria-label="ลบ"
                    onClick={() => remove(item.variantId)}
                    className="text-fg-muted transition-colors hover:text-error"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      aria-label="ลด"
                      onClick={() => setQty(item.variantId, item.quantity - 1)}
                      className="grid h-9 w-9 place-items-center"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="tabular w-9 text-center font-bold">{item.quantity}</span>
                    <button
                      aria-label="เพิ่ม"
                      onClick={() => setQty(item.variantId, item.quantity + 1)}
                      className="grid h-9 w-9 place-items-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="tabular font-extrabold">{formatTHB(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-bold">สรุปคำสั่งซื้อ</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-fg-muted">ยอดรวมสินค้า</dt>
              <dd className="tabular font-semibold">{formatTHB(sub)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fg-muted">ค่าจัดส่ง</dt>
              <dd className="tabular font-semibold">{shipping === 0 ? 'ฟรี' : formatTHB(shipping)}</dd>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-accent2">
                ซื้อเพิ่ม {formatTHB(FREE_SHIPPING_MIN - sub)} เพื่อรับส่งฟรี
              </p>
            )}
          </dl>
          <div className="my-4 border-t border-border" />
          <div className="flex justify-between text-lg font-extrabold">
            <span>รวมทั้งหมด</span>
            <span className="tabular">{formatTHB(total)}</span>
          </div>
          <Link href="/checkout" className="mt-6 block">
            <Button variant="accent" size="lg" className="w-full">
              ดำเนินการชำระเงิน <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/products" className="mt-3 block text-center text-sm text-fg-muted hover:text-fg">
            เลือกซื้อสินค้าต่อ
          </Link>
        </aside>
      </div>
    </div>
  );
}
