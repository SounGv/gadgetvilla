import { Truck, ShieldCheck, Headphones, FileText } from 'lucide-react';

const benefits = [
  { icon: Truck, label: 'ส่งฟรีทั่วไทย', sub: 'เมื่อช้อปครบ ฿1,500' },
  { icon: ShieldCheck, label: 'รับประกันศูนย์ไทย', sub: 'ไม่ต้องส่งต่างประเทศ' },
  { icon: Headphones, label: 'บริการหลังการขาย', sub: 'ดูแลตลอดการใช้งาน' },
  { icon: FileText, label: 'ออกใบกำกับภาษีได้', sub: 'ใบกำกับภาษีเต็มรูปแบบ' },
];

export function BrandBenefits() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container-gv flex flex-wrap items-center gap-x-8 gap-y-4 py-5">
        <div className="flex items-center gap-3 pr-4">
          <span className="text-sm font-extrabold text-fantech">FANTECH</span>
          <span className="h-5 w-px bg-border" />
          <span className="text-sm font-extrabold text-accent2">UGREEN</span>
        </div>
        <div className="flex flex-1 flex-wrap items-center justify-around gap-x-6 gap-y-4">
          {benefits.map((b) => (
            <div key={b.label} className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent2/10 text-accent2"><b.icon className="h-5 w-5" /></span>
              <div className="leading-tight">
                <div className="text-[13.5px] font-bold">{b.label}</div>
                <div className="text-[11.5px] text-fg-muted">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
