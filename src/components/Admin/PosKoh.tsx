import { ChefHat, ClipboardList, LogOut, ShoppingCart } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { use } from "react";
import { AuthContext } from "../Authentication/AuthContext";
import type { AuthContextType } from "../Authentication/auth";

const NAV_ITEMS = [
  { label: "POS", to: "/pos-koh", icon: ShoppingCart, end: true },
  { label: "Orders", to: "/pos-koh/orders", icon: ClipboardList, end: false },
  { label: "Kitchen Queue", to: "/pos-koh/kitchen-queue", icon: ChefHat, end: false },
];

export default function PosKoh() {
  const navigate = useNavigate();
  const { logoutUser } = use(AuthContext) as AuthContextType;

  const handleLogout = async () => {
    try {
      await logoutUser();
      sessionStorage.removeItem("pos-access-granted");
      navigate("/pos-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface font-body">
      <aside className="flex w-16 shrink-0 flex-col items-center border-r border-outline-variant/20 bg-surface-container-low py-5">
        <div className="mb-8 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary" title="POS KOH">
          <ShoppingCart size={18} />
        </div>

        <nav aria-label="POS KOH navigation" className="flex flex-1 flex-col items-center gap-3">
          {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              aria-label={label}
              className={({ isActive }) => `flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <Icon size={19} />
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
        >
          <LogOut size={19} />
        </button>

        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant [writing-mode:vertical-rl]">
          POS KOH
        </div>
      </aside>

      <main className="custom-scrollbar min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
