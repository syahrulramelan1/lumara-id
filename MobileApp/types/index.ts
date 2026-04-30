import type { Product, Category, Review, User, Order, OrderItem, Wishlist } from "@prisma/client";

export type Role = "USER" | "ADMIN";
export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRODUCT TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type ProductWithCategory = Product & {
  category: Category;
};

export type ReviewWithUser = Review & {
  user: Pick<User, "id" | "name" | "avatar">;
};

export type ProductWithReviews = Product & {
  category: Category;
  reviews: ReviewWithUser[];
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CATEGORY TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type CategoryWithCount = Category & {
  _count: {
    products: number;
  };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CART
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILTER & PAGINATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface FilterParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "terbaru" | "terlaris" | "harga-terendah" | "harga-tertinggi" | "rating";
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API RESPONSE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ORDER TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface OrderTracking {
  id:          string;
  orderId:     string;
  status:      string;
  description: string;
  location:    string | null;
  createdAt:   Date | string;
}

export type OrderWithItems = Order & {
  items:     (OrderItem & { product: Pick<Product, "id" | "name" | "images"> })[];
  user:      Pick<User, "id" | "name" | "email" | "avatar">;
  trackings: OrderTracking[];
  // kolom pengiriman manual (nullable sampai seller input)
  courier:          string | null;
  courierService:   string | null;
  trackingNumber:   string | null;
  shippedAt:        Date | string | null;
  estimatedArrival: Date | string | null;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WISHLIST TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type WishlistWithProduct = Wishlist & {
  product: ProductWithCategory;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  address: string;
  notes?: string;
}
