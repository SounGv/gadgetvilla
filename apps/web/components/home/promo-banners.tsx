'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Server, Gamepad2, Timer } from 'lucide-react';

function useCountdownToMidnight() {
  const [t, setT] = useState({ h: '00', m: '00', s: '00' });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      let diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
      const h = Math.floor(diff / 3600); diff %= 3600;
      const m = Math.floor(diff / 60);
      const s = diff % 60;
      const p = (n: number) => String(n).padStart(2, '0');
      setT({ h: p(h), m: p(m), s: p(s) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function PromoBanners() {
  const t = useCountdownToMidnight();

  return (
    <section className="container-gv grid gap-4 py-10 md:grid-cols-3">
      {/* FANTECH */}
      <Link
        href="/brands/fantech"
        className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-fantech/25 via-card to-card p-6"
      >
        <Gamepad2 className="absolute -right-3 -top-3 h-24 w-24 text-fantech/15" />
        <div>
          <span className="inline-block rounded bg-fantech px-2 py-0.5 text-[11px] font-extrabold text-white">FANTECH</span>
          <h3 className="mt-2 text-xl font-extrabold">เกมมิ่งเกียร์ครบเซ็ต</h3>
          <p className="mt-1 text-sm text-fg-muted">เมาส์ · คีย์บอร์ด · หูฟัง · เก้าอี้เกมมิ่ง</p>
        </div>
        <span className="inline-flex items-center gap-1 font-bold text-fantech">
          ช้อปเลย <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>

      {/* UGREEN */}
      <Link
        href="/brands/ugreen"
        className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent2/25 via-card to-card p-6"
      >
        <Zap className="absolute -right-3 -top-3 h-24 w-24 text-accent2/15" />
        <div>
          <span className="inline-flex items-center gap-1 rounded bg-accent2 px-2 py-0.5 text-[11px] font-extrabold text-white"><Server className="h-3 w-3" /> UGREEN</span>
          <h3 className="mt-2 text-xl font-extrabold">ชาร์จไว GaN · NAS · สายชาร์จ</h3>
          <p className="mt-1 text-sm text-fg-muted">อุปกรณ์ชาร์จและจัดเก็บข้อมูลคุณภาพสูง</p>
        </div>
        <span className="inline-flex items-center gap-1 font-bold text-accent2">
          ช้อปเลย <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>

      {/* FLASH SALE */}
      <Link
        href="/promotion"
        className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/20 via-card to-card p-6"
      >
        <Timer className="absolute -right-3 -top-3 h-24 w-24 text-accent/20" />
        <div>
          <span className="inline-flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-[11px] font-extrabold text-accent-fg"><Zap className="h-3 w-3" /> FLASH SALE</span>
          <h3 className="mt-2 text-xl font-extrabold">ดีลพิเศษวันนี้</h3>
          <div className="mt-2 flex items-center gap-1.5">
            {[t.h, t.m, t.s].map((v, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="tabular rounded-md bg-brand px-2 py-1 text-sm font-extrabold text-brand-fg">{v}</span>
                {i < 2 ? <span className="font-extrabold text-fg-muted">:</span> : null}
              </span>
            ))}
          </div>
        </div>
        <span className="inline-flex items-center gap-1 font-bold text-accent">
          ดูโปรโมชั่น <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </section>
  );
}
