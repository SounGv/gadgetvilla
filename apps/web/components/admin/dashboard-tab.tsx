'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, Wallet, Package, Users, Clock, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import { formatTHB } from '@/lib/utils';
import { orderStatusMeta } from './shared';
import type { DashboardData, OrderStatus } from './types';

function StatCard({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className={`mb-3 grid h-10 w-10 place-items-center rounded-lg ${tone}`}><Icon className="h-5 w-5" /></div>
      <p className="text-[13px] text-fg-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-extrabold">{value}</p>
    </div>
  );
}

export function DashboardTab() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setData(data);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="py-16 text-center text-fg-muted">กำลังโหลด…</p>;
  if (!data) return <p className="py-16 text-center text-fg-muted">โหลดข้อมูลไม่สำเร็จ</p>;

  const s = data.stats;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Wallet} label="ยอดขายรวม (ชำระแล้ว)" value={formatTHB(s.revenue)} tone="bg-accent2/10 text-accent2" />
        <StatCard icon={ShoppingBag} label="คำสั่งซื้อทั้งหมด" value={String(s.totalOrders)} tone="bg-accent/10 text-accent" />
        <StatCard icon={Package} label="สินค้าที่ขายอยู่" value={String(s.productCount)} tone="bg-fantech/10 text-fantech" />
        <StatCard icon={Users} label="ลูกค้า" value={String(s.customerCount)} tone="bg-sky-500/10 text-sky-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 font-bold"><Clock className="h-4 w-4 text-accent" /> คำสั่งซื้อล่าสุด</h3>
          {data.recentOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-fg-muted">ยังไม่มีคำสั่งซื้อ</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.recentOrders.map((o) => (
                <li key={o.orderNo} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{o.orderNo}</p>
                    <p className="truncate text-[12px] text-fg-muted">{o.shipName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tabular whitespace-nowrap font-semibold">{formatTHB(o.grandTotal)}</span>
                    <span className={`rounded px-2 py-0.5 text-[10.5px] font-bold ${orderStatusMeta[o.status as OrderStatus]?.cls ?? ''}`}>
                      {orderStatusMeta[o.status as OrderStatus]?.label ?? o.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 font-bold"><AlertTriangle className="h-4 w-4 text-amber-500" /> สต็อกใกล้หมด (≤ 5)</h3>
          {data.lowStock.length === 0 ? (
            <p className="py-6 text-center text-sm text-fg-muted">สต็อกทุกรายการเพียงพอ</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.lowStock.map((it, i) => (
                <li key={i} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{it.product}</p>
                    <p className="text-[12px] text-fg-muted">{it.sku}</p>
                  </div>
                  <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-bold ${it.quantity > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-error/10 text-error'}`}>
                    เหลือ {it.quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
