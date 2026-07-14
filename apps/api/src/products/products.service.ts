import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async list(params: { brand?: string; featured?: string; sort?: string; limit?: string }) {
    const where: Prisma.ProductWhereInput = { status: 'ACTIVE' };
    if (params.brand) where.brand = { slug: params.brand };
    if (params.featured === 'true') where.isFeatured = true;

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      params.sort === 'new' ? { createdAt: 'desc' } : { createdAt: 'desc' };

    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      take: params.limit ? Number(params.limit) : 24,
      include: {
        brand: true,
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        variants: { orderBy: { price: 'asc' }, take: 1, include: { inventory: true } },
        categories: { include: { category: true }, take: 1 },
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
    });

    const items = products.map((p) => {
      const variant = p.variants[0];
      const ratings = p.reviews.map((r) => r.rating);
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 5;
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.categories[0]?.category.name ?? '',
        brand: p.brand.slug as 'fantech' | 'ugreen',
        price: variant ? Number(variant.price) : 0,
        compareAtPrice: variant?.compareAtPrice ? Number(variant.compareAtPrice) : undefined,
        rating: Number(avg.toFixed(1)),
        reviewCount: ratings.length,
        imageUrl: p.images[0]?.url,
        badge: p.isNewArrival ? ('new' as const) : undefined,
        variantId: variant?.id,
        sku: variant?.sku,
        stock: variant ? variant.inventory.reduce((n, inv) => n + (inv.quantity - inv.reserved), 0) : 0,
      };
    });

    return { items };
  }

  /** รายการสินค้าสำหรับแอดมิน — ทุกสถานะ, ค้นหา, แบ่งหน้า, ข้อมูลแก้ไขครบ */
  async adminList(params: { q?: string; limit?: string; offset?: string }) {
    const take = Math.min(Number(params.limit) || 50, 200);
    const skip = Number(params.offset) || 0;
    const where: Prisma.ProductWhereInput = { status: { not: 'ARCHIVED' } };
    if (params.q?.trim()) {
      const q = params.q.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
        { variants: { some: { sku: { contains: q, mode: 'insensitive' } } } },
      ];
    }
    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: {
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { price: 'asc' }, take: 1, include: { inventory: true } },
          categories: { include: { category: true }, take: 1 },
        },
      }),
    ]);
    const items = products.map((p) => {
      const v = p.variants[0];
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        brandSlug: p.brand.slug,
        brandName: p.brand.name,
        categorySlug: p.categories[0]?.category.slug ?? '',
        categoryName: p.categories[0]?.category.name ?? '',
        price: v ? Number(v.price) : 0,
        compareAtPrice: v?.compareAtPrice ? Number(v.compareAtPrice) : null,
        stock: v ? v.inventory.reduce((n, inv) => n + (inv.quantity - inv.reserved), 0) : 0,
        sku: v?.sku ?? '',
        barcode: v?.barcode ?? '',
        images: p.images.map((i) => i.url),
        imageUrl: p.images[0]?.url ?? null,
        shortDesc: p.shortDesc ?? '',
        description: p.description ?? '',
        warranty: p.warranty ?? '',
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        status: p.status,
      };
    });
    return { items, total, limit: take, offset: skip };
  }

  async create(data: {
    name: string;
    slug: string;
    brandSlug: string;
    categorySlug?: string;
    shortDesc?: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    sku?: string;
    barcode?: string;
    imageUrl?: string;
    images?: string[];
    warranty?: string;
    stock?: number;
    isFeatured?: boolean;
    isNewArrival?: boolean;
  }) {
    const brand = await this.prisma.brand.findUnique({ where: { slug: data.brandSlug } });
    if (!brand) throw new NotFoundException(`ไม่พบแบรนด์: ${data.brandSlug}`);
    const category = data.categorySlug
      ? await this.prisma.category.findUnique({ where: { slug: data.categorySlug } })
      : null;
    const warehouse = await this.prisma.warehouse.findUnique({ where: { code: 'MAIN' } });
    const sku = data.sku?.trim() || `${data.slug.toUpperCase()}-01`;
    const imageList = (data.images?.length ? data.images : data.imageUrl ? [data.imageUrl] : [])
      .map((u) => String(u).trim())
      .filter(Boolean);

    return this.prisma.product.create({
      data: {
        slug: data.slug,
        name: data.name,
        shortDesc: data.shortDesc,
        description: data.description,
        warranty: data.warranty?.trim() || undefined,
        brandId: brand.id,
        status: 'ACTIVE',
        isFeatured: data.isFeatured ?? false,
        isNewArrival: data.isNewArrival ?? true,
        ...(category ? { categories: { create: { categoryId: category.id } } } : {}),
        ...(imageList.length ? { images: { create: imageList.map((url, i) => ({ url, sortOrder: i })) } } : {}),
        variants: {
          create: {
            sku,
            barcode: data.barcode?.trim() || undefined,
            name: data.name,
            price: data.price,
            compareAtPrice: data.compareAtPrice ?? null,
            isActive: true,
            ...(warehouse
              ? { inventory: { create: { warehouseId: warehouse.id, quantity: data.stock ?? 0 } } }
              : {}),
          },
        },
      },
      include: { variants: true, images: true },
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({ where: { id }, data });
  }

  /** แก้ไขสินค้าแบบครบ (ฟิลด์ที่หน้าแอดมินใช้) — อัปเดตทั้ง product + variant + inventory + images + category */
  async adminUpdate(
    id: string,
    data: {
      name?: string;
      slug?: string;
      brandSlug?: string;
      categorySlug?: string;
      shortDesc?: string;
      description?: string;
      warranty?: string;
      price?: number;
      compareAtPrice?: number | null;
      stock?: number;
      sku?: string;
      barcode?: string;
      images?: string[];
      isFeatured?: boolean;
      isNewArrival?: boolean;
      status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
    },
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { price: 'asc' }, take: 1 } },
    });
    if (!product) throw new NotFoundException('ไม่พบสินค้า');

    let brandId = product.brandId;
    if (data.brandSlug) {
      const b = await this.prisma.brand.findUnique({ where: { slug: data.brandSlug } });
      if (!b) throw new NotFoundException(`ไม่พบแบรนด์: ${data.brandSlug}`);
      brandId = b.id;
    }

    await this.prisma.product.update({
      where: { id },
      data: {
        brandId,
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.slug ? { slug: data.slug } : {}),
        ...(data.shortDesc !== undefined ? { shortDesc: data.shortDesc || null } : {}),
        ...(data.description !== undefined ? { description: data.description || null } : {}),
        ...(data.warranty !== undefined ? { warranty: data.warranty || null } : {}),
        ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
        ...(data.isNewArrival !== undefined ? { isNewArrival: data.isNewArrival } : {}),
        ...(data.status ? { status: data.status } : {}),
      },
    });

    // หมวดหมู่ (แทนที่ของเดิม)
    if (data.categorySlug) {
      const cat = await this.prisma.category.findUnique({ where: { slug: data.categorySlug } });
      if (cat) {
        await this.prisma.productCategory.deleteMany({ where: { productId: id } });
        await this.prisma.productCategory.create({ data: { productId: id, categoryId: cat.id } });
      }
    }

    // ตัวแปร (ราคา/สต็อก/SKU/บาร์โค้ด) — ใช้ variant แรก
    const variant = product.variants[0];
    if (variant) {
      await this.prisma.productVariant.update({
        where: { id: variant.id },
        data: {
          ...(data.price !== undefined ? { price: new Prisma.Decimal(data.price) } : {}),
          ...(data.compareAtPrice !== undefined
            ? { compareAtPrice: data.compareAtPrice != null ? new Prisma.Decimal(data.compareAtPrice) : null }
            : {}),
          ...(data.sku ? { sku: data.sku } : {}),
          ...(data.barcode !== undefined ? { barcode: data.barcode || null } : {}),
        },
      });
      if (data.stock !== undefined) {
        const wh = await this.prisma.warehouse.findFirst();
        if (wh) {
          await this.prisma.inventory.upsert({
            where: { variantId_warehouseId: { variantId: variant.id, warehouseId: wh.id } },
            update: { quantity: data.stock },
            create: { variantId: variant.id, warehouseId: wh.id, quantity: data.stock },
          });
        }
      }
    }

    // รูปภาพ (แทนที่ทั้งหมดถ้าส่งมา)
    if (data.images) {
      const imgs = data.images.map((u) => String(u).trim()).filter(Boolean);
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      if (imgs.length) {
        await this.prisma.productImage.createMany({
          data: imgs.map((url, i) => ({ productId: id, url, sortOrder: i })),
        });
      }
    }

    return { ok: true, id };
  }

  /** ปรับสต็อกอย่างเดียว (สำหรับหน้าสต็อก) */
  async setStock(id: string, stock: number) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { productId: id },
      orderBy: { price: 'asc' },
    });
    if (!variant) throw new NotFoundException('ไม่พบตัวแปรสินค้า');
    const wh = await this.prisma.warehouse.findFirst();
    if (!wh) throw new NotFoundException('ไม่พบคลังสินค้า');
    await this.prisma.inventory.upsert({
      where: { variantId_warehouseId: { variantId: variant.id, warehouseId: wh.id } },
      update: { quantity: stock },
      create: { variantId: variant.id, warehouseId: wh.id, quantity: stock },
    });
    return { ok: true, id, stock };
  }

  async remove(id: string) {
    return this.prisma.product.update({ where: { id }, data: { status: 'ARCHIVED' } });
  }

  async setFeatured(id: string, isFeatured: boolean) {
    return this.prisma.product.update({ where: { id }, data: { isFeatured } });
  }

  /** นำเข้าสินค้าจากไฟล์ BigSeller (batch) — กรองเฉพาะ Fantech/UGREEN + หมวดที่ขาย + คิดราคาจากทุน */
  async importProducts(payload: { markup?: number; rows: Array<Record<string, unknown>> }) {
    const factor = 1 + Number(payload.markup ?? 40) / 100;
    // แมปชื่อหมวดของ BigSeller → slug หมวดของเรา (20 หมวด)
    const catMap: Record<string, string> = {
      KEYBOARD: 'keyboard', 'KEYBOARD AND MOUSE': 'keyboard', MOUSE: 'mouse', 'MOUSE PAD': 'mousepad',
      HEADSET: 'headset', AUDIO: 'headset', EARPHONE: 'headset',
      'GAMING CONTROLLER': 'controller', MICROPHONE: 'streaming', 'CAPTURE CARD': 'streaming',
      WEBCAM: 'webcam', 'WEB CAMERA': 'webcam', 'WEB CAM': 'webcam',
      'GAMING CHAIR': 'gaming-chair', CHAIR: 'gaming-chair',
      'POWER BANK': 'powerbank', 'POWER BANK STATION': 'powerbank',
      'USB HUB': 'usb-hub', 'MULTI HUB': 'usb-hub',
      DOCK: 'dock', DOCKING: 'dock', 'DOCKING STATION': 'dock', 'WORK STATION': 'dock',
      HDMI: 'hdmi', 'MICRO HDMI': 'hdmi', 'MINI HDMI': 'hdmi', SWITCHER: 'hdmi', SPLITTER: 'hdmi',
      DP: 'display-adapter', 'MINI DP': 'display-adapter', DVI: 'display-adapter',
      'USB C CABLE': 'usb-cable', 'USB CABLE': 'usb-cable',
      'LIGHTNING CABLE': 'charging-cable', 'MICRO USB CABLE': 'charging-cable',
      'CHARGING CABLE': 'charging-cable', 'MINI USB CONVERTER': 'charging-cable',
      'PC CHARGER': 'gan-charger', 'GAN CHARGER': 'gan-charger',
      'MOBILE CHARGER': 'usb-charger', 'CAR CHARGER': 'usb-charger', 'WIRELESS CHARGER': 'usb-charger',
      BLUETOOTH: 'bluetooth-adapter', 'WIFI ADAPTER': 'bluetooth-adapter',
      'CARD READER': 'card-reader',
      NAS: 'nas', 'NETWORK ATTACHED STORAGE': 'nas', ENCLOSURE: 'nas',
    };
    // เดาหมวดจากชื่อสินค้า (ใช้เมื่อไม่มีหมวดหมู่ในไฟล์) — เรียงจากเฉพาะเจาะจง → กว้าง
    const catFromName = (name: string): string => {
      const n = (name || '').toLowerCase();
      const rules: [RegExp, string][] = [
        [/gaming ?chair|เก้าอี้/, 'gaming-chair'],
        [/keyboard|คีย์บอร์ด/, 'keyboard'],
        [/mouse ?pad|แผ่นรอง/, 'mousepad'],
        [/mouse|เมาส์/, 'mouse'],
        [/headset|headphone|earphone|earbud|หูฟัง/, 'headset'],
        [/controller|gamepad|joystick|จอย/, 'controller'],
        [/web ?cam|webcam/, 'webcam'],
        [/microphone|capture card|ไมโครโฟน/, 'streaming'],
        [/nas|nasync|enclosure/, 'nas'],
        [/power ?bank|พาวเวอร์แบง/, 'powerbank'],
        [/gan\b/, 'gan-charger'],
        [/dock/, 'dock'],
        [/usb ?hub|hub/, 'usb-hub'],
        [/hdmi/, 'hdmi'],
        [/displayport|display port|\bdp\b|\bdvi\b|\bvga\b|adapter|converter/, 'display-adapter'],
        [/card reader/, 'card-reader'],
        [/bluetooth|wifi|wireless adapter|receiver/, 'bluetooth-adapter'],
        [/charger|charging|ชาร์จ/, 'usb-charger'],
        [/lightning|type-?c cable|usb-?c cable|\bcable\b|สาย/, 'usb-cable'],
      ];
      for (const [re, slug] of rules) if (re.test(n)) return slug;
      return '';
    };
    const brandOf = (name: string): 'fantech' | 'ugreen' | null => {
      const u = (name || '').toUpperCase();
      if (u.includes('UGREEN') || u.includes('UGR')) return 'ugreen';
      if (u.includes('FANTECH') || u.includes('FANTE') || /\bFAN\b/.test(u)) return 'fantech';
      return null;
    };
    const [fantech, ugreen, warehouse, cats] = await Promise.all([
      this.prisma.brand.findUnique({ where: { slug: 'fantech' } }),
      this.prisma.brand.findUnique({ where: { slug: 'ugreen' } }),
      this.prisma.warehouse.findFirst(),
      this.prisma.category.findMany({ select: { id: true, slug: true } }),
    ]);
    const catId = new Map(cats.map((c) => [c.slug, c.id]));
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of payload.rows ?? []) {
      const name = String(row.name ?? '').trim();
      if (!name) { skipped++; continue; }
      const cost = Number(row.cost) || 0;
      // แบรนด์: จากคอลัมน์ brand ถ้ามี ไม่งั้นเดาจากชื่อ
      const rb = String(row.brand ?? '').toLowerCase().trim();
      const brandSlug = rb === 'fantech' || rb === 'ugreen' ? rb : brandOf(name);
      // หมวด: slug ตรง ๆ > แมปจากชื่อหมวด BigSeller > (ถ้าไม่มีหมวด) เดาจากชื่อสินค้า
      const rawCat = String(row.category ?? '').trim();
      const noCat = !rawCat || rawCat === 'ไม่มีหมวดหมู่' || rawCat === '-' || rawCat === '--';
      let catSlug = '';
      if (!noCat) {
        catSlug = catId.has(rawCat) ? rawCat : (catMap[rawCat.toUpperCase()] ?? '');
        // มีหมวดใน BigSeller แต่ไม่ใช่หมวดที่เราขาย → เดาจากชื่อเป็นทางเลือกสุดท้าย
        if (!catSlug) catSlug = catFromName(name);
      } else {
        catSlug = catFromName(name);
      }
      if (!brandSlug || !catSlug || !catId.has(catSlug)) { skipped++; continue; }
      const brand = brandSlug === 'ugreen' ? ugreen : fantech;
      if (!brand) { skipped++; continue; }
      // ราคา: ใช้ราคาขายที่กรอกมาถ้ามี ไม่งั้นคิดจากทุน × markup
      const priceIn = Number(row.price) || 0;
      const price = priceIn > 0 ? Math.round(priceIn) : Math.round((cost * factor) / 10) * 10;
      if (price <= 0) { skipped++; continue; }
      const cmp = Number(row.compareAtPrice) || 0;
      const stock = Number(row.stock) || 0;
      const image = row.image ? String(row.image) : null;
      const barcode = row.barcode ? String(row.barcode) : null;
      const sku =
        String(row.sku ?? '').trim() ||
        `${brandSlug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24)}-${Date.now().toString().slice(-5)}`;
      const slug = sku.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `sku-${Date.now()}`;

      try {
        const existing = await this.prisma.productVariant.findUnique({ where: { sku }, select: { id: true } });
        if (existing) {
          await this.prisma.productVariant.update({ where: { sku }, data: { price: new Prisma.Decimal(price), ...(cmp > 0 ? { compareAtPrice: new Prisma.Decimal(cmp) } : {}) } });
          if (warehouse) {
            await this.prisma.inventory.upsert({
              where: { variantId_warehouseId: { variantId: existing.id, warehouseId: warehouse.id } },
              update: { quantity: stock },
              create: { variantId: existing.id, warehouseId: warehouse.id, quantity: stock },
            });
          }
          updated++;
        } else {
          await this.prisma.product.create({
            data: {
              slug,
              name,
              brandId: brand.id,
              status: 'ACTIVE',
              categories: { create: { categoryId: catId.get(catSlug)! } },
              ...(image ? { images: { create: { url: image, sortOrder: 0 } } } : {}),
              variants: {
                create: {
                  sku,
                  barcode: barcode ?? undefined,
                  name,
                  price: new Prisma.Decimal(price),
                  ...(cmp > 0 ? { compareAtPrice: new Prisma.Decimal(cmp) } : {}),
                  ...(warehouse
                    ? { inventory: { create: { warehouseId: warehouse.id, quantity: stock } } }
                    : {}),
                },
              },
            },
          });
          created++;
        }
      } catch {
        skipped++;
      }
    }
    return { created, updated, skipped };
  }

  async getBySlug(slug: string) {
    const p = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true }, orderBy: { price: 'asc' }, include: { inventory: true } },
        specs: { orderBy: { sortOrder: 'asc' } },
        features: { orderBy: { sortOrder: 'asc' } },
        downloads: true,
        categories: { include: { category: true }, take: 1 },
        reviews: { where: { isApproved: true }, include: { user: true }, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!p || p.status !== 'ACTIVE') throw new NotFoundException('ไม่พบสินค้า');

    const ratings = p.reviews.map((r) => r.rating);
    const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 5;

    return {
      slug: p.slug,
      name: p.name,
      shortDesc: p.shortDesc ?? undefined,
      description: p.description ?? undefined,
      warranty: p.warranty ?? undefined,
      brand: p.brand.slug as 'fantech' | 'ugreen',
      category: p.categories[0]?.category.name ?? '',
      images: p.images.map((i) => ({ url: i.url, alt: i.alt ?? undefined, type: i.type as 'image' })),
      variants: p.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        name: v.name,
        price: Number(v.price),
        compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
        options: (v.options as Record<string, string>) ?? undefined,
        inStock: v.inventory.reduce((n, inv) => n + (inv.quantity - inv.reserved), 0),
      })),
      specs: p.specs.map((s) => ({ group: s.group ?? undefined, key: s.key, value: s.value })),
      features: p.features.map((f) => ({ title: f.title, body: f.body ?? undefined, imageUrl: f.imageUrl ?? undefined })),
      downloads: p.downloads.map((d) => ({ title: d.title, type: d.type as 'driver', fileUrl: d.fileUrl, version: d.version ?? undefined })),
      reviews: p.reviews.map((r) => ({
        id: r.id,
        author: r.user.firstName ?? 'ลูกค้า',
        rating: r.rating,
        title: r.title ?? undefined,
        body: r.body ?? undefined,
        createdAt: r.createdAt.toISOString(),
      })),
      rating: Number(avg.toFixed(1)),
      reviewCount: ratings.length,
    };
  }
}
