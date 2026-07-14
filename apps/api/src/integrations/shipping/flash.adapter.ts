import { Injectable } from '@nestjs/common';
import type { ShippingPort, RateInput, RateResult, LabelInput, LabelResult, TrackEvent } from './shipping.port';

const BASE = process.env.FLASH_API_URL ?? 'https://open-api.flashexpress.com';

@Injectable()
export class FlashAdapter implements ShippingPort {
  readonly carrier = 'flash';
  private key = process.env.FLASH_API_KEY ?? '';

  async quote(input: RateInput): Promise<RateResult> {
    // สูตรประมาณค่าส่งตามน้ำหนัก (ปรับตามสัญญาจริงกับ Flash)
    const base = 39;
    const perKg = 15;
    const fee = base + Math.max(0, Math.ceil(input.weightGram / 1000) - 1) * perKg;
    return { carrier: this.carrier, fee, etaDays: 2 };
  }

  async createLabel(input: LabelInput): Promise<LabelResult> {
    const res = await fetch(`${BASE}/open/v3/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        outTradeNo: input.orderNo,
        dstName: input.toName,
        dstPhone: input.toPhone,
        dstDetailAddress: input.toAddress,
        weight: input.weightGram,
      }),
    });
    if (!res.ok) throw new Error(`Flash ${res.status}`);
    const data: any = await res.json();
    return { trackingNo: data?.data?.pno ?? '', labelUrl: data?.data?.labelUrl ?? '' };
  }

  async track(trackingNo: string): Promise<TrackEvent[]> {
    const res = await fetch(`${BASE}/open/v1/orders/${trackingNo}/routes`, {
      headers: { Authorization: `Bearer ${this.key}` },
    });
    if (!res.ok) throw new Error(`Flash track ${res.status}`);
    const data: any = await res.json();
    return (data?.data?.routes ?? []).map((r: { routedAt: string; message: string }) => ({
      time: r.routedAt,
      status: r.message,
    }));
  }
}
