import { Outlet, useLocation, Link, useNavigate } from "react-router";
import AdminSidebar from "./AdminSidebar";
import { LogOut } from "lucide-react";
import { use, useEffect, useState } from "react";
import { AuthContext } from "../Authentication/AuthContext";
import type { AuthContextType } from "../Authentication/auth";

const HEADER_CONFIG: Record<
  string,
  {
    active: "catalog" | "categories" | "inventory" | "menu-items";
  }
> = {
  menu: {
    active: "catalog",
  },

  "menu/category-manage": {
    active: "categories",
  },

  "menu/inventory-manage": {
    active: "inventory",
  },

  "menu-item-manage": {
    active: "menu-items",
  },
};

export default function AdminHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser, user } = use(AuthContext) as AuthContextType;

  const [headerLeft, setHeaderLeft] =
    useState<React.ReactNode>(null);

  const displayName = user?.displayName?.trim() || user?.email?.split("@")[0] || "Admin User";
  const avatarUrl = user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuCLObpXipzaA4qABg6S_Q-RL6llLB7cdmPnQfyg3Y7J6lflDMU5PFHIeMyVvgxLDjY6AstseIqF-CPTccQ2Ba4VGzgOqFaPh7qke7NDrwuV_13IOUObyInwN6FRGjNrzSbv8WYlkSaO0i3O5Kpz8a86LR71RzG1Upw7iUwmZNnoLrZ4fCCp1hECA5U5lBY2uEgivyKzL1WC9XN8zULTrI_g-XXQOvRTlpgCc_DBWit3EPaEgtsHwb_UEpXJBxrFSeZ72n52sM8HjGY";

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // remove "/admin/" from pathname
  const path = location.pathname
    .replace(/^\/admin\/?/, "")
    .replace(/\/$/, "");

  useEffect(() => {
    const config = HEADER_CONFIG[path];

    // if route has no config
    if (!config) {
      setHeaderLeft(null);
      return;
    }

    setHeaderLeft(
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex gap-6 items-center">

          {/* Catalog */}
          <Link
            to="/admin/menu"
            className={`text-sm uppercase tracking-widest transition-all pb-1
              ${
                config.active === "catalog"
                  ? "text-primary border-b-2 border-primary"
                  : "text-secondary hover:opacity-80"
              }
            `}
          >
            Catalog
          </Link>

          {/* Categories */}
          <Link
            to="/admin/menu/category-manage"
            className={`text-sm uppercase tracking-widest transition-all pb-1
              ${
                config.active === "categories"
                  ? "text-primary border-b-2 border-primary"
                  : "text-secondary hover:opacity-80"
              }
            `}
          >
            Categories
          </Link>

          {/* Inventory */}
          <Link
            to="/admin/menu/inventory-manage"
            className={`text-sm uppercase tracking-widest transition-all pb-1
              ${
                config.active === "inventory"
                  ? "text-primary border-b-2 border-primary"
                  : "text-secondary hover:opacity-80"
              }
            `}
          >
            Inventory
          </Link>

          {/* Menu Item Management */}
          <Link
            to="/admin/menu-item-manage"
            className={`text-sm uppercase tracking-widest transition-all pb-1
              ${
                config.active === "menu-items"
                  ? "text-primary border-b-2 border-primary"
                  : "text-secondary hover:opacity-80"
              }
            `}
          >
            Menu Item Management
          </Link>
        </nav>
      </div>
    );
  }, [path]);

  return (
    <div className="flex h-dvh bg-white text-slate-900 font-body">
      <AdminSidebar />

      <main className="h-full min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white">
        <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-red-100 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {headerLeft}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 rounded-full border border-red-100 bg-red-50 px-2.5 py-1.5 shadow-sm sm:px-3">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm sm:h-10 sm:w-10">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="hidden min-[420px]:flex flex-col leading-tight sm:flex">
                <span className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                  Logged in
                </span>
                <span className="text-sm font-semibold text-red-700">{displayName}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-white text-slate-600 transition-colors hover:border-red-200 hover:text-red-700"
            >
              <LogOut size={18} className="cursor-pointer" />
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}