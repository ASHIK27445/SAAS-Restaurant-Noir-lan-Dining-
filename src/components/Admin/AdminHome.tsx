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
    <div className="flex min-h-screen bg-surface text-on-surface font-body">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-w-0 bg-surface">

        {/* Header */}
        <header className="flex justify-between items-center w-full px-8 h-20 sticky top-0 z-40 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/10">

          {/* Dynamic Left */}
          <div className="flex items-center gap-4">
            {headerLeft}
          </div>

          {/* Fixed Right */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-full border border-outline-variant/20 bg-surface-container-low px-3 py-1.5">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-surface-container-high ring-1 ring-outline-variant/20 shrink-0">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-secondary">Logged in</span>
                  <span className="text-sm font-semibold text-primary">{displayName}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                className="text-secondary hover:opacity-80 transition-opacity"
              >
                <LogOut size={18} className="cursor-pointer"/>
              </button>
            </div>
        </header>

        {/* Page Content */}
        <Outlet />
      </main>
    </div>
  );
}