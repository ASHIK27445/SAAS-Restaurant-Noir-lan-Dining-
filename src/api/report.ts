import { authFetch } from "./authFetch";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

export type ReportsOverview = {
  period: { fromDate: string; toDate: string };
  summary: { revenue: number; orderCount: number; averageOrderValue: number };
  daily: { date: string; revenue: number; orders: number }[];
  categories: { name: string; quantity: number; revenue: number; percentage: number }[];
  topDishes: { menuItemId: string; name: string; quantity: number; revenue: number }[];
  orderTypes: { orderType: string; orders: number; revenue: number }[];
};

export async function getReportsOverview(fromDate?: string, toDate?: string) {
  const params = new URLSearchParams();
  if (fromDate) params.set("fromDate", fromDate);
  if (toDate) params.set("toDate", toDate);
  const query = params.toString();
  const response = await authFetch(`${BASE_URL}/reports/overview${query ? `?${query}` : ""}`);
  const body = await response.json() as { success: boolean; data?: ReportsOverview; message?: string };
  if (!response.ok || !body.success || !body.data) throw new Error(body.message || "Failed to load reports");
  return body.data;
}
