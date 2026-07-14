import { Hero } from '@/components/home/hero';
import { BrandBenefits } from '@/components/home/brand-benefits';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { Collections } from '@/components/home/collections';
import { ProductTabs } from '@/components/home/product-tabs';
import { Newsletter } from '@/components/home/newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandBenefits />
      <CategoryShowcase />
      <Collections />
      <ProductTabs />
      <Newsletter />
    </>
  );
}
