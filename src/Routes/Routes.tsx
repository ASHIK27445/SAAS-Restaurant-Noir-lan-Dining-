import { createBrowserRouter } from "react-router";
import Home from "../components/Home/Home";
import CulinaryEditorial from "../components/Home/CulinaryEditional";
import CulinaryEditorialAbout from "../components/Home/CulinaryEditionalAbout";
import Login from "../components/Authentication/Login";
import ProductPage from "../components/Products/ProductPage";
import HomePageM from "../components/Home/HomepageM";
import Test from "../components/Home/Test";
import Pos from "../components/Home/Pos"
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
import ResetPassword from "../components/Authentication/ResetPassword";
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
import OrderManagement from "../components/Admin/OrderManagement";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Home ,
        children: [
            {
                index: true, 
                Component: HomePageM
            },
            {
                path:'about',
                Component: CulinaryEditorialAbout
            },
            {
                path: '/product-page',
                Component: ProductPage
            }
        ]
    },
    {
        path: '/POS', 
        Component: PosHome,
        children:[
            { index: true, Component: PosDashboard},
            {path: 'menu', Component: CulinaryPOS},
            {path: 'floor-plan', Component: FloorPlan},
            {path: 'staff-view', Component: StaffDirectory},
            {path: 'order', Component: PosOrderManagement},
            {path: 'floor-live', Component: FloorDistribution}
        ]
    },
{
  path: "admin",
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
        path: 'staff-schedule',
        Component: StaffSchedule
    },

    {
        path: 'staff-view-schedule',
        Component: EmployeeViewSchedule
    },
    {
        path: 'orders',
        Component: OrderManagement
    }
  ]
},
    {
        path: 'ed',
        Component: CulinaryEditorial
    },
    {
        path:'login',
        Component: Login
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
        path: 'test',
        Component: AddMenuItem
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
    }
])