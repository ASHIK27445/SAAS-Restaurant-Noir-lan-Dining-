const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

export type PublicMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string | null;
};

export type PublicMenuCategory = {
  id: string;
  name: string;
  description: string | null;
  bucketType: "MEALS" | "DRINKS" | "DESSERTS" | "SIDES";
  menuItems: PublicMenuItem[];
};

export async function getPublicMenu() {
  const response = await fetch(`${BASE_URL}/public/menu`);
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || "Could not load menu");
  return body as { success: true; data: PublicMenuCategory[]; specials: PublicMenuCategory[] };
}
