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
  LineChart,
  ListCheck,
  LayoutGrid,
  UserCog,
  UserRound,
  ShieldCheck,
  MailBadge,
  MessageSquareQuote,
  CalendarCheck,
  Images,
  TrendingUpDown,
  Bot,
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
    icon: Bot,
    label: "Business Assistant",
    to: "/admin/business-assistant",
  },
  {
    icon: Users,
    label: "Employee Management",
    to: "/admin/employee",
  },
  {
    icon: UserCog,
    label: "User Management",
    to: "/admin/users",
  },
  {
    icon: UserRound,
    label: "Customer Management",
    to: "/admin/customers",
  },
  {
    icon: ShieldCheck,
    label: "Permissions",
    to: "/admin/permissions",
  },
  {
    icon: ListCheck,
    label: "Daily Attendence",
    to: "/admin/attendence",
  },
  {
    icon: LayoutGrid,
    label: "Floor Distribution",
    to: "/admin/floor-distribution",
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
    icon: MailBadge,
    label: "Inquiry",
    to: "/admin/inquiry",
  },
  {
    icon: MessageSquareQuote,
    label: "Review Management",
    to: "/admin/reviews",
  },
  {
    icon: CalendarCheck,
    label: "Reservation Management",
    to: "/admin/reservations",
  },
  {
    icon: Images,
    label: "Gallery Management",
    to: "/admin/gallery",
  },
  {
    icon: LineChart,
    label: "Wage Report",
    to: "/admin/wage-report",
  },
  {
    icon: BarChart3,
    label: "Reports",
    to: "/admin/reports",
  },
  {
    icon: TrendingUpDown,
    label: "Demand Forecast",
    to: "/admin/demand-forecast",
  },
  {
    icon: FileClock,
    label: "Invoice History",
    to: "/admin/invoice-history",
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
    <>
      <aside className="hidden md:flex h-screen w-72 shrink-0 flex-col border-r border-red-100 bg-white px-4 py-4 shadow-sm sticky top-0 overflow-hidden">
        <div className="mb-6 shrink-0 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-500">
            Workspace
          </p>
          <h1 className="mt-2 font-headline text-2xl font-bold tracking-tight text-red-700">
            The WorkSpace
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-red-600">
            Admin Console
          </p>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
          {NAV_ITEMS.map((item) => (
            <SidebarItem key={item.label} {...item} />
          ))}
        </nav>

        <div className="mt-auto pt-3 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            {FOOTER_ITEMS.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </div>
      </aside>

      <div className="border-b border-red-100 bg-white px-3 py-3 shadow-sm md:hidden">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-600">
              Admin
            </p>
            <h2 className="font-headline text-xl font-bold text-slate-800">Workspace</h2>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const location = window.location.pathname;
            const isActive = location === item.to || location.startsWith(item.to + "/");

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold transition-all ${
                  isActive
                    ? "border-red-600 bg-red-600 text-white shadow-sm"
                    : "border-red-100 bg-red-50 text-slate-700 hover:border-red-200 hover:bg-red-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}