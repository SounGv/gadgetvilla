import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, FileText, Wrench, ArrowLeft, MessageCircle, PackageSearch } from 'lucide-react';

export const metadata: Metadata = {
  title: 'การรับประกัน | GADGET VILLA',
  description: 'เงื่อนไขการรับประกันสินค้า Fantech และ UGREEN การลงทะเบียนประกัน และการแจ้งเคลม',
};

const coverage = [
  { brand: 'Fantech', period: '1-2 ปี', note: 'เมาส์ คีย์บอร์ด หูฟัง เก้าอี้เกมมิ่ง (ตามรุ่น)' },
  { brand: 'UGREEN — ที่ชาร์จ/สาย', period: '2-3 ปี', note: 'GaN charger, สายชาร์จ, USB hub' },
  { brand: 'UGREEN — NAS/NASync', period: 'สูงสุด 5 ปี', note: 'อุปกรณ์จัดเก็บข้อมูล (ตามรุ่น)' },
];

export default function WarrantyPage() {
  return (
    <div className="container-gv py-14">
      <Link href="/support" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> กลับหน้าบริการลูกค้า
      </Link>
      <div className="max-w-2xl">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent"><ShieldCheck className="h-6 w-6" /></span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">การรับประกัน</h1>
        <p className="mt-3 text-fg-muted">สินค้าทุกชิ้นเป็นของแท้ พร้อมประกันศูนย์ไทย ครอบคลุมความเสียหายจากการผลิตตามเงื่อนไขของแต่ละแบรนด์</p>
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><ShieldCheck className="h-5 w-5 text-accent" /> ระยะเวลาประกัน</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-bg-subtle text-left text-fg-muted">
              <tr><th className="p-3 font-semibold">หมวดสินค้า</th><th className="p-3 font-semibold">ระยะประกัน</th><th className="hidden p-3 font-semibold sm:table-cell">หมายเหตุ</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coverage.map((c) => (
                <tr key={c.brand}>
                  <td className="p-3 font-semibold">{c.brand}</td>
                  <td className="p-3"><span className="rounded bg-accent2/10 px-2 py-0.5 font-bold text-accent2">{c.period}</span></td>
                  <td className="hidden p-3 text-fg-muted sm:table-cell">{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-fg-muted">* ระยะเวลาประกันจริงระบุบนหน้าสินค้าแต่ละรายการ ประกันไม่ครอบคลุมความเสียหายจากการใช้งานผิดวิธี ตกหล่น หรือของเหลว</p>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><FileText className="h-5 w-5 text-accent" /> ลงทะเบียนประกัน</h2>
          <ol className="space-y-2.5 text-sm text-fg-muted">
            <li>1. เก็บใบเสร็จ/เลขคำสั่งซื้อไว้เป็นหลักฐาน</li>
            <li>2. ถ่ายรูปสินค้าและ Serial Number (ถ้ามี)</li>
            <li>3. แจ้งข้อมูลกับทีมงานผ่าน LINE เพื่อบันทึกการรับประกัน</li>
          </ol>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Wrench className="h-5 w-5 text-accent" /> แจ้งเคลม/ซ่อม</h2>
          <ol className="space-y-2.5 text-sm text-fg-muted">
            <li>1. ทัก LINE พร้อมเลขคำสั่งซื้อและอาการเสีย</li>
            <li>2. ทีมงานตรวจสอบและแจ้งวิธีส่งสินค้ากลับ</li>
            <li>3. ตรวจเช็ค/ซ่อม/เปลี่ยนตามเงื่อนไขประกัน</li>
          </ol>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/support/contact" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-fg hover:shadow-md">
          <MessageCircle className="h-4 w-4" /> แจ้งเคลม / ลงทะเบียนประกัน
        </Link>
        <Link href="/tracking" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:bg-bg-subtle">
          <PackageSearch className="h-4 w-4" /> ติดตามสถานะเคลม
        </Link>
      </div>
    </div>
  );
}
