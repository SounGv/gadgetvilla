'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Search, User, ShoppingCart, Menu, Sun, Moon, X, Heart, ChevronDown, GitCompare, LayoutGrid,
} from 'lucide-react';
import { useCart } from '@/store/cart';
import { categories, fantechCategories, ugreenCategories } from '@/lib/categories';

const nav: { href: string; label: string; color?: string; caret?: boolean }[] = [
  { href: '/brands/fantech', label: 'FANTECH', color: 'text-fantech', caret: true },
  { href: '/brands/ugreen', label: 'UGREEN', color: 'text-accent2', caret: true },
  { href: '/products?category=gaming-chair', label: 'Gaming' },
  { href: '/products?category=nas', label: 'NAS & Storage', caret: true },
  { href: '/products?category=gan-charger', label: 'Charging', caret: true },
  { href: '/products?category=usb-hub', label: 'Connectivity' },
  { href: '/products?category=streaming', label: 'Streaming', caret: true },
  { href: '/promotion', label: 'Deals', caret: true },
  { href: '/blog', label: 'Blog' },
];

const actionBtn = 'flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-fg-muted transition-colors hover:text-fg';

export function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [mounted, setMounted] = useState(false);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => setMounted(true), []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/products?q=${encodeURIComponent(query)}` : '/products');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-bg/90 shadow-sm backdrop-blur-xl">
      {/* ROW 1 */}
      <div className="container-gv flex h-16 items-center gap-3 lg:gap-5">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-lg font-extrabold italic text-accent-fg">GV</span>
          <span className="leading-none">
            <span className="block text-lg font-extrabold tracking-tight">GADGET VILLA</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-muted sm:block">Tech Lifestyle Store</span>
          </span>
        </Link>

        {/* Categories button + mega menu */}
        <div className="group relative hidden lg:block">
          <button type="button" className="flex h-11 items-center gap-2 rounded-lg bg-accent2 px-4 text-sm font-bold text-white transition-colors hover:bg-accent2/90">
            <LayoutGrid className="h-4 w-4" /> Categories <ChevronDown className="h-4 w-4" />
          </button>
          <div className="invisible absolute left-0 top-full z-[60] w-[720px] translate-y-1 rounded-2xl border border-border bg-card p-5 opacity-0 shadow-2xl ring-1 ring-black/5 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="mb-3 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-fantech">FANTECH · Gaming</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {fantechCategories.map((c) => (
                    <Link key={c.slug} href={`/products?category=${c.slug}`} className="flex items-center gap-2 text-[13.5px] font-medium text-fg-muted hover:text-accent2">
                      <c.icon className="h-4 w-4" /> {c.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-accent2">UGREEN · Tech</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {ugreenCategories.map((c) => (
                    <Link key={c.slug} href={`/products?category=${c.slug}`} className="flex items-center gap-2 text-[13.5px] font-medium text-fg-muted hover:text-accent2">
                      <c.icon className="h-4 w-4" /> {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/products" className="mt-4 block border-t border-border pt-3 text-[13.5px] font-bold text-fg hover:text-accent2">ดูสินค้าทั้งหมด →</Link>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={submitSearch} className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาสินค้า, SKU, Barcode, แบรนด์..."
            aria-label="ค้นหาสินค้า"
            className="h-11 w-full rounded-full border border-border bg-bg-subtle pl-11 pr-28 text-sm outline-none transition-colors placeholder:text-fg-muted focus:border-accent2 focus:ring-2 focus:ring-accent2/20"
          />
          <button type="submit" className="absolute right-1.5 top-1/2 flex h-8 -translate-y-1/2 items-center gap-1.5 rounded-full bg-accent2 px-4 text-sm font-bold text-white hover:bg-accent2/90">
            <Search className="h-4 w-4" /> <span className="hidden lg:inline">ค้นหา</span>
          </button>
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-0.5">
          <button type="button" aria-label="สลับธีม" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="grid h-10 w-10 place-items-center rounded-md text-fg-muted hover:text-fg">
            <Sun className="hidden h-5 w-5 dark:block" />
            <Moon className="h-5 w-5 dark:hidden" />
          </button>
          <Link href="/compare" aria-label="เปรียบเทียบ" className={`hidden sm:flex ${actionBtn}`}>
            <GitCompare className="h-5 w-5" /><span className="text-[10px] font-semibold">Compare</span>
          </Link>
          <Link href="/wishlist" aria-label="รายการโปรด" className={`hidden sm:flex ${actionBtn}`}>
            <Heart className="h-5 w-5" /><span className="text-[10px] font-semibold">Wishlist</span>
          </Link>
          <Link href="/cart" aria-label="ตะกร้าสินค้า" className={`relative flex ${actionBtn}`}>
            <ShoppingCart className="h-5 w-5" /><span className="text-[10px] font-semibold">Cart</span>
            {mounted && count > 0 ? (
              <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-accent2 px-1 text-[10px] font-extrabold text-white">{count}</span>
            ) : null}
          </Link>
          <Link href="/account" aria-label="บัญชี" className={`hidden sm:flex ${actionBtn}`}>
            <User className="h-5 w-5" /><span className="text-[10px] font-semibold">Account</span>
          </Link>
          <button type="button" aria-label="เมนู" onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-md text-fg-muted lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ROW 2 — dark nav */}
      <div className="hidden bg-brand text-brand-fg lg:block">
        <nav className="container-gv flex h-11 items-center gap-6 text-[13.5px] font-semibold">
          {nav.map((n) => (
            <Link key={n.label} href={n.href} className={`flex h-full items-center gap-1 border-b-2 border-transparent transition-colors hover:border-accent2 hover:text-white ${n.color ?? 'text-brand-fg/85'}`}>
              {n.label}{n.caret ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : null}
            </Link>
          ))}
        </nav>
      </div>

      {/* MOBILE menu */}
      {open ? (
        <div className="border-t border-border bg-bg lg:hidden">
          <div className="container-gv flex flex-col gap-1 py-3">
            <form onSubmit={submitSearch} className="relative mb-2">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาสินค้า..." aria-label="ค้นหาสินค้า" className="h-11 w-full rounded-full border border-border bg-bg-subtle pl-10 pr-4 text-sm outline-none focus:border-accent2" />
            </form>
            {nav.map((n) => (
              <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className={`py-2.5 font-semibold hover:text-fg ${n.color ?? 'text-fg-muted'}`}>{n.label}</Link>
            ))}
            <p className="mt-2 pt-2 text-xs font-extrabold uppercase tracking-widest text-fg-muted">หมวดหมู่</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pb-1">
              {categories.map((c) => (
                <Link key={c.slug} href={`/products?category=${c.slug}`} onClick={() => setOpen(false)} className="py-1.5 text-[13.5px] text-fg-muted hover:text-accent2">{c.name}</Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
