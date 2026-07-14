import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OmiseAdapter } from './adapters/omise.adapter';
import { TrCloudService } from '../integrations/trcloud/trcloud.service';
import type { PaymentPort, CreateChargeInput } from './payment.port';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private adapter: PaymentPort;

  constructor(
    private prisma: PrismaService,
    private trcloud: TrCloudService,
    omise: OmiseAdapter,
  ) {
    const provider = process.env.PAYMENT_PROVIDER ?? 'omise';
    this.adapter = provider === 'omise' ? omise : omise;
  }

  async charge(input: CreateChargeInput) {
    const result = await this.adapter.createCharge(input);
    await this.prisma.payment.updateMany({
      where: { order: { orderNo: input.orderNo } },
      data: { transactionId: result.chargeId },
    });
    return result;
  }

  async handleWebhook(rawBody: string, signature?: string) {
    const evt = this.adapter.parseWebhook(rawBody, signature);
    const payment = await this.prisma.payment.findFirst({
      where: { transactionId: evt.chargeId },
      include: { order: true },
    });
    if (!payment) return { ok: false, reason: 'payment not found' };

    if (evt.status === 'paid') {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'PAID', paidAt: new Date(), rawPayload: JSON.parse(rawBody) },
        }),
        this.prisma.order.update({ where: { id: payment.orderId }, data: { status: 'PAID' } }),
      ]);

      // best-effort: ออกใบกำกับภาษี TRCLOUD (ไม่ให้ล้มการยืนยันชำระเงินถ้า integration พลาด)
      if (payment.order.wantTaxInvoice) {
        this.trcloud.createTaxInvoice(payment.orderId).catch((e) =>
          this.logger.error(`TRCLOUD invoice deferred error: ${(e as Error).message}`),
        );
      }
      // Phase ต่อ: push order → BigSeller, ส่งอีเมลใบเสร็จ (ผ่าน queue/worker)
    } else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', rawPayload: JSON.parse(rawBody) },
      });
    }
    return { ok: true, status: evt.status };
  }
}
