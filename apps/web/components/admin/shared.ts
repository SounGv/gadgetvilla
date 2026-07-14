import type { OrderStatus } from './types';

export const inputCls =
  'h-10 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20';
export const labelCls = 'mb-1 block text-[13px] font-semibold text-fg-muted';

export const brands = [
  { slug: 'fantech', name: 'Fantech' },
  { slug: 'ugreen', name: 'UGREEN' },
];

export function slugify(s: string) {
  const base = s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || `gv-${Date.now()}`;
}

// สถานะคำสั่งซื้อ → ป้ายไทย + สี
export const orderStatusMeta: Record<OrderStatus, { label: string; cls: string }> = {
  PENDING: { label: 'รอดำเนินการ', cls: 'bg-amber-500/10 text-amber-500' },
  PAID: { label: 'ชำระแล้ว', cls: 'bg-accent2/10 text-accent2' },
  PROCESSING: { label: 'กำลังเตรียมของ', cls: 'bg-sky-500/10 text-sky-500' },
  SHIPPED: { label: 'จัดส่งแล้ว', cls: 'bg-indigo-500/10 text-indigo-500' },
  DELIVERED: { label: 'ส่งสำเร็จ', cls: 'bg-emerald-500/10 text-emerald-500' },
  CANCELLED: { label: 'ยกเลิก', cls: 'bg-error/10 text-error' },
  REFUNDED: { label: 'คืนเงิน', cls: 'bg-fg-muted/10 text-fg-muted' },
};

export const orderStatuses: OrderStatus[] = [
  'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
];
