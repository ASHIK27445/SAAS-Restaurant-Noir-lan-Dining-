import { Outlet } from "react-router";
import SupplierAside from "./SupplierAside";

export default function SupplierLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface md:flex-row">
      <SupplierAside />
      <main className="min-w-0 flex-1 overflow-y-auto bg-surface-container-low">
        <Outlet />
      </main>
    </div>
  );
}
