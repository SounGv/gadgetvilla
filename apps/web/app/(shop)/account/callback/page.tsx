'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      window.localStorage.setItem('gv_access_token', token);
      setStatus('ok');
      const id = setTimeout(() => router.replace('/'), 900);
      return () => clearTimeout(id);
    }
    setStatus('error');
  }, [params, router]);

  return (
    <div className="container-gv flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      {status === 'loading' ? (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
          <p className="text-fg-muted">กำลังเข้าสู่ระบบ…</p>
        </>
      ) : status === 'ok' ? (
        <>
          <CheckCircle2 className="h-12 w-12 text-accent2" />
          <p className="text-lg font-bold">เข้าสู่ระบบสำเร็จ</p>
          <p className="text-fg-muted">กำลังพาไปหน้าแรก…</p>
        </>
      ) : (
        <>
          <AlertCircle className="h-12 w-12 text-error" />
          <p className="text-lg font-bold">เข้าสู่ระบบไม่สำเร็จ</p>
          <p className="text-fg-muted">ไม่พบ token — กรุณาลองใหม่อีกครั้ง</p>
          <button onClick={() => router.replace('/account')} className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-fg">
            กลับไปหน้าเข้าสู่ระบบ
          </button>
        </>
      )}
    </div>
  );
}

export default function AccountCallbackPage() {
  return (
    <Suspense fallback={<div className="container-gv py-20 text-center text-fg-muted">กำลังโหลด…</div>}>
      <CallbackInner />
    </Suspense>
  );
}
