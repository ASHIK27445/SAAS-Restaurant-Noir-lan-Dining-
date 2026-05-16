import { useState } from "react";
import {
  UtensilsCrossed,
  BarChart2,
  Settings,
  Search,
  TrendingUp,
  Utensils,
  CheckCircle,
  MoreHorizontal,
  CalendarDays,
  Share2,
  Home,
} from "lucide-react";

const PERIOD_TABS = ["This Week", "This Month", "Quarterly", "Custom"];

const CATEGORIES = [
  { label: "Main Course",    pct: 42, color: "bg-primary" },
  { label: "Wine & Spirits", pct: 28, color: "bg-tertiary" },
  { label: "Desserts",       pct: 15, color: "bg-secondary" },
  { label: "Appetizers",     pct: 15, color: "bg-on-primary-container" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export default function Reports() {
  const [activePeriod, setActivePeriod] = useState("This Month");

  return (
    <div className="bg-surface text-on-surface flex overflow-hidden min-h-screen font-body">

      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">

        {/* Top Bar */}
        <header className="flex justify-between items-center w-full px-6 sticky top-0 z-40 bg-surface/70 backdrop-blur-xl h-14 border-b border-outline-variant/10">
          <div className="flex items-center gap-6">
            <h2 className="text-xs uppercase tracking-widest text-primary font-bold">
              Reports & Analytics
            </h2>
            <div className="hidden lg:flex items-center bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/20 gap-2">
              <Search size={13} className="text-secondary" />
              <input
                className="bg-transparent border-none focus:ring-0 text-xs w-40 outline-none"
                placeholder="Search data..."
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6 pb-24 md:pb-8">

          {/* Page header + period picker */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-headline text-2xl text-on-surface leading-tight tracking-tight">
                Performance Editorial
              </h1>
              <p className="text-sm text-secondary mt-1 max-w-md leading-relaxed">
                A detailed overview of the establishment's financial health and culinary reach for
                the selected period.
              </p>
            </div>

            <div className="flex bg-surface-container-low p-1 rounded-xl">
              {PERIOD_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePeriod(tab)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 ${
                    activePeriod === tab
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  {tab === "Custom" && <CalendarDays size={11} />}
                  {tab}
                </button>
              ))}
            </div>
          </section>

          {/* KPI cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col justify-between h-36 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                  Total Revenue
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="font-headline text-2xl text-primary">$124,850</h3>
                  <span className="text-[11px] text-primary font-bold">+12.5%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-secondary/60">
                <TrendingUp size={13} />
                <span className="text-xs font-medium">Surpassing last month's pace</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col justify-between h-36 relative overflow-hidden">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                  Avg Order Value
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="font-headline text-2xl text-primary">$64.20</h3>
                  <span className="text-[11px] text-secondary font-bold">+2.1%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-secondary/60">
                <Utensils size={13} />
                <span className="text-xs font-medium">Fine dining segment leading</span>
              </div>
            </div>

            <div className="bg-primary text-on-primary p-5 rounded-xl flex flex-col justify-between h-36 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 opacity-10">
                <BarChart2 size={72} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Net Profit
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="font-headline text-2xl text-on-primary">$38,120</h3>
                  <span className="text-[11px] text-on-primary-container font-bold">+5.4%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-on-primary/70">
                <CheckCircle size={13} />
                <span className="text-xs font-medium">Efficiency targets met</span>
              </div>
            </div>
          </section>

          {/* Charts grid */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* SVG line chart */}
            <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl p-5">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h4 className="font-headline text-base text-on-surface">
                    Profit & Loss Trajectory
                  </h4>
                  <p className="text-[11px] text-secondary mt-0.5">
                    Visualizing monthly yield vs operational costs
                  </p>
                </div>
                <button className="text-secondary/40 hover:text-secondary transition-colors">
                  <MoreHorizontal size={17} />
                </button>
              </div>

              <div className="relative h-48 w-full">
                {[0, 25, 50, 75].map((pct) => (
                  <div
                    key={pct}
                    className="absolute left-0 w-full h-px bg-outline-variant/10"
                    style={{ top: `${pct}%` }}
                  />
                ))}

                <svg
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 800 256"
                >
                  <defs>
                    <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#173124" />
                      <stop offset="100%" stopColor="#173124" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,200 Q100,180 200,120 T400,150 T600,60 T800,90"
                    fill="none"
                    stroke="#173124"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,200 Q100,180 200,120 T400,150 T600,60 T800,90 V256 H0 Z"
                    fill="url(#lineGrad)"
                    opacity="0.1"
                  />
                </svg>

                <div className="absolute bottom-0 w-full flex justify-between text-[9px] font-bold uppercase tracking-widest text-secondary">
                  {MONTHS.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Category bars */}
            <div className="lg:col-span-2 bg-surface-container-low rounded-xl p-5">
              <div className="mb-5">
                <h4 className="font-headline text-base text-on-surface">Category Performance</h4>
                <p className="text-[11px] text-secondary mt-0.5">Distribution of revenue by department</p>
              </div>

              <div className="space-y-4">
                {CATEGORIES.map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                      <span className="text-primary">{label}</span>
                      <span className="text-secondary">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-5 w-full py-2.5 border border-outline-variant/30 rounded-lg text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-surface-container-lowest transition-colors">
                View Detailed Breakdown
              </button>
            </div>
          </section>

          {/* Editorial insights */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

            {/* Photo card */}
            <div className="relative group cursor-pointer overflow-hidden rounded-xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfeYepCX7C8zIgNCtmU3pzOF7vO4wB5shl7Ila3Hs8jtd56idROFv7kl8quOxyOYCMIO9n3_NvsGgUFagdBsmogoDkMNsJrXLX8eBAldWvnla7B27PtU71rQ9fKLdKW12JH20aA1Mo2yiukEhXoEiuA6Ur3px7XhMrFN-4qfixugLySw2zU9rkRgMhIajXPt0c4dZDdGVbq4Uda5rSUYoIbKPpMj5u_Gm-q8KrJR6PmnoSuz1ABtAcZxHwJV4oWsYdefmNQkIybAI"
                alt="Luxury restaurant interior"
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent flex flex-col justify-end p-5">
                <span className="text-on-primary text-[9px] font-bold uppercase tracking-widest mb-1">
                  Editor's Insight
                </span>
                <h4 className="font-headline text-lg text-on-primary leading-tight">
                  Optimizing Peak Hours: The Weekend Surge
                </h4>
                <p className="text-on-primary/80 text-xs mt-1.5 max-w-sm">
                  Data indicates a 14% increase in turnover when utilizing the "Tasting Menu"
                  strategy during Saturday dinner service.
                </p>
              </div>
            </div>

            {/* Text insight */}
            <div className="flex flex-col justify-center space-y-4">
              <div className="border-l-4 border-tertiary pl-5">
                <h4 className="font-headline text-lg text-on-surface leading-tight">
                  Inventory Intelligence
                </h4>
                <p className="text-secondary text-xs mt-2 leading-relaxed">
                  Based on your sales velocity, wine inventory for Bordeaux labels is projected to
                  deplete 12 days earlier than scheduled. We recommend adjusting the reorder point
                  or featuring a secondary vintage.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low p-3.5 rounded-lg">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-secondary block">
                    Top Dish
                  </span>
                  <span className="font-headline text-base text-primary">Truffle Tagliatelle</span>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-lg">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-secondary block">
                    Wait Time
                  </span>
                  <span className="font-headline text-base text-primary">18m Avg</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* FAB */}
        <button className="fixed bottom-6 right-6 bg-tertiary text-on-tertiary p-3.5 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform duration-200 z-50">
          <Share2 size={18} />
        </button>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl flex justify-around items-center h-16 border-t border-outline-variant/10 z-50">
          {[
            { icon: Home,            label: "Home" },
            { icon: UtensilsCrossed, label: "Menu" },
            { icon: BarChart2,       label: "Reports", active: true },
            { icon: Settings,        label: "Settings" },
          ].map(({ icon: Icon, label, active }) => (
            <a
              key={label}
              href="#"
              className={`flex flex-col items-center gap-1 ${active ? "text-primary" : "text-secondary"}`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
            </a>
          ))}
        </nav>
      </main>
    </div>
  );
}