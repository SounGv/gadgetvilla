#!/usr/bin/env bash
# GADGET VILLA — local setup อัตโนมัติ
set -e

echo "==> 1) ตรวจ prerequisites"
command -v pnpm >/dev/null || { echo "ต้องติดตั้ง pnpm ก่อน: npm i -g pnpm"; exit 1; }
command -v docker >/dev/null || echo "แนะนำติดตั้ง Docker (สำหรับ postgres/redis)"

echo "==> 2) เตรียม .env"
[ -f .env ] || { cp .env.example .env; echo "สร้าง .env จาก .env.example แล้ว — กรุณากรอกค่า secret จริง"; }

echo "==> 3) เปิด database (postgres + redis) ด้วย docker"
docker compose up -d postgres redis || echo "ข้ามขั้นตอน docker (เปิด DB เอง)"

echo "==> 4) ติดตั้ง dependencies"
pnpm install

echo "==> 5) generate + migrate + seed"
pnpm --filter @gv/db generate
pnpm --filter @gv/db migrate deploy || pnpm --filter @gv/db migrate
pnpm --filter @gv/db seed

echo "==> เสร็จ! รัน:  pnpm dev   (web :3000 · api :4000 · docs :4000/docs)"
