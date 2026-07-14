'use client';

import { useCallback, useEffect, useState } from 'react';
import { Boxes, Search, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import type { AdminProduct } from './types';

export function StockTab() {
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products/admin/list', { params: { q: query, limit: 200 } });
      const list: AdminProduct[] = (data.items ?? []).slice().sort((a: AdminProduct, b: AdminProduct) => a.stock - b.stock);
      setItems(list);
      setDraft(Object.fromEntries(list.map((p) => [p.id, String(p.stock)])));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { load(); }, [load]);

  const save = async (p: AdminProduct) => {
    const val = Number(draft[p.id]);
    if (Number.isNaN(val) || val === p.stock) return;
    setSavingId(p.id);
    try {
      await api.patch(`/products/${p.id}/stock`, { stock: val });
      setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, stock: val } : x)));
      setSavedId(p.id);
      setTimeout(() => setSavedId((s) => (s === p.id ? null : s)), 1500);
    } finally {
      setSavingId(null);
    }
  };

  const doSearch = (e: React.FormEvent) => { e.preventDefault(); setQuery(q); };

  return (
    <div className="space-y-4">
      <form onSubmit={doSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาสินค้าเพื่อปรับสต็อก" className="h-10 w-full rounded-md border border-border bg-bg pl-9 pr-3 text-sm outline-none focus:border-accent" />
        </div>
        <Button type="submit" variant="ghost" size="md">ค้นหา</Button>
      </form>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-bold"><Boxes className="h-5 w-5 text-accent" /> จัดการสต็อก</h2>
        <p className="mb-4 text-[13px] text-fg-muted">เรียงจากสต็อกน้อยไปมาก — แก้ตัวเลขแล้วกดบันทึกทีละรายการ</p>
        {loading ? (
          <p className="py-10 text-center text-fg-muted">กำลังโหลด…</p>
        ) : items.length === 0 ? (
          <p className="py-10 text-center text-fg-muted">ไม่พบสินค้า</p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((p) => {
              const changed = draft[p.id] !== undefined && Number(draft[p.id]) !== p.stock;
              return (
                <li key={p.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold">{p.name}</p>
                    <p className="text-[12px] text-fg-muted">{p.sku || p.slug}</p>
                  </div>
                  <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold ${p.stock > 5 ? 'bg-accent2/10 text-accent2' : p.stock > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-error/10 text-error'}`}>
                    {p.stock > 5 ? 'พร้อมส่ง' : p.stock > 0 ? 'ใกล้หมด' : 'หมด'}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={draft[p.id] ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                    className="h-9 w-20 rounded-md border border-border bg-bg px-2 text-center text-sm outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => save(p)}
                    disabled={!changed || savingId === p.id}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${savedId === p.id ? 'bg-accent2/20 text-accent2' : changed ? 'bg-accent text-accent-fg' : 'text-fg-muted opacity-40'}`}
                    aria-label="บันทึกสต็อก"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
