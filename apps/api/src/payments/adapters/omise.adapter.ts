import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import type {
  PaymentPort, CreateChargeInput, CreateChargeResult, WebhookResult,
} from '../payment.port';

const OMISE_API = 'https://api.omise.co';

@Injectable()
export class OmiseAdapter implements PaymentPort {
  readonly name = 'omise';
  private secretKey = process.env.OMISE_SECRET_KEY ?? '';

  private authHeader() {
    return 'Basic ' + Buffer.from(`${this.secretKey}:`).toString('base64');
  }

  private async omise(path: string, body: Record<string, unknown>) {
    const res = await fetch(`${OMISE_API}${path}`, {
      method: 'POST',
      headers: { Authorization: this.authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data: any = await res.json();
    if (!res.ok) throw new InternalServerErrorException(data?.message ?? 'Omise error');
    return data;
  }

  async createCharge(input: CreateChargeInput): Promise<CreateChargeResult> {
    if (!this.secretKey) {
      throw new InternalServerErrorException('ยังไม่ได้ตั้งค่า OMISE_SECRET_KEY ใน .env');
    }
    const amountSatang = Math.round(input.amount * 100);

    if (input.method === 'promptpay') {
      const source = await this.omise('/sources', {
        type: 'promptpay',
        amount: amountSatang,
        currency: 'thb',
      });
      const charge = await this.omise('/charges', {
        amount: amountSatang,
        currency: 'thb',
        source: source.id,
        metadata: { orderNo: input.orderNo },
      });
      const qr = charge?.source?.scannable_code?.image?.download_uri;
      return { chargeId: charge.id, status: 'pending', qrImageUri: qr };
    }

    if (input.method === 'credit_card') {
      const charge = await this.omise('/charges', {
        amount: amountSatang,
        currency: 'thb',
        card: input.cardToken,
        return_uri: input.returnUri,
        metadata: { orderNo: input.orderNo },
      });
      return {
        chargeId: charge.id,
        status: charge.paid ? 'paid' : 'pending',
        authorizeUri: charge.authorize_uri,
      };
    }

    // mobile_banking / อื่นๆ ใช้ source ตามชนิดที่ Omise รองรับ
    const source = await this.omise('/sources', {
      type: 'mobile_banking_scb',
      amount: amountSatang,
      currency: 'thb',
    });
    const charge = await this.omise('/charges', {
      amount: amountSatang,
      currency: 'thb',
      source: source.id,
      return_uri: input.returnUri,
      metadata: { orderNo: input.orderNo },
    });
    return { chargeId: charge.id, status: 'pending', authorizeUri: charge.authorize_uri };
  }

  parseWebhook(rawBody: string, signature?: string): WebhookResult {
    const secret = process.env.OMISE_WEBHOOK_SECRET;
    if (secret && signature) {
      const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
      const a = Buffer.from(expected);
      const b = Buffer.from(signature);
      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        throw new InternalServerErrorException('ลายเซ็น webhook ไม่ถูกต้อง');
      }
    }
    const event = JSON.parse(rawBody);
    const charge = event?.data ?? {};
    return {
      chargeId: charge.id,
      status: charge.status === 'successful' || charge.paid ? 'paid' : 'failed',
      orderNo: charge?.metadata?.orderNo,
    };
  }
}
