import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container-gv flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-7xl font-extrabold text-accent">404</p>
      <h1 className="text-2xl font-extrabold">ไม่พบหน้าที่คุณค้นหา</h1>
      <p className="text-fg-muted">หน้านี้อาจถูกย้ายหรือลบไปแล้ว</p>
      <Link href="/"><Button variant="accent" size="lg">กลับหน้าแรก</Button></Link>
    </div>
  );
}
