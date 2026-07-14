# Phase 3 — Database Design
### GADGET VILLA · PostgreSQL + Prisma

Schema จริงอยู่ที่ `packages/db/prisma/schema.prisma` — ครอบคลุมทุก module ที่กำหนดใน requirements

## กลุ่มตาราง (Domains)

**Auth / RBAC**
`User` (role enum 8 ระดับ), `OAuthAccount` (Google), `RefreshToken` (rotate/revoke ได้), `Address`

**Catalog**
`Brand`, `Category` (โครงต้นไม้ parent/children), `Product`, `ProductVariant` (SKU/barcode/price/options), `ProductImage` (image/video/360°), `ProductSpec`, `ProductFeature`, `ProductDownload` (driver/firmware/manual), `ProductRelation` (related/crosssell/upsell), `ProductCategory` (join m:n)

**Inventory**
`Warehouse`, `Inventory` (quantity + reserved ต่อ variant ต่อคลัง)

**Commerce**
`Cart` + `CartItem` (รองรับทั้ง member และ guest), `Order` + `OrderItem` (เก็บ snapshot ราคา/ชื่อ), `Payment` (status/method/provider/webhook payload), `Shipment` (carrier/tracking/label/timeline), `Invoice` (5 ประเภทเอกสาร + PDF + TRCLOUD ref)

**Marketing**
`Coupon` (percent/fixed, min spend, usage limit), `Promotion` (flash sale/bundle/campaign แบบ rule-based JSON)

**Engagement**
`Review` (1 คน 1 รีวิว/สินค้า, approve ก่อนแสดง), `Question` (Q&A), `WishlistItem`

**After-Sales**
`WarrantyRegistration`, `ReturnRequest` (คืน/เปลี่ยน), `Ticket` + `TicketMessage`

**Content**
`BlogPost`, `FaqItem`

**System / Integration**
`SyncLog` (BigSeller/TRCLOUD inbound/outbound), `AuditLog` (before/after ทุกการเปลี่ยนแปลงใน admin), `Setting` (key-value JSON)

## หลักการออกแบบสำคัญ

1. **Snapshot ในออเดอร์** — `OrderItem` เก็บชื่อ/ราคา/SKU ณ เวลาซื้อ เพื่อไม่ให้ข้อมูลเปลี่ยนย้อนหลังเมื่อสินค้าถูกแก้
2. **Inventory มี reserved** — กันของซ้ำระหว่าง checkout ก่อนชำระเงินเสร็จ
3. **BigSeller sync fields** — `bigsellerId`, `bigsellerSku`, `bigsellerOrderId` เป็น source-of-truth mapping
4. **Money = Decimal(12,2)** — ไม่ใช้ float กันปัญหาปัดเศษเงิน
5. **Soft references (onDelete: SetNull)** — ลบ user แล้วออเดอร์/ประวัติยังอยู่
6. **Index ครบ** จุดที่ query บ่อย (role, status, foreign keys, slug unique)
7. **Audit + Sync log** ทุกการเปลี่ยนแปลงตรวจสอบย้อนหลังได้

## ความสัมพันธ์หลัก (ย่อ)
```
User 1─* Order 1─* OrderItem *─1 ProductVariant *─1 Product *─1 Brand
Order 1─1 Payment / 1─1 Shipment / 1─* Invoice
Product 1─* Variant / Image / Spec / Feature / Download / Review / Question
Variant *─* Warehouse (ผ่าน Inventory)
Product *─* Category (ผ่าน ProductCategory)
```

## Seed
`packages/db/prisma/seed.ts` ใส่เฉพาะ **master data** (roles, หมวดหมู่หลัก, warehouse, settings) — **ไม่มีสินค้า mock**; สินค้าจริงมาจาก BigSeller sync

## การรัน
```bash
pnpm db:generate   # generate Prisma client
pnpm db:migrate    # สร้าง/อัปเดตตาราง
pnpm db:seed       # master data
```

*สถานะ: รอตรวจ/อนุมัติ เพื่อเข้าสู่ Phase 4 (UI/UX Design System)*
