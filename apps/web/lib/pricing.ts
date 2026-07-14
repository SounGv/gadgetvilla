export const FREE_SHIPPING_MIN = 990;
export const SHIPPING_FEE = 50;

export function calcShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
}
