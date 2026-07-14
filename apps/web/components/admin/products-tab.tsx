'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Package, Pencil, Search, X } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { formatTHB } from '@/lib/utils';
import { ImportBox } from './import-box';
import { ProductForm } from './product-form';
import type { AdminProduct } from './types';

const PAGE = 50;

export function ProductsTab() {
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products/admin/list', { params: { q: query, limit: PAGE, offset } });
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [query, offset]);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: string) => {
    if (!confirm('ลบสินค้านี้?')) return;
    try {
      await api.delete(`/products/${id}`);
      setMsg({ type: 'ok', text: 'ลบสินค้าแล้ว' });
      load();
    } catch (ex: unknown) {
      const e = ex as { response?: { data?: { message?: string } } };
      setMsg({ type: 'err', text: e?.response?.data?.message ?? 'ลบไม่สำเร็จ' });
    }
  };

  const onSaved = (text: string) => {
    setMsg({ type: 'ok', text });
    setEditing(null);
    setAdding(false);
    load();
  };

  const doSearch = (e: React.FormEvent) => { e.preventDefault(); setOffset(0); setQuery(q); };
  const pageStart = total === 0 ? 0 : offset + 1;
  const pageEnd = Math.min(offset + PAGE, total);

  return (
    <div className="space-y-6">
      <ImportBox onDone={load} />

      {msg ? (
        <p className={`rounded-md px-4 py-2.5 text-sm ${msg.type === 'ok' ? 'bg-accent2/10 text-accent2' : 'bg-error/10 text-error'}`}>{msg.text}</p>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Package className="h-5 w-5 text-accent" /> สินค้าในระบบ ({total})
          </h2>
          <Button type="button" variant="accent" size="md" onClick={() => { setAdding(true); setEditing(null); }}>
            <Plus className="h-4 w-4" /> เพิ่มสินค้า
          </Button>
        </div>

        <form onSubmit={doSearch} className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ค้นหาชื่อสินค้า / SKU / slug"
              className="h-10 w-full rounded-md border border-border bg-bg pl-9 pr-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <Button type="submit" variant="ghost" size="md">ค้นหา</Button>
        </form>

        {loading ? (
          <p className="py-10 text-center text-fg-muted">กำลังโหลด…</p>
        ) : items.length === 0 ? (
          <p className="py-10 text-center text-fg-muted">ไม่พบสินค้า</p>
        ) : (
          <>
            <ul className="divide-y divide-border">
              {items.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-bg-subtle">
                    {p.imageUrl ? <img src={p.imageUrl} alt="" className="h-full w-full object-contain" /> : <Package className="h-5 w-5 text-fg-muted" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold">{p.name}</p>
                    <p className="text-[12.5px] text-fg-muted">
                      <span className={p.brandSlug === 'fantech' ? 'text-fantech' : 'text-accent2'}>{p.brandName}</span>
                      {' · '}{p.categoryName || '—'}{' · '}{formatTHB(p.price)}
                    </p>
                  </div>
                  <span className={`hidden shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold sm:inline ${p.stock > 0 ? 'bg-accent2/10 text-accent2' : 'bg-error/10 text-error'}`}>
                    สต็อก {p.stock}
                  </span>
                  <button type="button" onClick={() => { setEditing(p); setAdding(false); }} aria-label="แก้ไข" className="grid h-9 w-9 place-items-center rounded-md text-fg-muted hover:bg-accent/10 hover:text-accent">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => remove(p.id)} aria-label="ลบ" className="grid h-9 w-9 place-items-center rounded-md text-fg-muted hover:bg-error/10 hover:text-error">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between text-sm text-fg-muted">
              <span>แสดง {pageStart}–{pageEnd} จาก {total}</span>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>ก่อนหน้า</Button>
                <Button type="button" variant="ghost" size="sm" disabled={pageEnd >= total} onClick={() => setOffset(offset + PAGE)}>ถัดไป</Button>
              </div>
            </div>
          </>
        )}
      </div>

      {(adding || editing) ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/50 p-4 backdrop-blur-sm" onClick={() => { setAdding(false); setEditing(null); }}>
          <div className="my-8 w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editing ? `แก้ไข: ${editing.name}` : 'เพิ่มสินค้าใหม่'}</h3>
              <button type="button" onClick={() => { setAdding(false); setEditing(null); }} className="grid h-8 w-8 place-items-center rounded-md text-fg-muted hover:bg-bg-subtle">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ProductForm initial={editing} onSaved={onSaved} onCancel={() => { setAdding(false); setEditing(null); }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
