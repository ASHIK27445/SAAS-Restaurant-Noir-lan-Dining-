import { authFetch } from "./authFetch";
import type { Reservation } from "./reservations";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await authFetch(`${BASE_URL}${path}`, options);
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || "Request failed");
  return body as T;
}

export function getAdminReservations() { return request<{ success: true; data: Reservation[] }>("/reservations/admin"); }
export function updateReservation(id: string, input: { status?: Reservation["status"]; adminNote?: string }) { return request<{ success: true; data: Reservation }>(`/reservations/admin/${id}`, { method: "PATCH", body: JSON.stringify(input) }); }
