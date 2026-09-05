import { authFetch } from "./authFetch";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

export type AssistantResponse = {
  answer: string;
  intent: string;
  period: { fromDate: string; toDate: string };
  highlights: { label: string; value: string }[];
};

export async function askAssistant(question: string) {
  const response = await authFetch(`${BASE_URL}/assistant/ask`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
  const body = await response.json() as { success: boolean; data?: AssistantResponse; message?: string };
  if (!response.ok || !body.success || !body.data) throw new Error(body.message || "Unable to answer that question");
  return body.data;
}