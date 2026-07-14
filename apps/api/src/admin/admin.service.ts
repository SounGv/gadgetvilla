import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async dashboard() {
    const [totalOrders, paidOrders, productCount, customerCount, revenueAgg, recentOrders, lowStock] =
      await Promise.all([
        this.prisma.order.count(),
        this.prisma.order.count({ where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } } }),
        this.prisma.product.count({ where: { status: 'ACTIVE' } }),
        this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
        this.prisma.order.aggregate({
          _sum: { grandTotal: true },
          where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        }),
        this.prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: { orderNo: true, status: true, grandTotal: true, shipName: true, createdAt: true },
        }),
        this.prisma.inventory.findMany({
          where: { quantity: { lte: 5 } },
          take: 10,
          include: { variant: { include: { product: true } } },
        }),
      ]);

    return {
      stats: {
        totalOrders,
        paidOrders,
        pendingOrders: totalOrders - paidOrders,
        revenue: Number(revenueAgg._sum.grandTotal ?? 0),
        productCount,
        customerCount,
      },
      recentOrders: recentOrders.map((o) => ({ ...o, grandTotal: Number(o.grandTotal) })),
      lowStock: lowStock.map((i) => ({
        sku: i.variant.sku,
        product: i.variant.product.name,
        quantity: i.quantity,
      })),
    };
  }

  async listOrders(status?: string) {
    const orders = await this.prisma.order.findMany({
      where: status ? { status: status as never } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { payment: true, shipment: true, _count: { select: { items: true } } },
    });
    return orders.map((o) => ({
      id: o.id,
      orderNo: o.orderNo,
      status: o.status,
      shipName: o.shipName,
      shipPhone: o.shipPhone,
      grandTotal: Number(o.grandTotal),
      itemCount: o._count.items,
      paymentStatus: o.payment?.status ?? null,
      paymentMethod: o.payment?.method ?? null,
      carrier: o.shipment?.carrier ?? null,
      trackingNo: o.shipment?.trackingNo ?? null,
      createdAt: o.createdAt,
    }));
  }

  async orderDetail(orderNo: string) {
    const o = await this.prisma.order.findUnique({
      where: { orderNo },
      include: { items: true, payment: true, shipment: true, user: true },
    });
    if (!o) return null;
    return {
      orderNo: o.orderNo,
      status: o.status,
      shipName: o.shipName,
      shipPhone: o.shipPhone,
      shipAddress: o.shipAddress,
      subtotal: Number(o.subtotal),
      shippingFee: Number(o.shippingFee),
      grandTotal: Number(o.grandTotal),
      wantTaxInvoice: o.wantTaxInvoice,
      createdAt: o.createdAt,
      customerEmail: o.user?.email ?? null,
      payment: o.payment
        ? { method: o.payment.method, status: o.payment.status, amount: Number(o.payment.amount) }
        : null,
      shipment: o.shipment
        ? { carrier: o.shipment.carrier, status: o.shipment.status, trackingNo: o.shipment.trackingNo }
        : null,
      items: o.items.map((i) => ({
        productName: i.productName,
        sku: i.sku,
        unitPrice: Number(i.unitPrice),
        quantity: i.quantity,
        lineTotal: Number(i.lineTotal),
      })),
    };
  }

  async updateOrderStatus(orderNo: string, status: string) {
    const allowed = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
    if (!allowed.includes(status)) throw new BadRequestException('สถานะไม่ถูกต้อง');
    const o = await this.prisma.order.update({
      where: { orderNo },
      data: { status: status as never },
    });
    return { ok: true, orderNo: o.orderNo, status: o.status };
  }
}
