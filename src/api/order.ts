import type {
  ApiErrorResponse, ApiItemResponse, ApiListResponse,
  CashierSetting, MenuItemWithCategory, Order, OrderStatus, OrderType,
} from "../types/order";
import { authFetch } from "./authFetch";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await authFetch(`${BASE_URL}${path}`, options);
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

export function getOrders(filters: { status?: string; orderType?: string; date?: string; fromDate?: string; toDate?: string } = {}) {
  const p = new URLSearchParams();
  if (filters.status) p.set("status", filters.status);
  if (filters.orderType) p.set("orderType", filters.orderType);
  if (filters.date) p.set("date", filters.date);
  if (filters.fromDate) p.set("fromDate", filters.fromDate);
  if (filters.toDate) p.set("toDate", filters.toDate);
  const qs = p.toString();
  return request<ApiListResponse<Order>>(`/orders${qs ? `?${qs}` : ""}`);
}

export function getNextOrderNumber() {
  return request<ApiItemResponse<{ orderNumber: number }>>("/orders/next-number");
}

export type PosSettings = { id: string; taxRate: string; serviceCharge: string; autoPrintReceipt: boolean; posPin: string };
export type PromoCode = { id: string; code: string; discountPercent: string; usageLimit: number | null; usageCount: number; isActive: boolean; showInPos: boolean };
export function getPosSettings() { return request<ApiItemResponse<PosSettings>>("/settings/pos-settings"); }
export function updatePosSettings(input: { taxRate: number; serviceCharge: number; autoPrintReceipt: boolean; posPin?: string }) {
  return request<ApiItemResponse<PosSettings>>("/settings/pos-settings", { method: "PATCH", body: JSON.stringify(input) });
}
export function getPromoCodes() { return request<ApiListResponse<PromoCode>>("/settings/promo-codes"); }
export function createPromoCode(input: { code: string; discountPercent: number; usageLimit: number | null; isActive: boolean; showInPos: boolean }) {
  return request<ApiItemResponse<PromoCode>>("/settings/promo-codes", { method: "POST", body: JSON.stringify(input) });
}
export function updatePromoCode(id: string, input: Partial<Pick<PromoCode, "code" | "usageLimit" | "isActive" | "showInPos">> & { discountPercent?: number | string }) {
  return request<ApiItemResponse<PromoCode>>(`/settings/promo-codes/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}
export function deletePromoCode(id: string) { return request<ApiItemResponse<null>>(`/settings/promo-codes/${id}`, { method: "DELETE" }); }

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
  promoCode?: string;
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

export type CustomerToken = { orderNumber: number; customerName: string | null; status: OrderStatus; orderType: OrderType; updatedAt: string };
export function getCustomerTokens() {
  return request<ApiListResponse<CustomerToken>>("/orders/token-display");
}
export function verifyPosPin(pin: string) { return request<{ success: true; valid: boolean }>("/settings/pos-pin/verify", { method: "POST", body: JSON.stringify({ pin }) }); }