import { Outlet } from "react-router";
import SupplierAside from "./SupplierAside";

export default function SupplierLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 md:flex-row">
      <SupplierAside />
      <main className="min-w-0 flex-1 overflow-x-hidden bg-white">
        <Outlet />
      </main>
    </div>
  );
}
