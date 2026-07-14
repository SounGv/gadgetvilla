import type { Metadata } from 'next';
import { PromoProducts } from './promo-products';

export const metadata: Metadata = {
  title: 'โปรโมชั่น & Flash Sale',
  description: 'รวมดีลลดราคาสินค้า Fantech และ UGREEN ของแท้ ประกันศูนย์ไทย',
};

export default function PromotionPage() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-to-br from-accent/15 to-bg">
        <div className="container-gv py-14">
          <span className="text-sm font-extrabold uppercase tracking-widest text-accent">Flash Sale</span>
          <h1 className="mt-2 text-4xl font-extrabold">โปรโมชั่นเดือนนี้</h1>
          <p className="mt-2 text-fg-muted">ดีลเด็ดลดราคา จำนวนจำกัด</p>
        </div>
      </section>
      <div className="container-gv py-10">
        <PromoProducts />
      </div>
    </div>
  );
}
