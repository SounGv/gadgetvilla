'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, Package, Receipt, Boxes, LogOut, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { inputCls, labelCls } from '@/components/admin/shared';
import { DashboardTab } from '@/components/admin/dashboard-tab';
import { ProductsTab } from '@/components/admin/products-tab';
import { OrdersTab } from '@/components/admin/orders-tab';
import { StockTab } from '@/components/admin/stock-tab';
import { HomepageTab } from '@/components/admin/homepage-tab';

type Tab = 'dashboard' | 'products' | 'orders' | 'stock' | 'homepage';

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'ภาพรวม', icon: LayoutDashboard },
  { key: 'products', label: 'สินค้า', icon: Package },
  { key: 'orders', label: 'คำสั่งซื้อ', icon: Receipt },
  { key: 'stock', label: 'สต็อก', icon: Boxes },
  { key: 'homepage', label: 'หน้าแรก', icon: ImageIcon },
];

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(typeof window !== 'undefined' ? localStorage.getItem('gv_access_token') : null);
    setReady(true);
  }, []);

  if (!ready) return <div className="container-gv py-20 text-center text-fg-muted">กำลังโหลด…</div>;
  return token ? (
    <AdminConsole
      onLogout={() => {
        localStorage.removeItem('gv_access_token');
        localStorage.removeItem('gv_refresh_token');
        setToken(null);
      }}
    />
  ) : (
    <LoginForm onLogin={(t) => { localStorage.setItem('gv_access_token', t); setToken(t); }} />
  );
}

function AdminConsole({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="container-gv py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-brand-fg"><ShieldCheck className="h-5 w-5" /></span>
          <h1 className="text-2xl font-extrabold sm:text-3xl">ระบบจัดการร้าน</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout}><LogOut className="h-4 w-4" /> ออกจากระบบ</Button>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${active ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:bg-bg-subtle'}`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'dashboard' ? <DashboardTab /> : null}
      {tab === 'products' ? <ProductsTab /> : null}
      {tab === 'orders' ? <OrdersTab /> : null}
      {tab === 'stock' ? <StockTab /> : null}
      {tab === 'homepage' ? <HomepageTab /> : null}
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: (t: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.refreshToken) localStorage.setItem('gv_refresh_token', data.refreshToken);
      onLogin(data.accessToken);
    } catch (ex: unknown) {
      const e2 = ex as { response?: { data?: { message?: string } } };
      setErr(e2?.response?.data?.message ?? 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-gv flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-lg">
        <div className="mb-5 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-brand-fg"><ShieldCheck className="h-5 w-5" /></span>
          <h1 className="text-xl font-extrabold">เข้าสู่ระบบผู้ดูแล</h1>
        </div>
        {err ? <p className="mb-3 rounded-md bg-error/10 px-3 py-2 text-sm text-error">{err}</p> : null}
        <label className={labelCls}>อีเมล</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} placeholder="admin@gadgetvilla.co.th" />
        <label className={`${labelCls} mt-4`}>รหัสผ่าน</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputCls} placeholder="••••••••" />
        <div className="mt-6">
          <Button type="submit" variant="accent" size="lg" className="w-full justify-center" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
          </Button>
        </div>
        <p className="mt-4 text-center text-[12.5px] text-fg-muted">ใช้บัญชี admin ที่ตั้งไว้ใน env ของ API</p>
      </form>
    </div>
  );
}
