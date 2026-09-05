import {
  BarChart3,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  PaperBag,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { use } from "react";
import { AuthContext } from "../Authentication/AuthContext";
import type { AuthContextType } from "../Authentication/auth";

const links = [
  { to: "/supplier", label: "Directory", icon: LayoutDashboard, end: true },
  { to: "/supplier/usage", label: "Ingredients", icon: PaperBag },
  { to: "/supplier/procurement", label: "Procurement", icon: ClipboardList },
  { to: "/supplier/catalog", label: "Catalog", icon: Package },
  { to: "/supplier/performance", label: "Performance", icon: BarChart3 },
  { to: "/supplier/contacts", label: "Contacts", icon: Users },
];

export default function SupplierAside() {
  const navigate = useNavigate();
  const { logoutUser } = use(AuthContext) as AuthContextType;

  const handleLogout = async () => {
    try {
      await logoutUser();
      sessionStorage.removeItem("supplier-access-granted");
      navigate("/supplier-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-red-100 bg-white shadow-sm md:sticky md:top-0 md:h-screen md:w-72 md:border-b-0 md:border-r md:shadow-none">
      <div className="px-5 py-5 md:px-6 md:py-7">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-500">
            The Culinary Editorial
          </p>
          <h1 className="mt-2 font-headline text-2xl tracking-tight text-red-700">Supplier workspace</h1>
          <p className="mt-1 text-sm text-red-600">Procurement network</p>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 px-3 pb-4 md:flex-col md:overflow-visible md:px-4 md:pb-0" aria-label="Supplier navigation">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive ? "bg-red-600 text-white shadow-sm" : "text-slate-700 hover:bg-red-50 hover:text-red-700"}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-red-100 px-4 py-4 md:px-6 md:py-6">
        <div className="flex items-center gap-3 rounded-xl bg-red-50 px-3 py-3 text-sm font-medium text-red-700">
          <FileText size={17} />
          <span>Supplier operations</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex w-full items-center gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
