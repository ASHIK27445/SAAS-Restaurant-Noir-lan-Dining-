import { authFetch } from "./authFetch";
import type { Review } from "./reviews";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await authFetch(`${BASE_URL}${path}`, options);
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || "Request failed");
  return body as T;
}

export function getAdminReviews() {
  return request<{ success: true; data: Review[]; settings: { homeReviewLimit: number } }>("/reviews/admin");
}

export function updateReview(id: string, input: { status?: Review["status"]; showOnHome?: boolean; homeOrder?: number }) {
  return request<{ success: true; data: Review }>(`/reviews/admin/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function updateReviewSettings(homeReviewLimit: number) {
  return request<{ success: true; data: { homeReviewLimit: number } }>("/reviews/admin/settings", { method: "PATCH", body: JSON.stringify({ homeReviewLimit }) });
}
