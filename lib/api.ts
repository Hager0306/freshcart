import axios, { AxiosError } from "axios";
import type {
  Brand,
  Cart,
  Category,
  ListResponse,
  Order,
  Product,
  ShippingAddress,
  SubCategory,
} from "./types";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://ecommerce.routemisr.com/api/v1";

export const TOKEN_KEY = "freshcart_token";

export const http = axios.create({ baseURL: BASE_URL });

http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) config.headers.set("token", token);
    } catch {
      /* storage unavailable */
    }
  }
  return config;
});

export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const e = err as AxiosError<{ message?: string; errors?: { msg?: string } }>;
    return (
      e.response?.data?.errors?.msg ??
      e.response?.data?.message ??
      e.message ??
      "Something went wrong"
    );
  }
  return err instanceof Error ? err.message : "Something went wrong";
}

/* ---------- Auth ---------- */
export const signUp = (body: {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}) => http.post("/auth/signup", body).then((r) => r.data);

export const signIn = (body: { email: string; password: string }) =>
  http
    .post<{ message: string; token: string; user: { name: string; email: string; role: string } }>(
      "/auth/signin",
      body,
    )
    .then((r) => r.data);

export const forgotPassword = (email: string) =>
  http.post("/auth/forgotPasswords", { email }).then((r) => r.data);

export const verifyResetCode = (resetCode: string) =>
  http.post("/auth/verifyResetCode", { resetCode }).then((r) => r.data);

export const resetPassword = (email: string, newPassword: string) =>
  http
    .put<{ token: string }>("/auth/resetPassword", { email, newPassword })
    .then((r) => r.data);

export const changePassword = (body: {
  currentPassword: string;
  password: string;
  rePassword: string;
}) =>
  http.put<{ token: string }>("/users/changeMyPassword", body).then((r) => r.data);

export const updateMe = (body: { name: string; email: string; phone: string }) =>
  http.put("/users/updateMe/", body).then((r) => r.data);

/* ---------- Catalog ---------- */
export type ProductQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: string;
  category?: string;
  brand?: string;
  subcategory?: string;
};

export function getProducts(q: ProductQuery = {}) {
  const params: Record<string, string | number> = {};
  if (q.page) params.page = q.page;
  if (q.limit) params.limit = q.limit;
  if (q.keyword) params.keyword = q.keyword;
  if (q.sort) params.sort = q.sort;
  if (q.category) params["category[in]"] = q.category;
  if (q.brand) params.brand = q.brand;
  if (q.subcategory) params["subcategory[in]"] = q.subcategory;
  return http.get<ListResponse<Product>>("/products", { params }).then((r) => r.data);
}

export const getProduct = (id: string) =>
  http.get<{ data: Product }>(`/products/${id}`).then((r) => r.data.data);

export const getCategories = () =>
  http.get<ListResponse<Category>>("/categories").then((r) => r.data.data);

export const getCategory = (id: string) =>
  http.get<{ data: Category }>(`/categories/${id}`).then((r) => r.data.data);

export const getSubCategoriesOf = (categoryId: string) =>
  http
    .get<ListResponse<SubCategory>>(`/categories/${categoryId}/subcategories`)
    .then((r) => r.data.data);

export const getSubCategory = (id: string) =>
  http.get<{ data: SubCategory }>(`/subcategories/${id}`).then((r) => r.data.data);

export const getBrands = (page = 1, limit = 40) =>
  http
    .get<ListResponse<Brand>>("/brands", { params: { page, limit } })
    .then((r) => r.data);

export const getBrand = (id: string) =>
  http.get<{ data: Brand }>(`/brands/${id}`).then((r) => r.data.data);

/* ---------- Cart ---------- */
export const getCart = () =>
  http.get<{ numOfCartItems: number; data: Cart }>("/cart").then((r) => r.data);

export const addToCart = (productId: string) =>
  http.post("/cart", { productId }).then((r) => r.data);

export const updateCartItem = (productId: string, count: number) =>
  http.put(`/cart/${productId}`, { count }).then((r) => r.data);

export const removeCartItem = (productId: string) =>
  http.delete(`/cart/${productId}`).then((r) => r.data);

export const clearCart = () => http.delete("/cart").then((r) => r.data);

/* ---------- Wishlist ---------- */
export const getWishlist = () =>
  http.get<{ count: number; data: Product[] }>("/wishlist").then((r) => r.data);

export const addToWishlist = (productId: string) =>
  http.post("/wishlist", { productId }).then((r) => r.data);

export const removeFromWishlist = (productId: string) =>
  http.delete(`/wishlist/${productId}`).then((r) => r.data);

/* ---------- Orders / payment ---------- */
export const createCashOrder = (cartId: string, shippingAddress: ShippingAddress) =>
  http.post(`/orders/${cartId}`, { shippingAddress }).then((r) => r.data);

export const createCheckoutSession = (
  cartId: string,
  shippingAddress: ShippingAddress,
  returnUrl: string,
) =>
  http
    .post<{ status: string; session: { url: string } }>(
      `/orders/checkout-session/${cartId}`,
      { shippingAddress },
      { params: { url: returnUrl } },
    )
    .then((r) => r.data);

export const getUserOrders = (userId: string) =>
  http.get<Order[]>(`/orders/user/${userId}`).then((r) => r.data);

/* ---------- Addresses ---------- */
export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export const getAddresses = () =>
  http.get<{ data: Address[] }>("/addresses").then((r) => r.data.data);

export const addAddress = (body: { name: string; details: string; phone: string; city: string }) =>
  http.post<{ data: Address[] }>("/addresses", body).then((r) => r.data.data);

export const removeAddress = (id: string) =>
  http.delete<{ data: Address[] }>(`/addresses/${id}`).then((r) => r.data.data);
