'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShieldCheck, Truck, Store, Gamepad2, Server, Zap, Headphones, Keyboard, Mouse } from 'lucide-react';

import { api } from '@/lib/api';
import { useHomeSettings } from '@/lib/home-settings';

interface HeroProduct { slug: string; name: string; imageUrl?: string; }

async function fetchHero(): Promise<HeroProduct[]> {
  const { data } = await api.get('/products', { params: { featured: true, limit: 10 } });
  let items: HeroProduct[] = data.items ?? data ?? [];
  if (!items.length) {
    const res = await api.get('/products', { params: { sort: 'new', limit: 10 } });
    items = res.data.items ?? res.data ?? [];
  }
  return items.filter((p) => p.imageUrl).slice(0, 5);
}

const badges = [
  { icon: ShieldCheck, label: '100% AUTHENTIC', sub: 'สินค้าแท้ ประกันศูนย์ไทย' },
  { icon: Truck, label: '1-3 DAYS DELIVERY', sub: 'จัดส่งเร็วทั่วประเทศ' },
  { icon: Store, label: 'OFFICIAL STORE', sub: 'ตัวแทนจำหน่ายอย่างเป็นทางการ' },
];

const fallbackIcons = [Gamepad2, Keyboard, Mouse, Server, Zap, Headphones];

export function Hero() {
  const { data } = useQuery({ queryKey: ['hero-products'], queryFn: fetchHero });
  const home = useHomeSettings();
  const [active, setActive] = useState(0);
  // ลำดับความสำคัญของรูปโชว์: รูปที่แอดมินอัปโหลด > รูปสินค้าจริง > ไอคอน
  const products: HeroProduct[] =
    home.hero && home.hero.length
      ? home.hero.map((url, i) => ({ slug: '', name: `ภาพที่ ${i + 1}`, imageUrl: url }))
      : data ?? [];
  const hasImgs = products.length > 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#07130c] via-[#0a1a10] to-[#05100a] text-white">
      {/* green ring + glows */}
      <div className="pointer-events-none absolute right-[8%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-accent2/20" />
      <div className="pointer-events-none absolute right-[12%] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-accent2/20 blur-[130px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-[120px]" />

      <div className="container-gv relative grid items-center gap-8 py-12 lg:grid-cols-[1fr_1.15fr] lg:py-16">
        {/* LEFT */}
        <div>
          <h1 className="text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
            LEVEL UP
            <br />
            <span className="text-accent2">YOUR LIFESTYLE</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-white/70 sm:text-lg">
            Gaming Gear จาก <b className="font-semibold text-white">FANTECH</b>
            <br className="hidden sm:block" /> และ Smart Tech จาก <b className="font-semibold text-accent2">UGREEN</b>
          </p>
          <Link href="/products" className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent2 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent2/20 transition-all hover:-translate-y-0.5 hover:bg-accent2/90">
            SHOP NOW <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {badges.map((b) => (
              <div key={b.label} className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-accent2"><b.icon className="h-4 w-4" /></span>
                <div className="leading-tight">
                  <div className="text-[12px] font-extrabold tracking-wide">{b.label}</div>
                  <div className="text-[11px] text-white/50">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {products.length > 1 ? (
            <div className="mt-8 flex gap-2">
              {products.map((_, i) => (
                <button key={i} aria-label={`สไลด์ ${i + 1}`} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all ${i === active ? 'w-8 bg-accent2' : 'w-4 bg-white/25'}`} />
              ))}
            </div>
          ) : null}
        </div>

        {/* RIGHT — product showcase */}
        <div className="relative min-h-[280px]">
          {hasImgs ? (
            <div className="relative flex h-full items-center justify-center">
              <Link href={products[active].slug ? `/products/${products[active].slug}` : '/products'} className="group relative z-10 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={products[active].imageUrl} alt={products[active].name} className="max-h-[320px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105" />
              </Link>
              <div className="absolute inset-x-8 bottom-6 z-0 h-10 rounded-[50%] bg-accent2/25 blur-2xl" />
              {products.length > 1 ? (
                <div className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                  {products.slice(0, 5).map((p, i) => (
                    <button key={p.slug} onClick={() => setActive(i)} className={`grid h-14 w-14 place-items-center overflow-hidden rounded-xl border bg-white/5 p-1.5 backdrop-blur transition-colors ${i === active ? 'border-accent2' : 'border-white/15 hover:border-white/40'}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imageUrl} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {fallbackIcons.map((Icon, i) => (
                <div key={i} className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/5"><Icon className="h-9 w-9 text-white/40" /></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
