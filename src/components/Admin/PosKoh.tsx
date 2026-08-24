import { ChefHat, Settings, ShoppingCart } from "lucide-react";
import { NavLink, Outlet } from "react-router";

const NAV_ITEMS = [
  { label: "POS", to: "/pos-koh", icon: ShoppingCart, end: true },
  { label: "Kitchen Queue", to: "/pos-koh/kitchen-queue", icon: ChefHat, end: false },
  { label: "Cashier Setting", to: "/pos-koh/cashier-setting", icon: Settings, end: false },
];

export default function PosKoh() {
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

        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant [writing-mode:vertical-rl]">
          POS KOH
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
