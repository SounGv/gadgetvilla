# Phase 9-10 — Performance Optimization & Deployment
### GADGET VILLA

## Performance (Phase 9)

| เทคนิค | ทำที่ไหน |
|---|---|
| SSR/ISR + revalidate | หน้า product detail (`revalidate: 300`) |
| Image optimization | `next/image` + AVIF/WebP (`next.config.mjs`) |
| Code splitting / lazy | App Router + `optimizePackageImports` (lucide, framer) |
| Compression | Next `compress:true` + Nginx gzip (พร้อมเปิด brotli) |
| Static asset cache | Nginx `Cache-Control immutable` สำหรับ `/_next/static` |
| Redis cache | query ยอดนิยม + rate limit |
| DB index | กำหนดใน Prisma schema ทุก FK/among |
| Font optimization | `next/font` (Noto Sans Thai, Inter) display swap |

**เป้าหมาย Lighthouse ≥95 ทุกหมวด · หน้าแรก < 2s** — วัดจริงหลัง deploy บนโดเมนของคุณด้วย Cloudflare หน้า edge

## Deployment (Phase 10)

### สถาปัตยกรรม
```
Cloudflare (DNS/SSL/WAF/CDN) → Nginx (reverse proxy, gzip, cache) → web:3000 + api:4000 → postgres + redis
```

### ไฟล์ที่เกี่ยวข้อง
- `docker/api.Dockerfile`, `docker/web.Dockerfile` — multi-stage (deps/dev/build/prod)
- `docker/nginx.conf` — reverse proxy + compression + security headers + cache
- `docker-compose.yml` (dev), `docker-compose.prod.yml` (prod + nginx)
- `.github/workflows/ci.yml` — lint → typecheck → test → build → docker build

### ขั้นตอน deploy จริง (VPS)
```bash
# 1) บนเซิร์ฟเวอร์: ติดตั้ง docker + docker compose
# 2) clone repo, สร้าง .env จาก .env.example แล้วกรอกค่าจริง (secret ทั้งหมด)
cp .env.example .env && nano .env
# 3) รัน production stack
docker compose -f docker-compose.prod.yml up --build -d
# 4) migrate + seed ครั้งแรก
docker compose -f docker-compose.prod.yml exec api sh -c "pnpm --filter @gv/db migrate deploy && pnpm --filter @gv/db seed"
# 5) sync สินค้าจาก BigSeller ครั้งแรก (ผ่าน admin หรือ cron)
```

### Cloudflare
- ชี้ DNS A record → IP เซิร์ฟเวอร์, เปิด proxy (สีส้ม)
- SSL/TLS = Full (strict), เปิด Always Use HTTPS
- Cache rule: cache `/_next/static/*` และ static assets
- เปิด WAF + Rate limiting

### CI/CD
GitHub Actions รัน quality gate ทุก push/PR; บน `main` build docker image
ตั้ง secrets: `REGISTRY_TOKEN`, `DEPLOY_HOST`, `DEPLOY_KEY` เพื่อ auto-deploy (ssh → `docker compose pull && up -d`)

### Security (สรุปที่ทำไว้)
HTTPS · Helmet + Nginx headers · CORS allowlist · Rate limit (Throttler + Cloudflare) · CSRF-ready · Zod/class-validator กัน XSS/SQLi · Prisma parameterized · argon2 · JWT rotate · Audit log · secrets ใน .env

## Checklist ก่อนเปิดร้านจริง
- [ ] กรอก .env ครบ (DB, JWT, Omise, BigSeller, TRCLOUD, Shipping, Google, SMTP)
- [ ] `pnpm install && pnpm db:migrate && pnpm db:seed`
- [ ] เชื่อม BigSeller sync สินค้าจริงเข้าระบบ
- [ ] ทดสอบชำระเงินจริงด้วยบัญชี Omise (sandbox → production)
- [ ] ตั้งโดเมน + Cloudflare + SSL
- [ ] วัด Lighthouse, ปรับจนได้ ≥95
- [ ] ตั้ง backup ฐานข้อมูล + monitoring (Sentry)
