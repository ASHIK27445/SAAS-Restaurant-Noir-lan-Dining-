import { authFetch } from "./authFetch";

import type {
  InquiryErrorResponse,
  InquiryItemResponse,
  InquiryListResponse,
  InquiryType,
} from "../types/inquiry";

const BASE_URL =
  import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await authFetch(
    `${BASE_URL}${path}`,
    options
  );

  const body = await res.json();

  if (!res.ok || body.success === false) {
    throw new Error(
      (body as InquiryErrorResponse).message ||
        `Request failed: ${res.status}`
    );
  }

  return body as T;
}

// GET /inquiry/all
export function getInquiries(
  type?: InquiryType
) {
  const query = type
    ? `?type=${type}`
    : "";

  return request<InquiryListResponse>(
    `/inquiry/all${query}`
  );
}

// POST /inquiry/get-started
export function createGetStartedInquiry(
  email: string
) {
  return request<InquiryItemResponse>(
    "/inquiry/get-started",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  );
}

// POST /inquiry/book-a-demo
export function createBookDemoInquiry(
  email: string
) {
  return request<InquiryItemResponse>(
    "/inquiry/book-a-demo",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  );
}