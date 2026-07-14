# Phase 4 — UI/UX Design System
### GADGET VILLA · "Villa" Design System (ออกแบบเอง ไม่ใช้ template)

ระดับประสบการณ์เป้าหมาย: Apple Store / ASUS / Razer / Samsung Store — พรีเมียม สะอาด โหลดเร็ว
ไฟล์ token จริง: `packages/config/tailwind-preset.ts` และ `packages/ui/styles/tokens.css`

---

## 1. Design Principles
1. **Product-first** — สินค้าเป็นพระเอก พื้นที่ว่างเยอะ ภาพคมชัด
2. **Quiet luxury** — พรีเมียมด้วยพื้นที่ว่าง คอนทราสต์ และดีเทล ไม่ใช่สีจัดจ้าน
3. **Fast & calm** — ทรานสิชันนุ่มนวล ไม่มี motion รบกวน โหลดไว
4. **Accessible** — คอนทราสต์ผ่าน WCAG AA, โฟกัสชัด, แตะง่ายบนมือถือ
5. **Consistent** — ทุกอย่างมาจาก token เดียวกัน

## 2. Color System

**Brand**
| Token | Light | Dark | ใช้ทำอะไร |
|---|---|---|---|
| `--brand` (primary) | `#111318` (near-black) | `#F5F7FA` | สีหลักแบรนด์/ปุ่มหลัก |
| `--accent` (Fantech) | `#E11D2A` | `#FF4D57` | จุดเน้น, ป้ายลด, CTA รอง |
| `--accent-2` (UGREEN) | `#16A34A` | `#22C55E` | แท็ก UGREEN, success |

> primary เป็นโทน near-black/white สไตล์ Apple/Samsung เพื่อความพรีเมียม ส่วนสีแบรนด์ Fantech(แดง)/UGREEN(เขียว) ใช้เป็น accent เฉพาะจุด

**Neutrals (scale)** `--gray-50 … --gray-950` — พื้นหลัง, เส้น, ข้อความรอง
**Semantic** `--success #16A34A` · `--warning #F59E0B` · `--error #DC2626` · `--info #2563EB`
**Surface** `--bg`, `--bg-subtle`, `--card`, `--border`, `--ring`

## 3. Typography

- **หลัก (ไทย+อังกฤษ):** `LINE Seed Sans TH` / fallback `Noto Sans Thai`, `Inter`, system-ui
- **ตัวเลข/ราคา:** ใช้ tabular-nums
- **Scale (rem):** display 3.5 / h1 2.5 / h2 2 / h3 1.5 / h4 1.25 / body 1 / sm .875 / xs .75
- **Weight:** 400 / 500 / 600 / 700 / 800
- **Line-height:** heading 1.15, body 1.6 · **Tracking:** heading -0.02em

## 4. Spacing & Layout
- **Spacing scale (4px base):** 0,1(4),2(8),3(12),4(16),5(20),6(24),8(32),10(40),12(48),16(64),20(80),24(96)
- **Container:** max-width 1280px, gutter 16/24px
- **Grid:** 12 คอลัมน์ (desktop), product grid 4→3→2→1
- **Breakpoints:** sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536

## 5. Radius / Shadow / Border
- **Radius:** sm 8 · md 12 · lg 16 · xl 20 · full 999
- **Shadow:** xs, sm, md, lg, xl — นุ่ม โปร่ง (สไตล์ Apple) ไม่ดำทึบ
- **Border:** 1px `--border`, hover ยกด้วย shadow ไม่ใช่เส้นหนา

## 6. Motion (Framer Motion)
- **Duration:** fast 150ms · base 220ms · slow 350ms
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-expo) สำหรับ enter
- **Patterns:** fade+rise 8px (การ์ดเข้า), scale 0.98→1 (ปุ่มกด), stagger 40ms (กริด), page transition นุ่ม
- **เคารพ** `prefers-reduced-motion` — ปิด animation ให้ผู้ใช้ที่ตั้งค่า

## 7. Components (spec)
Button (primary/secondary/ghost/destructive · sm/md/lg · loading/disabled) · Input/Select/Checkbox/Radio/Switch · Card (product/content) · Badge/Tag (new/hot/sale/brand) · Rating stars · Price (มีราคาเดิม/ส่วนลด %) · Breadcrumb · Tabs · Accordion · Dialog/Sheet/Drawer (cart) · Toast · Tooltip · Pagination · Skeleton · Gallery/ImageZoom · QuantityStepper · Stepper (checkout)

## 8. States (บังคับทุก data view)
- **Loading:** skeleton ตรงตามรูปทรง component (ไม่ใช่ spinner กลางจอ)
- **Empty:** ไอคอน + ข้อความ + CTA (เช่น ตะกร้าว่าง → "เลือกซื้อสินค้า")
- **Error:** ข้อความชัดเจน + ปุ่มลองใหม่
- **Success:** toast/inline ยืนยัน
- **Hover/Focus/Active/Disabled:** ทุก interactive element มีครบ, focus ring มองเห็นชัด

## 9. Dark / Light Mode
- ใช้ CSS variables + `class="dark"` (next-themes)
- ทุก token มีคู่ light/dark, ทดสอบคอนทราสต์ทั้งสองโหมด
- ค่าเริ่มต้น = ตามระบบผู้ใช้ (system)

## 10. Accessibility Checklist
คอนทราสต์ ≥ 4.5:1 (ข้อความ) · focus ring ทุก element · แตะขั้นต่ำ 44×44px · alt text ทุกภาพ · semantic HTML + ARIA · keyboard navigable · form label ครบ

---

*สถานะ: รอตรวจ/อนุมัติ เพื่อเข้าสู่ Phase 5 (Frontend Development) — token จริงถูกสร้างเป็นโค้ดแล้ว*
