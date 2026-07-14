import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'เงื่อนไขการใช้งาน' };

export default function TermsPage() {
  return (
    <div className="container-gv max-w-3xl py-16">
      <h1 className="text-3xl font-extrabold">เงื่อนไขการใช้งาน</h1>
      <div className="mt-6 space-y-4 text-fg-muted">
        <p>การใช้งานเว็บไซต์ GADGET VILLA ถือว่าคุณยอมรับเงื่อนไขการใช้งานทั้งหมด</p>
        <p>ราคาสินค้าและโปรโมชั่นอาจเปลี่ยนแปลงได้โดยไม่ต้องแจ้งล่วงหน้า สินค้าทุกชิ้นเป็นของแท้และมีการรับประกันตามเงื่อนไขของผู้ผลิต</p>
        <p>การสั่งซื้อจะสมบูรณ์เมื่อได้รับการยืนยันการชำระเงิน บริษัทขอสงวนสิทธิ์ในการยกเลิกคำสั่งซื้อที่มีข้อผิดพลาดด้านราคาหรือสต็อก</p>
        <p>การเปลี่ยน/คืนสินค้าเป็นไปตามนโยบายที่ระบุในหน้าบริการลูกค้า</p>
      </div>
    </div>
  );
}
