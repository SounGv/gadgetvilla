'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PackageSearch, CheckCircle2, Truck, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { formatTHB } from '@/lib/utils';

interface Status {
  orderNo: string;
  status: string;
  paymentStatus: string | null;
  carrier: string | null;
  trackingNo: string | null;
  shipmentStatus: string | null;
  grandTotal: number;
  createdAt: string;
}

const steps = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
const stepLabel: Record<string, string> = {
  PENDING: 'รอชำระเงิน',
  PAID: 'ชำระเงินแล้ว',
  PROCESSING: 'กำลังเตรียมสินค้า',
  SHIPPED: 'จัดส่งแล้ว',
  DELIVERED: 'ส่งถึงแล้ว',
};

function TrackingInner() {
  const params = useSearchParams();
  const [orderNo, setOrderNo] = useState('');
  const [data, setData] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async (no: string) => {
    if (!no) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await api.get(`/orders/${no}/status`);
      if (!res.data) setError('ไม่พบคำสั่งซื้อนี้');
      else setData(res.data);
    } catch {
      setError('ค้นหาไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = params.get('order');
    if (q) {
      setOrderNo(q);
      lookup(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentStep = data ? steps.indexOf(data.status) : -1;

  return (
    <div className="container-gv max-w-2xl py-12">
      <h1 className="mb-2 text-3xl font-extrabold">ติดตามคำสั่งซื้อ</h1>
      <p className="mb-6 text-fg-muted">กรอกเลขคำสั่งซื้อ (เช่น GVxxxxx) เพื่อดูสถานะ</p>

      <div className="flex gap-2">
        <input
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
          placeholder="เลขคำสั่งซื้อ"
          className="flex-1 rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
        <Button variant="accent" loading={loading} onClick={() => lookup(orderNo.trim())}>
          ค้นหา
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      {data && (
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-fg-muted">คำสั่งซื้อ</p>
              <p className="text-lg font-extrabold">{data.orderNo}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-fg-muted">ยอดรวม</p>
              <p className="tabular text-lg font-extrabold">{formatTHB(data.grandTotal)}</p>
            </div>
          </div>

          <div className="my-6 space-y-4">
            {steps.map((s, i) => {
              const done = i <= currentStep;
              const Icon = i === currentStep ? Clock : i < currentStep ? CheckCircle2 : Truck;
              return (
                <div key={s} className="flex items-center gap-3">
                  <Icon className={done ? 'h-6 w-6 text-accent2' : 'h-6 w-6 text-fg-muted'} />
                  <span className={done ? 'font-semibold' : 'text-fg-muted'}>{stepLabel[s]}</span>
                </div>
              );
            })}
          </div>

          {data.trackingNo && (
            <p className="text-sm">
              ขนส่ง: <b>{data.carrier?.toUpperCase()}</b> · เลขพัสดุ: <b>{data.trackingNo}</b>
            </p>
          )}
          {data.status === 'PENDING' && (
            <p className="mt-2 text-sm text-warning">รอการชำระเงิน — หากชำระแล้วสถานะจะอัปเดตอัตโนมัติ</p>
          )}
        </div>
      )}

      {!data && !error && !loading && (
        <div className="mt-10 flex flex-col items-center gap-2 text-fg-muted">
          <PackageSearch className="h-10 w-10" />
          <p>กรอกเลขคำสั่งซื้อเพื่อเริ่มติดตาม</p>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="container-gv py-20 text-center text-fg-muted">กำลังโหลด…</div>}>
      <TrackingInner />
    </Suspense>
  );
}
