// Pure pricing logic — แยกออกมาเพื่อทดสอบได้ง่ายและใช้ซ้ำ
export const FREE_SHIPPING_MIN = 990;
export const SHIPPING_FEE = 50;
export const TAX_RATE = 0.07;

export function calcShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
}

export function calcTax(subtotal: number, wantTaxInvoice: boolean): number {
  return wantTaxInvoice ? Number((subtotal * TAX_RATE).toFixed(2)) : 0;
}

export interface LineInput { unitPrice: number; quantity: number; }

export function calcTotals(lines: LineInput[], wantTaxInvoice = false) {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const shippingFee = calcShipping(subtotal);
  const taxTotal = calcTax(subtotal, wantTaxInvoice);
  const grandTotal = Number((subtotal + shippingFee + taxTotal).toFixed(2));
  return { subtotal, shippingFee, taxTotal, grandTotal };
}
