'use client';

import { useCallback, useEffect, useState } from 'react';
import { Receipt, X, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { formatTHB } from '@/lib/utils';
import { orderStatusMeta, orderStatuses } from './shared';
import type { AdminOrderRow, AdminOrderDetail, OrderStatus } from './types';

function StatusBadge({ status }: { status: OrderStatus }) {
  const m = orderStatusMeta[status];
  return <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${m.cls}`}>{m.label}</span>;
}

export function OrdersTab() {
  const [rows, setRows] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | ''>('');
  const [detail, setDetail] = useState<AdminOrderDetail | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/orders', { params: filter ? { status: filter } : {} });
      setRows(data ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const openDetail = async (orderNo: string) => {
    try {
      const { data } = await api.get(`/admin/orders/${orderNo}`);
      setDetail(data);
    } catch { /* ignore */ }
  };

  const changeStatus = async (orderNo: string, status: OrderStatus) => {
    setBusy(true);
    try {
      await api.patch(`/admin/orders/${orderNo}/status`, { status });
      setDetail((d) => (d ? { ...d, status } : d));
      load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('')} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${filter === '' ? 'bg-accent text-accent-fg' : 'border border-border text-fg-muted'}`}>ทั้งหมด</button>
        {orderStatuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${filter === s ? 'bg-accent text-accent-fg' : 'border border-border text-fg-muted'}`}>
            {orderStatusMeta[s].label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-2 sm:p-4">
        {loading ? (
          <p className="py-10 text-center text-fg-muted">กำลังโหลด…</p>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-fg-muted">ยังไม่มีคำสั่งซื้อ</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((o) => (
              <li key={o.id}>
                <button onClick={() => openDetail(o.orderNo)} className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left hover:bg-bg-subtle">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-bg-subtle"><Receipt className="h-5 w-5 text-fg-muted" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold">{o.orderNo}</p>
                    <p className="truncate text-[12.5px] text-fg-muted">{o.shipName} · {o.itemCount} รายการ</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="tabular text-sm font-bold">{formatTHB(o.grandTotal)}</p>
                    <p className="text-[11px] text-fg-muted">{new Date(o.createdAt).toLocaleDateString('th-TH')}</p>
                  </div>
                  <StatusBadge status={o.status} />
                  <ChevronRight className="h-4 w-4 shrink-0 text-fg-muted" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {detail ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/50 p-4 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div className="my-8 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{detail.orderNo}</h3>
                <p className="text-[12.5px] text-fg-muted">{new Date(detail.createdAt).toLocaleString('th-TH')}</p>
              </div>
              <button type="button" onClick={() => setDetail(null)} className="grid h-8 w-8 place-items-center rounded-md text-fg-muted hover:bg-bg-subtle"><X className="h-4 w-4" /></button>
            </div>

            <div className="mb-4 rounded-lg border border-border bg-bg-subtle p-3 text-sm">
              <p className="font-semibold">{detail.shipName} · {detail.shipPhone}</p>
              {detail.customerEmail ? <p className="text-fg-muted">{detail.customerEmail}</p> : null}
              {detail.payment ? <p className="mt-1 text-fg-muted">ชำระ: {detail.payment.method} ({detail.payment.status})</p> : null}
              {detail.shipment ? <p className="text-fg-muted">ขนส่ง: {detail.shipment.carrier}{detail.shipment.trackingNo ? ` · ${detail.shipment.trackingNo}` : ''}</p> : null}
            </div>

            <ul className="mb-4 divide-y divide-border">
              {detail.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-2 py-2 text-sm">
                  <span className="min-w-0 flex-1 truncate">{it.productName} <span className="text-fg-muted">× {it.quantity}</span></span>
                  <span className="tabular whitespace-nowrap font-semibold">{formatTHB(it.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mb-4 space-y-1 text-sm">
              <div className="flex justify-between text-fg-muted"><span>ยอดสินค้า</span><span className="tabular">{formatTHB(detail.subtotal)}</span></div>
              <div className="flex justify-between text-fg-muted"><span>ค่าจัดส่ง</span><span className="tabular">{detail.shippingFee === 0 ? 'ฟรี' : formatTHB(detail.shippingFee)}</span></div>
              <div className="flex justify-between text-base font-extrabold"><span>รวม</span><span className="tabular">{formatTHB(detail.grandTotal)}</span></div>
            </div>

            <label className="mb-1 block text-[13px] font-semibold text-fg-muted">เปลี่ยนสถานะคำสั่งซื้อ</label>
            <div className="flex flex-wrap gap-2">
              {orderStatuses.map((s) => (
                <button
                  key={s}
                  disabled={busy || s === detail.status}
                  onClick={() => changeStatus(detail.orderNo, s)}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors disabled:opacity-50 ${s === detail.status ? orderStatusMeta[s].cls : 'border border-border text-fg-muted hover:border-accent hover:text-accent'}`}
                >
                  {orderStatusMeta[s].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
