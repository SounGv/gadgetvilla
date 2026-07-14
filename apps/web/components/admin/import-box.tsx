'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/categories';
import { inputCls, labelCls } from './shared';

type ImpState = {
  running: boolean;
  done: number;
  total: number;
  result?: { read: number; created: number; updated: number; skipped: number };
};

export function ImportBox({ onDone }: { onDone: () => void }) {
  const [markup, setMarkup] = useState('40');
  const [imp, setImp] = useState<ImpState>({ running: false, done: 0, total: 0 });
  const [err, setErr] = useState('');

  const downloadTemplate = () => {
    const headers = ['ชื่อสินค้า', 'แบรนด์', 'หมวดหมู่ (slug)', 'ราคาขาย', 'ราคาเดิม', 'สต็อก', 'SKU', 'บาร์โค้ด', 'URL รูป'];
    const example = [
      ['FANTECH MAXFIT81 FROST', 'fantech', 'keyboard', 1790, 2290, 50, 'MAXFIT81', '', ''],
      ['UGREEN Nexode 65W GaN', 'ugreen', 'gan-charger', 890, 990, 30, 'NEXODE65', '', ''],
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, ...example]);
    const catWs = XLSX.utils.aoa_to_sheet([
      ['slug (ใส่ในคอลัมน์หมวดหมู่)', 'ชื่อหมวด', 'แบรนด์'],
      ...categories.map((c) => [c.slug, c.name, c.brand]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'สินค้า');
    XLSX.utils.book_append_sheet(wb, catWs, 'หมวดหมู่ที่ใช้ได้');
    XLSX.writeFile(wb, 'gadgetvilla-product-template.xlsx');
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr('');
    setImp({ running: true, done: 0, total: 0 });
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      // BigSeller export บางไฟล์มี !ref เพี้ยน (A1) — คำนวณช่วงข้อมูลจริงใหม่จากทุกเซลล์
      const addrs = Object.keys(ws).filter((k) => k[0] !== '!');
      if (addrs.length) {
        const rg = { s: { r: Infinity, c: Infinity }, e: { r: -1, c: -1 } };
        for (const a of addrs) {
          const cell = XLSX.utils.decode_cell(a);
          rg.s.r = Math.min(rg.s.r, cell.r);
          rg.s.c = Math.min(rg.s.c, cell.c);
          rg.e.r = Math.max(rg.e.r, cell.r);
          rg.e.c = Math.max(rg.e.c, cell.c);
        }
        ws['!ref'] = XLSX.utils.encode_range(rg as never);
      }
      const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as unknown[][];
      const headers = ((grid[0] as unknown[]) || []).map((h) => String(h).trim());
      const idx = (label: string) => headers.indexOf(label);
      let rows: Record<string, unknown>[] = [];
      if (idx('ชื่อสินค้า') >= 0) {
        const iName = idx('ชื่อสินค้า'), iBrand = idx('แบรนด์');
        const iCat = idx('หมวดหมู่ (slug)') >= 0 ? idx('หมวดหมู่ (slug)') : idx('หมวดหมู่');
        const iPrice = idx('ราคาขาย'), iCmp = idx('ราคาเดิม'), iStock = idx('สต็อก');
        const iSku = idx('SKU'), iBar = idx('บาร์โค้ด'), iImg = idx('URL รูป');
        rows = grid.slice(1).filter((r) => r[iName]).map((r) => ({
          name: r[iName], brand: iBrand >= 0 ? r[iBrand] : '', category: iCat >= 0 ? r[iCat] : '',
          price: iPrice >= 0 ? r[iPrice] : 0, compareAtPrice: iCmp >= 0 ? r[iCmp] : 0,
          stock: iStock >= 0 ? r[iStock] : 0, sku: iSku >= 0 ? r[iSku] : '',
          barcode: iBar >= 0 ? r[iBar] : '', image: iImg >= 0 ? r[iImg] : '',
        }));
      } else if (idx('เลข SKU') >= 0) {
        const iSku = idx('เลข SKU'), iName = idx('ชื่อ SKU'), iCat = idx('หมวดหมู่');
        const iCost = idx('อ้างอิงราคาต้นทุน'), iStock = idx('สต็อกที่มีอยู่ทั้งหมด');
        const iImg = idx('Image URL'), iBar = idx('GTIN');
        rows = grid.slice(1).filter((r) => r[iSku]).map((r) => ({
          sku: r[iSku], name: r[iName], category: iCat >= 0 ? r[iCat] : '',
          cost: iCost >= 0 ? r[iCost] : 0, stock: iStock >= 0 ? r[iStock] : 0,
          image: iImg >= 0 ? r[iImg] : '', barcode: iBar >= 0 ? r[iBar] : '',
        }));
      } else {
        setErr(`ไฟล์ไม่ตรงรูปแบบ — คอลัมน์ที่เจอ: ${headers.slice(0, 6).join(', ') || '(ว่าง)'} … ใช้เทมเพลตของเรา หรือไฟล์ SKU_Merchant จาก BigSeller`);
        setImp({ running: false, done: 0, total: 0 });
        return;
      }
      if (rows.length === 0) {
        setErr('อ่านไฟล์แล้วไม่พบรายการสินค้า (0 แถว) — ตรวจว่าไฟล์มีข้อมูลและอยู่ชีตแรก');
        setImp({ running: false, done: 0, total: 0 });
        return;
      }
      const chunk = 150;
      let created = 0, updated = 0, skipped = 0;
      setImp({ running: true, done: 0, total: rows.length });
      for (let i = 0; i < rows.length; i += chunk) {
        const { data } = await api.post(
          '/products/import',
          { markup: Number(markup) || 40, rows: rows.slice(i, i + chunk) },
          { timeout: 120000 },
        );
        created += data.created || 0;
        updated += data.updated || 0;
        skipped += data.skipped || 0;
        setImp({ running: true, done: Math.min(i + chunk, rows.length), total: rows.length });
      }
      setImp({ running: false, done: rows.length, total: rows.length, result: { read: rows.length, created, updated, skipped } });
      onDone();
    } catch (ex: unknown) {
      const e2 = ex as { response?: { data?: { message?: string } } };
      setErr(e2?.response?.data?.message ?? 'นำเข้าไม่สำเร็จ');
      setImp({ running: false, done: 0, total: 0 });
    } finally {
      e.target.value = '';
    }
  };

  const r = imp.result;
  const ok = r && r.created + r.updated > 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold">
        <Upload className="h-5 w-5 text-accent" /> นำเข้าสินค้าจาก BigSeller (Excel)
      </h2>
      <p className="mb-4 text-[13px] text-fg-muted">
        ใช้ไฟล์ SKU_Merchant (.xlsx) — ระบบนำเข้าเฉพาะ Fantech/UGREEN + หมวดที่ขาย และคิดราคาขายจากทุน
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className={labelCls}>บวกกำไรจากทุน (%)</label>
          <input type="number" min="0" value={markup} onChange={(e) => setMarkup(e.target.value)} className={`${inputCls} w-32`} />
        </div>
        <Button type="button" variant="ghost" size="md" onClick={downloadTemplate}>
          <Download className="h-4 w-4" /> ดาวน์โหลดเทมเพลต
        </Button>
        <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-fg ${imp.running ? 'pointer-events-none opacity-50' : ''}`}>
          <Upload className="h-4 w-4" /> เลือกไฟล์ Excel
          <input type="file" accept=".xlsx,.xls" className="hidden" onChange={onFile} disabled={imp.running} />
        </label>
      </div>
      {err ? <p className="mt-3 rounded-md bg-error/10 px-3 py-2 text-sm text-error">{err}</p> : null}
      {imp.running ? <p className="mt-3 text-sm text-fg-muted">กำลังนำเข้า… {imp.done}/{imp.total} แถว</p> : null}
      {r ? (
        <div className={`mt-3 rounded-md px-4 py-3 text-sm ${ok ? 'bg-accent2/10 text-accent2' : 'bg-amber-500/10 text-amber-500'}`}>
          <p className="font-bold">{ok ? '✅ นำเข้าสำเร็จ' : '⚠️ ไม่มีสินค้าใหม่ถูกเพิ่ม'}</p>
          <p className="mt-0.5">
            อ่านจากไฟล์ได้ <b>{r.read}</b> แถว · เพิ่มใหม่ <b>{r.created}</b> · อัปเดต <b>{r.updated}</b> · ข้าม <b>{r.skipped}</b>
          </p>
          {r.read <= 3 ? (
            <p className="mt-1 text-fg-muted">อ่านได้แค่ {r.read} แถว — อาจอัปไฟล์เทมเพลตตัวอย่าง ลองอัปไฟล์ SKU_Merchant ตัวเต็มจาก BigSeller</p>
          ) : r.skipped > 0 ? (
            <p className="mt-1 text-fg-muted">ที่ข้าม {r.skipped} รายการ = ไม่ใช่ Fantech/UGREEN หรือไม่มีหมวด/ราคาตามเงื่อนไข</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
