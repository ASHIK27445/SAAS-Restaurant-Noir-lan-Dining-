const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

export type Review = {
  id: string;
  displayName: string | null;
  isAnonymous: boolean;
  content: string;
  foodRating: number;
  serviceRating: number;
  ambienceRating: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  showOnHome?: boolean;
  homeOrder?: number;
  createdAt: string;
};

export async function getHomeReviews() {
  const response = await fetch(`${BASE_URL}/reviews/home`);
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || "Could not load reviews");
  return body as { success: true; data: Review[]; limit: number };
}

export async function submitReview(input: Omit<Review, "id" | "createdAt" | "status" | "showOnHome" | "homeOrder">) {
  const response = await fetch(`${BASE_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || "Could not submit review");
  return body as { success: true; message: string };
}
