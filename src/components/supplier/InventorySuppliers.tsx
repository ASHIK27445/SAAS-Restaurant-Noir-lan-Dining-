import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Minus,
  X,
  TrendingDown,
  Calendar,
  BarChart3,
  Loader2,
} from "lucide-react";
import { getInventory, adjustStock, getInventoryUsage, getInventoryUsageOverview } from "../../api/inventory";
import type { InventoryItem, InventoryUsageOverview, InventoryUsageReport } from "../../types/inventory";

const STATUS_DOT: Record<string, string> = {
  "in-stock": "bg-primary",
  "low-stock": "bg-tertiary",
  "out-of-stock": "bg-error",
};

function ReduceStockPanel({
  item,
  onClose,
  onSaved,
}: {
  item: InventoryItem;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = Number(item.currentStock);
  const qtyNum = Number(quantity) || 0;
  const remaining = current - qtyNum;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!quantity || qtyNum <= 0) {
      setError("Enter a quantity greater than 0.");
      return;
    }
    if (qtyNum > current) {
      setError(`Only ${current} ${item.unit} in stock.`);
      return;
    }

    setSubmitting(true);
    try {
      await adjustStock(item.id, { type: "USAGE", quantity: qtyNum, note: note.trim() || undefined });
      await onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to record usage");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm bg-surface rounded-xl shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10">
          <h3 className="font-headline text-lg text-on-surface">Reduce Stock</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 text-sm">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-wide mb-1">Item</p>
            <p className="font-medium text-on-surface">{item.name}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Currently {current} {item.unit} in stock
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
              Quantity used *
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={current}
                step={0.1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="flex-1 bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
              />
              <span className="text-xs text-on-surface-variant">{item.unit}</span>
            </div>
            {quantity && qtyNum > 0 && qtyNum <= current && (
              <p className="text-xs text-on-surface-variant mt-1">
                Remaining after this: <strong className="text-on-surface">{remaining} {item.unit}</strong>
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
              Note (optional)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. used in tonight's service"
              className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
            />
          </div>

          {error && <p className="text-error text-xs">{error}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Record Usage"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UsageReportModal({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const [report, setReport] = useState<InventoryUsageReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"daily" | "monthly">("daily");

  useEffect(() => {
    setLoading(true);
    setError(null);
    getInventoryUsage(item.id, { days: 14, months: 6 })
      .then((res) => setReport(res.data))
      .catch((err) => setError(err.message || "Failed to load usage report"))
      .finally(() => setLoading(false));
  }, [item.id]);

  const maxDaily = useMemo(
    () => Math.max(1, ...(report?.dailyUsage.map((d) => d.quantity) ?? [0])),
    [report]
  );
  const maxMonthly = useMemo(
    () => Math.max(1, ...(report?.monthlyUsage.map((m) => m.quantity) ?? [0])),
    [report]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-surface rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10 sticky top-0 bg-surface">
          <div>
            <h3 className="font-headline text-lg text-on-surface">{item.name}</h3>
            <p className="text-xs text-on-surface-variant">Usage report</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : error ? (
            <p className="text-error text-sm py-8 text-center">{error}</p>
          ) : report ? (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-container-low rounded-xl p-4">
                  <p className="text-xs text-on-surface-variant uppercase tracking-wide mb-1">Current Stock</p>
                  <p className="font-headline text-2xl text-primary">
                    {Number(report.currentStock)} <span className="text-sm text-on-surface-variant">{report.unit}</span>
                  </p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-4">
                  <p className="text-xs text-on-surface-variant uppercase tracking-wide mb-1">Avg. Daily Usage</p>
                  <p className="font-headline text-2xl text-primary">
                    {report.averageDailyUsage !== null ? (
                      <>
                        {report.averageDailyUsage} <span className="text-sm text-on-surface-variant">{report.unit}/day</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
              </div>

              {/* Toggle */}
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg w-fit mb-4">
                <button
                  onClick={() => setView("daily")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    view === "daily" ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant"
                  }`}
                >
                  <Calendar size={13} /> Daily
                </button>
                <button
                  onClick={() => setView("monthly")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    view === "monthly" ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant"
                  }`}
                >
                  <BarChart3 size={13} /> Monthly
                </button>
              </div>

              {view === "daily" ? (
                report.dailyUsage.every((d) => d.quantity === 0) ? (
                  <p className="text-sm text-on-surface-variant text-center py-8">
                    No usage recorded in the last 14 days.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {report.dailyUsage.map((d) => (
                      <div key={d.date} className="flex items-center gap-3">
                        <span className="text-xs text-on-surface-variant w-20 shrink-0">
                          {new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                        <div className="flex-1 bg-surface-container-low rounded-full h-4 relative overflow-hidden">
                          <div
                            className="bg-primary-container h-full rounded-full transition-all"
                            style={{ width: `${(d.quantity / maxDaily) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-on-surface w-16 text-right shrink-0">
                          {d.quantity} {report.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              ) : report.monthlyUsage.every((m) => m.quantity === 0) ? (
                <p className="text-sm text-on-surface-variant text-center py-8">
                  No usage recorded in the last 6 months.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {report.monthlyUsage.map((m) => (
                    <div key={m.month} className="flex items-center gap-3">
                      <span className="text-xs text-on-surface-variant w-20 shrink-0">
                        {new Date(`${m.month}-01`).toLocaleDateString(undefined, { month: "short", year: "2-digit" })}
                      </span>
                      <div className="flex-1 bg-surface-container-low rounded-full h-4 relative overflow-hidden">
                        <div
                          className="bg-primary-container h-full rounded-full transition-all"
                          style={{ width: `${(m.quantity / maxMonthly) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-on-surface w-16 text-right shrink-0">
                        {m.quantity} {report.unit}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function InventorySuppliers() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [usageOverview, setUsageOverview] = useState<Record<string, InventoryUsageOverview>>({});

  const [reducingItem, setReducingItem] = useState<InventoryItem | null>(null);
  const [reportItem, setReportItem] = useState<InventoryItem | null>(null);

  function loadItems() {
    setLoading(true);
    setError(null);
    return getInventory({ pageSize: 200 })
      .then(async (res) => {
        setItems(res.data);
        const usage = await getInventoryUsageOverview();
        setUsageOverview(Object.fromEntries(usage.data.map((entry) => [entry.itemId, entry])));
      })
      .catch((err) => setError(err.message || "Failed to load inventory"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadItems();
  }, []);

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))).sort(), [items]);

  const filtered = items.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || i.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen">
      <main className="max-w-6xl mx-auto w-full px-5 py-8 sm:px-8 sm:py-10">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl text-primary tracking-tight">
              Inventory Supplies
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Current stock on hand for every ingredient — no pricing, just quantities.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ingredients…"
              className="w-full bg-surface-container-low text-sm rounded-lg pl-9 pr-3 py-2 border border-transparent focus:border-primary/20 focus:outline-none placeholder:text-on-surface-variant"
            />
          </div>
        </header>

        {categories.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            <button
              onClick={() => setCategoryFilter("")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === "" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === c ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-on-surface-variant text-sm py-8">Loading inventory…</p>
        ) : error ? (
          <p className="text-error text-sm py-8">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-on-surface-variant text-sm py-8 text-center">
            {items.length === 0 ? "No ingredients yet." : "No ingredients match your search or filter."}
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 border-collapse text-left">
                <caption className="sr-only">Ingredient inventory and stock usage actions</caption>
                <thead className="bg-surface-container-low text-[11px] uppercase tracking-wider text-on-surface-variant">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">Ingredient</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Category</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">In stock</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Minimum</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Used / 30 days</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Avg. / day</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {filtered.map((item) => {
                    const stock = Number(item.currentStock);
                    const minimum = Number(item.minThreshold);
                    const statusLabel = item.status === "in-stock" ? "In stock" : item.status === "low-stock" ? "Low stock" : "Out of stock";
                    return (
                      <tr key={item.id} className="group transition-colors hover:bg-surface-container-low/70">
                        <th scope="row" className="px-5 py-4 font-normal">
                          <div className="flex items-center gap-3">
                            <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[item.status]}`} aria-hidden="true" />
                            <div>
                              <p className="font-medium text-on-surface">{item.name}</p>
                              <p className="mt-0.5 text-xs text-on-surface-variant">{item.unit}</p>
                            </div>
                          </div>
                        </th>
                        <td className="px-5 py-4 text-sm text-on-surface-variant">{item.category}</td>
                        <td className="px-5 py-4 text-right">
                          <span className="font-headline text-lg text-primary">{stock}</span>
                          <span className="ml-1 text-xs text-on-surface-variant">{item.unit}</span>
                        </td>
                        <td className="px-5 py-4 text-right text-sm text-on-surface-variant">
                          {minimum} {item.unit}
                        </td>
                        <td className="px-5 py-4 text-right text-sm text-on-surface-variant">
                          {usageOverview[item.id]?.totalUsage ?? 0} {item.unit}
                        </td>
                        <td className="px-5 py-4 text-right text-sm text-on-surface-variant">
                          {(usageOverview[item.id]?.averageDailyUsage ?? 0).toFixed(2)} {item.unit}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center rounded-full bg-surface-container-low px-2.5 py-1 text-xs font-medium text-on-surface-variant">
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => setReducingItem(item)}
                              disabled={stock <= 0}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Minus size={13} /> Reduce
                            </button>
                            <button
                              onClick={() => setReportItem(item)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10"
                            >
                              <TrendingDown size={13} /> Usage
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-outline-variant/15 px-5 py-3 text-xs text-on-surface-variant">
              Showing {filtered.length} of {items.length} ingredients
            </div>
          </div>
        )}
      </main>

      {reducingItem && (
        <ReduceStockPanel
          item={reducingItem}
          onClose={() => setReducingItem(null)}
          onSaved={loadItems}
        />
      )}

      {reportItem && <UsageReportModal item={reportItem} onClose={() => setReportItem(null)} />}
    </div>
  );
}