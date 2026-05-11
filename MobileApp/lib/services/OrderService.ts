import { orderModel } from "@/lib/models/OrderModel";
import { productModel } from "@/lib/models/ProductModel";
import { fetchShippingOptions, findMatchingShippingOption } from "@/lib/shipping/rajaongkir";
import { getStaticShippingOptions } from "@/lib/shipping/static";
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
    paymentMethod: string,
    shippingCost = 0,
    courier?: string,
    courierService?: string,
    weightGrams = 1000
  ) {
    if (!courier?.trim() || !courierService?.trim()) {
      throw new Error("Pilih kurir dan layanan pengiriman.");
    }
    const w = Math.round(Number(weightGrams));
    if (!Number.isFinite(w) || w < 100) {
      throw new Error("Berat paket tidak valid (minimal 100 gram).");
    }

    // Validasi anti-tamper: cocokin cost yang dikirim client dengan
    // hasil dari Komerce / fallback. Courier "internal" = static fallback.
    let validated = false;
    if (courier === "internal") {
      // Fallback flat rate — butuh provinceId
      if (!shippingAddress.provinceId?.trim()) {
        throw new Error("Pilih provinsi tujuan untuk menghitung ongkir.");
      }
      const opts = getStaticShippingOptions(shippingAddress.provinceId.trim(), w);
      validated = !!findMatchingShippingOption(opts, courier, courierService.trim(), shippingCost);
    } else {
      // Komerce mode — butuh cityId
      if (!shippingAddress.cityId?.trim()) {
        throw new Error("Pilih kota tujuan untuk menghitung ongkir.");
      }
      try {
        const result = await fetchShippingOptions(shippingAddress.cityId.trim(), w);
        validated = !!findMatchingShippingOption(result.options, courier.trim(), courierService.trim(), shippingCost);
      } catch {
        // Komerce error saat validasi → fallback ke static cocokin pakai provinceId
        if (shippingAddress.provinceId?.trim()) {
          const opts = getStaticShippingOptions(shippingAddress.provinceId.trim(), w);
          validated = !!findMatchingShippingOption(opts, courier.trim(), courierService.trim(), shippingCost);
        }
      }
    }

    if (!validated) {
      throw new Error("Ongkir tidak valid atau sudah berubah. Silakan hitung ulang ongkir.");
    }

    for (const item of items) {
      const product = await productModel.findById(item.productId);
      if (!product) throw new Error(`Produk ${item.name} tidak ditemukan`);
      if (product.stock < item.quantity) throw new Error(`Stok ${item.name} tidak cukup`);
    }

    const order = await orderModel.create(userId, items, shippingAddress, paymentMethod, shippingCost, courier, courierService);

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
