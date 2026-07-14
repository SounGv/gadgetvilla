import { Module } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';
import { FlashAdapter } from './flash.adapter';
import { JtAdapter } from './jt.adapter';
import { KerryAdapter } from './kerry.adapter';
import { ThaiPostAdapter } from './thaipost.adapter';
import { DhlAdapter } from './dhl.adapter';

@Module({
  providers: [ShippingService, FlashAdapter, JtAdapter, KerryAdapter, ThaiPostAdapter, DhlAdapter],
  controllers: [ShippingController],
  exports: [ShippingService],
})
export class ShippingModule {}
