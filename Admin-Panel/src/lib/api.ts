import axios from "axios";

const BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";
const SECRET = (import.meta.env.VITE_ADMIN_SECRET as string) || "";

const http = axios.create({
  baseURL: `${BASE}/api/admin`,
  headers: { "x-admin-secret": SECRET },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiProduct {
  id: string; name: string; slug: string; description: string;
  price: number; originalPrice: number | null; stock: number;
  sku: string | null; images: string; sizes: string; colors: string;
  isFeatured: boolean; isNew: boolean; rating: number; reviewCount: number;
  categoryId: string; category: { id: string; name: string; slug: string };
  createdAt: string;
}

export interface ApiCategory {
  id: string; name: string; slug: string;
  description: string | null; image: string | null;
  _count?: { products: number };
  createdAt: string;
}

export interface ApiOrder {
  id: string; status: string; total: number;
  paymentMethod: string; shippingAddress: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string; avatar: string | null };
  items: Array<{
    id: string; quantity: number; size: string; color: string; price: number;
    product: { id: string; name: string; images: string };
  }>;
}

export interface ApiReview {
  id: string; rating: number; comment: string; images: string; createdAt: string;
  user: { id: string; name: string | null; email: string; avatar: string | null };
  product: { id: string; name: string; images: string };
}

export interface ApiUser {
  id: string; email: string; name: string | null;
  avatar: string | null; phone: string | null; role: string; createdAt: string;
}

export interface DashboardStats {
  totalProducts: number; totalCategories: number;
  totalOrders: number; totalRevenue: number;
  pendingOrders: number; totalUsers: number;
}

// ─── Products ────────────────────────────────────────────────────────────────

export const productsApi = {
  list: (params?: Record<string, string | number>) =>
    http.get<{ success: boolean; data: ApiProduct[]; total: number }>("/products", { params }),
  get: (id: string) =>
    http.get<{ success: boolean; data: ApiProduct }>(`/products/${id}`),
  create: (data: FormData) =>
    http.post<{ success: boolean; data: ApiProduct }>("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: string, data: FormData) =>
    http.patch<{ success: boolean; data: ApiProduct }>(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: string) =>
    http.delete<{ success: boolean }>(`/products/${id}`),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
  list: () =>
    http.get<{ success: boolean; data: ApiCategory[] }>("/categories"),
  get: (id: string) =>
    http.get<{ success: boolean; data: ApiCategory }>(`/categories/${id}`),
  create: (data: FormData) =>
    http.post<{ success: boolean; data: ApiCategory }>("/categories", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: string, data: FormData) =>
    http.patch<{ success: boolean; data: ApiCategory }>(`/categories/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: string) =>
    http.delete<{ success: boolean }>(`/categories/${id}`),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ordersApi = {
  list: (page = 1) =>
    http.get<{ success: boolean; data: ApiOrder[]; total: number }>("/orders", { params: { page } }),
  get: (id: string) =>
    http.get<{ success: boolean; data: ApiOrder }>(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    http.patch<{ success: boolean; data: ApiOrder }>(`/orders/${id}/status`, { status }),
  delete: (id: string) =>
    http.delete<{ success: boolean }>(`/orders/${id}`),
};

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewsApi = {
  list: (page = 1) =>
    http.get<{ success: boolean; data: ApiReview[]; total: number }>("/reviews", { params: { page } }),
  get: (id: string) =>
    http.get<{ success: boolean; data: ApiReview }>(`/reviews/${id}`),
  delete: (id: string) =>
    http.delete<{ success: boolean }>(`/reviews/${id}`),
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  list: (page = 1) =>
    http.get<{ success: boolean; data: ApiUser[]; total: number }>("/users", { params: { page } }),
  get: (id: string) =>
    http.get<{ success: boolean; data: ApiUser }>(`/users/${id}`),
  updateRole: (id: string, role: string) =>
    http.patch<{ success: boolean; data: ApiUser }>(`/users/${id}`, { role }),
  delete: (id: string) =>
    http.delete<{ success: boolean }>(`/users/${id}`),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  stats: () =>
    http.get<{ success: boolean; data: DashboardStats }>("/dashboard"),
};
