export type PayMethod = 'promptpay' | 'credit_card' | 'mobile_banking' | 'cod';

export interface CreateChargeInput {
  orderNo: string;
  amount: number; // THB
  method: PayMethod;
  cardToken?: string; // สำหรับบัตร (token จาก frontend, ไม่ส่งเลขบัตรผ่าน server)
  returnUri?: string;
}

export interface CreateChargeResult {
  chargeId: string;
  status: 'pending' | 'paid' | 'failed';
  authorizeUri?: string; // 3DS / redirect
  qrImageUri?: string; // PromptPay QR
}

export interface WebhookResult {
  chargeId: string;
  status: 'paid' | 'failed';
  orderNo?: string;
}

export interface PaymentPort {
  readonly name: string;
  createCharge(input: CreateChargeInput): Promise<CreateChargeResult>;
  parseWebhook(rawBody: string, signature?: string): WebhookResult;
}
