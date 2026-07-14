import { Injectable, BadRequestException } from '@nestjs/common';
import { FlashAdapter } from './flash.adapter';
import { JtAdapter } from './jt.adapter';
import { KerryAdapter } from './kerry.adapter';
import { ThaiPostAdapter } from './thaipost.adapter';
import { DhlAdapter } from './dhl.adapter';
import type { ShippingPort, RateInput, LabelInput } from './shipping.port';

@Injectable()
export class ShippingService {
  private adapters: Record<string, ShippingPort>;

  constructor(
    flash: FlashAdapter,
    jt: JtAdapter,
    kerry: KerryAdapter,
    thaipost: ThaiPostAdapter,
    dhl: DhlAdapter,
  ) {
    this.adapters = { flash, jt, kerry, thaipost, dhl };
  }

  private get(carrier: string): ShippingPort {
    const a = this.adapters[carrier];
    if (!a) throw new BadRequestException(`ไม่รองรับขนส่ง: ${carrier}`);
    return a;
  }

  quote(carrier: string, input: RateInput) {
    return this.get(carrier).quote(input);
  }
  quoteAll(input: RateInput) {
    return Promise.all(Object.values(this.adapters).map((a) => a.quote(input)));
  }
  createLabel(carrier: string, input: LabelInput) {
    return this.get(carrier).createLabel(input);
  }
  track(carrier: string, trackingNo: string) {
    return this.get(carrier).track(trackingNo);
  }
}
