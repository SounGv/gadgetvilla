import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'คำถามที่พบบ่อย (FAQ) | GADGET VILLA',
  description: 'รวมคำถามยอดฮิตเกี่ยวกับสินค้า การสั่งซื้อ จัดส่ง ชำระเงิน และการรับประกัน',
};

const faqs: { q: string; a: string }[] = [
  { q: 'สินค้าเป็นของแท้หรือไม่?', a: 'สินค้าทุกชิ้นเป็นของแท้ 100% นำเข้าและจัดจำหน่ายอย่างเป็นทางการ พร้อมประกันศูนย์ไทย' },
  { q: 'ชำระเงินปลอดภัยไหม?', a: 'ชำระผ่านช่องทางที่ปลอดภัย: PromptPay QR, บัตรเครดิต/เดบิต และ Mobile Banking ข้อมูลถูกเข้ารหัสทุกขั้นตอน' },
  { q: 'สั่งซื้อแล้วกี่วันได้รับของ?', a: 'จัดส่ง 1-2 วันทำการทั่วประเทศ (พื้นที่ห่างไกลอาจ 3 วัน) หากสั่งก่อน 15:00 น. จะจัดส่งภายในวันเดียวกัน' },
  { q: 'ส่งฟรีเมื่อไหร่?', a: 'สั่งซื้อครบ ฿1,000 ขึ้นไป ส่งฟรีทั่วประเทศ ต่ำกว่านั้นค่าส่งเหมา ฿50' },
  { q: 'ชำระเงินได้กี่ช่องทาง?', a: 'PromptPay QR, บัตรเครดิต/เดบิต และ Mobile Banking' },
  { q: 'สินค้ามีประกันกี่ปี?', a: 'ขึ้นกับรุ่นสินค้า โดยทั่วไป Fantech 1-2 ปี และ UGREEN 1-3 ปี (บางรุ่นสูงสุด 5 ปี) ดูรายละเอียดที่หน้าการรับประกัน' },
  { q: 'เปลี่ยน/คืนสินค้าได้ไหม?', a: 'ได้ภายใน 7 วันหากสินค้ามีปัญหาจากการผลิตหรือได้รับไม่ตรงรุ่น โดยสินค้าต้องอยู่ในสภาพสมบูรณ์พร้อมกล่องและอุปกรณ์' },
  { q: 'ออกใบกำกับภาษีได้หรือไม่?', a: 'ออกใบกำกับภาษีเต็มรูปแบบได้ กรุณาระบุข้อมูลบริษัท/บุคคลตอนสั่งซื้อ หรือแจ้งทีมงานภายหลัง' },
  { q: 'ติดตามพัสดุอย่างไร?', a: 'ใช้เลขคำสั่งซื้อที่ได้รับ ตรวจสอบสถานะได้ที่หน้า “ติดตามคำสั่งซื้อ” ตลอด 24 ชม.' },
];

export default function FaqPage() {
  return (
    <div className="container-gv py-14">
      <div className="max-w-2xl">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent"><HelpCircle className="h-6 w-6" /></span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">คำถามที่พบบ่อย</h1>
        <p className="mt-3 text-fg-muted">รวมคำถามยอดฮิต — ถ้าไม่พบคำตอบที่ต้องการ ทักทีมงานได้เลย</p>
      </div>

      <div className="mt-10 max-w-3xl space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-border bg-card p-5 [&_svg]:open:rotate-180">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold">
              {f.q}
              <ChevronDown className="h-5 w-5 shrink-0 text-fg-muted transition-transform" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-6">
        <p className="font-semibold">ยังไม่พบคำตอบ?</p>
        <Link href="/support/contact" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-fg hover:shadow-md">
          ติดต่อทีมงาน
        </Link>
      </div>
    </div>
  );
}
