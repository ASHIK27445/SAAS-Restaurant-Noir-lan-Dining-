import { authFetch } from "./authFetch";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await authFetch(`${BASE_URL}${path}`, options);
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || `Request failed: ${response.status}`);
  return body as T;
}

export type AccessModule = "SUPPLIERS" | "INVENTORY" | "EMPLOYEES" | "ORDERS" | "ATTENDANCE" | "POS" | "MENU" | "USERS";
export type AccessGrant = { id: string; userId: string; module: AccessModule; status: "PENDING" | "APPROVED" | "REJECTED"; user: UserSummary };
export type UserSummary = { id: string; email: string; name: string | null; phone: string | null; role: string; isActive: boolean; firebaseUid: string; accessGrants?: AccessGrant[] };

export function getCurrentUser() {
  return request<{ success: true; user: UserSummary }>("/auth/me");
}

export async function bootstrapAdmin(token: string, profile: { name?: string | null; phone?: string | null }) {
  const response = await fetch(`${BASE_URL}/auth/bootstrap-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, ...profile }),
  });
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || "Admin bootstrap failed");
  return body as { success: true; user: UserSummary };
}

export function getUsers() {
  return request<{ success: true; data: UserSummary[] }>("/auth/users");
}

export function updateUser(id: string, input: { name?: string; phone?: string; role?: string; isActive?: boolean }) {
  return request<{ success: true; data: UserSummary }>(`/auth/users/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function deleteUser(id: string) {
  return request<{ success: true; message: string }>(`/auth/users/${id}`, { method: "DELETE" });
}

export function getAccessGrants() {
  return request<{ success: true; data: AccessGrant[] }>("/auth/access-grants");
}

export function requestAccess(userId: string, module: AccessModule) {
  return request("/auth/access-grants", { method: "POST", body: JSON.stringify({ userId, module }) });
}

export function reviewAccess(grantId: string, status: "APPROVED" | "REJECTED") {
  return request(`/auth/access-grants/${grantId}`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export function changeFirebasePassword(uid: string, password: string) {
  return request(`/auth/users/${uid}/password`, { method: "PATCH", body: JSON.stringify({ password }) });
}
