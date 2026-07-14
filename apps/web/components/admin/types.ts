export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  brandSlug: string;
  brandName: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  sku: string;
  barcode: string;
  images: string[];
  imageUrl: string | null;
  shortDesc: string;
  description: string;
  warranty: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
}

export interface AdminOrderRow {
  id: string;
  orderNo: string;
  status: OrderStatus;
  shipName: string;
  shipPhone: string;
  grandTotal: number;
  itemCount: number;
  paymentStatus: string | null;
  paymentMethod: string | null;
  carrier: string | null;
  trackingNo: string | null;
  createdAt: string;
}

export interface AdminOrderDetail {
  orderNo: string;
  status: OrderStatus;
  shipName: string;
  shipPhone: string;
  shipAddress: unknown;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  wantTaxInvoice: boolean;
  createdAt: string;
  customerEmail: string | null;
  payment: { method: string; status: string; amount: number } | null;
  shipment: { carrier: string; status: string; trackingNo: string | null } | null;
  items: { productName: string; sku: string; unitPrice: number; quantity: number; lineTotal: number }[];
}

export interface DashboardData {
  stats: {
    totalOrders: number;
    paidOrders: number;
    pendingOrders: number;
    revenue: number;
    productCount: number;
    customerCount: number;
  };
  recentOrders: { orderNo: string; status: OrderStatus; grandTotal: number; shipName: string; createdAt: string }[];
  lowStock: { sku: string; product: string; quantity: number }[];
}
