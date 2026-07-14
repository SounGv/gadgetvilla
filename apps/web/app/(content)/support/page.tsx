import type { Metadata } from 'next';
import Link from 'next/link';
import { Truck, RotateCcw, ShieldCheck, PackageSearch, MessageCircle, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'บริการลูกค้า',
  description: 'ศูนย์ช่วยเหลือ GADGET VILLA — จัดส่ง เปลี่ยน/คืน ประกัน ติดตามพัสดุ ติดต่อเรา',
};

const topics = [
  { icon: Truck, title: 'การจัดส่ง', desc: 'ส่งไว 1-2 วันทำการทั่วไทย', href: '/support/shipping' },
  { icon: RotateCcw, title: 'เปลี่ยน/คืนสินค้า', desc: 'เงื่อนไขการเปลี่ยนคืนภายใน 7 วัน', href: '/support/returns' },
  { icon: ShieldCheck, title: 'การรับประกัน', desc: 'ลงทะเบียนประกัน & แจ้งเคลม', href: '/warranty' },
  { icon: PackageSearch, title: 'ติดตามพัสดุ', desc: 'เช็คสถานะคำสั่งซื้อของคุณ', href: '/tracking' },
  { icon: HelpCircle, title: 'คำถามที่พบบ่อย', desc: 'รวมคำถามยอดฮิต', href: '/faq' },
  { icon: MessageCircle, title: 'ติดต่อเรา', desc: 'LINE / โทร / อีเมล', href: '/support/contact' },
];

export default function SupportPage() {
  return (
    <div className="container-gv py-16">
      <div className="max-w-2xl">
        <span className="text-sm font-extrabold uppercase tracking-widest text-accent">ศูนย์ช่วยเหลือ</span>
        <h1 className="mt-2 text-4xl font-extrabold">เราช่วยอะไรคุณได้บ้าง?</h1>
        <p className="mt-3 text-fg-muted">เลือกหัวข้อด้านล่าง หรือติดต่อทีมงานได้ทุกวัน 9:00-18:00</p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <Link key={t.title} href={t.href}
            className="rounded-lg border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md">
            <t.icon className="h-8 w-8 text-accent" />
            <h3 className="mt-3 font-bold">{t.title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
