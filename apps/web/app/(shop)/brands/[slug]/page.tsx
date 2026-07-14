import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrandProducts } from '@/components/product/brand-products';

const brands: Record<string, { name: string; tagline: string; desc: string; accent: string; text: string }> = {
  fantech: {
    name: 'Fantech',
    tagline: 'Gaming Gear',
    desc: 'เกมมิ่งเกียร์ครบเซ็ต เมาส์ คีย์บอร์ด หูฟัง สเปกจัดเต็มในราคาที่จับต้องได้',
    accent: 'from-fantech/15',
    text: 'text-fantech',
  },
  ugreen: {
    name: 'UGREEN',
    tagline: 'Charging & Storage',
    desc: 'ที่ชาร์จ GaN สายชาร์จ พาวเวอร์แบงก์ NAS USB Hub คุณภาพสูง ทนทาน ชาร์จไว',
    accent: 'from-accent2/15',
    text: 'text-accent2',
  },
};

export function generateStaticParams() {
  return [{ slug: 'fantech' }, { slug: 'ugreen' }];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const b = brands[params.slug];
  return b ? { title: `${b.name} — สินค้าทั้งหมด`, description: b.desc } : { title: 'ไม่พบแบรนด์' };
}

export default function BrandPage({ params }: { params: { slug: string } }) {
  const b = brands[params.slug];
  if (!b) notFound();

  return (
    <div>
      <section className={`border-b border-border bg-gradient-to-br ${b.accent} to-bg`}>
        <div className="container-gv py-16">
          <span className="text-sm font-extrabold uppercase tracking-widest text-fg-muted">{b.tagline}</span>
          <h1 className={`mt-2 text-5xl font-extrabold ${b.text}`}>{b.name}</h1>
          <p className="mt-3 max-w-xl text-lg text-fg-muted">{b.desc}</p>
        </div>
      </section>
      <div className="container-gv py-10">
        <BrandProducts brand={params.slug} />
      </div>
    </div>
  );
}
