import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const BASE = process.env.TRCLOUD_API_URL ?? 'https://trcloud.co/api';

@Injectable()
export class TrCloudService {
  private readonly logger = new Logger(TrCloudService.name);
  private key = process.env.TRCLOUD_API_KEY ?? '';
  private companyId = process.env.TRCLOUD_COMPANY_ID ?? '';

  constructor(private prisma: PrismaService) {}

  /** สร้างใบกำกับภาษีใน TRCLOUD เมื่อออเดอร์ชำระเงินสำเร็จ */
  async createTaxInvoice(orderId: string) {
    if (!this.key) throw new Error('ยังไม่ได้ตั้งค่า TRCLOUD_API_KEY ใน .env');
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) return;

    const payload = {
      company_id: this.companyId,
      customer_name: order.shipName,
      items: order.items.map((i) => ({
        name: i.productName,
        sku: i.sku,
        qty: i.quantity,
        price: Number(i.unitPrice),
      })),
      subtotal: Number(order.subtotal),
      vat: Number(order.taxTotal),
      total: Number(order.grandTotal),
      reference: order.orderNo,
    };

    try {
      const res = await fetch(`${BASE}/tax_invoice`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`TRCLOUD ${res.status}`);
      const data: any = await res.json();

      await this.prisma.invoice.create({
        data: {
          orderId: order.id,
          type: 'TAX_INVOICE',
          docNo: data?.doc_no ?? `TRC-${order.orderNo}`,
          pdfUrl: data?.pdf_url ?? null,
          trcloudRef: data?.id ?? null,
        },
      });
      await this.prisma.order.update({ where: { id: order.id }, data: { trcloudRef: data?.id ?? null } });
      await this.prisma.syncLog.create({
        data: { source: 'trcloud', entity: 'invoice', direction: 'outbound', status: 'success', refId: order.orderNo },
      });
      return data;
    } catch (e) {
      this.logger.error(`TRCLOUD invoice failed: ${(e as Error).message}`);
      await this.prisma.syncLog.create({
        data: { source: 'trcloud', entity: 'invoice', direction: 'outbound', status: 'failed', refId: order.orderNo, message: (e as Error).message },
      });
      throw e;
    }
  }
}
