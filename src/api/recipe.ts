import type { InventoryItem } from "../types/inventory";
import { authFetch } from "./authFetch";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

export type RecipeIngredient = {
  id: string;
  ingredientName: string;
  quantity: string;
  unit: string;
  mapping: {
    inventoryItemId: string;
    unitPriceSnapshot: string;
    ingredientCost: string;
    inventoryItem: InventoryItem;
  } | null;
};

export type MenuRecipe = {
  id: string;
  version: number;
  isActive: boolean;
  changeNote: string | null;
  createdAt: string;
  ingredients: RecipeIngredient[];
};

async function request<T>(path: string, options?: RequestInit) {
  const response = await authFetch(`${BASE_URL}${path}`, options);
  const body = await response.json() as { success: boolean; data?: T; message?: string };
  if (!response.ok || !body.success || body.data === undefined) throw new Error(body.message || "Recipe request failed");
  return body.data;
}

export function getMenuRecipes(menuItemId: string) {
  return request<MenuRecipe[]>(`/menu/items/${menuItemId}/recipes`);
}

export function createMenuRecipe(menuItemId: string, input: { changeNote?: string; ingredients: { ingredientName: string; quantity: number; unit: string }[] }) {
  return request<MenuRecipe>(`/menu/items/${menuItemId}/recipes`, { method: "POST", body: JSON.stringify(input) });
}

export function saveRecipeMappings(menuItemId: string, recipeId: string, mappings: { recipeIngredientId: string; inventoryItemId: string }[]) {
  return request<MenuRecipe>(`/menu/items/${menuItemId}/recipes/${recipeId}/mappings`, { method: "PUT", body: JSON.stringify({ mappings })});
}