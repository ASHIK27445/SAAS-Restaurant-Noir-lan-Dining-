import {
  BarChart3,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react";
import { NavLink } from "react-router";

const links = [
  { to: "/supplier", label: "Directory", icon: LayoutDashboard, end: true },
  { to: "/supplier/procurement", label: "Procurement", icon: ClipboardList },
  { to: "/supplier/catalog", label: "Catalog", icon: Package },
  { to: "/supplier/performance", label: "Performance", icon: BarChart3 },
  { to: "/supplier/contacts", label: "Contacts", icon: Users },
];

export default function SupplierAside() {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-outline-variant/20 bg-surface-container-lowest md:sticky md:top-0 md:h-screen md:w-72 md:border-b-0 md:border-r">
      <div className="px-6 py-6 md:px-7 md:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">The Culinary Editorial</p>
        <h1 className="mt-2 font-headline text-2xl tracking-tight text-on-surface">Supplier workspace</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Procurement network</p>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 md:flex-col md:overflow-visible md:px-4 md:pb-0" aria-label="Supplier navigation">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto hidden border-t border-outline-variant/15 px-6 py-6 md:block">
        <div className="flex items-center gap-3 text-sm text-on-surface-variant">
          <FileText size={17} />
          <span>Supplier operations</span>
        </div>
      </div>
    </aside>
  );
}
