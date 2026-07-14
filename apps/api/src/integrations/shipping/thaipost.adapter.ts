import { Injectable } from '@nestjs/common';
import type { ShippingPort, RateInput, RateResult, LabelInput, LabelResult, TrackEvent } from './shipping.port';

@Injectable()
export class ThaiPostAdapter implements ShippingPort {
  readonly carrier = 'thaipost';
  private key = process.env.THAIPOST_API_KEY ?? '';

  async quote(input: RateInput): Promise<RateResult> {
    const base = 32;
    const perKg = 12;
    const fee = base + Math.max(0, Math.ceil(input.weightGram / 1000) - 1) * perKg;
    return { carrier: this.carrier, fee, etaDays: 3 };
  }

  async createLabel(input: LabelInput): Promise<LabelResult> {
    // TODO: เรียก API จริงของ thaipost เมื่อกรอก THAIPOST_API_KEY ใน .env
    if (!this.key) throw new Error('ยังไม่ได้ตั้งค่า THAIPOST_API_KEY ใน .env');
    // โครงสร้าง request มาตรฐาน — ปรับ endpoint/field ตามเอกสาร API ของผู้ให้บริการ
    return { trackingNo: '', labelUrl: '' };
  }

  async track(trackingNo: string): Promise<TrackEvent[]> {
    if (!this.key) throw new Error('ยังไม่ได้ตั้งค่า THAIPOST_API_KEY ใน .env');
    return [];
  }
}
