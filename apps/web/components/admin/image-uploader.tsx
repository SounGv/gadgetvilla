'use client';

import { useRef, useState } from 'react';
import { Upload, Link2, X, Star, ImageIcon, Loader2 } from 'lucide-react';

/**
 * ปรับขนาดรูปอัตโนมัติด้วย canvas:
 *  - ใหญ่เกิน (ด้านยาวสุด > MAX) → ย่อลง
 *  - เล็กเกิน (ด้านยาวสุด < MIN) → ขยายขึ้นแบบพอดี (จำกัดไม่เกิน 2 เท่า กันเบลอ)
 *  - ส่งออกเป็น WebP คุณภาพ 0.85 (คงความโปร่งใส + ไฟล์เล็ก)
 */
const MAX = 1000;
const MIN = 640;

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read error'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('image error'));
      img.onload = () => {
        const longest = Math.max(img.width, img.height) || 1;
        let scale = 1;
        if (longest > MAX) scale = MAX / longest;
        else if (longest < MIN) scale = Math.min(MIN / longest, 2);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('no ctx'));
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        let url = canvas.toDataURL('image/webp', 0.85);
        if (!url.startsWith('data:image/webp')) url = canvas.toDataURL('image/jpeg', 0.85);
        resolve(url);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const addFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setBusy(true);
    try {
      const out: string[] = [];
      for (const f of Array.from(files)) {
        if (!f.type.startsWith('image/')) continue;
        try { out.push(await resizeToDataUrl(f)); } catch { /* ข้ามไฟล์เสีย */ }
      }
      if (out.length) onChange([...images, ...out]);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const addUrl = () => {
    const u = url.trim();
    if (!u) return;
    onChange([...images, u]);
    setUrl('');
  };

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));
  const makeMain = (i: number) => {
    if (i === 0) return;
    const next = [...images];
    const [m] = next.splice(i, 1);
    onChange([m, ...next]);
  };

  return (
    <div>
      <label className="mb-1 block text-[13px] font-semibold text-fg-muted">รูปสินค้า (แนบไฟล์ หรือใส่ URL — รูปแรกเป็นรูปหลัก)</label>

      {images.length ? (
        <div className="mb-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-bg-subtle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-contain p-1" />
              {i === 0 ? (
                <span className="absolute left-1 top-1 rounded bg-accent px-1.5 py-0.5 text-[9px] font-extrabold text-accent-fg">หลัก</span>
              ) : (
                <button type="button" onClick={() => makeMain(i)} title="ตั้งเป็นรูปหลัก" className="absolute left-1 top-1 hidden rounded bg-black/60 p-1 text-white group-hover:block">
                  <Star className="h-3 w-3" />
                </button>
              )}
              <button type="button" onClick={() => remove(i)} title="ลบรูป" className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-3 flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-bg-subtle py-6 text-fg-muted">
          <ImageIcon className="h-7 w-7 opacity-50" />
          <span className="text-[13px]">ยังไม่มีรูป — แนบไฟล์หรือใส่ URL</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-fg hover:shadow-md disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? 'กำลังปรับขนาด…' : 'แนบรูปจากเครื่อง'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />

        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
              placeholder="วาง URL รูป แล้วกด เพิ่ม"
              className="h-10 w-full rounded-md border border-border bg-bg pl-9 pr-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <button type="button" onClick={addUrl} className="rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-bg-subtle">เพิ่ม</button>
        </div>
      </div>
      <p className="mt-1.5 text-[12px] text-fg-muted">แนบได้หลายรูป · ระบบย่อ/ขยายให้พอดีอัตโนมัติ (ด้านยาวสุด ~640-1000px)</p>
    </div>
  );
}
