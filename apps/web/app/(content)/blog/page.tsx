import type { Metadata } from 'next';
import { Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'บทความ & ข่าวสาร',
  description: 'ทิปการใช้งาน รีวิว และข่าวสารสินค้า Fantech และ UGREEN จาก GADGET VILLA',
};

// บทความจริงจะดึงจาก API /blog (BlogPost model) เมื่อเปิดใช้งานระบบคอนเทนต์
export default function BlogPage() {
  return (
    <div className="container-gv py-16">
      <span className="text-sm font-extrabold uppercase tracking-widest text-accent">Community</span>
      <h1 className="mt-2 text-4xl font-extrabold">บทความ & ข่าวสาร</h1>
      <p className="mt-3 max-w-xl text-fg-muted">ทิปการเลือกเกมมิ่งเกียร์ รีวิว และวิธีใช้อุปกรณ์ให้คุ้มค่า</p>

      <div className="mt-12 flex flex-col items-center gap-3 rounded-lg border border-border bg-card py-20 text-center">
        <Newspaper className="h-10 w-10 text-fg-muted" />
        <p className="font-semibold">ยังไม่มีบทความ</p>
        <p className="text-sm text-fg-muted">บทความจะแสดงเมื่อทีมคอนเทนต์เผยแพร่ผ่านระบบหลังบ้าน</p>
      </div>
    </div>
  );
}
