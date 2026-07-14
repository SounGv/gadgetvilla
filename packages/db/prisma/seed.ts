// ============================================================
// GADGET VILLA — Database Seed (master data เท่านั้น, ไม่มีสินค้า mock)
// รัน: pnpm db:seed
// ============================================================
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ---- Categories (โครงหลัก) ----
  const categories = [
    // FANTECH · Gaming
    { slug: 'gaming-chair', name: 'เก้าอี้เกมมิ่ง', sortOrder: 1 },
    { slug: 'keyboard', name: 'คีย์บอร์ด', sortOrder: 2 },
    { slug: 'mouse', name: 'เมาส์', sortOrder: 3 },
    { slug: 'headset', name: 'หูฟัง', sortOrder: 4 },
    { slug: 'mousepad', name: 'แผ่นรองเมาส์', sortOrder: 5 },
    { slug: 'controller', name: 'จอยเกม', sortOrder: 6 },
    { slug: 'webcam', name: 'เว็บแคม', sortOrder: 7 },
    { slug: 'streaming', name: 'อุปกรณ์สตรีม', sortOrder: 8 },
    // UGREEN · Charging / Storage / Connectivity
    { slug: 'nas', name: 'NAS / NASync', sortOrder: 9 },
    { slug: 'gan-charger', name: 'ที่ชาร์จ GaN', sortOrder: 10 },
    { slug: 'usb-charger', name: 'ที่ชาร์จ USB', sortOrder: 11 },
    { slug: 'powerbank', name: 'พาวเวอร์แบงก์', sortOrder: 12 },
    { slug: 'dock', name: 'Docking Station', sortOrder: 13 },
    { slug: 'usb-hub', name: 'USB Hub', sortOrder: 14 },
    { slug: 'hdmi', name: 'อุปกรณ์ HDMI', sortOrder: 15 },
    { slug: 'display-adapter', name: 'ตัวแปลงจอ', sortOrder: 16 },
    { slug: 'usb-cable', name: 'สาย USB', sortOrder: 17 },
    { slug: 'charging-cable', name: 'สายชาร์จ', sortOrder: 18 },
    { slug: 'bluetooth-adapter', name: 'Bluetooth Adapter', sortOrder: 19 },
    { slug: 'card-reader', name: 'Card Reader', sortOrder: 20 },
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: c,
    });
  }

  // ---- Brands ----
  for (const b of [
    { slug: 'fantech', name: 'Fantech' },
    { slug: 'ugreen', name: 'UGREEN' },
  ]) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name },
      create: b,
    });
  }

  // ---- Warehouse (คลังหลัก) ----
  await prisma.warehouse.upsert({
    where: { code: 'MAIN' },
    update: {},
    create: { code: 'MAIN', name: 'คลังหลัก GADGET VILLA' },
  });

  // ---- Settings ----
  const settings: Record<string, unknown> = {
    store_name: 'GADGET VILLA',
    currency: 'THB',
    free_shipping_min: 990,
    tax_rate: 7,
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: value as object },
      create: { key, value: value as object },
    });
  }

  console.log('✅ Seed master data เสร็จสมบูรณ์ (ไม่มีสินค้า mock — สินค้าจริงมาจาก BigSeller)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
