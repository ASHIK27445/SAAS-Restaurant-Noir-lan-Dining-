import { useState } from "react";
import {
  Search,
  Bell,
  LogOut,
  ArrowRight,
  ListFilter,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type PayType = "Card" | "Cash" | "Mobile";

const TYPE_STYLE: Record<PayType, { pill: string; text: string }> = {
  Card:   { pill: "bg-primary/5",             text: "text-primary" },
  Cash:   { pill: "bg-secondary/10",          text: "text-secondary" },
  Mobile: { pill: "bg-tertiary-container/10", text: "text-tertiary-container" },
};

type Invoice = {
  inv: string;
  ord: string;
  date: string;
  amount: string;
  type: PayType;
};

const INVOICES: Invoice[] = [
  { inv: "#INV-94021", ord: "ORD-2201", date: "Oct 28, 2023 • 19:42", amount: "$342.12",   type: "Card" },
  { inv: "#INV-94020", ord: "ORD-2200", date: "Oct 28, 2023 • 19:15", amount: "$156.00",   type: "Cash" },
  { inv: "#INV-94019", ord: "ORD-2199", date: "Oct 28, 2023 • 18:50", amount: "$1,204.88", type: "Card" },
  { inv: "#INV-94018", ord: "ORD-2198", date: "Oct 28, 2023 • 18:32", amount: "$89.00",    type: "Mobile" },
  { inv: "#INV-94017", ord: "ORD-2197", date: "Oct 28, 2023 • 18:10", amount: "$562.40",   type: "Card" },
];

const PAGES = [1, 2, 3, 169];

export default function InvoiceHistory() {
  const [search, setSearch]         = useState("");
  const [payType, setPayType]       = useState("ALL METHODS");
  const [activePage, setActivePage] = useState(1);

  const filtered = INVOICES.filter((inv) => {
    const matchSearch =
      inv.inv.toLowerCase().includes(search.toLowerCase()) ||
      inv.ord.toLowerCase().includes(search.toLowerCase());
    const matchType =
      payType === "ALL METHODS" || inv.type.toUpperCase() === payType;
    return matchSearch && matchType;
  });

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">

      <main className="grow flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="bg-surface/70 backdrop-blur-xl flex justify-between items-center w-full px-6 sticky top-0 h-14 z-40 border-b border-outline-variant/10">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              className="bg-surface-container-low border-none rounded-xl pl-9 pr-4 py-1.5 text-xs uppercase tracking-widest focus:ring-1 focus:ring-primary/20 w-52 transition-all outline-none"
              placeholder="SEARCH INVOICES..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button className="text-secondary hover:opacity-80 transition-opacity">
                <Bell size={17} />
              </button>
              <div className="flex items-center gap-2.5 pl-3 border-l border-outline-variant/20">
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-widest text-secondary font-bold">
                    Administrator
                  </p>
                  <p className="text-[11px] font-medium text-primary">JULIAN VASSEUR</p>
                </div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU0sIThi3kbuf1ioMgW7iBmjtXDz_5i4djM6lD9DQjPslOvxp0nFMM8KUgkxNNj8N8YJbOtL33L162LvwU32kIvxkr1yJGAc1vh1NMRy7PE0SR985FREgxk_KZo4nM9Dljh6wmMB2W7u5sc3cX9wTp9fWAbRToXjFBTu6XiVNMgN5comIigNVxm8MsnHezHVRBpVzW_jU6euB6fe-WThWASLsgMOdQUoIGom0nxtH_VOQyKTUM9J5jhoy2Z0qHoaf3hrnTLOkx-b0"
                  alt="Admin avatar"
                  className="w-8 h-8 rounded-full object-cover grayscale"
                />
              </div>
            </div>
            <button className="text-[11px] uppercase tracking-widest text-primary border-b-2 border-primary pb-0.5 hover:opacity-80 transition-opacity flex items-center gap-1">
              <LogOut size={12} /> Logout
            </button>
          </div>
        </header>

        {/* Archive Section */}
        <section className="p-6 max-w-7xl mx-auto w-full">

          {/* Header + filters */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-headline text-on-primary-fixed mb-1 tracking-wide">
                Archive
              </h2>
              <p className="text-sm text-on-surface-variant italic">
                Reviewing past transactions and culinary records.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Date range display */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-widest font-bold text-secondary px-1">
                  Date Range
                </label>
                <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-xl gap-2">
                  <span className="text-[11px] font-medium text-primary">OCT 01, 2023</span>
                  <ArrowRight size={11} className="text-outline" />
                  <span className="text-[11px] font-medium text-primary">OCT 31, 2023</span>
                </div>
              </div>

              {/* Payment type filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-widest font-bold text-secondary px-1">
                  Payment Type
                </label>
                <select
                  className="bg-surface-container-low border-none rounded-xl text-[11px] font-medium text-primary pr-8 focus:ring-0 py-1.5 px-3 outline-none"
                  value={payType}
                  onChange={(e) => setPayType(e.target.value)}
                >
                  <option>ALL METHODS</option>
                  <option>CARD</option>
                  <option>CASH</option>
                  <option>MOBILE</option>
                </select>
              </div>

              <button className="bg-primary text-on-primary px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 self-end hover:opacity-90 transition-opacity">
                <ListFilter size={12} />
                Apply Filters
              </button>
            </div>
          </div>

          {/* Stat bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col justify-between border border-outline-variant/10">
              <p className="text-[9px] uppercase tracking-widest text-secondary font-bold mb-2">
                Total Revenue
              </p>
              <p className="text-3xl font-headline text-primary">$42,890.50</p>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between">
              <p className="text-[9px] uppercase tracking-widest text-secondary font-bold mb-2">
                Transaction Count
              </p>
              <p className="text-3xl font-headline text-primary">842</p>
            </div>

            <div className="relative rounded-xl overflow-hidden group h-32 md:h-auto">
              <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/30 transition-colors z-10" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBppRjpI_3R8_PLR2xCvsFCLXVx28KJ14d4BzMY8wf8SmOoaIovUS4yJweY9Qp4KFn66PZMdUNzpiVfuwBOw-Fh3BLLopbJvVdxuZftZzaw98xVScDA4dVibsBiBHlqRe-yazkuYc-O1Nm8YLdGB7C32FF9HYLuVvhMXUoDkEgt4YIGgps9fAs1n0G9Osp7QG-bDNIlY5blz8mv7rmfuRBxxf1cU9L5tX96XQI9EitYcnGJX47brNzlsEitwnoYz-zkpRWu6g3-r40"
                alt="Luxury dining room"
                className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="relative z-20 p-5 h-full flex flex-col justify-end">
                <p className="text-white font-headline text-base leading-tight">
                  October Monthly Performance
                </p>
                <p className="text-white/80 text-[10px] uppercase tracking-widest mt-1">
                  +12% vs last month
                </p>
              </div>
            </div>
          </div>

          {/* Invoice table */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  {[
                    { label: "Invoice #",   align: "" },
                    { label: "Order ID",    align: "" },
                    { label: "Date & Time", align: "" },
                    { label: "Amount",      align: "text-right" },
                    { label: "Type",        align: "" },
                    { label: "Actions",     align: "text-center" },
                  ].map(({ label, align }) => (
                    <th
                      key={label}
                      className={`px-5 py-3 text-[9px] uppercase tracking-widest font-bold text-secondary ${align}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map((row) => {
                  const s = TYPE_STYLE[row.type];
                  return (
                    <tr key={row.inv} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-xs text-primary">{row.inv}</td>
                      <td className="px-5 py-3.5 text-[11px] text-secondary tracking-widest">{row.ord}</td>
                      <td className="px-5 py-3.5 text-xs text-on-surface-variant font-medium">{row.date}</td>
                      <td className="px-5 py-3.5 text-right text-sm font-headline text-primary">{row.amount}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 ${s.pill} ${s.text} rounded-full`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button className="p-1.5 text-secondary hover:text-primary transition-colors">
                          <Printer size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-5 py-3.5 flex justify-between items-center bg-surface-container-low/30">
              <p className="text-[11px] text-on-surface-variant">
                Showing 1 to 5 of 842 records
              </p>
              <div className="flex items-center gap-1.5">
                <button className="w-7 h-7 rounded-full flex items-center justify-center text-outline hover:text-primary transition-colors">
                  <ChevronLeft size={15} />
                </button>
                {PAGES.map((p, i) => (
                  <>
                    {i === PAGES.length - 1 && (
                      <span key="ellipsis" className="text-secondary px-1 text-xs">…</span>
                    )}
                    <button
                      key={p}
                      onClick={() => setActivePage(p)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                        activePage === p
                          ? "bg-primary text-on-primary"
                          : "text-secondary hover:bg-surface-container-high"
                      }`}
                    >
                      {p}
                    </button>
                  </>
                ))}
                <button className="w-7 h-7 rounded-full flex items-center justify-center text-outline hover:text-primary transition-colors">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}