import type {
  ApiErrorResponse, ApiItemResponse, ApiListResponse,
  AttendanceRow, EmployeeListItem, OpenShift, RateHistoryEntry, Staff,
  WageSummaryReport, YearlyWageReport,
} from "../types/employee";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
  const body = await res.json();
  if (!res.ok || body.success === false) throw new Error((body as ApiErrorResponse).message || `Request failed: ${res.status}`);
  return body as T;
}

// ── Staff ──
export function getStaffList() {
  return request<ApiListResponse<EmployeeListItem>>("/employees/staff/all/list");
}
export function getStaff(filters: { search?: string; role?: string } = {}) {
  const p = new URLSearchParams();
  if (filters.search) p.set("search", filters.search);
  if (filters.role) p.set("role", filters.role);
  const qs = p.toString();
  return request<ApiListResponse<Staff>>(`/employees/staff${qs ? `?${qs}` : ""}`);
}
export function createStaff(input: {
  name: string; email: string; role: string; title: string; phone?: string; image?: string;
  systemAccess?: boolean; hourlyRate?: number; scheduleStartTime?: string; scheduleEndTime?: string; scheduleLabel?: string;
}) {
  return request<ApiItemResponse<Staff>>("/employees/staff/create", { method: "POST", body: JSON.stringify(input) });
}
export function updateStaff(id: string, input: {
  name: string; email: string; role: string; title: string; phone?: string; image?: string; systemAccess?: boolean;
  scheduleStartTime?: string; scheduleEndTime?: string; scheduleLabel?: string;
}) {
  return request<ApiItemResponse<Staff>>(`/employees/staff/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}
export function updateStaffSchedule(id: string, input: { scheduleStartTime: string; scheduleEndTime: string; scheduleLabel: string }) {
  return request<ApiItemResponse<Staff>>(`/employees/staff/${id}/schedule`, { method: "PATCH", body: JSON.stringify(input) });
}
export function updateStaffRate(id: string, rate: number) {
  return request<ApiItemResponse<Staff>>(`/employees/staff/${id}/rate`, { method: "PATCH", body: JSON.stringify({ rate }) });
}
export function getRateHistory(id: string) {
  return request<ApiListResponse<RateHistoryEntry>>(`/employees/staff/${id}/rate-history`);
}

// ── Open Shifts ──
export function getOpenShifts(filters: { startDate?: string; endDate?: string } = {}) {
  const p = new URLSearchParams();
  if (filters.startDate) p.set("startDate", filters.startDate);
  if (filters.endDate) p.set("endDate", filters.endDate);
  const qs = p.toString();
  return request<ApiListResponse<OpenShift>>(`/employees/open-shifts${qs ? `?${qs}` : ""}`);
}
export function createOpenShift(input: { date: string; startTime: string; endTime: string; label: string; role: string; staffIds?: string[] }) {
  return request<ApiItemResponse<OpenShift>>("/employees/open-shifts/create", { method: "POST", body: JSON.stringify(input) });
}
export function assignOpenShift(openShiftId: string, staffIds: string[]) {
  return request<ApiItemResponse<OpenShift>>(`/employees/open-shifts/${openShiftId}/assign`, { method: "POST", body: JSON.stringify({ staffIds }) });
}
export function deleteOpenShift(id: string) {
  return request<ApiItemResponse<null>>(`/employees/open-shifts/${id}`, { method: "DELETE" });
}

// ── Attendance ──
export function getAttendance(date: string) {
  return request<ApiListResponse<AttendanceRow>>(`/employees/attendance?date=${date}`);
}
export function checkIn(staffId: string, date: string) {
  return request<ApiItemResponse<AttendanceRow>>("/employees/attendance/check-in", { method: "POST", body: JSON.stringify({ staffId, date }) });
}
export function checkOut(staffId: string, date: string) {
  return request<ApiItemResponse<AttendanceRow>>("/employees/attendance/check-out", { method: "POST", body: JSON.stringify({ staffId, date }) });
}
export function toggleOpenShiftAttendance(input: { staffId: string; date: string; attended: boolean; openShiftAssignmentId: string }) {
  return request<ApiItemResponse<AttendanceRow>>("/employees/attendance/open-shift-toggle", { method: "POST", body: JSON.stringify(input) });
}
export function setBonus(staffId: string, date: string, bonus: number) {
  return request<ApiItemResponse<AttendanceRow>>("/employees/attendance/bonus", { method: "PATCH", body: JSON.stringify({ staffId, date, bonus }) });
}

// ── Wage Reports ──
export function getWeeklyWageReport(startDate: string) {
  return request<WageSummaryReport & { success: true }>(`/employees/wages/weekly?startDate=${startDate}`);
}
export function getMonthlyWageReport(year: number, month: number) {
  return request<WageSummaryReport & { success: true }>(`/employees/wages/monthly?year=${year}&month=${month}`);
}
export function getYearlyWageReport(year: number) {
  return request<YearlyWageReport & { success: true }>(`/employees/wages/yearly?year=${year}`);
}