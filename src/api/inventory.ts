import type {
  ApiErrorResponse,
  ApiItemResponse,
  ApiListResponse,
  CreateInventoryItemInput,
  CreateSupplierContactInput,
  InventoryItem,
  PurchaseOrder,
  StockAdjustmentInput,
  StockMovement,
  Supplier,
  SupplierContact,
  SupplierDetail,
  SupplierDirectoryResponse,
} from "../types/inventory";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body = await res.json();

  if (!res.ok || body.success === false) {
    const err = body as ApiErrorResponse;
    throw new Error(err.message || `Request failed: ${res.status}`);
  }

  return body as T;
}

// ── Inventory ──

export type InventoryFilters = {
  search?: string;
  status?: "in-stock" | "low-stock" | "out-of-stock";
  category?: string;
  page?: number;
  supplierId?: string;
  pageSize?: number;
};

export function getInventory(filters: InventoryFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.category) params.set("category", filters.category);
  if (filters.supplierId) params.set("supplierId", filters.supplierId); // NEW
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

  const qs = params.toString();
  return request<ApiListResponse<InventoryItem>>(`/inventory${qs ? `?${qs}` : ""}`);
}

export function getLowStockItems() {
  return request<ApiListResponse<InventoryItem>>("/inventory/low-stock");
}

export function getInventoryItem(id: string) {
  return request<ApiItemResponse<InventoryItem>>(`/inventory/${id}`);
}

export function createInventoryItem(input: CreateInventoryItemInput) {
  return request<ApiItemResponse<InventoryItem>>("/inventory/create", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateInventoryItem(id: string, input: Partial<CreateInventoryItemInput>) {
  return request<ApiItemResponse<InventoryItem>>(`/inventory/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function adjustStock(id: string, input: StockAdjustmentInput) {
  return request<ApiItemResponse<{ movement: StockMovement; item: InventoryItem }>>(
    `/inventory/${id}/stock`,
    { method: "PATCH", body: JSON.stringify(input) }
  );
}

export function getStockMovements(id: string) {
  return request<ApiListResponse<StockMovement>>(`/inventory/${id}/movements`);
}

export function deleteInventoryItem(id: string) {
  return request<ApiItemResponse<null>>(`/inventory/${id}`, { method: "DELETE" });
}

// ── Suppliers ──

export function getSuppliers(filters: { search?: string; category?: string; status?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);

  const qs = params.toString();
  return request<ApiListResponse<Supplier>>(`/suppliers${qs ? `?${qs}` : ""}`);
}

export function createSupplier(input: Omit<Supplier, "id" | "createdAt" | "updatedAt">) {
  return request<ApiItemResponse<Supplier>>("/suppliers/create", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getSupplierDirectory() {
  return request<SupplierDirectoryResponse>("/suppliers/directory");
}

// ── Purchase Orders ──

export function getPurchaseOrders(filters: { status?: string; supplierId?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.supplierId) params.set("supplierId", filters.supplierId);

  const qs = params.toString();
  return request<ApiListResponse<PurchaseOrder>>(`/purchase-orders${qs ? `?${qs}` : ""}`);
}

export function createPurchaseOrder(input: {
  poNumber: string;
  supplierId: string;
  expectedDate?: string;
  items: { inventoryItemId: string; quantity: number; unitPrice: number }[];
}) {
  return request<ApiItemResponse<PurchaseOrder>>("/purchase-orders/create", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updatePurchaseOrderStatus(
  id: string,
  payload:
    | { status: "SHIPPED" | "CANCELLED" }
    | { status: "RECEIVED"; receivedEverything: true }
    | { status: "RECEIVED"; items: { purchaseOrderItemId: string; receivedQuantity: number; receivedUnitPrice: number }[] }
) {
  return request<ApiItemResponse<PurchaseOrder>>(`/purchase-orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function ratePurchaseOrder(id: string, rating: number) {
  return request<ApiItemResponse<PurchaseOrder>>(`/purchase-orders/${id}/rating`, {
    method: "PATCH",
    body: JSON.stringify({ rating }),
  });
}

//supplier contact
export function getSupplierContacts(filters: { search?: string; category?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);

  const qs = params.toString();
  return request<ApiListResponse<SupplierContact>>(`/supplier-contacts${qs ? `?${qs}` : ""}`);
}

export function createSupplierContact(input: CreateSupplierContactInput) {
  return request<ApiItemResponse<SupplierContact>>("/supplier-contacts/create", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateSupplierContact(id: string, input: Partial<CreateSupplierContactInput>) {
  return request<ApiItemResponse<SupplierContact>>(`/supplier-contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function toggleSupplierContactFavorite(id: string) {
  return request<ApiItemResponse<SupplierContact>>(`/supplier-contacts/${id}/favorite`, {
    method: "PATCH",
  });
}

export function deleteSupplierContact(id: string) {
  return request<ApiItemResponse<null>>(`/supplier-contacts/${id}`, { method: "DELETE" });
}


// NEW
export function getSupplier(id: string) {
  return request<ApiItemResponse<SupplierDetail>>(`/suppliers/${id}`);
}