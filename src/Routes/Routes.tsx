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
import FloorPlanLive from "../components/POS/FloorDistribution";
import PosDashboard from "../components/POS/PosDashboard";
import PosHome from "../components/POS/PosHome";
import StaffDirectory from "../components/POS/StaffDirectory";
import PosOrderManagement from "../components/POS/PosOrderManagement";

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
            {path: 'order', Component: PosOrderManagement}
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
        path: 'test',
        Component: Test
    },
    {
        path: '/t',
        Component: Pos
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
        path: '/floor', 
        Component: FloorPlanLive
    },
    {
        path: '/pos-dashboard',
        Component: PosDashboard
    }
])