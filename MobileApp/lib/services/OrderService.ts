import { orderModel } from "@/lib/models/OrderModel";
import { productModel } from "@/lib/models/ProductModel";
import type { CartItem, ShippingAddress, OrderWithItems } from "@/types";

export class OrderService {
  private static instance: OrderService;
  static getInstance() {
    if (!this.instance) this.instance = new OrderService();
    return this.instance;
  }

  async createOrder(
    userId: string,
    items: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: string
  ) {
    for (const item of items) {
      const product = await productModel.findById(item.productId);
      if (!product) throw new Error(`Produk ${item.name} tidak ditemukan`);
      if (product.stock < item.quantity) throw new Error(`Stok ${item.name} tidak cukup`);
    }

    const order = await orderModel.create(userId, items, shippingAddress, paymentMethod);

    await Promise.all(
      items.map((item) => productModel.decrementStock(item.productId, item.quantity))
    );

    return order;
  }

  async getOrder(id: string): Promise<OrderWithItems | null> {
    return orderModel.findById(id);
  }

  async getUserOrders(userId: string, page = 1) {
    return orderModel.findByUser(userId, page);
  }

  async getAllOrders(page = 1) {
    return orderModel.findAll(page);
  }

  async updateStatus(id: string, status: string) {
    const validStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) throw new Error("Status tidak valid");
    return orderModel.updateStatus(id, status);
  }

  parseShippingAddress(raw: string): ShippingAddress {
    try { return JSON.parse(raw); } catch { return {} as ShippingAddress; }
  }
}

export const orderService = OrderService.getInstance();
