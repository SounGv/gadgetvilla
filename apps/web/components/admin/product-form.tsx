'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/categories';
import { inputCls, labelCls, brands, slugify } from './shared';
import { ImageUploader } from './image-uploader';
import type { AdminProduct } from './types';

type FormState = {
  name: string; slug: string; brandSlug: string; categorySlug: string;
  price: string; compareAtPrice: string; stock: string; sku: string; barcode: string;
  shortDesc: string; description: string; warranty: string; isFeatured: boolean;
};

function toForm(p?: AdminProduct | null): FormState {
  return {
    name: p?.name ?? '',
    slug: p?.slug ?? '',
    brandSlug: p?.brandSlug ?? 'fantech',
    categorySlug: p?.categorySlug || 'keyboard',
    price: p ? String(p.price) : '',
    compareAtPrice: p?.compareAtPrice ? String(p.compareAtPrice) : '',
    stock: p ? String(p.stock) : '',
    sku: p?.sku ?? '',
    barcode: p?.barcode ?? '',
    shortDesc: p?.shortDesc ?? '',
    description: p?.description ?? '',
    warranty: p?.warranty ?? '',
    isFeatured: p?.isFeatured ?? false,
  };
}

export function ProductForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: AdminProduct | null;
  onSaved: (msg: string) => void;
  onCancel?: () => void;
}) {
  const editing = !!initial?.id;
  const [form, setForm] = useState<FormState>(toForm(initial));
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: keyof FormState, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        brandSlug: form.brandSlug,
        categorySlug: form.categorySlug || undefined,
        price: Number(form.price) || 0,
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        stock: form.stock ? Number(form.stock) : 0,
        sku: form.sku.trim() || undefined,
        barcode: form.barcode.trim() || undefined,
        images: images.map((u) => u.trim()).filter(Boolean),
        shortDesc: form.shortDesc.trim() || undefined,
        description: form.description.trim() || undefined,
        warranty: form.warranty.trim() || undefined,
        isFeatured: form.isFeatured,
      };
      if (editing) {
        await api.patch(`/products/${initial!.id}`, payload);
        onSaved(`อัปเดต "${payload.name}" สำเร็จ`);
      } else {
        await api.post('/products', payload);
        onSaved(`เพิ่มสินค้า "${payload.name}" สำเร็จ`);
        setForm(toForm(null));
        setImages([]);
      }
    } catch (ex: unknown) {
      const e = ex as { response?: { data?: { message?: string } } };
      setErr(e?.response?.data?.message ?? 'บันทึกไม่สำเร็จ (ตรวจสิทธิ์ admin / ข้อมูลซ้ำ)');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      {err ? <p className="mb-4 rounded-md bg-error/10 px-3 py-2 text-sm text-error">{err}</p> : null}
      <div className="space-y-4">
        <div>
          <label className={labelCls}>ชื่อสินค้า *</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} required className={inputCls} placeholder="เช่น FANTECH MAXFIT81 FROST" />
        </div>
        <div>
          <label className={labelCls}>slug (เว้นว่างให้สร้างอัตโนมัติ)</label>
          <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className={inputCls} placeholder="maxfit81-frost" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>แบรนด์ *</label>
            <select value={form.brandSlug} onChange={(e) => set('brandSlug', e.target.value)} className={inputCls}>
              {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>หมวดหมู่</label>
            <select value={form.categorySlug} onChange={(e) => set('categorySlug', e.target.value)} className={inputCls}>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>ราคาขาย (บาท) *</label>
            <input type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} required className={inputCls} placeholder="1790" />
          </div>
          <div>
            <label className={labelCls}>ราคาเดิม</label>
            <input type="number" min="0" value={form.compareAtPrice} onChange={(e) => set('compareAtPrice', e.target.value)} className={inputCls} placeholder="2290" />
          </div>
          <div>
            <label className={labelCls}>สต็อก</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} className={inputCls} placeholder="50" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>SKU</label>
            <input value={form.sku} onChange={(e) => set('sku', e.target.value)} className={inputCls} placeholder="MAXFIT81" />
          </div>
          <div>
            <label className={labelCls}>บาร์โค้ด</label>
            <input value={form.barcode} onChange={(e) => set('barcode', e.target.value)} className={inputCls} placeholder="6957382404256" />
          </div>
        </div>
        <ImageUploader images={images} onChange={setImages} />
        <div>
          <label className={labelCls}>คำอธิบายสั้น</label>
          <input value={form.shortDesc} onChange={(e) => set('shortDesc', e.target.value)} className={inputCls} placeholder="คีย์บอร์ดกลไก 75% hot-swap" />
        </div>
        <div>
          <label className={labelCls}>รายละเอียดสินค้า</label>
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} className={`${inputCls} h-auto py-2`} placeholder="รายละเอียด สเปก จุดเด่นของสินค้า" />
        </div>
        <div>
          <label className={labelCls}>การรับประกัน</label>
          <input value={form.warranty} onChange={(e) => set('warranty', e.target.value)} className={inputCls} placeholder="เช่น ประกันศูนย์ไทย 1 ปี" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="h-4 w-4" />
          แสดงในสินค้าแนะนำ (หน้าแรก)
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="submit" variant="accent" size="lg" className="flex-1 justify-center" disabled={saving}>
          {saving ? 'กำลังบันทึก…' : editing ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" size="lg" onClick={onCancel}>ยกเลิก</Button>
        ) : null}
      </div>
    </form>
  );
}
