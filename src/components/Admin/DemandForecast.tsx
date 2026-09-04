import { useEffect, useState } from "react";
import { CalendarClock, ChefHat, Info, LoaderCircle, RefreshCw, TrendingUp } from "lucide-react";
import { getDemandForecast, type DemandForecastResponse } from "../../api/demandForecast";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function statusLabel(status: "NO_HISTORY" | "LOW_DEMAND" | "FORECAST") {
  if (status === "NO_HISTORY") return "No history";
  if (status === "LOW_DEMAND") return "Low demand";
  return "Forecast";
}

function statusClass(status: "NO_HISTORY" | "LOW_DEMAND" | "FORECAST") {
  if (status === "NO_HISTORY") return "bg-surface-container-high text-secondary";
  if (status === "LOW_DEMAND") return "bg-tertiary/20 text-on-surface";
  return "bg-primary/10 text-primary";
}

export default function DemandForecast() {
  const [forecast, setForecast] = useState<DemandForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadForecast(isRefresh = false) {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError("");
    try { setForecast(await getDemandForecast()); } catch (reason) { setError(reason instanceof Error ? reason.message : "Failed to load demand forecast"); }
    finally { setLoading(false); setRefreshing(false); }
  }

  useEffect(() => { void loadForecast(); }, []);

  const items = forecast?.items ?? [];
  const tomorrowTotal = items.reduce((total, item) => total + item.tomorrow.recommendedQuantity, 0);
  const nextWeekTotal = items.reduce((total, item) => total + item.next7Days.recommendedQuantity, 0);
  const topItems = items.slice(0, 5);

  return <div className="min-h-full bg-surface font-body text-on-surface"><main className="mx-auto w-full max-w-7xl space-y-6 p-6 pb-24 md:pb-8"><header className="flex flex-col justify-between gap-4 border-b border-outline-variant/10 pb-5 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">AI Operations</p><h1 className="mt-2 font-headline text-3xl tracking-tight">Menu Demand Forecast</h1><p className="mt-1 max-w-xl text-sm leading-relaxed text-secondary">Internal forecast based on the last {forecast?.history.days ?? 56} days of paid menu sales. No external AI service is used.</p></div><button type="button" onClick={() => void loadForecast(true)} disabled={loading || refreshing} className="flex items-center gap-2 self-start rounded-lg border border-outline-variant/30 px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-surface-container-low disabled:opacity-50"><RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh</button></header>

      {loading && <div className="flex items-center gap-2 rounded-xl bg-surface-container-low p-5 text-sm text-secondary"><LoaderCircle size={16} className="animate-spin" /> Calculating demand from recent sales...</div>}
      {error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {!loading && !error && forecast && <>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3"><div className="flex h-36 flex-col justify-between rounded-xl bg-primary p-5 text-on-primary"><span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Recommended Prep Tomorrow</span><strong className="font-headline text-4xl">{tomorrowTotal}</strong><span className="flex items-center gap-2 text-xs opacity-70"><CalendarClock size={13} /> {items[0] ? dateLabel(items[0].tomorrow.date) : "Tomorrow"}</span></div><div className="flex h-36 flex-col justify-between rounded-xl bg-surface-container-lowest p-5"><span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Expected Next 7 Days</span><strong className="font-headline text-4xl text-primary">{nextWeekTotal}</strong><span className="flex items-center gap-2 text-xs text-secondary"><TrendingUp size={13} /> Across {items.length} menu items</span></div><div className="flex h-36 flex-col justify-between rounded-xl bg-surface-container-lowest p-5"><span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Forecast Method</span><strong className="font-headline text-xl text-primary">Weekday trend</strong><span className="flex items-center gap-2 text-xs text-secondary"><Info size={13} /> Expected + recommended quantity</span></div></section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-5"><div className="rounded-xl bg-surface-container-lowest p-5 lg:col-span-3"><div className="mb-5"><h2 className="font-headline text-lg">Tomorrow’s Preparation List</h2><p className="mt-0.5 text-[11px] text-secondary">Expected demand and recommended kitchen preparation</p></div><div className="space-y-4">{topItems.map((item) => <div key={item.menuItemId}><div className="mb-1.5 flex items-center justify-between gap-4 text-sm"><span className="font-semibold">{item.name}</span><span className="shrink-0 text-right"><strong className="block text-primary">Prepare {item.tomorrow.recommendedQuantity}</strong><small className="text-secondary">Expected {item.tomorrow.expectedQuantity.toFixed(1)}</small></span></div><div className="flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-highest"><div className="h-full rounded-full bg-primary" style={{ width: `${topItems[0]?.tomorrow.recommendedQuantity ? item.tomorrow.recommendedQuantity / topItems[0].tomorrow.recommendedQuantity * 100 : 0}%` }} /></div><span className={`w-24 rounded-full px-2 py-1 text-center text-[10px] font-bold ${statusClass(item.tomorrow.status)}`}>{statusLabel(item.tomorrow.status)} · {item.tomorrow.confidence}%</span></div></div>)}{topItems.length === 0 && <p className="text-sm text-secondary">No active menu items found.</p>}</div></div><div className="rounded-xl bg-surface-container-low p-5 lg:col-span-2"><div className="mb-5 flex items-start justify-between"><div><h2 className="font-headline text-lg">Top Categories</h2><p className="mt-0.5 text-[11px] text-secondary">Tomorrow’s recommended preparation</p></div><ChefHat size={18} className="text-tertiary" /></div><div className="space-y-3">{Object.entries(items.reduce<Record<string, number>>((groups, item) => { groups[item.category] = (groups[item.category] ?? 0) + item.tomorrow.recommendedQuantity; return groups; }, {})).sort(([, left], [, right]) => right - left).slice(0, 5).map(([category, quantity]) => <div key={category} className="flex items-center justify-between border-b border-outline-variant/10 py-2 text-sm"><span>{category}</span><strong className="text-primary">{quantity} units</strong></div>)}</div></div></section>

        <section className="overflow-hidden rounded-xl bg-surface-container-lowest"><div className="flex items-center justify-between border-b border-outline-variant/10 p-5"><div><h2 className="font-headline text-lg">Seven-Day Forecast</h2><p className="mt-0.5 text-[11px] text-secondary">Expected demand versus recommended preparation</p></div><span className="text-[10px] uppercase tracking-widest text-secondary">History: {forecast.history.fromDate} – {forecast.history.toDate}</span></div><div className="overflow-x-auto"><table className="w-full min-w-190 text-left text-sm"><thead className="bg-surface-container-low text-[10px] uppercase tracking-widest text-secondary"><tr><th className="px-5 py-3">Menu item</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Expected tomorrow</th><th className="px-5 py-3">Prepare tomorrow</th><th className="px-5 py-3">7-day expected</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{items.slice(0, 20).map((item) => <tr key={item.menuItemId} className="border-t border-outline-variant/10"><td className="px-5 py-3 font-semibold">{item.name}</td><td className="px-5 py-3 text-secondary">{item.category}</td><td className="px-5 py-3 text-primary">{item.tomorrow.expectedQuantity.toFixed(1)}</td><td className="px-5 py-3 font-bold text-primary">{item.tomorrow.recommendedQuantity}</td><td className="px-5 py-3">{item.next7Days.expectedQuantity.toFixed(1)}</td><td className="px-5 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusClass(item.tomorrow.status)}`}>{statusLabel(item.tomorrow.status)} · {item.tomorrow.confidence}%</span></td></tr>)}</tbody></table></div></section>
      </>}
    </main></div>;
}
