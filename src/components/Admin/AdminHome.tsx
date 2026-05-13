import { Outlet } from "react-router";
import AdminSidebar from "./AdminSidebar";

export default function AdminHome(){
    return(
        <div className="flex min-h-screen bg-surface text-on-surface font-body">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto min-w-0 bg-surface">
                <Outlet />
            </main>
        </div>
    )
}