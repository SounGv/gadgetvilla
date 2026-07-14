'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, Clock, ArrowLeft, Send } from 'lucide-react';

const EMAIL = 'support@gadgetvilla.co.th';
const PHONE = '02-123-4567';

const channels = [
  { icon: MessageCircle, label: 'LINE Official', value: '@gadgetvilla', href: 'https://line.me/R/ti/p/@gadgetvilla', tone: 'text-accent2' },
  { icon: Phone, label: 'โทรศัพท์', value: PHONE, href: `tel:${PHONE.replace(/-/g, '')}`, tone: 'text-accent' },
  { icon: Mail, label: 'อีเมล', value: EMAIL, href: `mailto:${EMAIL}`, tone: 'text-fantech' },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [order, setOrder] = useState('');
  const [topic, setTopic] = useState('สอบถามสินค้า');
  const [message, setMessage] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[${topic}] จาก ${name || 'ลูกค้า'}${order ? ` · ออเดอร์ ${order}` : ''}`;
    const body = `ชื่อ: ${name}\nเลขคำสั่งซื้อ: ${order || '-'}\nหัวข้อ: ${topic}\n\n${message}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const field = 'h-11 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20';

  return (
    <div className="container-gv py-14">
      <Link href="/support" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> กลับหน้าบริการลูกค้า
      </Link>
      <div className="max-w-2xl">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent"><MessageCircle className="h-6 w-6" /></span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">ติดต่อเรา</h1>
        <p className="mt-3 text-fg-muted">ทีมงานพร้อมช่วยเหลือทุกวัน เลือกช่องทางที่สะดวก หรือส่งข้อความหาเราด้านล่าง</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-bg-subtle ${c.tone}`}><c.icon className="h-5 w-5" /></span>
              <div>
                <div className="text-[13px] text-fg-muted">{c.label}</div>
                <div className="font-bold">{c.value}</div>
              </div>
            </a>
          ))}
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-bg-subtle text-fg-muted"><Clock className="h-5 w-5" /></span>
            <div>
              <div className="text-[13px] text-fg-muted">เวลาทำการ</div>
              <div className="font-bold">ทุกวัน 9:00 - 18:00 น.</div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-bold">ส่งข้อความถึงเรา</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[13px] font-semibold text-fg-muted">ชื่อของคุณ</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className={field} placeholder="ชื่อ-นามสกุล" />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-semibold text-fg-muted">เลขคำสั่งซื้อ (ถ้ามี)</label>
                <input value={order} onChange={(e) => setOrder(e.target.value)} className={field} placeholder="เช่น GV-2026-0001" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold text-fg-muted">หัวข้อ</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className={field}>
                {['สอบถามสินค้า', 'สถานะคำสั่งซื้อ', 'เปลี่ยน/คืนสินค้า', 'เคลมประกัน', 'ใบกำกับภาษี', 'อื่น ๆ'].map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold text-fg-muted">ข้อความ</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className={`${field} h-auto py-2.5`} placeholder="รายละเอียดที่ต้องการสอบถาม" />
            </div>
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-bold text-accent-fg hover:shadow-md">
              <Send className="h-4 w-4" /> ส่งข้อความ
            </button>
            <p className="text-center text-[12px] text-fg-muted">ปุ่มนี้จะเปิดอีเมลของคุณพร้อมข้อความที่กรอกไว้</p>
          </div>
        </form>
      </div>
    </div>
  );
}
