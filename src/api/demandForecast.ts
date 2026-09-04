import { authFetch } from "./authFetch";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

export type DemandForecastItem = {
  menuItemId: string;
  name: string;
  category: string;
  price: number;
  tomorrow: { date: string; quantity: number; confidence: number; weekdayAverage: number; recentAverage: number; trend: number; sampleCount: number };
  next7Days: { quantity: number; averageConfidence: number };
  forecast: { date: string; quantity: number; confidence: number }[];
};

export type DemandForecastResponse = {
  generatedAt: string;
  history: { fromDate: string; toDate: string; days: number };
  method: string;
  items: DemandForecastItem[];
};

export async function getDemandForecast() {
  const response = await authFetch(`${BASE_URL}/forecasting/menu`);
  const body = await response.json() as { success: boolean; data?: DemandForecastResponse; message?: string };
  if (!response.ok || !body.success || !body.data) throw new Error(body.message || "Failed to load demand forecast");
  return body.data;
}
