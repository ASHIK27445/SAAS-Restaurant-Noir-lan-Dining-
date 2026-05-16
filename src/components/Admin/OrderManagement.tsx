import { useState } from "react";
import {
  Search,
  Bell,
  TrendingUp,
  Filter,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";


const TABS = ["All Orders", "Active (27)", "Completed", "Cancelled"];

type OrderStatus = "preparing" | "delivery" | "completed" | "cancelled";

type Order = {
  id: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  name: string;
  tier: string;
  time: string;
  type: string;
  status: OrderStatus;
  total: string;
};

const STATUS_MAP: Record<OrderStatus, { label: string; pill: string; text: string; dot?: boolean }> = {
  preparing:  { label: "Preparing",        pill: "bg-tertiary/10",             text: "text-tertiary",              dot: true },
  delivery:   { label: "Out for Delivery",  pill: "bg-primary/10",              text: "text-primary" },
  completed:  { label: "Completed",         pill: "bg-on-primary-container/20", text: "text-on-primary-fixed-variant" },
  cancelled:  { label: "Cancelled",         pill: "bg-error/10",                text: "text-error" },
};

const ORDERS: Order[] = [
  {
    id: "#CE-9402", initials: "ES",
    avatarBg: "bg-secondary-container", avatarText: "text-on-secondary-container",
    name: "Eleanor Shellstrop", tier: "Premium Member",
    time: "Today, 12:45 PM", type: "ASAP Delivery",
    status: "preparing", total: "$124.50",
  },
  {
    id: "#CE-9398", initials: "TP",
    avatarBg: "bg-primary-container", avatarText: "text-on-primary-container",
    name: "Tahani Al-Jamil", tier: "VIP Priority",
    time: "Today, 12:12 PM", type: "Scheduled (1:30 PM)",
    status: "delivery", total: "$342.15",
  },
  {
    id: "#CE-9395", initials: "CM",
    avatarBg: "bg-outline-variant/20", avatarText: "text-secondary",
    name: "Chidi Anagonye", tier: "Guest",
    time: "Today, 11:55 AM", type: "ASAP Pickup",
    status: "completed", total: "$45.00",
  },
  {
    id: "#CE-9390", initials: "JM",
    avatarBg: "bg-secondary-container", avatarText: "text-on-secondary-container",
    name: "Jason Mendoza", tier: "Premium Member",
    time: "Today, 11:30 AM", type: "ASAP Delivery",
    status: "cancelled", total: "$18.25",
  },
];

const STATS = [
  {
    label: "Total Orders Today",
    value: "142",
    extra: (
      <span className="text-xs text-primary font-bold flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-full">
        <TrendingUp size={12} /> +12%
      </span>
    ),
  },
  { label: "Pending Kitchen",    value: "18",    extra: <span className="text-xs text-secondary font-medium">Avg. 22 min</span> },
  {
    label: "Out for Delivery",   value: "09",
    extra: (
      <div className="flex -space-x-2">
        {["JD", "AL"].map((i) => (
          <div key={i} className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
            {i}
          </div>
        ))}
      </div>
    ),
  },
  { label: "Revenue (Daily)",    value: "$4,821", valueClass: "text-tertiary", extra: <span className="text-xs text-secondary">Tier: Gold</span> },
];

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [activePage, setActivePage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = ORDERS.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">


      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 bg-surface overflow-hidden">

        {/* Top Bar */}
        {/* <header className="flex justify-between items-center w-full px-8 sticky top-0 z-40 bg-surface/70 backdrop-blur-xl h-20 border-b border-outline-variant/10">
          <h2 className="font-headline text-2xl text-primary font-bold tracking-tight">
            Order Management
          </h2>

          <div className="flex items-center gap-8">
            <div className="relative hidden lg:block">
              <input
                className="bg-surface-container-low border-none rounded-full py-2 px-10 text-xs tracking-widest focus:ring-1 focus:ring-primary/20 w-64 placeholder:text-secondary/50 outline-none"
                placeholder="SEARCH ORDERS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/60" />
            </div>

            <div className="flex items-center gap-6">
              <button className="text-primary hover:opacity-80 transition-opacity relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-tertiary rounded-full" />
              </button>

              <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
                <div className="text-right">
                  <p className="text-[10px] font-label uppercase tracking-widest text-secondary">
                    Administrator
                  </p>
                  <p className="text-xs font-bold text-primary">Julian V.</p>
                </div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjstZps80Z4sRqai19sFM0_fPuHjHQSSdnx1WOfeZk_ZohOTqIaajSXxZnjQkd6Y8vDyGLhAyp9L0ctv86uDoQ1ynvb0cKhRhvUG06wf3OmbxRal6N1jb1qYC62nwh0uQRHRHW-n0RyJ32TGdZfgP6skYTDDIUqcRjAue2UaUI7yiQtmOx01oD0SnE27X5XlRbifkg5chUTIKTLugl2r4W7SeXyyZ3heGyR5pfs-tFEqUZ1j_vAcIiWrmh7EjKafETvk03IPOhBds"
                  alt="Admin avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </header> */}

        <section className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {STATS.map(({ label, value, valueClass, extra }) => (
              <div
                key={label}
                className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10"
              >
                <p className="text-[10px] font-label uppercase tracking-widest text-secondary mb-2">
                  {label}
                </p>
                <div className="flex items-end justify-between">
                  <h3 className={`text-3xl font-headline font-bold ${valueClass ?? "text-primary"}`}>
                    {value}
                  </h3>
                  {extra}
                </div>
              </div>
            ))}
          </div>

          {/* ── Orders table card ── */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden">

            {/* Tabs + actions */}
            <div className="px-8 pt-6 pb-4 flex flex-col sm:flex-row justify-between items-end gap-4">
              <div className="flex gap-8 border-b border-outline-variant/20 w-full sm:w-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm tracking-wide transition-colors ${
                      activeTab === tab
                        ? "font-bold text-primary border-b-2 border-primary"
                        : "font-medium text-secondary hover:text-primary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low text-primary rounded-lg text-sm font-medium hover:bg-surface-container-high transition-colors">
                  <Filter size={16} /> Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-surface-container-low/50">
                  <tr>
                    {["Order ID", "Customer", "Date & Time", "Status", "Total", "Actions"].map(
                      (col, i) => (
                        <th
                          key={col}
                          className={`px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-label text-secondary font-bold ${
                            i === 0 ? "px-8" : ""
                          } ${i >= 4 ? "text-right" : ""}`}
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filtered.map((order) => {
                    const s = STATUS_MAP[order.status];
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-surface-container-low/30 transition-colors group"
                      >
                        {/* ID */}
                        <td className="px-8 py-5 text-sm font-bold text-primary">{order.id}</td>

                        {/* Customer */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full ${order.avatarBg} ${order.avatarText} flex items-center justify-center text-xs font-bold`}
                            >
                              {order.initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-primary">{order.name}</p>
                              <p className="text-[10px] text-secondary">{order.tier}</p>
                            </div>
                          </div>
                        </td>

                        {/* Time */}
                        <td className="px-6 py-5">
                          <p className="text-sm text-primary">{order.time}</p>
                          <p className="text-[10px] text-secondary">{order.type}</p>
                        </td>

                        {/* Status badge */}
                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1 ${s.pill} ${s.text} text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 w-fit`}
                          >
                            {s.dot && (
                              <span className={`w-1.5 h-1.5 rounded-full ${s.text.replace("text-", "bg-")} animate-pulse`} />
                            )}
                            {s.label}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-5 text-right font-headline font-bold text-primary">
                          {order.total}
                        </td>

                        {/* Actions (show on hover) */}
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-2 text-secondary hover:text-primary hover:bg-surface-container-high rounded-full transition-colors"
                              title="Print Receipt"
                            >
                              <Printer size={16} />
                            </button>
                            <button className="px-3 py-1.5 bg-primary text-on-primary text-xs font-medium rounded-lg hover:opacity-90">
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-4 bg-surface-container-low/30 flex items-center justify-between border-t border-outline-variant/10">
              <p className="text-xs text-secondary">
                Showing <span className="font-bold text-primary">1 – 4</span> of 142 orders
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="p-1 rounded-lg border border-outline-variant/20 text-secondary hover:bg-surface-container-low disabled:opacity-30"
                >
                  <ChevronLeft size={18} />
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivePage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      activePage === p
                        ? "bg-primary text-on-primary"
                        : "hover:bg-surface-container-low text-secondary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <span className="text-secondary px-2">...</span>
                <button
                  onClick={() => setActivePage(36)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    activePage === 36
                      ? "bg-primary text-on-primary"
                      : "hover:bg-surface-container-low text-secondary"
                  }`}
                >
                  36
                </button>
                <button className="p-1 rounded-lg border border-outline-variant/20 text-secondary hover:bg-surface-container-low">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Insight cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Kitchen load advisory */}
            <div className="md:col-span-2 bg-primary text-on-primary p-8 rounded-xl relative overflow-hidden group">
              <div className="relative z-10 max-w-md">
                <h4 className="font-headline text-2xl font-bold mb-4">Kitchen Load Advisory</h4>
                <p className="text-sm text-on-primary-container leading-relaxed mb-6 opacity-90">
                  High volume detected for "Main Grill". Estimated preparation times are currently
                  12 minutes above seasonal average. Suggest highlighting cold appetizers on
                  user-facing featured menu.
                </p>
                <button className="px-6 py-3 bg-on-primary text-primary rounded-xl font-bold text-sm hover:bg-surface-container-lowest transition-colors">
                  Adjust Menu Visibility
                </button>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 grayscale group-hover:grayscale-0 transition-all duration-700 pointer-events-none">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJblunIyJHyiRoxiV9G6x-bz0XyvB7PrEdzLuAWLyEncCQMGdFL1qXLrjmbUdr63vGeT8zb4rvOPqzMvUcC4jSbXljv4CSCLz-8qRR0RwHRdIM86XtA98zJOR7JLToWGItPWHugEazyjCpuIqofBRllfnBP71ejxgu1GHr7yx6RMxmZe4YTgOmiAhaOMP1_c8pTRPcC1CeV3dJZ1LXGD4MUCtAZPcAq4Z-fVx6JJkBjG2lGseXgmQ4mHMtE3-eSOETRuLo92iQ4Oc"
                  alt="Professional kitchen"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Quality card */}
            <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
                <Star size={28} fill="currentColor" />
              </div>
              <h4 className="font-headline text-xl font-bold text-primary">Order Quality Goal</h4>
              <p className="text-sm text-secondary">
                98% of orders today met the "Hot on Arrival" standard. Continue maintaining high
                logistics efficiency.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}