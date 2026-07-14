import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'นโยบายความเป็นส่วนตัว' };

export default function PrivacyPage() {
  return (
    <div className="container-gv max-w-3xl py-16">
      <h1 className="text-3xl font-extrabold">นโยบายความเป็นส่วนตัว</h1>
      <div className="mt-6 space-y-4 text-fg-muted">
        <p>GADGET VILLA ให้ความสำคัญกับความเป็นส่วนตัวของลูกค้า เราเก็บรวบรวมข้อมูลเท่าที่จำเป็นสำหรับการสั่งซื้อ จัดส่ง และบริการหลังการขายเท่านั้น</p>
        <p>ข้อมูลที่เก็บ ได้แก่ ชื่อ ที่อยู่ เบอร์โทร อีเมล และประวัติการสั่งซื้อ โดยจะไม่เปิดเผยต่อบุคคลภายนอกยกเว้นผู้ให้บริการขนส่งและชำระเงินที่เกี่ยวข้องกับคำสั่งซื้อของคุณ</p>
        <p>คุณมีสิทธิ์ขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลได้ตลอดเวลา ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</p>
        <p>ติดต่อเรื่องข้อมูลส่วนบุคคล: support@gadgetvilla.co.th</p>
      </div>
    </div>
  );
}
