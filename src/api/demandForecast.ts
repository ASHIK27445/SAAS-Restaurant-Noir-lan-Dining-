import { authFetch } from "./authFetch";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

export type DemandForecastItem = {
  menuItemId: string;
  name: string;
  category: string;
  price: number;
  tomorrow: { date: string; expectedQuantity: number; recommendedQuantity: number; status: "NO_HISTORY" | "LOW_DEMAND" | "FORECAST"; confidence: number; weekdayAverage: number; recentAverage: number; soldDayAverage: number; trend: number; sampleCount: number };
  next7Days: { expectedQuantity: number; recommendedQuantity: number; averageConfidence: number };
  forecast: { date: string; expectedQuantity: number; recommendedQuantity: number; status: "NO_HISTORY" | "LOW_DEMAND" | "FORECAST"; confidence: number }[];
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

  // Keep the UI stable while a development server is still serving the previous response shape.
  return {
    ...body.data,
    items: body.data.items.map((item) => {
      const legacyTomorrow = item.tomorrow as typeof item.tomorrow & { quantity?: number };
      const legacyNext7Days = item.next7Days as typeof item.next7Days & { quantity?: number };
      const expectedQuantity = item.tomorrow.expectedQuantity ?? legacyTomorrow.quantity ?? 0;
      const recommendedQuantity = item.tomorrow.recommendedQuantity ?? Math.round(expectedQuantity);
      const status = item.tomorrow.status ?? (expectedQuantity === 0 ? "NO_HISTORY" : "FORECAST");
      return {
        ...item,
        tomorrow: { ...item.tomorrow, expectedQuantity, recommendedQuantity, status },
        next7Days: {
          ...item.next7Days,
          expectedQuantity: item.next7Days.expectedQuantity ?? legacyNext7Days.quantity ?? expectedQuantity * 7,
          recommendedQuantity: item.next7Days.recommendedQuantity ?? legacyNext7Days.quantity ?? recommendedQuantity * 7,
        },
      };
    }),
  };
}
