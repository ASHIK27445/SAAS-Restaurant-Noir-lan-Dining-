const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

export type Reservation = {
  id: string; guestName: string; email: string; phone: string; reservationDate: string; reservationTime: string; guestCount: number; specialRequest: string | null; status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"; adminNote: string | null; createdAt: string;
};

export async function submitReservation(input: { guestName: string; email: string; phone: string; reservationDate: string; reservationTime: string; guestCount: number; specialRequest: string }) {
  const response = await fetch(`${BASE_URL}/reservations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || "Could not submit reservation");
  return body as { success: true; message: string };
}
