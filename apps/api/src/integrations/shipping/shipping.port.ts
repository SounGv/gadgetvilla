export interface RateInput {
  weightGram: number;
  destProvince: string;
  destPostalCode: string;
  codAmount?: number;
}
export interface RateResult { carrier: string; fee: number; etaDays: number; }
export interface LabelInput { orderNo: string; toName: string; toPhone: string; toAddress: string; weightGram: number; }
export interface LabelResult { trackingNo: string; labelUrl: string; }
export interface TrackEvent { time: string; status: string; note?: string; }

export interface ShippingPort {
  readonly carrier: string;
  quote(input: RateInput): Promise<RateResult>;
  createLabel(input: LabelInput): Promise<LabelResult>;
  track(trackingNo: string): Promise<TrackEvent[]>;
}
