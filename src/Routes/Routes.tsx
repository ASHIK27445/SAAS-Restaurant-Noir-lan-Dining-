import { createBrowserRouter, Navigate } from "react-router";
import CulinaryEditorial from "../components/Home/CulinaryEditional";
import CulinaryEditorialAbout from "../components/Home/CulinaryEditionalAbout";
import Login from "../components/Authentication/Login";
import ProductPage from "../components/Products/ProductPage";
import AddMenuItemPage from "../components/Others/AddMenuItemPage";
import EmployeeManagementPage from "../components/Others/EmployeeManagementPage";
import OrderManagementPage from "../components/Others/OrderManagementPage";
import CulinaryPOS from "../components/POS/CulinaryPOS";
import FloorPlan from "../components/POS/FloorPlan";
import PosDashboard from "../components/POS/PosDashboard";
import PosHome from "../components/POS/PosHome";
import StaffDirectory from "../components/POS/StaffDirectory";
import PosOrderManagement from "../components/POS/PosOrderManagement";
import FloorDistribution from "../components/POS/FloorDistribution";
import CreateAccount from "../components/Authentication/Registration";
import EmailVerificationSuccess from "../components/Authentication/EmailVerificationSuccess";
import EmailVerificationSent from "../components/Authentication/EmailVerificationSent";
import ResendVerification from "../components/Authentication/ResendVerification";
import AddMenuItem from "../components/Admin/AddMenuItem";
import CategoryManagement from "../components/Admin/CategoryManagement";
import AdminHome from "../components/Admin/AdminHome";
import AdminDashboardDefault from "../components/Admin/AdminDashboardDefault";
import InventoryManagement from "../components/Admin/InventoryManagement";
import EmployeeManagement from "../components/Admin/EmployeeManagement";
import AddEmployeeModal from "../components/Admin/AddEmployeeModal";
import StaffSchedule from "../components/Admin/StaffSchedule";
import EmployeeViewSchedule from "../components/Admin/EmployeeViewSchedule";
import Reports from "../components/Admin/Reports";
import DemandForecast from "../components/Admin/DemandForecast";
import InvoiceHistory from "../components/Admin/InvoiceHistory";
import SupplierProfile from "../components/supplier/SupplierProfile";
import SupplierDirectory from "../components/supplier/SupplierDirectory";
import SupplierPerformanceAnalysis from "../components/supplier/SupplierPerformanceAnalysis";
import SupplierContactDirectory from "../components/supplier/SupplierContactDirectory";
import SupplierCatalogManagement from "../components/supplier/SupplierCatelogManagement";
import ProcurementPOTracking from "../components/supplier/ProcurementTracking";
import SupplierLayout from "../components/supplier/SupplierLayout";
import InventorySuppliers from "../components/supplier/InventorySuppliers";
import WageReport from "../components/Admin/WageReport";
import DailyAttendance from "../components/Admin/DailyAttendence";
import FloorAdmin from "../components/Admin/FloorAdmin";
import Pos from "../components/Admin/Pos";
import KitchenQueue from "../components/Admin/KitchenQueue";
import CustomerTokenDisplay from "../components/Admin/CustomerTokenDisplay";
import CashierSettingPage from "../components/Admin/CashierSettingPage";
import MenuItemManagement from "../components/Admin/MenuItemManagement";
import PosKoh from "../components/Admin/PosKoh";
import OrderPos from "../components/Admin/OrderPos";
import OrderPosDetails from "../components/Admin/OrderPosDetails";
import OrderManagementReal from "../components/Admin/OrderManagementReal";
import AdminBusinessAssistant from "../components/Admin/AdminBusinessAssistant";
import UserManagement from "../components/Admin/UserManagement";
import CustomerManagement from "../components/Admin/CustomerManagement";
import PermissionManagement from "../components/Admin/PermissionManagement";
import ManagementLogin from "../components/Authentication/ManagementLogin";
import PosLogin from "../components/Authentication/PosLogin";
import SupplierLogin from "../components/Authentication/SupplierLogin";
import PosAccessGate from "../components/Authentication/PosAccessGate";
import SupplierAccessGate from "../components/Authentication/SupplierAccessGate";
import ManagementAccessGate from "../components/Authentication/ManagementAccessGate";
import InquiryPage from "../components/Admin/InquiryPage";
import Home from "../pages/Home";
import AboutPage from "../pages/AboutPage";
import App from "../App";
import ReviewHome from "../pages/ReviewHome";
import ReviewAdminManagement from "../components/Admin/ReviewAdminManagement";
import AdminReservationManagement from "../components/Admin/AdminReservationManagement";
import AvrileBrunchMenu from "../pages/AvrileBrunchMenu";
import GalleryPage from "../pages/GalleryPage";
import GalleryAdminManagement from "../components/Admin/GalleryAdminManagement";
import UserAccessGate from "../components/Authentication/UserAccessGate";
import UserDashboard from "../pages/UserDashboard.tsx";
import FullMenu from "../pages/FullMenu";
import CartCheckOut from "../pages/CartCheckOut";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: AboutPage },
    { path: "reviews", Component: ReviewHome },
    { path: "menu-preview", Component: AvrileBrunchMenu },
    { path: "full-menu", Component: FullMenu },
        {
            path: "cart-checkout",
            Component: UserAccessGate,
            children: [{ index: true, Component: CartCheckOut }],
        },
    { path: "gallery", Component: GalleryPage },
            {
                path: "dashboard",
                Component: UserAccessGate,
                children: [{ index: true, Component: UserDashboard }],
            },
    ],
  },
    {
        path: '/about',
        Component: CulinaryEditorialAbout
    },
    {
        path: '/product-page',
        Component: ProductPage
    },
    {
        path: '/POS', 
        Component: PosAccessGate,
        children:[
            { Component: PosHome, children: [
                { index: true, Component: PosDashboard},
                {path: 'menu', Component: CulinaryPOS},
                {path: 'floor-plan', Component: FloorPlan},
                {path: 'staff-view', Component: StaffDirectory},
                {path: 'order', Component: PosOrderManagement},
                {path: 'floor-live', Component: FloorDistribution}
            ] }
        ]
    },
{
  path: "admin",
  Component: ManagementAccessGate,
  children: [
    {
      Component: AdminHome,
      children: [
        { index: true, Component: AdminDashboardDefault },

        {
          path: "menu",
          children: [
            { index: true, Component: AddMenuItem },
            { path: "category-manage", Component: CategoryManagement },
            {path: "inventory-manage", Component: InventoryManagement}
          ]
        },

        {
            path: "employee",
            Component: EmployeeManagement
        },
        {
            path: "users",
            Component: UserManagement
        },
        {
            path: "customers",
            Component: CustomerManagement
        },
        {
            path: "permissions",
            Component: PermissionManagement
        },

        {
            path: 'staff-schedule',
            Component: StaffSchedule
        },

        {
            path: 'staff-view-schedule',
            Component: EmployeeViewSchedule
        },
        {
            path: 'orders',
            Component: OrderManagementReal
        },
        {
            path: 'business-assistant',
            Component: AdminBusinessAssistant
        },
        {
            path: 'reports',
            Component: Reports
        },
        {
            path: 'demand-forecast',
            Component: DemandForecast
        },
        {
            path: 'invoice-history',
            Component: InvoiceHistory
        },
        {
            path: 'wage-report',
            Component: WageReport
        },
        {
            path: 'attendence',
            Component: DailyAttendance
        },
        {
            path: 'floor-distribution',
            Component: FloorAdmin
        },
        {
            path: 'menu-item-manage',
            Component: MenuItemManagement
        },
        {
            path: 'inquiry', 
            Component: InquiryPage
        },
        {
            path: 'reviews',
            Component: ReviewAdminManagement
        },
        {
            path: 'reservations',
            Component: AdminReservationManagement
        },
        {
            path: 'gallery',
            Component: GalleryAdminManagement
        },
        {
            path: 'settings',
            Component: CashierSettingPage
        }
      ]
    }
  ]
},
{
    path: '/pos-koh',
    Component: PosAccessGate,
    children: [
        { Component: PosKoh, children: [
            { index: true, Component: Pos },
            { path: 'orders', Component: OrderPos },
            { path: 'orders/:orderId', Component: OrderPosDetails },
            { path: 'kitchen-queue', Component: KitchenQueue },
            { path: 'customer-display', Component: CustomerTokenDisplay }
        ] }
    ]
},
{
    path: '/pos-koh/cashier-setting',
    element: <Navigate to="/admin/settings" replace />
},
    {
        path: 'ed',
        Component: CulinaryEditorial
    },
    {
        path:'/login',
        Component: Login
    },
    {
        path: 'pos-login',
        Component: PosLogin
    },
    {
        path: 'supplier-login',
        Component: SupplierLogin
    },
    {
        path: 'management-login',
        Component: ManagementLogin
    },
    {
        path: 'add-staff',
        Component: AddEmployeeModal
    },
    {
        path: 'registration', 
        Component: CreateAccount
    },
    // {
    //     path: 'menu/category-manage',
    //     Component: CategoryManagement
    // },
    {
        path: 'sent-email-verfication',
        Component: EmailVerificationSent
    },
    {
        path: 'resent-verification', 
        Component: ResendVerification
    },
    {
        path: '/supplier',
        Component: SupplierAccessGate,
        children: [
            { Component: SupplierLayout, children: [
                { index: true, Component: SupplierDirectory },
                { path: 'procurement', Component: ProcurementPOTracking },
                { path: 'usage', Component: InventorySuppliers },
                { path: 'catalog', Component: SupplierCatalogManagement },
                { path: 'performance', Component: SupplierPerformanceAnalysis },
                { path: 'contacts', Component: SupplierContactDirectory },
                { path: ':supplierId', Component: SupplierProfile },
            ] },
        ],
    },
    {
        path: '/email-verification-success',
        Component: EmailVerificationSuccess
    },
    {
        path: '/add-menu-item',
        Component: AddMenuItemPage
    },
    {
        path: '/employee-management',
        Component: EmployeeManagementPage
    },
    {
        path: '/order-management',
        Component: OrderManagementPage
    },
    {
        path: '/pos-dashboard',
        Component: PosDashboard
    },
    {
        path: '/kq',
        Component: KitchenQueue
    },
    {
        path: '/cashier-setting',
        element: <Navigate to="/admin/settings" replace />
    }
])