import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const BASE = process.env.BIGSELLER_API_URL ?? 'https://api.bigseller.com';

interface BsProduct {
  id: string;
  name: string;
  brand?: string;
  categoryName?: string;
  description?: string;
  images?: string[];
  variants?: { sku: string; barcode?: string; name?: string; price: number; stock: number }[];
}

@Injectable()
export class BigSellerService {
  private readonly logger = new Logger(BigSellerService.name);
  private apiKey = process.env.BIGSELLER_API_KEY ?? '';

  private async call<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${BASE}${path}`);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url, { headers: { Authorization: `Bearer ${this.apiKey}` } });
    if (!res.ok) throw new Error(`BigSeller ${res.status}`);
    return (await res.json()) as T;
  }

  /** ดึงสินค้าจาก BigSeller แล้ว upsert เข้า DB (BigSeller = source of truth) */
  async syncProducts(): Promise<{ synced: number }> {
    if (!this.apiKey) throw new Error('ยังไม่ได้ตั้งค่า BIGSELLER_API_KEY ใน .env');
    const data = await this.call<{ items: BsProduct[] }>('/v1/products', { pageSize: '100' });
    let synced = 0;

    for (const p of data.items ?? []) {
      try {
        const brandSlug = (p.brand ?? 'fantech').toLowerCase();
        const brand = await this.prisma.brand.upsert({
          where: { slug: brandSlug },
          update: {},
          create: { slug: brandSlug, name: p.brand ?? 'Fantech' },
        });
        const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + p.id;

        const product = await this.prisma.product.upsert({
          where: { bigsellerId: p.id },
          update: { name: p.name, description: p.description, status: 'ACTIVE' },
          create: {
            bigsellerId: p.id,
            slug,
            name: p.name,
            description: p.description,
            status: 'ACTIVE',
            brandId: brand.id,
          },
        });

        for (const v of p.variants ?? []) {
          await this.prisma.productVariant.upsert({
            where: { sku: v.sku },
            update: { price: new Prisma.Decimal(v.price), bigsellerSku: v.sku },
            create: {
              productId: product.id,
              sku: v.sku,
              barcode: v.barcode,
              name: v.name ?? p.name,
              price: new Prisma.Decimal(v.price),
              bigsellerSku: v.sku,
            },
          });
        }
        synced++;
      } catch (e) {
        this.logger.error(`sync product ${p.id} failed: ${(e as Error).message}`);
        await this.prisma.syncLog.create({
          data: { source: 'bigseller', entity: 'product', direction: 'inbound', status: 'failed', refId: p.id, message: (e as Error).message },
        });
      }
    }

    await this.prisma.syncLog.create({
      data: { source: 'bigseller', entity: 'product', direction: 'inbound', status: 'success', message: `synced ${synced}` },
    });
    return { synced };
  }

  /** อัปเดตสต็อกจาก webhook ของ BigSeller */
  async updateInventory(sku: string, quantity: number) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { sku },
      include: { inventory: true },
    });
    if (!variant) return;
    const warehouse = await this.prisma.warehouse.findFirst();
    if (!warehouse) return;
    await this.prisma.inventory.upsert({
      where: { variantId_warehouseId: { variantId: variant.id, warehouseId: warehouse.id } },
      update: { quantity },
      create: { variantId: variant.id, warehouseId: warehouse.id, quantity },
    });
  }

  constructor(private prisma: PrismaService) {}
}
