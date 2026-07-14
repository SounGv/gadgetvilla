# Phase 2 — System Architecture
### GADGET VILLA · Enterprise E-Commerce Platform

> Defaults ที่เลือกให้ (ปรับได้ภายหลัง): **BigSeller = source of truth ของสินค้า/สต็อก/ออเดอร์**, Payment ใช้ **adapter pattern** (default: Omise — รองรับ PromptPay + บัตร), Deploy ด้วย **Docker Compose + Nginx + Cloudflare + GitHub Actions CI/CD** (ลงได้ทั้ง VPS และ Cloud)

---

## 1. High-Level Architecture

```
                         ┌───────────────────────────┐
                         │        Cloudflare          │  CDN, WAF, DNS, SSL
                         └─────────────┬─────────────┘
                                       │
                         ┌─────────────▼─────────────┐
                         │           Nginx            │  reverse proxy, gzip/brotli
                         └──────┬──────────────┬──────┘
                                │              │
              ┌─────────────────▼───┐   ┌──────▼──────────────────┐
              │  Web (Next.js)      │   │  API (NestJS)           │
              │  storefront + admin │──▶│  REST + Swagger + Auth  │
              │  SSR/ISR, PWA       │   │  RBAC, business logic   │
              └─────────────────────┘   └──────┬───────┬──────────┘
                                                │       │
                          ┌─────────────────────┘       └──────────────┐
                          │                                            │
                   ┌──────▼──────┐   ┌───────────┐   ┌──────────┐  ┌───▼─────────┐
                   │ PostgreSQL  │   │   Redis   │   │  Worker  │  │ Integrations│
                   │  (Prisma)   │   │ cache+    │   │  (BullMQ │  │  BigSeller  │
                   │             │   │ queue     │◀─▶│  jobs)   │  │  TRCLOUD    │
                   └─────────────┘   └───────────┘   └──────────┘  │  Payment    │
                                                                    │  Shipping   │
                                                                    │  Chat/LINE  │
                                                                    └─────────────┘
```

## 2. Monorepo Structure (Turborepo + pnpm workspaces)

```
gadgetvilla/
├── apps/
│   ├── web/                 # Next.js 14 (App Router) — storefront + admin
│   └── api/                 # NestJS — REST API + workers
├── packages/
│   ├── ui/                  # Design System (shadcn/ui base + custom components)
│   ├── config/              # eslint, tsconfig, tailwind preset (shared)
│   ├── types/               # shared TypeScript types + Zod schemas
│   └── db/                  # Prisma schema + client + migrations + seed
├── docker/                  # Dockerfiles, nginx.conf
├── .github/workflows/       # CI/CD (GitHub Actions)
├── docs/                    # เอกสารทุก Phase
├── docker-compose.yml       # dev: postgres + redis + api + web
├── docker-compose.prod.yml  # prod: + nginx
├── .env.example
├── turbo.json
└── package.json
```

## 3. Technology Decisions

**Frontend (apps/web)**
- Next.js 14 App Router (SSR/ISR/SSG) · React 18 · TypeScript
- TailwindCSS + shadcn/ui + Radix · Framer Motion (animation)
- TanStack Query (server state) + Zustand (client state: cart, ui)
- React Hook Form + Zod (validation) · Axios (typed API client)
- next/image (optimization) · next-pwa (PWA) · next-seo + JSON-LD (SEO)

**Backend (apps/api)**
- NestJS + TypeScript · REST + `@nestjs/swagger` (OpenAPI docs)
- Prisma ORM · class-validator + Zod (DTO validation)
- BullMQ + Redis (queue/worker: email, invoice PDF, sync jobs)
- Passport (JWT strategy + Google OAuth) · argon2 (password hashing)

**Data**
- PostgreSQL 16 (primary) · Redis 7 (cache, session, queue, rate-limit)
- Prisma migrations + seed script (seed = master data เช่น role/category เท่านั้น, ไม่ใช่สินค้า mock)

## 4. Authentication & Authorization

- **Auth:** email+password (argon2) และ Google OAuth 2.0
- **Token:** JWT access token (อายุสั้น ~15 นาที) + refresh token (httpOnly secure cookie, หมุนเวียน/rotate)
- **RBAC:** role → permission mapping, guard ระดับ route + method (`@Roles()`, `@Permissions()`)
- **Roles:** guest, customer, dealer, staff, content_editor, warehouse, admin, super_admin
- **Session:** refresh token เก็บ hash ใน DB/Redis เพื่อ revoke ได้

## 5. Integration Design (Adapter/Port pattern)

ทุก integration ออกแบบเป็น interface (port) + adapter เพื่อสลับผู้ให้บริการได้ และทดสอบง่าย

| Integration | Sync | รายละเอียด |
|---|---|---|
| **BigSeller** | Webhook (realtime) + Schedule (fallback) + Manual | Product/SKU/Barcode/Price/Promotion/Inventory/Orders/Shipment/Tracking. BigSeller = source of truth ของสต็อก; เว็บ push order กลับ |
| **TRCLOUD** | On-event | สร้าง Customer/Invoice/Receipt/Tax Invoice/Credit Note เมื่อชำระเงินสำเร็จ; ดึง Sales Report |
| **Payment** | SDK + Webhook | `PaymentPort` → OmiseAdapter (default), รองรับเพิ่ม 2C2P/GBPrimePay. PromptPay, บัตร, Mobile Banking, COD |
| **Shipping** | API | `ShippingPort` → Flash/J&T/Kerry/ThaiPost/DHL adapters. คำนวณค่าส่ง, สร้าง label, tracking |
| **Chat/Notify** | API/Webhook | LINE OA, Messenger, Telegram, Email (transactional) + AI chat (RAG จาก knowledge base) |

**หลักการความปลอดภัยของ integration:** secret ทั้งหมดอยู่ใน env; webhook ตรวจ signature; job มี retry + dead-letter; ทุก external call มี timeout + circuit breaker

## 6. Data & Sync Strategy

- BigSeller webhook → API endpoint (ตรวจ signature) → enqueue job → worker update DB → invalidate Redis cache → revalidate ISR page
- Schedule job (cron) ดึงข้อมูลเต็มวันละครั้ง/รายชั่วโมง เป็น fallback กันข้อมูลหลุด
- Order flow: checkout → payment webhook (paid) → create order in DB → push to BigSeller → create invoice in TRCLOUD → email เอกสาร → worker

## 7. Security Architecture

HTTPS ทุกชั้น · Helmet headers · CORS allowlist · Rate limit (Redis) · CSRF (double-submit/cookie) · Input validation (Zod/class-validator) กัน XSS/SQLi · Prisma parameterized queries · argon2 · secrets ใน env/secret manager · Audit log ทุก action ที่เปลี่ยนข้อมูลใน admin · encryption at rest สำหรับข้อมูลอ่อนไหว

## 8. Performance Architecture

SSR/ISR + edge cache (Cloudflare) · Redis cache สำหรับ query ยอดนิยม · next/image + AVIF/WebP · code splitting + lazy load · brotli/gzip · DB index + connection pool · CDN สำหรับ static · เป้าหมาย Lighthouse ≥95 ทุกหมวด, หน้าแรก < 2s

## 9. Deployment Architecture

- **Dev:** `docker-compose up` (postgres + redis + api + web hot reload)
- **Prod:** `docker-compose.prod.yml` (+ nginx) หรือแยก service ขึ้น cloud
- **CI/CD:** GitHub Actions — lint → typecheck → test → build → docker build/push → deploy
- **Edge:** Cloudflare (DNS, SSL, WAF, CDN, cache rules)
- **Observability:** health endpoints, structured logs, error tracking (Sentry-ready)

## 10. Environments

| Env | ใช้ทำอะไร | Data |
|---|---|---|
| local | พัฒนา | seed master data |
| staging | ทดสอบ/ยิง sandbox ของ gateway | ข้อมูลทดสอบ |
| production | ใช้งานจริง | ข้อมูลจริงจาก BigSeller/TRCLOUD |

---

*สถานะ: รอตรวจ/อนุมัติ เพื่อเข้าสู่ Phase 3 (Database Design) — โครง repo จริงถูกสร้างแล้วในโฟลเดอร์นี้*
