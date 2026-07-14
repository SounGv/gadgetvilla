import type { Metadata } from 'next';
import { ShieldCheck, Truck, Headphones, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา',
  description: 'GADGET VILLA ตัวแทนจำหน่าย Fantech และ UGREEN อย่างเป็นทางการในประเทศไทย',
};

const values = [
  { icon: ShieldCheck, title: 'ของแท้ 100%', body: 'สินค้าทุกชิ้นเป็นของแท้ ประกันศูนย์ไทย' },
  { icon: Truck, title: 'ส่งไวทั่วไทย', body: 'จัดส่งภายใน 1-2 วันทำการ ทั่วประเทศ' },
  { icon: Headphones, title: 'บริการหลังการขาย', body: 'ทีมงานดูแลตลอดอายุการใช้งาน' },
  { icon: Award, title: 'ตัวแทนอย่างเป็นทางการ', body: 'ได้รับการแต่งตั้งจาก Fantech และ UGREEN' },
];

export default function AboutPage() {
  return (
    <div className="container-gv py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-sm font-extrabold uppercase tracking-widest text-accent">เกี่ยวกับเรา</span>
        <h1 className="mt-2 text-4xl font-extrabold">GADGET VILLA</h1>
        <p className="mt-4 text-lg text-fg-muted">
          เราคือศูนย์รวมสินค้าเทคโนโลยีคุณภาพ ตัวแทนจำหน่าย Fantech เกมมิ่งเกียร์
          และ UGREEN อุปกรณ์ชาร์จและจัดเก็บข้อมูล อย่างเป็นทางการในประเทศไทย
          มุ่งมั่นส่งมอบสินค้าของแท้พร้อมบริการที่ดีที่สุดให้ลูกค้าทุกคน
        </p>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v) => (
          <div key={v.title} className="rounded-lg border border-border bg-card p-6 text-center">
            <v.icon className="mx-auto h-8 w-8 text-accent" />
            <h3 className="mt-3 font-bold">{v.title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{v.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
