import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductListClient } from '@/components/product/product-list-client';

export const metadata: Metadata = {
  title: 'สินค้าทั้งหมด',
  description: 'เลือกซื้อสินค้า Fantech และ UGREEN ของแท้ ประกันศูนย์ไทย ส่งไวทั่วประเทศ',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-gv py-20 text-center text-fg-muted">กำลังโหลด…</div>}>
      <ProductListClient />
    </Suspense>
  );
}
