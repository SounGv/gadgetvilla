import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma, PaymentMethod } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { calcShipping, calcTax } from './pricing';

const methodMap: Record<string, PaymentMethod> = {
  promptpay: 'PROMPTPAY',
  credit_card: 'CREDIT_CARD',
  mobile_banking: 'MOBILE_BANKING',
  cod: 'COD',
};

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId?: string) {
    if (!dto.items?.length) throw new BadRequestException('ไม่มีสินค้าในคำสั่งซื้อ');

    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: dto.items.map((i) => i.variantId) } },
      include: { product: true, inventory: true },
    });
    if (variants.length !== dto.items.length) throw new BadRequestException('พบสินค้าที่ไม่ถูกต้อง');

    let subtotal = 0;
    const orderItems = dto.items.map((item) => {
      const v = variants.find((x) => x.id === item.variantId)!;
      const available = v.inventory.reduce((n, inv) => n + (inv.quantity - inv.reserved), 0);
      if (available < item.quantity) throw new BadRequestException(`สินค้า ${v.product.name} มีไม่พอ`);
      const unitPrice = Number(v.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;
      return {
        variantId: v.id,
        productName: v.product.name,
        sku: v.sku,
        unitPrice: new Prisma.Decimal(unitPrice),
        quantity: item.quantity,
        lineTotal: new Prisma.Decimal(lineTotal),
      };
    });

    const shippingFee = calcShipping(subtotal);
    const taxTotal = calcTax(subtotal, dto.wantTaxInvoice ?? false);
    const grandTotal = subtotal + shippingFee + taxTotal;
    const orderNo = `GV${Date.now().toString(36).toUpperCase()}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNo,
          userId: userId ?? null,
          status: 'PENDING',
          subtotal: new Prisma.Decimal(subtotal),
          shippingFee: new Prisma.Decimal(shippingFee),
          taxTotal: new Prisma.Decimal(taxTotal),
          grandTotal: new Prisma.Decimal(grandTotal),
          shipName: dto.name,
          shipPhone: dto.phone,
          shipAddress: {
            line1: dto.line1,
            subdistrict: dto.subdistrict,
            district: dto.district,
            province: dto.province,
            postalCode: dto.postalCode,
            email: dto.email,
          },
          wantTaxInvoice: dto.wantTaxInvoice ?? false,
          items: { create: orderItems },
          payment: {
            create: {
              provider: process.env.PAYMENT_PROVIDER ?? 'omise',
              method: methodMap[dto.paymentMethod],
              status: 'PENDING',
              amount: new Prisma.Decimal(grandTotal),
            },
          },
          shipment: { create: { carrier: dto.carrier, status: 'PENDING' } },
        },
      });

      // reserve inventory
      for (const item of dto.items) {
        const v = variants.find((x) => x.id === item.variantId)!;
        const inv = v.inventory[0];
        if (inv) {
          await tx.inventory.update({
            where: { id: inv.id },
            data: { reserved: { increment: item.quantity } },
          });
        }
      }
      return created;
    });

    // NOTE: Phase 7 — เรียก Payment Gateway จริงเพื่อสร้าง charge/QR แล้วคืน paymentUrl
    return { orderNo: order.orderNo, grandTotal, paymentUrl: null };
  }

  /** สถานะสาธารณะสำหรับหน้าติดตามพัสดุ (ข้อมูลจำกัด ไม่ต้องล็อกอิน) */
  async publicStatus(orderNo: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNo },
      include: { shipment: true, payment: true },
    });
    if (!order) return null;
    return {
      orderNo: order.orderNo,
      status: order.status,
      paymentStatus: order.payment?.status ?? null,
      carrier: order.shipment?.carrier ?? null,
      trackingNo: order.shipment?.trackingNo ?? null,
      shipmentStatus: order.shipment?.status ?? null,
      grandTotal: Number(order.grandTotal),
      createdAt: order.createdAt,
    };
  }

  async findByOrderNo(orderNo: string) {
    return this.prisma.order.findUnique({
      where: { orderNo },
      include: { items: true, payment: true, shipment: true },
    });
  }
}
