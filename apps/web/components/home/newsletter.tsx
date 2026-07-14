'use client';

import { useState } from 'react';
import { Send, CheckCircle2, Mail } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // เปิดอีเมลสมัครรับข่าวถึงร้าน (ทำงานได้จริงโดยไม่ต้องมี backend)
    window.location.href = `mailto:support@gadgetvilla.co.th?subject=${encodeURIComponent('สมัครรับข่าวสาร GADGET VILLA')}&body=${encodeURIComponent(`สมัครรับข่าวสารด้วยอีเมล: ${email}`)}`;
    setDone(true);
  };

  return (
    <section className="bg-gradient-to-br from-[#07130c] via-[#0a1a10] to-[#05100a] text-white">
      <div className="container-gv grid items-center gap-6 py-12 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">GET THE LATEST DEALS &amp; NEWS</h2>
          <p className="mt-2 text-white/70">อัปเดตโปรโมชั่น สินค้าใหม่ และบทความเทคโนโลยีก่อนใคร</p>
        </div>
        <form onSubmit={submit} className="flex w-full gap-2">
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="กรอกอีเมลของคุณ"
              className="h-12 w-full rounded-full border border-white/15 bg-white/5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-accent2"
            />
          </div>
          <button type="submit" className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-accent2 px-6 text-sm font-bold text-white hover:bg-accent2/90">
            {done ? <><CheckCircle2 className="h-4 w-4" /> สมัครแล้ว</> : <><Send className="h-4 w-4" /> SUBSCRIBE</>}
          </button>
        </form>
      </div>
    </section>
  );
}
