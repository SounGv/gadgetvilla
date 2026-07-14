# Deploy — VPS + Cloudflare Tunnel
### GADGET VILLA (gadgetvilla.co.th)

วิธีนี้ปลอดภัยสุด: VPS **ไม่ต้องเปิดพอร์ต 80/443 สู่อินเทอร์เน็ต** — Cloudflare Tunnel (cloudflared) วิ่งออกจาก VPS ไปหา Cloudflare แล้ว Cloudflare รับทราฟฟิกจากโดเมนส่งเข้ามาให้

```
ผู้ใช้ → Cloudflare (DNS/SSL/CDN/WAF) → Tunnel → cloudflared (ใน VPS) → nginx → web/api → postgres/redis
```

> ⚠️ Tunnel ตั้งที่ **Zero Trust → Networks → Tunnels** ไม่ใช่หน้า "Workers & Pages"

---

## ขั้นที่ 1 — เตรียม VPS
1. เช่า VPS (DigitalOcean / Vultr / AWS Lightsail) — แนะนำ Ubuntu 22.04, RAM ≥ 2GB
2. ติดตั้ง Docker + Compose:
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```
3. อัปโหลดโปรเจกต์ขึ้น VPS (git clone หรือ scp โฟลเดอร์ `gadgetvilla`)

## ขั้นที่ 2 — สร้าง Tunnel ใน Cloudflare
1. เข้า **https://one.dash.cloudflare.com** (Zero Trust)
2. เมนูซ้าย: **Networks → Tunnels → Create a tunnel**
3. เลือก **Cloudflared** → ตั้งชื่อ เช่น `gadgetvilla` → Save
4. หน้าถัดไปจะมี **Tunnel Token** (ขึ้นต้น `eyJ...`) — **คัดลอกเก็บไว้**
5. ยังไม่ต้องรันคำสั่งที่ Cloudflare โชว์ (เราใส่ token ใน docker แทน)
6. ในหน้า **Public Hostnames** ของ tunnel นี้ กด **Add a public hostname**:
   - Subdomain: (เว้นว่าง) · Domain: `gadgetvilla.co.th` · Service: `HTTP` → `nginx:80`
   - เพิ่มอีกอัน: Subdomain `www` · Domain `gadgetvilla.co.th` · Service `HTTP` → `nginx:80`

> ต้องเพิ่มโดเมน `gadgetvilla.co.th` เข้า Cloudflare ก่อน (Add site) และชี้ nameserver ที่ผู้จดโดเมน

## ขั้นที่ 3 — ตั้งค่า .env บน VPS
```bash
cd gadgetvilla
cp .env.example .env
nano .env
```
กรอกให้ครบ โดยเฉพาะ:
- `CLOUDFLARE_TUNNEL_TOKEN=` (token จากขั้นที่ 2)
- `DATABASE_URL`, `POSTGRES_*`, `JWT_*`
- `APP_URL=https://gadgetvilla.co.th`, `API_URL=https://gadgetvilla.co.th/api`
- `NEXT_PUBLIC_API_URL=https://gadgetvilla.co.th/api`
- secret ของ Omise / BigSeller / TRCLOUD / Shipping / Google / SMTP

## ขั้นที่ 4 — รัน production stack
```bash
docker compose -f docker-compose.prod.yml up --build -d
```
บริการที่ขึ้น: postgres, redis, api, web, nginx, **cloudflared** (ต่อ tunnel อัตโนมัติด้วย token)

## ขั้นที่ 5 — migrate + seed (ครั้งแรก)
```bash
docker compose -f docker-compose.prod.yml exec api sh -c \
  "pnpm --filter @gv/db migrate:deploy && pnpm --filter @gv/db seed"
```

## ขั้นที่ 6 — sync สินค้าจริง + ตรวจ
1. sync BigSeller (ผ่าน admin หรือเรียก API ด้วย token admin)
2. เปิด `https://gadgetvilla.co.th` — ควรเห็นเว็บผ่าน HTTPS ของ Cloudflare
3. ตั้ง Omise webhook → `https://gadgetvilla.co.th/api/payments/webhook`
4. ทดสอบสั่งซื้อจริง 1 ออเดอร์ครบ loop

## Cloudflare (ตั้งค่าเสริมในแดชบอร์ดโดเมน)
- **SSL/TLS**: Full (strict) · เปิด Always Use HTTPS
- **Speed → Optimization**: เปิด Brotli, Auto Minify
- **Caching → Cache Rules**: cache `/_next/static/*` (Edge TTL 1 ปี)
- **Security → WAF**: เปิด Managed Rules + Rate Limiting

## อัปเดตเวอร์ชันภายหลัง
```bash
git pull
docker compose -f docker-compose.prod.yml up --build -d
```
(หรือใช้ GitHub Actions ที่เตรียมไว้ให้ auto build/deploy)

---

### สิ่งที่ผมทำแทนคุณไม่ได้ (ต้องทำเอง)
- สร้างบัญชี/Tunnel และคัดลอก Tunnel Token
- กรอก secret ทั้งหมดใน `.env`
- ชี้ nameserver โดเมน + ยืนยันใน Cloudflare
เหตุผล: เป็น credential/บัญชีของคุณ ผมกรอกหรือกดยืนยันแทนไม่ได้ตามนโยบายความปลอดภัย — แต่ทุกไฟล์ config พร้อมแล้ว ทำตามขั้นด้านบนได้เลย
