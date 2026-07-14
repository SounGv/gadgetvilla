import type { Metadata } from 'next';
import Link from 'next/link';
import { Truck, Clock, Banknote, MapPin, PackageCheck, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'การจัดส่ง | GADGET VILLA',
  description: 'ข้อมูลการจัดส่งสินค้า ค่าส่ง ระยะเวลา และขนส่งที่ให้บริการ',
};

const carriers = [
  { name: 'Flash Express', time: '1-2 วันทำการ' },
  { name: 'J&T Express', time: '1-2 วันทำการ' },
  { name: 'Kerry Express', time: '1-3 วันทำการ' },
  { name: 'ไปรษณีย์ไทย (EMS)', time: '1-3 วันทำการ' },
  { name: 'DHL (ด่วนพิเศษ)', time: '1 วันทำการ' },
];

const fees = [
  { cond: 'สั่งซื้อครบ ฿1,000 ขึ้นไป', fee: 'ส่งฟรี' },
  { cond: 'สั่งซื้อต่ำกว่า ฿1,000', fee: '฿50 (เหมาทั่วประเทศ)' },
  { cond: 'พื้นที่ห่างไกล/เกาะ', fee: 'อาจมีค่าส่งเพิ่มตามจริง' },
];

export default function ShippingPage() {
  return (
    <div className="container-gv py-14">
      <Link href="/support" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> กลับหน้าบริการลูกค้า
      </Link>
      <div className="max-w-2xl">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent"><Truck className="h-6 w-6" /></span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">การจัดส่ง</h1>
        <p className="mt-3 text-fg-muted">จัดส่งไวทั่วประเทศ 1-2 วันทำการ พร้อมติดตามพัสดุแบบเรียลไทม์</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Banknote className="h-5 w-5 text-accent" /> ค่าจัดส่ง</h2>
          <ul className="divide-y divide-border">
            {fees.map((f) => (
              <li key={f.cond} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="text-fg-muted">{f.cond}</span>
                <span className="font-bold">{f.fee}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Clock className="h-5 w-5 text-accent" /> ขนส่งที่ให้บริการ</h2>
          <ul className="divide-y divide-border">
            {carriers.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="font-semibold">{c.name}</span>
                <span className="text-fg-muted">{c.time}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><PackageCheck className="h-5 w-5 text-accent" /> ขั้นตอนหลังสั่งซื้อ</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            ['ยืนยันคำสั่งซื้อ', 'ระบบยืนยันและเตรียมจัดส่งภายในวันเดียวกัน (ก่อน 15:00 น.)'],
            ['แพ็กและจัดส่ง', 'แพ็กอย่างดี ส่งออกและออกเลขพัสดุให้ทางอีเมล/SMS'],
            ['ติดตามพัสดุ', 'เช็คสถานะได้ที่หน้า “ติดตามคำสั่งซื้อ” ตลอด 24 ชม.'],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-xl border border-border bg-bg-subtle p-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-extrabold text-accent-fg">{i + 1}</span>
              <h3 className="mt-3 font-bold">{t}</h3>
              <p className="mt-1 text-[13px] text-fg-muted">{d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-accent/10 p-4 text-sm text-fg">
          <MapPin className="h-5 w-5 shrink-0 text-accent" />
          จัดส่งเฉพาะภายในประเทศไทย · ตรวจสอบสถานะได้ที่{' '}
          <Link href="/tracking" className="font-bold text-accent hover:underline">ติดตามคำสั่งซื้อ</Link>
        </div>
      </section>
    </div>
  );
}
