import Link from 'next/link';
import { Truck, BadgeCheck, LifeBuoy, ShieldCheck, PackageSearch, Store } from 'lucide-react';

const promos = [
  { icon: Truck, text: 'จัดส่งฟรีทั่วประเทศ เมื่อช้อปครบ ฿1,500' },
  { icon: BadgeCheck, text: 'สินค้าแท้ 100% ประกันศูนย์ไทย' },
  { icon: ShieldCheck, text: 'ตัวแทนจำหน่ายอย่างเป็นทางการ' },
];

const links = [
  { icon: LifeBuoy, label: 'Support Center', href: '/support' },
  { icon: ShieldCheck, label: 'Warranty', href: '/warranty' },
  { icon: PackageSearch, label: 'Track Order', href: '/tracking' },
  { icon: Store, label: 'Dealer Login', href: '/dealer' },
];

export function AnnouncementBar() {
  return (
    <div className="bg-brand text-brand-fg">
      <div className="container-gv flex h-9 items-center justify-between gap-4 text-[12px]">
        <div className="flex items-center gap-5 overflow-hidden">
          {promos.map((p, i) => (
            <span key={i} className={`inline-flex items-center gap-1.5 whitespace-nowrap ${i > 0 ? 'hidden sm:inline-flex' : ''}`}>
              <p.icon className="h-3.5 w-3.5 text-accent" /> {p.text}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="inline-flex items-center gap-1 whitespace-nowrap text-brand-fg/80 transition-colors hover:text-accent">
              <l.icon className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
