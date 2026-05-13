import { Outlet, useLocation, Link } from "react-router";
import AdminSidebar from "./AdminSidebar";
import { Bell, LogOut, Search } from "lucide-react";
import { useEffect, useState } from "react";

const HEADER_CONFIG: Record<
  string,
  {
    active: "catalog" | "categories" | "inventory";
  }
> = {
  menu: {
    active: "catalog",
  },

  "menu/category-manage": {
    active: "categories",
  },
};

export default function AdminHome() {
  const location = useLocation();

  const [headerLeft, setHeaderLeft] =
    useState<React.ReactNode>(null);

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
            to="/admin/menu/inventory"
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
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-64 focus-within:ring-1 ring-primary/20">
                <Search size={15}/>
                <input
                  className="bg-transparent border-none text-sm focus:ring-0 w-full placeholder:text-secondary/50"
                  placeholder="Search menu items..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="text-secondary hover:opacity-80">
                  <Bell size={18} />
                </button>
                <div className="h-10 w-10 rounded-full overflow-hidden bg-surface-container-high ring-1 ring-outline-variant/20">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLObpXipzaA4qABg6S_Q-RL6llLB7cdmPnQfyg3Y7J6lflDMU5PFHIeMyVvgxLDjY6AstseIqF-CPTccQ2Ba4VGzgOqFaPh7qke7NDrwuV_13IOUObyInwN6FRGjNrzSbv8WYlkSaO0i3O5Kpz8a86LR71RzG1Upw7iUwmZNnoLrZ4fCCp1hECA5U5lBY2uEgivyKzL1WC9XN8zULTrI_g-XXQOvRTlpgCc_DBWit3EPaEgtsHwb_UEpXJBxrFSeZ72n52sM8HjGY"
                    alt="Chef portrait"
                    className="h-full w-full object-cover"
                  />
                </div>
                <LogOut size={18} className="cursor-pointer"/>
              </div>
            </div>
        </header>

        {/* Page Content */}
        <Outlet />
      </main>
    </div>
  );
}