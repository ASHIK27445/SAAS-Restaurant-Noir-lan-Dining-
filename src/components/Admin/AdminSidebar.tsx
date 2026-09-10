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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

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
  onClick?: () => void;
};

function SidebarItem({ icon: Icon, label, to, onClick }: SidebarItemProps) {
  const location = useLocation();

  const isActive =
    location.pathname === to ||
    location.pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      onClick={onClick}
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

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <>
      <div className="mb-6 shrink-0 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
        <h1 className="mt-2 font-headline text-2xl font-bold tracking-tight text-red-700">
          The WorkSpace
        </h1>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-red-600">
          Admin Console
        </p>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.label} {...item} onClick={onItemClick} />
        ))}
      </nav>

      <div className="mt-auto pt-3 shrink-0">
        <div className="grid grid-cols-2 gap-2">
          {FOOTER_ITEMS.map((item) => (
            <SidebarItem key={item.label} {...item} onClick={onItemClick} />
          ))}
        </div>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-screen w-72 shrink-0 flex-col border-r border-red-100 bg-white px-4 py-4 shadow-sm sticky top-0 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile floating trigger — toggles Menu/X */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="fixed top-4 left-4 z-60 flex h-11 w-11 items-center justify-center rounded-full border border-red-100 bg-white text-red-700 shadow-md md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white px-4 py-4 shadow-xl overflow-hidden animate-in slide-in-from-left duration-200">
            <SidebarContent onItemClick={() => setIsOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}