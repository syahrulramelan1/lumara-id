import { prisma } from "@/lib/prisma";
import type { Order } from "@prisma/client";
import type { OrderWithItems, OrderTracking, ShippingAddress, CartItem } from "@/types";

const TRACKING_INCLUDE = {
  items: { include: { product: { select: { id: true, name: true, images: true } } } },
  user:  { select: { id: true, name: true, email: true, avatar: true } },
  trackings: { orderBy: { createdAt: "desc" as const } },
};

export class OrderModel {
  private static instance: OrderModel;
  static getInstance() {
    if (!this.instance) this.instance = new OrderModel();
    return this.instance;
  }

  async findById(id: string): Promise<OrderWithItems | null> {
    return prisma.order.findUnique({
      where: { id },
      include: TRACKING_INCLUDE,
    }) as Promise<OrderWithItems | null>;
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: TRACKING_INCLUDE,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } }),
    ]);
    return { data: data as unknown as OrderWithItems[], total };
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.order.findMany({
        include: TRACKING_INCLUDE,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count(),
    ]);
    return { data: data as unknown as OrderWithItems[], total };
  }

  async create(
    userId: string,
    items: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: string
  ): Promise<Order> {
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod,
        status: "PENDING",
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity:  i.quantity,
            size:      i.size,
            color:     i.color,
            price:     i.price,
          })),
        },
      },
    });

    // Auto milestone: pesanan masuk
    await this.addTracking(order.id, "Pesanan Masuk", "Pesanan kamu berhasil dibuat dan menunggu konfirmasi pembayaran.");

    return order;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const validStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) throw new Error("Status tidak valid");

    const order = await prisma.order.update({ where: { id }, data: { status } });

    // Auto milestone saat status berubah
    const autoMilestones: Record<string, { status: string; description: string }> = {
      PAID:       { status: "Pembayaran Dikonfirmasi", description: "Pembayaran kamu telah dikonfirmasi. Pesanan sedang disiapkan." },
      PROCESSING: { status: "Dikemas",                description: "Pesanan kamu sedang dikemas oleh Lumara.id." },
      DELIVERED:  { status: "Pesanan Diterima",       description: "Pesanan dikonfirmasi telah diterima. Terima kasih sudah berbelanja!" },
      CANCELLED:  { status: "Dibatalkan",             description: "Pesanan ini telah dibatalkan." },
    };

    if (autoMilestones[status]) {
      const m = autoMilestones[status];
      await this.addTracking(id, m.status, m.description);
    }

    return order;
  }

  // Tandai pesanan dikirim + input resi
  async shipOrder(
    id: string,
    data: {
      courier:          string;
      courierService:   string;
      trackingNumber:   string;
      estimatedArrival: Date;
      note?:            string;
    }
  ): Promise<Order> {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status:           "SHIPPED",
        courier:          data.courier,
        courierService:   data.courierService,
        trackingNumber:   data.trackingNumber,
        shippedAt:        new Date(),
        estimatedArrival: data.estimatedArrival,
      },
    });

    const desc = data.note?.trim()
      ? `Paket diserahkan ke ${data.courier} ${data.courierService}. ${data.note}`
      : `Paket diserahkan ke ${data.courier} ${data.courierService}. No. resi: ${data.trackingNumber}`;

    await this.addTracking(id, "Diserahkan ke Kurir", desc);

    return order;
  }

  // Tambah entri tracking manual
  async addTracking(
    orderId: string,
    status: string,
    description: string,
    location?: string
  ): Promise<OrderTracking> {
    return prisma.orderTracking.create({
      data: { orderId, status, description, location: location ?? null },
    }) as Promise<OrderTracking>;
  }

  // Buyer konfirmasi terima
  async confirmDelivery(id: string): Promise<Order> {
    const order = await prisma.order.update({
      where: { id },
      data: { status: "DELIVERED" },
    });
    await this.addTracking(id, "Pesanan Diterima", "Pembeli mengkonfirmasi pesanan telah diterima. Terima kasih sudah berbelanja di Lumara.id!");
    return order;
  }

  async findRecent(limit = 5): Promise<OrderWithItems[]> {
    return prisma.order.findMany({
      include: TRACKING_INCLUDE,
      orderBy: { createdAt: "desc" },
      take: limit,
    }) as unknown as Promise<OrderWithItems[]>;
  }
}

export const orderModel = OrderModel.getInstance();
