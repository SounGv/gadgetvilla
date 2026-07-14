'use client';

import Link from 'next/link';
import { ArrowRight, Gamepad2, Server, Zap } from 'lucide-react';
import { useHomeSettings } from '@/lib/home-settings';

const collections = [
  { title: 'FANTECH GAMING', sub: 'Gear For Every Victory', href: '/brands/fantech', icon: Gamepad2, className: 'from-fantech/30 via-[#1a0508] to-black', accent: 'text-fantech' },
  { title: 'UGREEN NAS SOLUTION', sub: 'จัดเก็บ เชื่อมต่อ ปลอดภัย สำหรับทุกคนในองค์กร', href: '/products?category=nas', icon: Server, className: 'from-accent2/30 via-[#04140b] to-black', accent: 'text-accent2' },
  { title: 'SMART CHARGING', sub: 'ชาร์จเร็ว ปลอดภัย ด้วยเทคโนโลยี GaN', href: '/products?category=gan-charger', icon: Zap, className: 'from-accent2/25 via-[#06130d] to-black', accent: 'text-accent2' },
];

export function Collections() {
  const home = useHomeSettings();
  return (
    <section className="bg-bg">
      <div className="container-gv py-4 pb-12">
        <h2 className="mb-6 text-xl font-extrabold sm:text-2xl">EXPLORE OUR COLLECTIONS</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {collections.map((c, i) => {
            const img = home.collections?.[i];
            return (
              <Link
                key={c.title}
                href={c.href}
                className={`group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${c.className} p-7 text-white transition-all hover:-translate-y-1 hover:shadow-2xl`}
              >
                {img ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={c.title} className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                  </>
                ) : (
                  <c.icon className={`absolute right-5 top-5 h-16 w-16 opacity-20 ${c.accent}`} />
                )}
                <div className="relative">
                  <h3 className="text-2xl font-extrabold">{c.title}</h3>
                  <p className="mt-1.5 max-w-[85%] text-sm text-white/70">{c.sub}</p>
                  <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur transition-colors group-hover:bg-accent2 group-hover:text-white">
                    SHOP NOW <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
