import { calcShipping, calcTax, calcTotals } from './pricing';

describe('pricing', () => {
  describe('calcShipping', () => {
    it('คิดค่าส่ง 50 เมื่อยอด < 990', () => {
      expect(calcShipping(500)).toBe(50);
    });
    it('ส่งฟรีเมื่อยอด >= 990', () => {
      expect(calcShipping(990)).toBe(0);
      expect(calcShipping(1500)).toBe(0);
    });
  });

  describe('calcTax', () => {
    it('ไม่มีภาษีเมื่อไม่ขอใบกำกับ', () => {
      expect(calcTax(1000, false)).toBe(0);
    });
    it('คิด VAT 7% เมื่อขอใบกำกับ', () => {
      expect(calcTax(1000, true)).toBe(70);
    });
  });

  describe('calcTotals', () => {
    it('รวมยอดถูกต้อง (มีค่าส่ง ไม่มีภาษี)', () => {
      const r = calcTotals([{ unitPrice: 200, quantity: 2 }], false);
      expect(r.subtotal).toBe(400);
      expect(r.shippingFee).toBe(50);
      expect(r.taxTotal).toBe(0);
      expect(r.grandTotal).toBe(450);
    });
    it('รวมยอดถูกต้อง (ส่งฟรี + ภาษี)', () => {
      const r = calcTotals([{ unitPrice: 1000, quantity: 1 }], true);
      expect(r.subtotal).toBe(1000);
      expect(r.shippingFee).toBe(0);
      expect(r.taxTotal).toBe(70);
      expect(r.grandTotal).toBe(1070);
    });
  });
});
