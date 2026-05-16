import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ReceiptText,
  Users,
  BarChart3,
  FileClock,
  Settings,
  HelpCircle,
  AlarmClockCheck,
} from "lucide-react";

const NAV_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    to: "/admin",
  },
  {
    icon: UtensilsCrossed,
    label: "Menu Management",
    to: "/admin/menu",
  },
  {
    icon: ReceiptText,
    label: "Order Management",
    to: "/admin/orders",
  },
  {
    icon: Users,
    label: "Employee Management",
    to: "/admin/employee",
  },
  {
    icon: AlarmClockCheck,
    label: "Staff Schedule",
    to: "/admin/staff-schedule",
  },
  {
    icon: AlarmClockCheck,
    label: "Staff View Schedule",
    to: "/admin/staff-view-schedule",
  },
  {
    icon: BarChart3,
    label: "Reports",
    to: "/admin/reports",
  },
  {
    icon: FileClock,
    label: "Invoice History",
    to: "/admin/invoices",
  },
];

const FOOTER_ITEMS = [
  {
    icon: Settings,
    label: "Settings",
    to: "/admin/settings",
  },
  {
    icon: HelpCircle,
    label: "Support",
    to: "/admin/support",
  },
];

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
};

function SidebarItem({ icon: Icon, label, to }: SidebarItemProps) {
  const location = useLocation();

  const isActive =
    location.pathname === to ||
    location.pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 group
        ${
          isActive
            ? "bg-surface-container-low text-primary font-bold rounded-r-full"
            : "text-secondary hover:bg-surface-container-low rounded-xl"
        }
      `}
    >
      <Icon
        className={`w-5 h-5 transition-colors
          ${isActive ? "text-primary" : "group-hover:text-primary"}
        `}
      />

      <span className="font-body text-sm">{label}</span>
    </Link>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="hidden md:flex flex-col h-screen w-72 border-r border-outline-variant/20 bg-surface py-8 px-4 sticky top-0">

      {/* Branding */}
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-headline font-bold text-primary tracking-tight">
          The Culinary Editorial
        </h1>

        <p className="text-xs uppercase tracking-widest text-secondary mt-1">
          Admin Console
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </nav>

      {/* Footer Navigation */}
      <div className="mt-auto pt-6 space-y-1">
        {FOOTER_ITEMS.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </div>
    </aside>
  );
}