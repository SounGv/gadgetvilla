import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().min(2, 'กรุณากรอกชื่อ-นามสกุล'),
  phone: z
    .string()
    .regex(/^0\d{8,9}$/, 'เบอร์โทรไม่ถูกต้อง (เช่น 0812345678)'),
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  line1: z.string().min(5, 'กรุณากรอกที่อยู่'),
  subdistrict: z.string().min(1, 'กรุณากรอกตำบล/แขวง'),
  district: z.string().min(1, 'กรุณากรอกอำเภอ/เขต'),
  province: z.string().min(1, 'กรุณากรอกจังหวัด'),
  postalCode: z.string().regex(/^\d{5}$/, 'รหัสไปรษณีย์ 5 หลัก'),
  carrier: z.enum(['flash', 'jt', 'kerry', 'thaipost', 'dhl']),
  paymentMethod: z.enum(['promptpay', 'credit_card', 'mobile_banking']),
  wantTaxInvoice: z.boolean().optional(),
  note: z.string().optional(),
});

export type CheckoutForm = z.infer<typeof checkoutSchema>;
