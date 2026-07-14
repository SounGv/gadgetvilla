import { Injectable } from '@nestjs/common';
import type { ShippingPort, RateInput, RateResult, LabelInput, LabelResult, TrackEvent } from './shipping.port';

@Injectable()
export class DhlAdapter implements ShippingPort {
  readonly carrier = 'dhl';
  private key = process.env.DHL_API_KEY ?? '';

  async quote(input: RateInput): Promise<RateResult> {
    const base = 80;
    const perKg = 30;
    const fee = base + Math.max(0, Math.ceil(input.weightGram / 1000) - 1) * perKg;
    return { carrier: this.carrier, fee, etaDays: 1 };
  }

  async createLabel(input: LabelInput): Promise<LabelResult> {
    // TODO: เรียก API จริงของ dhl เมื่อกรอก DHL_API_KEY ใน .env
    if (!this.key) throw new Error('ยังไม่ได้ตั้งค่า DHL_API_KEY ใน .env');
    // โครงสร้าง request มาตรฐาน — ปรับ endpoint/field ตามเอกสาร API ของผู้ให้บริการ
    return { trackingNo: '', labelUrl: '' };
  }

  async track(trackingNo: string): Promise<TrackEvent[]> {
    if (!this.key) throw new Error('ยังไม่ได้ตั้งค่า DHL_API_KEY ใน .env');
    return [];
  }
}
