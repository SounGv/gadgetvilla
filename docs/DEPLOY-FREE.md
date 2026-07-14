# Deploy ฟรี — Vercel + Render + Neon + Upstash
### GADGET VILLA (ไม่ต้องมีโดเมน/VPS เสียเงิน)

ผลลัพธ์: เว็บออนไลน์จริงที่ URL ฟรี เช่น `gadgetvilla.vercel.app`

```
เว็บ (Next.js) → Vercel        [ฟรี]
API (NestJS)  → Render         [ฟรี, หลับเมื่อไม่มีคนใช้]
Postgres      → Neon           [ฟรี]
Redis         → Upstash        [ฟรี]
```

> ทุกขั้นต้องทำด้วยบัญชีของคุณเอง (สมัคร/กรอก env) — ผมกรอก credential แทนไม่ได้ แต่บอกทีละคลิก

---

## ขั้น 0 — เอาโค้ดขึ้น GitHub (จำเป็น เพราะ Vercel/Render ดึงจาก GitHub)
1. สมัคร/ล็อกอิน **github.com** → New repository → ตั้งชื่อ `gadgetvilla` → Create (Private ได้)
2. บนเครื่องคุณ (Windows) เปิด PowerShell ที่โฟลเดอร์ `gadgetvilla`:
```powershell
# ล้าง .git ที่ค้างไว้ก่อน (ผมสร้างค้างไว้แต่ลบจาก sandbox ไม่ได้)
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

git init
git add .
git commit -m "GADGET VILLA e-commerce — ready to deploy"
git branch -M main
git remote add origin https://github.com/<username>/gadgetvilla.git
git push -u origin main
```
> git ต้องรันบนเครื่อง Windows ของคุณเอง — ผมรันจาก sandbox ไม่ได้ (network drive ล็อกไฟล์ .git)

## ขั้น 1 — ฐานข้อมูล Postgres (Neon) ฟรี
1. สมัคร **neon.tech** → Create project (เลือก region Singapore)
2. คัดลอก **Connection string** (ขึ้นต้น `postgresql://...`) → เก็บไว้เป็น `DATABASE_URL`
   - ต่อท้ายด้วย `?sslmode=require` ถ้ายังไม่มี

## ขั้น 2 — Redis (Upstash) ฟรี
1. สมัคร **upstash.com** → Create Database (Redis, region Singapore)
2. คัดลอก **Redis URL** (`rediss://...`) → เก็บไว้เป็น `REDIS_URL`

## ขั้น 3 — API ขึ้น Render ฟรี
1. สมัคร **render.com** → เชื่อม GitHub
2. **New → Blueprint** → เลือก repo `gadgetvilla` → Render อ่าน `render.yaml` อัตโนมัติ
3. กด Apply → ระหว่างสร้าง จะให้กรอก env ที่ตั้ง `sync:false`:
   - `DATABASE_URL` = จาก Neon
   - `REDIS_URL` = จาก Upstash
   - `APP_URL` = (ใส่ทีหลังหลังได้ URL Vercel) ชั่วคราวใส่ `http://localhost:3000` ไปก่อน
   - integration keys ปล่อยว่างได้ (ยังไม่ต้องใช้ตอนนี้)
4. รอ build เสร็จ → ได้ URL เช่น `https://gadgetvilla-api.onrender.com`
5. เปิด `https://gadgetvilla-api.onrender.com/health` ต้องขึ้น `{"status":"ok","db":"up"}`
   - (ครั้งแรกช้าเพราะ free tier ตื่นจากหลับ + รัน migrate/seed อัตโนมัติ)

## ขั้น 4 — เว็บขึ้น Vercel ฟรี
1. สมัคร **vercel.com** → เชื่อม GitHub → Import repo `gadgetvilla`
2. ตั้งค่า:
   - **Root Directory** = `apps/web`  ← สำคัญ
   - Framework = Next.js (ตรวจอัตโนมัติ)
3. **Environment Variables** เพิ่ม:
   - `NEXT_PUBLIC_API_URL` = `https://gadgetvilla-api.onrender.com`
4. Deploy → ได้ URL เช่น `https://gadgetvilla.vercel.app`

## ขั้น 5 — เชื่อม 2 ฝั่งให้คุยกัน
1. กลับไป Render → service API → Environment → แก้ `APP_URL` = `https://gadgetvilla.vercel.app` → Save (redeploy)
   - (เพื่อเปิด CORS ให้เว็บเรียก API ได้)
2. เปิด `https://gadgetvilla.vercel.app` — เว็บควรขึ้นแล้ว 🎉

## ขั้น 6 — ใส่สินค้าจริง
- หน้าเว็บจะยังว่าง (ไม่มี mock) — ต้อง sync จาก BigSeller:
  - ตั้ง `BIGSELLER_API_KEY` ใน Render แล้วเรียก sync (ผ่าน admin หรือ API)
- หรือถ้าอยากลองเพิ่มสินค้าเองก่อน ใช้ Swagger ที่ `https://gadgetvilla-api.onrender.com/docs` (ต้องมี token admin)

---

## ข้อจำกัดแพลนฟรี (พูดตรงๆ)
- Render free **หลับเมื่อไม่มีคนใช้** → เข้าครั้งแรกช้า ~30-50 วินาที
- Neon/Upstash มีลิมิตพื้นที่/connection
- ไม่เหมาะทราฟฟิกสูงหรือขายจริงจังระยะยาว → พอโตค่อยย้ายขึ้น VPS (ดู `DEPLOY-Cloudflare-Tunnel.md`)
- การรับเงินจริง (Omise) ต้องสมัคร merchant แยก (ไม่มีฟรี)

## เชื่อมโดเมนสวยภายหลัง (ถ้าซื้อโดเมน)
- Vercel: Settings → Domains → Add `gadgetvilla.com`
- Cloudflare: จัดการ DNS/CDN ครอบได้ (ชี้ CNAME มา Vercel)
