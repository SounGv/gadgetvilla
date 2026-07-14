'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // ส่ง error ไป observability (Sentry-ready)
    console.error(error);
  }, [error]);

  return (
    <div className="container-gv flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-7xl font-extrabold text-accent">500</p>
      <h1 className="text-2xl font-extrabold">เกิดข้อผิดพลาด</h1>
      <p className="text-fg-muted">ขออภัย ระบบมีปัญหาชั่วคราว กรุณาลองใหม่</p>
      <Button variant="accent" size="lg" onClick={reset}>ลองใหม่</Button>
    </div>
  );
}
