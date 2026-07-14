# Phase 1 — Business Analysis
### GADGET VILLA · แพลตฟอร์ม E-Commerce ระดับ Enterprise

เอกสารนี้เป็นผลลัพธ์ของ Phase 1 ตามลำดับงานที่กำหนด ต้องได้รับการตรวจสอบและอนุมัติก่อนเข้าสู่ Phase 2 (System Architecture)

---

## 1. ภาพรวมธุรกิจ (Business Overview)

**บริษัท:** GADGET VILLA — Technology Store
**โมเดลธุรกิจ:** ตัวแทนจำหน่ายสินค้าเทคโนโลยีของแท้ (B2C เป็นหลัก, รองรับ B2B/Dealer)
**แบรนด์หลัก:** Fantech (เกมมิ่งเกียร์) และ UGREEN (อุปกรณ์ชาร์จ/จัดเก็บข้อมูล/อุปกรณ์เสริม)
**ตลาด:** ประเทศไทย (ภาษาไทยเป็นหลัก, สกุลเงิน THB)
**ช่องทางปัจจุบัน:** Shopee (ugreenbygadgetvilla), Shopify (กำลังตั้งค่า) → ต้องการเว็บไซต์ของตัวเองที่ควบคุมได้เต็มที่

**เป้าหมายเชิงกลยุทธ์:**
1. มีเว็บไซต์ของแบรนด์เองที่ไม่ต้องพึ่งค่าธรรมเนียม/ข้อจำกัดของ marketplace
2. เชื่อมระบบหลังบ้านที่ใช้อยู่ (BigSeller = สต็อก/ออเดอร์, TRCLOUD = บัญชี/ใบกำกับภาษี) เพื่อลดงานซ้ำซ้อน
3. ยกระดับประสบการณ์ลูกค้าให้เทียบชั้น Apple Store / ASUS / Razer / Samsung Store
4. รองรับการขยายสินค้า/แบรนด์/ยอดขายในอนาคต (scalable)

---

## 2. กลุ่มผู้ใช้และบทบาท (User Personas & Roles)

| บทบาท | คำอธิบาย | สิทธิ์หลัก (RBAC) |
|---|---|---|
| **Guest** | ผู้เยี่ยมชมทั่วไป | ดูสินค้า, ค้นหา, เปรียบเทียบ, ใส่ตะกร้า (guest cart) |
| **Customer** | ลูกค้าที่สมัครสมาชิก | สั่งซื้อ, ติดตามพัสดุ, wishlist, รีวิว, ลงทะเบียนประกัน, แจ้งเคลม, เปิด ticket |
| **Dealer** | ตัวแทน/ร้านค้าส่ง | ราคา dealer, สั่งซื้อจำนวนมาก, เครดิตเทอม (ถ้ามี), ใบเสนอราคา |
| **Staff / CS** | พนักงานบริการลูกค้า | จัดการออเดอร์, ตอบ ticket/live chat, จัดการเคลม/คืนสินค้า |
| **Content Editor** | ทีมคอนเทนต์/การตลาด | จัดการ blog, promotion, banner, SEO, flash sale |
| **Warehouse** | คลังสินค้า | ดูออเดอร์, พิมพ์ label, อัปเดตสถานะจัดส่ง, จัดการสต็อก |
| **Admin** | ผู้ดูแลระบบ | CRUD ทุก module, จัดการผู้ใช้/สิทธิ์, ตั้งค่าระบบ |
| **Super Admin** | เจ้าของ/ผู้บริหาร | เข้าถึงทุกอย่าง + audit log + การตั้งค่าความปลอดภัย |

---

## 3. ขอบเขตระบบ (Scope) — แบ่งตามโดเมน

### 3.1 Storefront (หน้าเว็บลูกค้า)
Home · About · Brands · Categories · Product List · Product Detail · Compare · Wishlist · Cart · Checkout · Payment · Order Tracking · Warranty · Support · Blog · FAQ · Downloads · Contact · Dealer · Promotion · Flash Sale · Bundle · New Arrival · Best Seller · News · Privacy Policy · Terms · 404 · 500

### 3.2 Product Experience (หน้าสินค้า)
Gallery · Video · 360° View · Specification · Features · Downloads (Driver/Firmware) · Warranty info · Review & Rating · Q&A · Related/Cross-sell/Up-sell · Stock status · Shipping estimate · Tax invoice option · Promotion/Coupon · Share · Compare · Wishlist

### 3.3 Commerce Core
- **Cart & Checkout:** guest + member, coupon, bundle, คำนวณภาษี/ค่าส่ง
- **Payment:** PromptPay, บัตรเครดิต, Mobile Banking, COD (ผ่าน Payment Gateway)
- **Shipping:** Flash, J&T, DHL, ไปรษณีย์ไทย, Kerry — คำนวณค่าส่ง, tracking, พิมพ์ label
- **Invoice:** ใบเสนอราคา, ใบกำกับภาษี, ใบเสร็จ, ใบส่งสินค้า (PDF + ส่งอีเมล)

### 3.4 After-Sales & Support
ลงทะเบียนประกัน · แจ้งเคลม · คืน/เปลี่ยนสินค้า · Ticket system · Knowledge Base · Live Chat (AI + human) · LINE OA · Messenger · Telegram · Email

### 3.5 Back-Office
- **Admin Dashboard:** Realtime — ยอดขาย, รายได้, ออเดอร์, คลัง, สถานะ sync, payment, shipping, customer analytics, charts
- **Admin CRUD:** Users, Products, Categories, Brands, Warehouse, Inventory, Orders, Payments, Promotions, Coupons, Warranty, Reviews, Blogs, FAQ, Settings

### 3.6 External Integrations
| ระบบ | หน้าที่ | วิธีเชื่อม | ต้องใช้ credential ของลูกค้า |
|---|---|---|---|
| **BigSeller** | Product, SKU, Barcode, Price, Promotion, Warehouse, Inventory, Orders, Shipment, Tracking | REST API + Webhook + Schedule sync | ✅ API key |
| **TRCLOUD** | Customer, Invoice, Receipt, Tax Invoice, Credit Note, Sales Report | REST API | ✅ API key |
| **Payment Gateway** | ตัดเงินจริง (PromptPay/บัตร/Banking) | SDK/API + Webhook | ✅ merchant + secret key |
| **Shipping Carriers** | ค่าส่ง + label + tracking | API ต่อเจ้า | ✅ merchant API |
| **Google OAuth** | Login ด้วย Google | OAuth 2.0 | ✅ Client ID/Secret |
| **LINE / Messenger / Telegram** | แชท/แจ้งเตือน | Official API | ✅ token |

> **หมายเหตุสำคัญ:** โค้ดเชื่อมต่อทั้งหมดจะถูกสร้างจริงพร้อมใช้งาน (มี interface, service, webhook handler, error handling, retry) แต่ต้องกรอก credential ของบัญชีจริงใน `.env` โดยลูกค้าเอง การตัดเงินจริง/ยิง API จริงต้องทดสอบด้วยบัญชีจริงของลูกค้า

---

## 4. Functional Requirements (สรุปหลัก)

1. ผู้ใช้ค้นหา/กรอง/เรียงสินค้าได้ (full-text + filter ตามแบรนด์/หมวด/ราคา/สต็อก)
2. สมัคร/เข้าสู่ระบบด้วย email-password และ Google OAuth พร้อม JWT + refresh token
3. เพิ่มสินค้าลงตะกร้า/wishlist/compare และ checkout พร้อมคำนวณค่าส่ง+ภาษีแบบเรียลไทม์
4. ชำระเงินผ่าน gateway จริง และรับ webhook ยืนยันการชำระ อัปเดตสถานะออเดอร์อัตโนมัติ
5. ออกเอกสาร (ใบเสร็จ/ใบกำกับภาษี) เป็น PDF และส่งอีเมลอัตโนมัติ
6. ติดตามสถานะพัสดุจาก carrier จริง
7. สต็อก/ราคา/ออเดอร์ sync สองทางกับ BigSeller (realtime webhook + schedule fallback)
8. เอกสารบัญชี/ภาษี sync กับ TRCLOUD
9. Admin จัดการทุก module ผ่าน CRUD จริงที่เชื่อม database
10. ระบบ after-sales: ประกัน, เคลม, คืนสินค้า, ticket, knowledge base
11. Dashboard เรียลไทม์แสดง KPI ธุรกิจ

## 5. Non-Functional Requirements

| ด้าน | เป้าหมาย |
|---|---|
| Performance | หน้าแรกโหลด < 2 วินาที, Core Web Vitals ผ่าน, Lighthouse ≥95 ทุกหมวด |
| Rendering | SSR/SSG + ISR, lazy load, image optimization, cache, compression |
| Scalability | Stateless services, Redis cache/queue, แยก worker, พร้อม scale horizontal |
| Security | HTTPS, Helmet, CORS, Rate limit, CSRF, XSS/SQLi protection, encryption, audit log |
| Availability | Docker + health check + graceful shutdown, พร้อม CI/CD |
| Accessibility | WCAG AA, Lighthouse Accessibility ≥95 |
| SEO | Meta/OG, sitemap, structured data (Product/Breadcrumb), SSR, Lighthouse SEO ≥95 |
| Maintainability | TypeScript ทั้ง stack, test coverage เป้าหมาย, Swagger API docs |
| PWA | ติดตั้งได้, offline shell, push (optional) |

## 6. สมมติฐานและข้อจำกัด (Assumptions & Constraints)

- ลูกค้ามี/จะเปิดบัญชี merchant กับ payment gateway และ carrier ที่เลือก
- ลูกค้ามีสิทธิ์เข้าถึง API ของ BigSeller และ TRCLOUD
- credential/secret ทั้งหมดลูกค้าเป็นผู้จัดเก็บและกรอกใน `.env` (ผู้พัฒนาไม่กรอก secret แทน)
- โดเมน, hosting/server (หรือ cloud), และการ deploy production ใช้ทรัพยากร/บัญชีของลูกค้า
- สินค้า/ราคา/รูปจริงมาจาก BigSeller เป็น source of truth (ไม่ใช้ mock data ในระบบจริง)

## 7. เกณฑ์ความสำเร็จ (Definition of Done ต่อ Phase)

แต่ละ Phase ถือว่าเสร็จเมื่อ: (1) ส่งมอบ artifact ครบ, (2) ผ่านการตรวจ/รีวิว, (3) รันได้จริง/ทดสอบผ่านในขอบเขตที่ทดสอบได้, (4) ลูกค้าอนุมัติให้ไป Phase ถัดไป

---

## 8. Roadmap (10 Phases)

1. ✅ **Business Analysis** (เอกสารนี้)
2. System Architecture — โครง monorepo, services, infra, integration design
3. Database Design — schema PostgreSQL + Prisma ครบทุก module
4. UI/UX Design System — tokens, components, states, dark/light
5. Frontend Development — Next.js storefront + admin
6. Backend Development — NestJS API + auth + business logic
7. API Integration — payment, shipping, BigSeller, TRCLOUD, chat
8. Testing — unit / integration / E2E / API / security
9. Performance Optimization — Lighthouse, caching, CWV
10. Deployment — Docker, CI/CD, Nginx, Cloudflare, production

---

*จัดทำโดย: ทีมพัฒนา (CTO · Product Owner · Enterprise Solution Architect · E-Commerce Specialist)*
*สถานะ: รอการอนุมัติเพื่อเข้าสู่ Phase 2*
