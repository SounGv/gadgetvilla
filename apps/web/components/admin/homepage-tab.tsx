'use client';

import { useEffect, useState } from 'react';
import { Save, Image as ImageIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/categories';
import { ImageUploader } from './image-uploader';
import { featuredCategorySlugs } from '@/components/home/category-showcase';

const collectionLabels = ['FANTECH GAMING', 'UGREEN NAS SOLUTION', 'SMART CHARGING'];
const featuredCats = featuredCategorySlugs
  .map((s) => categories.find((c) => c.slug === s))
  .filter(Boolean) as typeof categories;

export function HomepageTab() {
  const [hero, setHero] = useState<string[]>([]);
  const [cats, setCats] = useState<Record<string, string>>({});
  const [cols, setCols] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/settings/home');
        if (data) {
          setHero(data.hero ?? []);
          setCats(data.categories ?? {});
          setCols([data.collections?.[0] ?? '', data.collections?.[1] ?? '', data.collections?.[2] ?? '']);
        }
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await api.put('/settings/home', {
        value: { hero, categories: cats, collections: cols.filter(Boolean).length ? cols : [] },
      });
      setMsg({ type: 'ok', text: 'บันทึกรูปหน้าแรกแล้ว — รีเฟรชหน้าเว็บเพื่อดูผล' });
    } catch (ex: unknown) {
      const e = ex as { response?: { data?: { message?: string } } };
      setMsg({ type: 'err', text: e?.response?.data?.message ?? 'บันทึกไม่สำเร็จ' });
    } finally {
      setSaving(false);
    }
  };

  const setCat = (slug: string, arr: string[]) =>
    setCats((c) => ({ ...c, [slug]: arr[arr.length - 1] ?? '' }));
  const setCol = (i: number, arr: string[]) =>
    setCols((c) => { const n = [...c]; n[i] = arr[arr.length - 1] ?? ''; return n; });

  if (loading) return <p className="py-16 text-center text-fg-muted">กำลังโหลด…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold"><ImageIcon className="h-5 w-5 text-accent2" /> รูปหน้าแรก</h2>
          <p className="text-[13px] text-fg-muted">อัปโหลด/เปลี่ยนรูปที่แสดงบนหน้าแรก — ระบบย่อขนาดอัตโนมัติ</p>
        </div>
        <Button variant="accent" size="md" onClick={save} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? 'กำลังบันทึก…' : 'บันทึก'}
        </Button>
      </div>
      {msg ? <p className={`rounded-md px-4 py-2.5 text-sm ${msg.type === 'ok' ? 'bg-accent2/10 text-accent2' : 'bg-error/10 text-error'}`}>{msg.text}</p> : null}

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-3 font-bold">Hero (แบนเนอร์หลัก) — โชว์สลับได้หลายรูป</h3>
        <ImageUploader images={hero} onChange={setHero} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 font-bold">รูปหมวดหมู่ (Shop by Category)</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCats.map((c) => (
            <div key={c.slug}>
              <p className="mb-1 text-[13px] font-semibold">{c.name}</p>
              <ImageUploader images={cats[c.slug] ? [cats[c.slug]] : []} onChange={(arr) => setCat(c.slug, arr)} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 font-bold">แบนเนอร์ Collections (3 ใบ)</h3>
        <div className="grid gap-5 sm:grid-cols-3">
          {collectionLabels.map((label, i) => (
            <div key={label}>
              <p className="mb-1 text-[13px] font-semibold">{label}</p>
              <ImageUploader images={cols[i] ? [cols[i]] : []} onChange={(arr) => setCol(i, arr)} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="accent" size="lg" onClick={save} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? 'กำลังบันทึก…' : 'บันทึกรูปหน้าแรก'}
        </Button>
      </div>
    </div>
  );
}
