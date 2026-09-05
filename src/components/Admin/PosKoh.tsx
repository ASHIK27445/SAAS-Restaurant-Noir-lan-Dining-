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
    <div
      className="flex h-screen overflow-hidden bg-sky-50 text-slate-900 font-body"
      style={{
        ['--color-primary' as string]: '#2563eb',
        ['--color-on-primary' as string]: '#ffffff',
        ['--color-primary-container' as string]: '#dbeafe',
        ['--color-on-primary-container' as string]: '#1d4ed8',
        ['--color-secondary' as string]: '#475569',
        ['--color-on-secondary' as string]: '#ffffff',
        ['--color-secondary-container' as string]: '#e2e8f0',
        ['--color-on-secondary-container' as string]: '#1e293b',
        ['--color-surface' as string]: '#f8fbff',
        ['--color-on-surface' as string]: '#0f172a',
        ['--color-surface-variant' as string]: '#e2e8f0',
        ['--color-on-surface-variant' as string]: '#334155',
        ['--color-surface-container-lowest' as string]: '#ffffff',
        ['--color-surface-container-low' as string]: '#eff6ff',
        ['--color-surface-container' as string]: '#eaf2ff',
        ['--color-surface-container-high' as string]: '#dfeafd',
      }}
    >
      <aside className="flex w-16 shrink-0 flex-col items-center border-r border-blue-200 bg-white py-5 shadow-sm">
        <div className="mb-8 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white" title="POS KOH">
          POS
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
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
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
          className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-blue-50 hover:text-red-600"
        >
          <LogOut size={19} />
        </button>

        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 [writing-mode:vertical-rl]">
          POS KOH
        </div>
      </aside>

      <main className="custom-scrollbar min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)]">
        <Outlet />
      </main>
    </div>
  );
}
