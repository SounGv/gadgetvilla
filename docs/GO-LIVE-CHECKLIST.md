# GADGET VILLA — Go-Live Checklist

รวมทุกขั้นตอนสำหรับนำเว็บขึ้นใช้งานจริง เรียงตามลำดับ

## 1. เตรียมเครื่อง / บัญชี
- [ ] ติดตั้ง Node 20+, pnpm, Docker + Docker Compose บนเซิร์ฟเวอร์
- [ ] มีโดเมน (gadgetvilla.co.th) + บัญชี Cloudflare
- [ ] บัญชี merchant: **Omise** (payment), **BigSeller**, **TRCLOUD**, ขนส่ง (Flash/J&T/Kerry/ไปรษณีย์/DHL)
- [ ] Google Cloud OAuth Client (สำหรับ Google Login)
- [ ] บัญชี SMTP สำหรับส่งอีเมล

## 2. ตั้งค่า (ในเครื่อง/เซิร์ฟเวอร์)
- [ ] `cp .env.example .env` แล้วกรอกค่า **secret จริงทั้งหมด** (ผู้ดูแลกรอกเอง ไม่ commit ขึ้น git)
- [ ] `bash scripts/setup.sh` หรือ `make setup` (install + migrate + seed)
- [ ] ตรวจ `pnpm dev` ขึ้นได้: web :3000, api :4000, Swagger :4000/docs

## 3. ข้อมูลสินค้า (ห้าม mock)
- [ ] ตั้งค่า `BIGSELLER_API_KEY` แล้วเรียก `POST /integrations/bigseller/sync` (หรือปุ่มใน admin)
- [ ] ตรวจว่าสินค้า/ราคา/สต็อกจริงไหลเข้า DB และแสดงบนหน้าเว็บ
- [ ] ตั้ง webhook BigSeller ชี้มาที่ `/integrations/bigseller/webhook` (realtime stock)
- [ ] ตั้ง cron sync สำรอง (รายชั่วโมง/วัน)

## 4. การชำระเงิน
- [ ] กรอก `OMISE_SECRET_KEY`, `OMISE_PUBLIC_KEY`, `OMISE_WEBHOOK_SECRET`
- [ ] ตั้ง Omise webhook → `/payments/webhook`
- [ ] ทดสอบ **sandbox** ก่อน: PromptPay QR ขึ้นจริง, จ่ายแล้วออเดอร์เป็น PAID อัตโนมัติ
- [ ] ทดสอบบัตรเครดิต (3DS) + COD
- [ ] สลับเป็น production key เมื่อพร้อม

## 5. เอกสาร / ภาษี
- [ ] กรอก `TRCLOUD_API_KEY`, `TRCLOUD_COMPANY_ID`
- [ ] ทดสอบ: ออเดอร์ที่ขอใบกำกับภาษี → สร้างใน TRCLOUD อัตโนมัติหลังชำระเงิน

## 6. การจัดส่ง
- [ ] กรอก API key ของขนส่งที่ใช้ (อย่างน้อย 1 เจ้า)
- [ ] ทดสอบ `/shipping/quote` คืนค่าส่งถูกต้อง
- [ ] ทดสอบสร้าง label + tracking

## 7. บัญชี Admin
- [ ] สร้าง user แล้วอัปเดต role เป็น `ADMIN`/`SUPER_ADMIN` ใน DB
- [ ] เข้า `/admin` เห็น dashboard + สถิติจริง

## 8. คุณภาพ / ความปลอดภัย
- [ ] `pnpm lint && pnpm typecheck && pnpm test` ผ่าน
- [ ] `pnpm --filter @gv/web exec playwright test` (E2E) ผ่าน
- [ ] ตรวจ JWT secrets เป็นค่า random ยาว (ไม่ใช่ค่า default)
- [ ] เปิด HTTPS ทุกชั้น + Cloudflare WAF + rate limit
- [ ] ตั้ง backup DB อัตโนมัติ

## 9. Performance / SEO
- [ ] `pnpm build` สำเร็จ
- [ ] วัด Lighthouse ทุกหมวด ≥95, หน้าแรก < 2s (ปรับ image/cache จนผ่าน)
- [ ] ตรวจ sitemap.xml, robots.txt, meta/OG, JSON-LD หน้า product
- [ ] ทดสอบ PWA ติดตั้งได้

## 10. Deploy
- [ ] `docker compose -f docker-compose.prod.yml up --build -d`
- [ ] migrate + seed บน production: `... exec api sh -c "pnpm --filter @gv/db migrate:deploy && pnpm --filter @gv/db seed"`
- [ ] Cloudflare: ชี้ DNS, SSL Full(strict), cache `/_next/static/*`, WAF
- [ ] ตั้ง GitHub Actions secrets เพื่อ auto-deploy (REGISTRY_TOKEN, DEPLOY_HOST, DEPLOY_KEY)
- [ ] ทดสอบสั่งซื้อจริง 1 ออเดอร์ครบ loop (สินค้า → จ่าย → เอกสาร → ติดตาม)
- [ ] ปิด "Opening soon" / เปิดร้านจริง 🎉

## คำสั่งลัด (Makefile)
```
make setup       # ตั้งค่าครั้งแรก
make dev         # รัน dev
make test        # unit tests
make docker-prod # รัน production
```
