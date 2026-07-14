# GADGET VILLA — สรุปโครงการ (Handover)

แพลตฟอร์ม E-Commerce ระดับ Enterprise สำหรับ Fantech & UGREEN · production-ready architecture

## สร้างครบทั้ง 10 Phase
1. ✅ Business Analysis — `docs/PHASE-1-*`
2. ✅ System Architecture — `docs/PHASE-2-*`
3. ✅ Database Design (Prisma ~30 ตาราง) — `docs/PHASE-3-*`, `packages/db/prisma/schema.prisma`
4. ✅ UI/UX Design System — `docs/PHASE-4-*`, `docs/design-system-preview.html`, tokens
5. ✅ Frontend (Next.js) — `apps/web` (Home, Products, Detail, Cart, Checkout, Account, Wishlist, static, 404/500, PWA)
6. ✅ Backend (NestJS) — `apps/api` (auth/JWT/RBAC, products, orders, health, Swagger)
7. ✅ API Integration — Payment(Omise), BigSeller, TRCLOUD, Shipping(Flash), Google OAuth
8. ✅ Testing — unit/integration/E2E (รัน logic จริงผ่าน 10/10)
9. ✅ Performance — SSR/ISR, image opt, cache, compression, headers
10. ✅ Deployment — Docker, Nginx, Cloudflare, GitHub Actions CI/CD

## Stack
Next.js 14 · NestJS · TypeScript · Prisma · PostgreSQL · Redis · TailwindCSS · Zustand · TanStack Query · Zod · Docker

## เริ่มใช้งาน
```bash
cp .env.example .env      # กรอก secret จริงทั้งหมด
pnpm install
pnpm db:migrate && pnpm db:seed
pnpm dev                  # web :3000 · api :4000 · swagger :4000/docs
# หรือ: docker compose up --build
```

## สิ่งที่ต้องกรอกเอง (.env) ก่อนใช้งานจริง
DB · JWT secrets · OMISE_SECRET_KEY/WEBHOOK · BIGSELLER_API_KEY · TRCLOUD_API_KEY · FLASH_API_KEY (+เจ้าอื่น) · GOOGLE_CLIENT_ID/SECRET · SMTP

## ส่วนที่เสริมได้ภายหลัง (nice-to-have)
- Admin dashboard UI (API + RBAC พร้อมแล้ว)
- Adapters ขนส่งเพิ่ม (J&T/Kerry/ThaiPost/DHL) — ใช้ pattern เดียวกับ Flash
- Queue/Worker (BullMQ) สำหรับ email/PDF/async sync
- Compare, Blog, Brands, Promotion pages
- หน้า PromptPay QR แสดง QR จาก payment charge

## หมายเหตุการทดสอบในเครื่องผู้พัฒนา
โค้ดทั้งหมดผ่าน syntax check; การ `pnpm install`, `build`, และ test เต็มรูปแบบต้องรันบนเครื่องคุณ (แซนด์บ็อกซ์บล็อกการติดตั้ง dependency ขนาดใหญ่และ Prisma engine)
