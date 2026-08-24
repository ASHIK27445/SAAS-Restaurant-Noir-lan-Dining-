import type {
  ApiErrorResponse, ApiItemResponse, ApiListResponse,
  CashierSetting, MenuItemWithCategory, Order, OrderStatus, OrderType,
} from "../types/order";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
  const body = await res.json();
  if (!res.ok || body.success === false) throw new Error((body as ApiErrorResponse).message || `Request failed: ${res.status}`);
  return body as T;
}

export function getMenuItemsByBucket(bucket: string) {
  return request<ApiListResponse<MenuItemWithCategory>>(`/orders/menu/items/by-bucket/${bucket}`);
}

export function getCashierSetting() {
  return request<ApiItemResponse<CashierSetting | null>>("/orders/cashier-setting");
}
export function setCashierSetting(staffId: string) {
  return request<ApiItemResponse<CashierSetting>>("/orders/cashier-setting", { method: "PATCH", body: JSON.stringify({ staffId }) });
}

export function getOrders(filters: { status?: string; orderType?: string; date?: string } = {}) {
  const p = new URLSearchParams();
  if (filters.status) p.set("status", filters.status);
  if (filters.orderType) p.set("orderType", filters.orderType);
  if (filters.date) p.set("date", filters.date);
  const qs = p.toString();
  return request<ApiListResponse<Order>>(`/orders${qs ? `?${qs}` : ""}`);
}

export function createOrder(input: {
  orderType: OrderType;
  serverStaffId?: string;
  tableNo?: string;
  guestCount?: number;
  customerName?: string;
  deliveryAddress?: string;
  note?: string;
  paymentMethod?: string;
  items: { menuItemId: string; quantity: number; unitPrice: number; note?: string }[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
}) {
  return request<ApiItemResponse<Order>>("/orders/create", { method: "POST", body: JSON.stringify(input) });
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return request<ApiItemResponse<Order>>(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export function completeDineInWithPayment(id: string, paymentMethod: string) {
  return request<ApiItemResponse<Order>>(`/orders/${id}/complete-with-payment`, { method: "POST", body: JSON.stringify({ paymentMethod }) });
}

export function markPrepStart(unitId: string) {
  return request<ApiItemResponse<any>>(`/orders/item-units/${unitId}/prep-start`, { method: "POST" });
}
export function markPrepComplete(unitId: string) {
  return request<ApiItemResponse<any>>(`/orders/item-units/${unitId}/prep-complete`, { method: "POST" });
}
export function getKitchenQueue() {
  return request<ApiListResponse<any>>("/orders/kitchen-queue");
}