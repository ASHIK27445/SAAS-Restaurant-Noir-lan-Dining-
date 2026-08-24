export type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY";
export type OrderStatus = "PREPARING" | "SERVED" | "OUT_FOR_DELIVERY" | "RECEIVED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID";
export type CategoryBucket = "MEALS" | "DRINKS" | "DESSERTS" | "SIDES";

export type MenuItemWithCategory = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string | null;
  categoryId: string;
  category?: { id: string; name: string; bucketType: CategoryBucket };
};

export type OrderItemUnit = {
  id: string;
  orderItemId: string;
  unitIndex: number;
  prepStartedAt: string | null;
  prepCompletedAt: string | null;
};

export type OrderItem = {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItem?: MenuItemWithCategory;
  quantity: number;
  unitPrice: string;
  note: string | null;
  units: OrderItemUnit[];
};

export type Order = {
  id: string;
  orderNumber: number;
  orderNumberDisplay: string;
  orderType: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  paidAt: string | null;
  cashierName: string | null;
  serverStaffId: string | null;
  serverName: string | null;
  tableNo: string | null;
  guestCount: number | null;
  customerName: string | null;
  deliveryAddress: string | null;
  note: string | null;
  subtotal: string;
  tax: string;
  serviceCharge: string;
  total: string;
  items: OrderItem[];
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CashierSetting = {
  id: string;
  activeCashierStaffId: string | null;
  activeCashier?: { id: string; name: string; role: string } | null;
  updatedAt: string;
};

export type ApiListResponse<T> = { success: true; data: T[] };
export type ApiItemResponse<T> = { success: true; message?: string; data: T };
export type ApiErrorResponse = { success: false; message: string };