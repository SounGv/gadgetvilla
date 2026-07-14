# GADGET VILLA — Enterprise E-Commerce Platform

แพลตฟอร์ม E-Commerce ระดับ Enterprise สำหรับจำหน่ายสินค้า **Fantech** และ **UGREEN**
โครงสร้าง production-ready · Next.js + NestJS + Prisma + PostgreSQL + Redis

## Stack
- **Frontend:** Next.js 14 (App Router), React, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, TanStack Query, Zustand, React Hook Form + Zod, PWA
- **Backend:** NestJS, TypeScript, Prisma, REST + Swagger, BullMQ (queue/worker)
- **Data:** PostgreSQL 16, Redis 7
- **Auth:** JWT + refresh token, RBAC, Google OAuth
- **Infra:** Docker, Nginx, Cloudflare, GitHub Actions CI/CD

## โครงสร้าง (Monorepo — Turborepo + pnpm)
```
apps/web    Next.js storefront + admin
apps/api    NestJS API + workers
packages/ui       Design System
packages/db       Prisma schema + migrations + seed
packages/types    shared types + Zod
packages/config   shared eslint/tsconfig/tailwind
```

## เริ่มต้นใช้งาน (Dev)
```bash
cp .env.example .env          # แล้วกรอกค่าจริง
pnpm install
pnpm db:migrate               # สร้างตารางในฐานข้อมูล
pnpm db:seed                  # master data (role, category)
pnpm dev                      # web:3000  api:4000  swagger:4000/docs
```
หรือใช้ Docker ทั้งชุด:
```bash
docker compose up --build
```

## Roadmap (10 Phases)
1. ✅ Business Analysis — `docs/PHASE-1-*`
2. ✅ System Architecture — `docs/PHASE-2-*`
3. ⏳ Database Design
4. UI/UX Design System
5. Frontend Development
6. Backend Development
7. API Integration
8. Testing
9. Performance Optimization
10. Deployment

## หมายเหตุความปลอดภัย
ค่า secret/API key ทั้งหมด (payment, BigSeller, TRCLOUD, shipping, OAuth) ต้องกรอกใน `.env` โดยเจ้าของระบบเอง — ไม่มีการเก็บ secret ในโค้ด และไม่ commit `.env` ขึ้น git
