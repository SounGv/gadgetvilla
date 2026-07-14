import { Injectable } from '@nestjs/common';
import type { ShippingPort, RateInput, RateResult, LabelInput, LabelResult, TrackEvent } from './shipping.port';

@Injectable()
export class KerryAdapter implements ShippingPort {
  readonly carrier = 'kerry';
  private key = process.env.KERRY_API_KEY ?? '';

  async quote(input: RateInput): Promise<RateResult> {
    const base = 45;
    const perKg = 16;
    const fee = base + Math.max(0, Math.ceil(input.weightGram / 1000) - 1) * perKg;
    return { carrier: this.carrier, fee, etaDays: 2 };
  }

  async createLabel(input: LabelInput): Promise<LabelResult> {
    // TODO: เรียก API จริงของ kerry เมื่อกรอก KERRY_API_KEY ใน .env
    if (!this.key) throw new Error('ยังไม่ได้ตั้งค่า KERRY_API_KEY ใน .env');
    // โครงสร้าง request มาตรฐาน — ปรับ endpoint/field ตามเอกสาร API ของผู้ให้บริการ
    return { trackingNo: '', labelUrl: '' };
  }

  async track(trackingNo: string): Promise<TrackEvent[]> {
    if (!this.key) throw new Error('ยังไม่ได้ตั้งค่า KERRY_API_KEY ใน .env');
    return [];
  }
}
