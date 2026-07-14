import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import type { CreateChargeInput } from './payment.port';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('charge')
  charge(@Body() body: CreateChargeInput) {
    return this.payments.charge(body);
  }

  @Post('webhook')
  webhook(@Req() req: Request, @Headers('x-omise-signature') sig?: string) {
    // ต้องใช้ raw body — ตั้งค่า rawBody ใน main.ts (bodyParser raw สำหรับ path นี้)
    const raw = (req as unknown as { rawBody?: Buffer }).rawBody?.toString() ?? JSON.stringify(req.body);
    return this.payments.handleWebhook(raw, sig);
  }
}
