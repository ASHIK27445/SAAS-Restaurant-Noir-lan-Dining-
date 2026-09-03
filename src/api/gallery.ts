import { authFetch } from "./authFetch";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";
export type GalleryCategory = "INTERIOR" | "FOOD" | "MOMENTS";
export type GalleryImage = { id: string; title: string; imageUrl: string; altText: string | null; category: GalleryCategory; sortOrder: number; isActive: boolean; createdAt?: string };

export async function getPublicGallery() {
  const response = await fetch(`${BASE_URL}/public/gallery`);
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || "Could not load gallery");
  return body as { success: true; data: GalleryImage[] };
}

async function adminRequest<T>(path: string, options?: RequestInit) {
  const response = await authFetch(`${BASE_URL}${path}`, options);
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || "Request failed");
  return body as T;
}

export function getAdminGallery() { return adminRequest<{ success: true; data: GalleryImage[] }>("/admin/gallery"); }
export function createGalleryImage(input: Omit<GalleryImage, "id" | "createdAt">) { return adminRequest<{ success: true; data: GalleryImage }>("/admin/gallery", { method: "POST", body: JSON.stringify(input) }); }
export function updateGalleryImage(id: string, input: Partial<Omit<GalleryImage, "id" | "createdAt">>) { return adminRequest<{ success: true; data: GalleryImage }>(`/admin/gallery/${id}`, { method: "PATCH", body: JSON.stringify(input) }); }
export function deleteGalleryImage(id: string) { return adminRequest<{ success: true }>(`/admin/gallery/${id}`, { method: "DELETE" }); }
