import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import Spinner from "../components/Others/Spinner.tsx";

// POS — EAGER (highest priority, customer-facing, instant load)
import PosAccessGate from "../components/Authentication/PosAccessGate";
import PosKoh from "../components/Pos/PosKoh.tsx";
import Pos from "../components/Pos/Pos.tsx";
import OrderPos from "../components/Pos/OrderPos.tsx";
import OrderPosDetails from "../components/Pos/OrderPosDetails.tsx";
import KitchenQueue from "../components/Admin/KitchenQueue";
import CustomerTokenDisplay from "../components/Admin/CustomerTokenDisplay";
import PosLogin from "../components/Authentication/PosLogin";
import HomeMain from "../components/Others/HomeMain.tsx";

// Login pages — EAGER (small file, no spinner needed)
import ManagementLogin from "../components/Authentication/ManagementLogin";

// Admin — LAZY (role-restricted, not on every visit)
const ManagementAccessGate = lazy(() => import("../components/Authentication/ManagementAccessGate"));
const AdminHome = lazy(() => import("../components/Admin/AdminHome"));
const AdminDashboardDefault = lazy(() => import("../components/Admin/AdminDashboardDefault"));
const AddMenuItem = lazy(() => import("../components/Admin/AddMenuItem"));
const CategoryManagement = lazy(() => import("../components/Admin/CategoryManagement"));
const InventoryManagement = lazy(() => import("../components/Admin/InventoryManagement"));
const EmployeeManagement = lazy(() => import("../components/Admin/EmployeeManagement"));
const UserManagement = lazy(() => import("../components/Admin/UserManagement"));
const CustomerManagement = lazy(() => import("../components/Admin/CustomerManagement"));
const PermissionManagement = lazy(() => import("../components/Pos/PermissionManagement.tsx"));
const StaffSchedule = lazy(() => import("../components/Admin/StaffSchedule"));
const EmployeeViewSchedule = lazy(() => import("../components/Admin/EmployeeViewSchedule"));
const OrderManagementReal = lazy(() => import("../components/Admin/OrderManagementReal"));
const AdminBusinessAssistant = lazy(() => import("../components/Admin/AdminBusinessAssistant"));
const Reports = lazy(() => import("../components/Admin/Reports"));
const DemandForecast = lazy(() => import("../components/Admin/DemandForecast"));
const InvoiceHistory = lazy(() => import("../components/Admin/InvoiceHistory"));
const WageReport = lazy(() => import("../components/Admin/WageReport"));
const DailyAttendance = lazy(() => import("../components/Admin/DailyAttendence"));
const FloorAdmin = lazy(() => import("../components/Admin/FloorAdmin"));
const MenuItemManagement = lazy(() => import("../components/Admin/MenuItemManagement"));
const InquiryPage = lazy(() => import("../components/Admin/InquiryPage"));
const ReviewAdminManagement = lazy(() => import("../components/Admin/ReviewAdminManagement"));
const AdminReservationManagement = lazy(() => import("../components/Admin/AdminReservationManagement"));
const GalleryAdminManagement = lazy(() => import("../components/Admin/GalleryAdminManagement"));
const CashierSettingPage = lazy(() => import("../components/Admin/CashierSettingPage"));
const SupportPage = lazy(() => import("../components/Admin/SupportPage.tsx"));

// Supplier — LAZY
const SupplierAccessGate = lazy(() => import("../components/Authentication/SupplierAccessGate"));
const SupplierLayout = lazy(() => import("../components/supplier/SupplierLayout"));
const SupplierDirectory = lazy(() => import("../components/supplier/SupplierDirectory"));
const ProcurementPOTracking = lazy(() => import("../components/supplier/ProcurementTracking"));
const InventorySuppliers = lazy(() => import("../components/supplier/InventorySuppliers"));
const SupplierCatalogManagement = lazy(() => import("../components/supplier/SupplierCatelogManagement"));
const SupplierPerformanceAnalysis = lazy(() => import("../components/supplier/SupplierPerformanceAnalysis"));
const SupplierContactDirectory = lazy(() => import("../components/supplier/SupplierContactDirectory"));
const SupplierProfile = lazy(() => import("../components/supplier/SupplierProfile"));

const withSuspense = (Component: any) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  { path: "/", Component: HomeMain },
  {
    path: "admin",
    element: withSuspense(ManagementAccessGate),
    children: [
      {
        element: withSuspense(AdminHome),
        children: [
          { index: true, element: withSuspense(AdminDashboardDefault) },
          {
            path: "menu",
            children: [
              { index: true, element: withSuspense(AddMenuItem) },
              { path: "category-manage", element: withSuspense(CategoryManagement) },
              { path: "inventory-manage", element: withSuspense(InventoryManagement) },
            ],
          },
          { path: "employee", element: withSuspense(EmployeeManagement) },
          { path: "users", element: withSuspense(UserManagement) },
          { path: "customers", element: withSuspense(CustomerManagement) },
          { path: "permissions", element: withSuspense(PermissionManagement) },
          { path: "staff-schedule", element: withSuspense(StaffSchedule) },
          { path: "staff-view-schedule", element: withSuspense(EmployeeViewSchedule) },
          { path: "orders", element: withSuspense(OrderManagementReal) },
          { path: "business-assistant", element: withSuspense(AdminBusinessAssistant) },
          { path: "reports", element: withSuspense(Reports) },
          { path: "demand-forecast", element: withSuspense(DemandForecast) },
          { path: "invoice-history", element: withSuspense(InvoiceHistory) },
          { path: "wage-report", element: withSuspense(WageReport) },
          { path: "attendence", element: withSuspense(DailyAttendance) },
          { path: "floor-distribution", element: withSuspense(FloorAdmin) },
          { path: "menu-item-manage", element: withSuspense(MenuItemManagement) },
          { path: "inquiry", element: withSuspense(InquiryPage) },
          { path: "reviews", element: withSuspense(ReviewAdminManagement) },
          { path: "reservations", element: withSuspense(AdminReservationManagement) },
          { path: "gallery", element: withSuspense(GalleryAdminManagement) },
          { path: "settings", element: withSuspense(CashierSettingPage) },
          { path: "support", element: withSuspense(SupportPage) },
        ],
      },
    ],
  },
  // POS — no Suspense, instant
  {
    path: "/pos-koh",
    Component: PosAccessGate,
    children: [
      {
        Component: PosKoh,
        children: [
          { index: true, Component: Pos },
          { path: "orders", Component: OrderPos },
          { path: "orders/:orderId", Component: OrderPosDetails },
          { path: "kitchen-queue", Component: KitchenQueue },
          { path: "customer-display", Component: CustomerTokenDisplay },
        ],
      },
    ],
  },
  { path: "/pos-koh/cashier-setting", element: <Navigate to="/admin/settings" replace /> },
  { path: "pos-login", Component: PosLogin },
  { path: "management-login", Component: ManagementLogin },
  {
    path: "/supplier",
    element: withSuspense(SupplierAccessGate),
    children: [
      {
        element: withSuspense(SupplierLayout),
        children: [
          { index: true, element: withSuspense(SupplierDirectory) },
          { path: "procurement", element: withSuspense(ProcurementPOTracking) },
          { path: "usage", element: withSuspense(InventorySuppliers) },
          { path: "catalog", element: withSuspense(SupplierCatalogManagement) },
          { path: "performance", element: withSuspense(SupplierPerformanceAnalysis) },
          { path: "contacts", element: withSuspense(SupplierContactDirectory) },
          { path: ":supplierId", element: withSuspense(SupplierProfile) },
        ],
      },
    ],
  },
]);