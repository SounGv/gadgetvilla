import type { Metadata } from 'next';
import Link from 'next/link';
import { RotateCcw, CheckCircle2, XCircle, ArrowLeft, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'เปลี่ยน/คืนสินค้า | GADGET VILLA',
  description: 'เงื่อนไขและขั้นตอนการเปลี่ยนหรือคืนสินค้าภายใน 7 วัน',
};

const eligible = [
  'สินค้าชำรุด/เสียหายจากการผลิต หรือได้รับสินค้าไม่ตรงรุ่น',
  'สินค้าอยู่ในสภาพสมบูรณ์ พร้อมกล่องและอุปกรณ์ครบ',
  'แจ้งภายใน 7 วันนับจากวันได้รับสินค้า',
  'มีหลักฐานการสั่งซื้อ (เลขคำสั่งซื้อ/ใบเสร็จ)',
];
const notEligible = [
  'สินค้าถูกใช้งานจนมีร่องรอย/เสียหายจากผู้ใช้',
  'อุปกรณ์/กล่อง/ของแถมไม่ครบ',
  'เกินระยะเวลา 7 วัน',
  'สินค้าประเภทสาย/ของใช้สิ้นเปลืองที่แกะซีลแล้ว (เว้นแต่ชำรุด)',
];

export default function ReturnsPage() {
  return (
    <div className="container-gv py-14">
      <Link href="/support" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> กลับหน้าบริการลูกค้า
      </Link>
      <div className="max-w-2xl">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent"><RotateCcw className="h-6 w-6" /></span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">เปลี่ยน / คืนสินค้า</h1>
        <p className="mt-3 text-fg-muted">รับเปลี่ยน/คืนสินค้าภายใน 7 วัน หากสินค้ามีปัญหาจากการผลิตหรือได้รับไม่ตรงรุ่น</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-accent2"><CheckCircle2 className="h-5 w-5" /> เข้าเงื่อนไข</h2>
          <ul className="space-y-3 text-sm">
            {eligible.map((e) => (
              <li key={e} className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent2" /><span>{e}</span></li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-error"><XCircle className="h-5 w-5" /> ไม่เข้าเงื่อนไข</h2>
          <ul className="space-y-3 text-sm">
            {notEligible.map((e) => (
              <li key={e} className="flex gap-2.5"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" /><span className="text-fg-muted">{e}</span></li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-bold">ขั้นตอนการขอเปลี่ยน/คืน</h2>
        <ol className="grid gap-4 sm:grid-cols-4">
          {[
            ['แจ้งทีมงาน', 'ทัก LINE หรืออีเมลพร้อมเลขคำสั่งซื้อและรูปสินค้า'],
            ['รอตรวจสอบ', 'ทีมงานตรวจสอบเงื่อนไขภายใน 1-2 วันทำการ'],
            ['ส่งสินค้ากลับ', 'แพ็กสินค้าพร้อมอุปกรณ์ ส่งกลับตามที่อยู่ที่แจ้ง'],
            ['รับของใหม่/เงินคืน', 'เปลี่ยนสินค้าใหม่ หรือคืนเงินภายใน 7-14 วัน'],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-xl border border-border bg-bg-subtle p-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-extrabold text-accent-fg">{i + 1}</span>
              <h3 className="mt-3 text-sm font-bold">{t}</h3>
              <p className="mt-1 text-[12.5px] text-fg-muted">{d}</p>
            </li>
          ))}
        </ol>
        <Link href="/support/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-fg hover:shadow-md">
          <MessageCircle className="h-4 w-4" /> แจ้งเปลี่ยน/คืนสินค้า
        </Link>
      </section>
    </div>
  );
}
