import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { ProductGallery } from '@/components/product/product-gallery';
import { AddToCart } from '@/components/product/add-to-cart';
import { ProductTabs } from '@/components/product/product-tabs';
import { Rating } from '@/components/ui/rating';
import type { ProductDetail } from '@/lib/types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const res = await fetch(`${API}/products/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as ProductDetail;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'ไม่พบสินค้า' };
  return {
    title: product.name,
    description: product.shortDesc ?? `${product.name} ของแท้ ประกันศูนย์ไทย จาก GADGET VILLA`,
    openGraph: { images: product.images[0]?.url ? [product.images[0].url] : [] },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: product.brand,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'THB',
      price: product.variants[0]?.price,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="container-gv py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 flex items-center gap-1 text-sm text-fg-muted">
        <Link href="/" className="hover:text-fg">หน้าแรก</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-fg">สินค้า</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-fg">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-fg-muted">
            {product.brand}
          </span>
          <h1 className="mt-1 text-3xl font-extrabold">{product.name}</h1>
          <div className="mt-2">
            <Rating value={product.rating} count={product.reviewCount} />
          </div>
          {product.shortDesc && <p className="mt-4 text-fg-muted">{product.shortDesc}</p>}

          <div className="mt-6">
            <AddToCart product={product} />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center text-xs font-semibold">
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-5 w-5 text-accent" /> ส่งไว 1-2 วัน
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-5 w-5 text-accent" /> ประกันศูนย์ไทย
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="h-5 w-5 text-accent" /> เปลี่ยน/คืนได้
            </div>
          </div>
        </div>
      </div>

      <ProductTabs product={product} />
    </div>
  );
}
