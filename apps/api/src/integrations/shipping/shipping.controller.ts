import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
import type { RateInput } from './shipping.port';

@ApiTags('shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private shipping: ShippingService) {}

  @Post('quote')
  quote(@Body() body: RateInput) {
    return this.shipping.quoteAll(body);
  }

  @Get(':carrier/track/:trackingNo')
  track(@Param('carrier') carrier: string, @Param('trackingNo') trackingNo: string) {
    return this.shipping.track(carrier, trackingNo);
  }
}
