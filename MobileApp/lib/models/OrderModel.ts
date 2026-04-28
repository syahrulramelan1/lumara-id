import { prisma } from "@/lib/prisma";
import type { Order } from "@prisma/client";
import type { OrderWithItems, ShippingAddress, CartItem } from "@/types";

export class OrderModel {
  private static instance: OrderModel;
  static getInstance() {
    if (!this.instance) this.instance = new OrderModel();
    return this.instance;
  }

  async findById(id: string): Promise<OrderWithItems | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: { select: { id: true, name: true, images: true } } } },
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });
  }

  async findByUser(userId: string, page = 1, limit = 10): Promise<{ data: OrderWithItems[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: { include: { product: { select: { id: true, name: true, images: true } } } },
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } }),
    ]);
    return { data, total };
  }

  async findAll(page = 1, limit = 20): Promise<{ data: OrderWithItems[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.order.findMany({
        include: {
          items: { include: { product: { select: { id: true, name: true, images: true } } } },
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count(),
    ]);
    return { data, total };
  }

  async create(
    userId: string,
    items: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: string
  ): Promise<Order> {
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return prisma.order.create({
      data: {
        userId,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod,
        status: "PENDING",
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
            price: i.price,
          })),
        },
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    return prisma.order.update({ where: { id }, data: { status } });
  }

  async findRecent(limit = 5): Promise<OrderWithItems[]> {
    return prisma.order.findMany({
      include: {
        items: { include: { product: { select: { id: true, name: true, images: true } } } },
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}

export const orderModel = OrderModel.getInstance();
