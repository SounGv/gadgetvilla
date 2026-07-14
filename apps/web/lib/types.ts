export interface ProductImage {
  url: string;
  alt?: string;
  type?: 'image' | 'video' | 'view360';
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  options?: Record<string, string>;
  inStock?: number;
}

export interface ProductSpec {
  group?: string;
  key: string;
  value: string;
}

export interface ProductDownload {
  title: string;
  type: 'driver' | 'firmware' | 'manual' | 'software';
  fileUrl: string;
  version?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt: string;
}

export interface ProductDetail {
  slug: string;
  name: string;
  shortDesc?: string;
  description?: string;
  brand: 'fantech' | 'ugreen';
  category: string;
  images: ProductImage[];
  variants: ProductVariant[];
  specs: ProductSpec[];
  features: { title: string; body?: string; imageUrl?: string }[];
  downloads: ProductDownload[];
  reviews: Review[];
  rating: number;
  reviewCount: number;
}
