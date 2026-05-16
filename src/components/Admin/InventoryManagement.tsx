import { ChevronLeft, ChevronRight, Download, Leaf, ListFilterPlus, MessageCircleWarning, Plus, Search, TrendingUp } from "lucide-react";
import { useState } from "react";

type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

const INVENTORY = [
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQDDR7EW5adFIROOHd0mSA8syGx0C6PoRqPixd8H6jBeYHCUftyri24lC2pTp8CXVQCkxpzFnrZSBTIpSuHd0wzsYKG3uI-F2DuCmoVB0fih_roXRM2YdDCpwi0KOq1584WeTox_RGT_JzNjB25Wcu4-eMBHcz_-02yXN2etYr_dA3BR10uwV-A1mqsUiA7X20CVP4Jrwnyd74gzfqscqPDfUOAdQYpi7B7Pzayp1MUFg11yZ7RDUfUnVe2N7aPoBs54CuUrOKK_A",
    name: "Wagyu Beef A5",
    sub: "Japanese Prefecture Origin",
    status: "in-stock" as StockStatus,
    qty: "12.5",
    unit: "kg",
    supplier: "Kyoto Fine Meats",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjlGRYOXzLCEFnfYd_KHI4M3773PAEGZAgjAARwUzfDsyt3x1xwDeb02ywU8KuUkUKUr0ikUvZCaWfpLvUjowGUlFn3bcMpWsdLfA0Qtz3r0dCPvyp311c8bMT6DGHYHrOlBeb9bIkqgNbzz6AK67olZJzVsAtXyCRjjrNrdSRv5burKG2KcejMG6Wqp8_ON4F0DodVZEdfwO8VirhwlkRX21CCDAW2LCQ993hi0OQNaJnd3mCZdLX054f8W7qrm73Tb5eNO5vJhU",
    name: "Organic Heirloom Tomatoes",
    sub: "Heritage Variety Mix",
    status: "low-stock" as StockStatus,
    qty: "3.2",
    unit: "boxes",
    supplier: "Valley Green Farms",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAb3dx5QtHhaOBF1yWgrYQlvxIbVx8smHLGwGrZdvlz0hwFOhaniliRWuV2eUWfjZD5WkWSuyTj-Qh2zWYNYeqIwF0Z48mJR7kGArElIMOP5gedHbLt0EX03Cnou49buj_o7mY915mUMMbs-xHaqJyEtjOhYXgGqsNs9IwoVO2SD03OARLQrUO7y3FVdK-B-8G0-S3rqluxGgZjoZmhq1QIRkocfmkYqR7V0PMmVB4cs5GBHcqLnCct91pBQMUNaBXsovts66eSeiA",
    name: "White Truffle Oil",
    sub: "Alba Essence Infusion",
    status: "out-of-stock" as StockStatus,
    qty: "0.0",
    unit: "liters",
    supplier: "Umbria Artisans",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJQII-t-50nB_0WxqxlD_v_sDKygETCIpMXnkwcZPFvjHIUUO9pNdRnyr89HM1yi75dTcaYgWohE6XbobtH7nnR_1wGIaacQUA1S0--AgI97JzGvghepuSKn0-3p4fRoUoDoxfCiBiMrtkKFxWw_MJotQ-tqz2oqN11AIZpjfF8ZV5s-A8uLQO5lIoFM16EWebfIYQSoNlyr1Vtuw8Pa0qmEYFkoeZYnxAyqnSaeAe9hmEUTXSGvU3fH9ADf_VKa5oasKceKF15l0",
    name: "Madagascar Vanilla Beans",
    sub: "Grade A Bourbon",
    status: "in-stock" as StockStatus,
    qty: "0.8",
    unit: "kg",
    supplier: "Spice Route Imports",
  },
];

const STATUS_CONFIG: Record<StockStatus, { label: string; dot: string; pill: string; text: string }> = {
  "in-stock": {
    label: "In Stock",
    dot: "bg-primary",
    pill: "bg-primary-container/10",
    text: "text-primary",
  },
  "low-stock": {
    label: "Low Stock",
    dot: "bg-tertiary",
    pill: "bg-tertiary/10",
    text: "text-tertiary",
  },
  "out-of-stock": {
    label: "Out of Stock",
    dot: "bg-on-surface-variant",
    pill: "bg-on-surface-variant/10",
    text: "text-on-surface-variant",
  },
};

export default function InventoryManagement() {
  const [search, setSearch] = useState("");

  const filtered = INVENTORY.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-body my-2">

      <main className="min-h-screen flex-1">

        {/* ── Content ── */}
        <section className="px-8 pb-8">

          {/* Alert bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="col-span-2 bg-primary text-on-primary p-5 rounded-xl flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-headline mb-1">Critical Restock Required</h3>
                <p className="text-on-primary-container text-xs max-w-md">
                  3 luxury staples are currently 'Out of Stock'. Immediate reordering is recommended
                  to maintain the tasting menu integrity.
                </p>
                <button className="mt-4 px-5 py-1.5 bg-surface-container-lowest text-primary rounded-full text-xs font-semibold hover:bg-white transition-colors">
                  Review Alerts
                </button>
              </div>
              <MessageCircleWarning className="absolute right-4 bottom-4 opacity-10 pointer-events-none" size={48} />
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-center">
              <p className="text-on-surface-variant text-[10px] font-medium uppercase tracking-widest mb-1">
                Inventory Value
              </p>
              <p className="text-3xl font-headline text-primary">$42,850.20</p>
              <div className="flex items-center gap-2 mt-1.5 text-tertiary">
                <TrendingUp size={14} />
                <span className="text-xs font-bold">+12% from last week</span>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-surface-container-low rounded-xl overflow-hidden">

            {/* Table toolbar */}
            <div className="px-5 py-4 flex items-center justify-between bg-surface-container-high/50">
              <div className="relative w-60">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  className="w-full pl-9 pr-4 py-1.5 bg-surface border-none rounded-xl focus:ring-1 focus:ring-primary/20 text-xs placeholder:text-on-surface-variant/60"
                  placeholder="Search ingredients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium px-3 py-1.5 hover:bg-surface-container-high rounded-lg transition-colors">
                  <ListFilterPlus size={13} />
                  Filter
                </button>
                <button className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium px-3 py-1.5 hover:bg-surface-container-high rounded-lg transition-colors">
                  <Download size={13} />
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-on-surface-variant border-b border-outline-variant/10">
                    {["Ingredient", "Stock Status", "Current Stock", "Unit", "Supplier", "Actions"].map(
                      (col, i) => (
                        <th
                          key={col}
                          className={`px-5 py-3 font-medium text-[10px] uppercase tracking-widest ${
                            i === 2 ? "text-center" : i === 5 ? "text-right" : ""
                          }`}
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {filtered.map((row) => {
                    const s = STATUS_CONFIG[row.status];
                    return (
                      <tr
                        key={row.name}
                        className="hover:bg-surface-container-high/30 transition-colors"
                      >
                        {/* Ingredient */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface-container-highest overflow-hidden shrink-0">
                              <img
                                src={row.img}
                                alt={row.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-headline text-on-surface">{row.name}</p>
                              <p className="text-[11px] text-on-surface-variant">{row.sub}</p>
                            </div>
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${s.pill} ${s.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </span>
                        </td>

                        {/* Qty */}
                        <td
                          className={`px-5 py-3.5 text-center text-sm font-bold ${
                            row.status === "out-of-stock" ? "text-error" : "text-on-surface"
                          }`}
                        >
                          {row.qty}
                        </td>

                        {/* Unit */}
                        <td className="px-5 py-3.5 text-on-surface-variant text-xs">{row.unit}</td>

                        {/* Supplier */}
                        <td className="px-5 py-3.5 text-on-surface-variant text-xs">{row.supplier}</td>

                        {/* Action */}
                        <td className="px-5 py-3.5 text-right">
                          {row.status === "out-of-stock" ? (
                            <button className="bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-bold hover:shadow-lg transition-all">
                              Reorder Now
                            </button>
                          ) : (
                            <button className="text-primary hover:underline text-xs font-semibold">
                              Reorder
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-4 flex items-center justify-between border-t border-outline-variant/5">
              <p className="text-[11px] text-on-surface-variant">Showing 4 of 128 ingredients</p>
              <div className="flex gap-1.5">
                <button className="p-1.5 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface transition-colors">
                  <ChevronLeft size={15} />
                </button>
                <button className="p-1.5 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface transition-colors">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Secondary Insights ── */}
        <section className="px-8 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Vendor Performance */}
          <div className="bg-surface-container-low p-6 rounded-xl">
            <h3 className="text-base font-headline text-primary mb-4">Vendor Performance</h3>
            <div className="space-y-4">
              {[
                { name: "Kyoto Fine Meats", score: "98%", filled: 4 },
                { name: "Valley Green Farms", score: "85%", filled: 3 },
              ].map(({ name, score, filled }) => (
                <div key={name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-on-surface">{name}</p>
                    <p className="text-[11px] text-on-surface-variant">Reliability Score: {score}</p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-5 rounded-full ${
                          i < filled ? "bg-primary" : "bg-primary/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-outline-variant/10 pt-4 flex items-center justify-between">
              <p className="text-[11px] text-on-surface-variant italic">
                Next delivery scheduled: Tuesday, Oct 12
              </p>
              <button className="text-tertiary text-[10px] font-bold uppercase tracking-wider">
                Manage Suppliers
              </button>
            </div>
          </div>

          {/* Side cards */}
          <div className="flex flex-col gap-4">
            <div className="bg-tertiary p-5 rounded-xl text-on-tertiary flex items-center justify-between">
              <div>
                <h4 className="font-headline text-base">Seasonal Surplus</h4>
                <p className="text-xs opacity-80">Organic Heirloom Carrots are currently peaking.</p>
              </div>
              <button className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all">
                Adjust Menus
              </button>
            </div>

            <div className="bg-secondary-container p-5 rounded-xl text-on-secondary-fixed-variant flex items-center justify-between">
              <div>
                <h4 className="font-headline text-base">Waste Reduction</h4>
                <p className="text-xs opacity-80">Food waste decreased by 4.2% this month.</p>
              </div>
              <Leaf size={18} />
            </div>
          </div>
        </section>
      </main>

      {/* FAB */}
      <button className="fixed right-6 bottom-6 bg-primary text-on-primary h-12 w-12 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
        <Plus size={18} />
      </button>
    </div>
  );
}