// Types mirroring schema.prisma — keep these in sync with the backend models.

export type SupplierStatus = "ACTIVE" | "INACTIVE";

export type Supplier = {
  id: string;
  name: string;
  category: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  rating: number | null;
  status: SupplierStatus;
  createdAt: string;
  updatedAt: string;
};

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  unit: string;
  image: string | null;
  category: string;
  currentStock: string; // Prisma Decimal serializes as a string over JSON
  minThreshold: string;
  costPerUnit: string;
  supplierId: string | null;
  supplier?: Supplier | null;
  createdAt: string;
  updatedAt: string;
  // Computed by the backend on read — not stored
  status: StockStatus;
};

export type StockMovementType = "RESTOCK" | "USAGE" | "WASTE" | "ADJUSTMENT";

export type StockMovement = {
  id: string;
  inventoryItemId: string;
  type: StockMovementType;
  quantity: string;
  note: string | null;
  createdAt: string;
};

export type PurchaseOrderStatus = "PENDING" | "SHIPPED" | "RECEIVED" | "CANCELLED";

export type PurchaseOrderItem = {
  id: string;
  purchaseOrderId: string;
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
  quantity: string;
  unitPrice: string;
  receivedQuantity: string | null;
  receivedUnitPrice: string | null;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  supplierId: string;
  supplier?: Supplier;
  status: PurchaseOrderStatus;
  issuedDate: string;
  expectedDate: string | null;
  deliveredDate: string | null;
  totalAmount: string;
  rating: number | null;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
  purchaseAmount: number | null;
};

// Result shape of GET /suppliers/directory — aggregated from received purchase order data.
export type SupplierDirectoryEntry = {
  id: string;
  name: string;
  category: string;
  rating: number | null;
  status: SupplierStatus;
  totalSpend: number;
  lastDelivery: string | null;
  reliabilityScore: number | null;
  productQualityScore: number | null;
  onTimeDeliveryScore: number | null;
  orderFulfillmentScore: number | null;
  demandFulfillmentScore: number | null;
  qualityAcceptance: number | null;
  onTimeTrackedCount: number;
  qualityTrackedQuantity: number;
  totalOrders: number;
  receivedOrderCount: number;
  ratedOrderCount: number;
};

export type SupplierDirectoryResponse = {
  success: true;
  data: SupplierDirectoryEntry[];
  meta: { activeSupplierCount: number };
};

// ── API request/response shapes ──

export type ApiListResponse<T> = {
  success: true;
  data: T[];
  pagination?: { page: number; pageSize: number; total: number };
};

export type ApiItemResponse<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

export type CreateInventoryItemInput = {
  name: string;
  sku: string;
  unit: string;
  image?: string;
  category: string;
  currentStock?: number;
  minThreshold?: number;
  costPerUnit: number;
  supplierId?: string;
};

export type StockAdjustmentInput = {
  type: StockMovementType;
  quantity: number;
  note?: string;
};

export type SupplierContact = {
  id: string;
  companyName: string;
  category: string | null;
  contactName: string | null;
  role: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  businessHours: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateSupplierContactInput = {
  companyName: string;
  category?: string;
  contactName?: string;
  role?: string;
  email?: string;
  phone?: string;
  address?: string;
  businessHours?: string;
};

export type ShortageRecord = {
  poNumber: string;
  itemName: string;
  unit: string;
  orderedQuantity: number;
  receivedQuantity: number;
  shortageQuantity: number;
  deliveredDate: string | null;
};

export type SupplierDetail = Supplier & {
  totalSpend: number;
  lastDelivery: string | null;
  fulfillmentRate: number | null; // null = not enough order history yet
  totalOrders: number;
  receivedOrderCount: number;
  qualityScore: number | null;
  ratedOrderCount: number;
  onTimeDeliveryRate: number | null;   // % on-time over the last 2 months, null if no trackable orders
  onTimeTrackedCount: number;
  shortageCount: number;               // count of received line items where receivedQuantity < ordered quantity, YTD
  shortages: ShortageRecord[];         // the underlying records for shortageCount, most recent first
};


export type DailyUsagePoint = { date: string; quantity: number };
export type MonthlyUsagePoint = { month: string; quantity: number };

export type InventoryUsageReport = {
  itemId: string;
  itemName: string;
  unit: string;
  currentStock: string;
  dailyUsage: DailyUsagePoint[];
  monthlyUsage: MonthlyUsagePoint[];
  averageDailyUsage: number | null;
};

export type InventoryUsageOverview = {
  itemId: string;
  totalUsage: number;
  averageDailyUsage: number;
};