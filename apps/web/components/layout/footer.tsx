import Link from 'next/link';
import { Phone, Clock, Mail, MapPin, Facebook, Youtube, Instagram, MessageCircle, BadgeCheck, Truck, ShieldCheck } from 'lucide-react';

const cols = [
  {
    title: 'สินค้า',
    links: [
      ['คีย์บอร์ด Fantech', '/products?category=keyboard'],
      ['เมาส์เกมมิ่ง Fantech', '/products?category=mouse'],
      ['หูฟังเกมมิ่ง', '/products?category=headset'],
      ['ที่ชาร์จ GaN UGREEN', '/products?category=gan-charger'],
      ['UGREEN NAS / NASync', '/products?category=nas'],
      ['สินค้าใหม่', '/products?sort=new'],
    ],
  },
  {
    title: 'ช่วยเหลือ',
    links: [
      ['วิธีสั่งซื้อ', '/support'],
      ['การจัดส่ง', '/support'],
      ['เปลี่ยน/คืนสินค้า', '/support'],
      ['การรับประกัน', '/warranty'],
      ['ติดตามพัสดุ', '/tracking'],
      ['คำถามที่พบบ่อย', '/support'],
    ],
  },
  {
    title: 'บริษัท',
    links: [
      ['เกี่ยวกับเรา', '/about'],
      ['ตัวแทนจำหน่าย', '/dealer'],
      ['บทความ', '/blog'],
      ['ร่วมงานกับเรา', '/about'],
      ['นโยบายความเป็นส่วนตัว', '/privacy'],
      ['เงื่อนไขการใช้งาน', '/terms'],
    ],
  },
];

const socials = [
  { icon: Facebook, href: 'https://www.facebook.com/gadgetvillathailand/', label: 'Facebook' },
  { icon: MessageCircle, href: 'https://line.me', label: 'LINE' },
  { icon: Youtube, href: 'https://www.youtube.com/@gadgetvillathailand', label: 'YouTube' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

const trust = [
  { icon: BadgeCheck, label: 'ของแท้ 100% ประกันศูนย์ไทย' },
  { icon: Truck, label: 'ส่งไวทั่วไทย 1-2 วัน' },
  { icon: ShieldCheck, label: 'ชำระเงินปลอดภัย' },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-bg-subtle">
      {/* trust strip */}
      <div className="border-b border-border">
        <div className="container-gv grid grid-cols-1 gap-4 py-6 sm:grid-cols-3">
          {trust.map((t) => (
            <div key={t.label} className="flex items-center justify-center gap-2.5 text-[13.5px] font-semibold">
              <t.icon className="h-5 w-5 shrink-0 text-accent" />
              {t.label}
            </div>
          ))}
        </div>
      </div>

      <div className="container-gv grid grid-cols-2 gap-8 py-14 md:grid-cols-5">
        <div className="col-span-2">
          <div className="flex items-center gap-2 text-lg font-extrabold">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-accent font-extrabold italic text-accent-fg">GV</span>
            GADGET VILLA
          </div>
          <p className="mt-3 max-w-sm text-sm text-fg-muted">
            ตัวแทนจำหน่าย Fantech &amp; UGREEN อย่างเป็นทางการ สินค้าของแท้ ประกันศูนย์ไทย บริการหลังการขายครบวงจร
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-fg-muted">
            <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-accent" /> 02-123-4567</li>
            <li className="flex items-center gap-2.5"><Clock className="h-4 w-4 shrink-0 text-accent" /> 09:00 - 18:00 น. (ทุกวัน)</li>
            <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-accent" /> support@gadgetvilla.co.th</li>
            <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> กรุงเทพมหานคร ประเทศไทย</li>
          </ul>
          <div className="mt-5 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-fg-muted transition-colors hover:border-accent hover:text-accent"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wide">{c.title}</h4>
            <ul className="space-y-2.5">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-fg-muted transition-colors hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-gv flex flex-col justify-between gap-3 py-6 text-[13px] text-fg-muted sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} GADGET VILLA. สงวนลิขสิทธิ์</span>
          <div className="flex flex-wrap gap-2">
            {['VISA', 'Mastercard', 'PromptPay', 'โอนธนาคาร'].map((p) => (
              <span key={p} className="rounded border border-border bg-card px-2.5 py-1 text-[11px] font-bold">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
