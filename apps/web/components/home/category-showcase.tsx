'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/lib/categories';
import { useHomeSettings } from '@/lib/home-settings';

export const featuredCategorySlugs = [
  'gaming-chair', 'keyboard', 'mouse', 'headset', 'nas', 'gan-charger',
  'powerbank', 'dock', 'usb-cable', 'webcam', 'controller',
];

const featured = featuredCategorySlugs
  .map((s) => categories.find((c) => c.slug === s))
  .filter(Boolean) as typeof categories;

export function CategoryShowcase() {
  const home = useHomeSettings();
  return (
    <section className="bg-bg">
      <div className="container-gv py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-extrabold sm:text-2xl">SHOP BY CATEGORY</h2>
          <Link href="/products" className="inline-flex items-center gap-1 text-sm font-bold text-accent2 hover:opacity-80">
            View All Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11">
          {featured.map((c) => {
            const img = home.categories?.[c.slug];
            return (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-3 text-center transition-all hover:-translate-y-1 hover:border-accent2/50 hover:shadow-lg"
              >
                <span className="grid aspect-square w-full place-items-center overflow-hidden rounded-xl bg-bg-subtle transition-colors group-hover:bg-accent2/10">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={c.name} className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <c.icon className={`h-8 w-8 ${c.brand === 'fantech' ? 'text-fantech' : 'text-accent2'}`} />
                  )}
                </span>
                <span className="text-[12px] font-semibold leading-tight">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
