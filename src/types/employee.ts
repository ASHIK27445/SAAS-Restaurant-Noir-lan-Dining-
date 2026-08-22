export type RoleEnum = "Chef" | "SousChef" | "Waiter" | "Cashier" | "Manager" | "Admin";
export type Department = "Kitchen" | "Front of House" | "Administration";

export type Staff = {
  id: string;
  name: string;
  email: string;
  role: RoleEnum;
  title: string;
  phone: string;
  avatar: string | null;
  isActive: boolean;
  systemAccess: boolean;
  online: boolean;
  location: string | null;
  hourlyRate: string | null;
  scheduleStartTime: string | null;
  scheduleEndTime: string | null;
  scheduleLabel: string | null;
  department: Department;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeListItem = {
  id: string;
  name: string;
  email: string;
  role: RoleEnum;
  title: string;
  phone: string;
  img: string;
  online: boolean;
  location: string;
  systemAccess: boolean;
  hourlyRate: string | null;
  scheduleStartTime: string | null;
  scheduleEndTime: string | null;
  scheduleLabel: string | null;
  department: Department;
};

export type RateHistoryEntry = {
  id: string;
  staffId: string;
  rate: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdAt: string;
};

export type OpenShiftAssignment = {
  id: string;
  openShiftId: string;
  staffId: string;
  staff?: Staff;
  rateAtAssignment: string;
  createdAt: string;
};

export type OpenShift = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  label: string;
  role: string;
  assignments: OpenShiftAssignment[];
  createdAt: string;
  updatedAt: string;
};

export type AttendanceRow = {
  id: string | null;
  staffId: string;
  staffName: string;
  staffRole: RoleEnum;
  scheduleLabel: string | null;
  scheduleStartTime: string | null;
  scheduleEndTime: string | null;
  checkIn: string | null;
  checkOut: string | null;
  regularHours: string | null;
  regularWage: string | null;
  hasOpenShiftToday: boolean;
  openShiftAssignmentId: string | null;
  openShiftLabel: string | null;
  openShiftAttended: boolean;
  openShiftHours: string | null;
  openShiftWage: string | null;
  bonus: string;
  totalWage: string | null;
};

export type WageSummaryEntry = {
  staffId: string;
  staffName: string;
  totalHours: number;
  totalWage: number;
  daysWorked: number;
};

export type WageSummaryReport = {
  data: WageSummaryEntry[];
  meta: { grandTotalWage: number; grandTotalHours: number };
};

export type YearlyMonthEntry = { month: number; totalHours: number; totalWage: number };
export type YearlyWageReport = {
  data: YearlyMonthEntry[];
  meta: { grandTotalWage: number; grandTotalHours: number };
};

export type ApiListResponse<T> = { success: true; data: T[] };
export type ApiItemResponse<T> = { success: true; message?: string; data: T };
export type ApiErrorResponse = { success: false; message: string };