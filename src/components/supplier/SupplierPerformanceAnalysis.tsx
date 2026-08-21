import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Download,
  Loader2,
  Package,
  RefreshCw,
  Star,
  Truck,
} from "lucide-react";
import { getInventory, getPurchaseOrders, getSupplierDirectory } from "../../api/inventory";
import type { InventoryItem, PurchaseOrder, SupplierDirectoryEntry } from "../../types/inventory";

const currency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const dateFormat = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No deliveries yet";

function buildMonthlySpend(orders: PurchaseOrder[], months: number) {
  const now = new Date();
  const buckets = Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - index - 1), 1);
    return { key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleDateString("en-US", { month: "short" }), value: 0 };
  });
  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));
  orders.filter((order) => order.status === "RECEIVED").forEach((order) => {
    const date = new Date(order.issuedDate);
    const bucket = bucketMap.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (bucket) bucket.value += Number(order.totalAmount);
  });
  const max = Math.max(1, ...buckets.map((bucket) => bucket.value));
  return buckets.map((bucket) => ({ ...bucket, height: bucket.value ? Math.max(8, (bucket.value / max) * 100) : 3 }));
}

function downloadReport(rows: Array<Record<string, string | number>>) {
  const headers = Object.keys(rows[0] ?? {});
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "supplier-performance-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function SupplierPerformanceAnalysis() {
  const [suppliers, setSuppliers] = useState<SupplierDirectoryEntry[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [ingredients, setIngredients] = useState<InventoryItem[]>([]);
  const [supplierId, setSupplierId] = useState("all");
  const [months, setMonths] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [supplierResponse, orderResponse, inventoryResponse] = await Promise.all([
        getSupplierDirectory(),
        getPurchaseOrders(),
        getInventory({ pageSize: 100 }),
      ]);
      setSuppliers(supplierResponse.data);
      setOrders(orderResponse.data);
      setIngredients(inventoryResponse.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load supplier analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const selectedSupplier = suppliers.find((supplier) => supplier.id === supplierId);
  const scopedOrders = useMemo(() => supplierId === "all" ? orders : orders.filter((order) => order.supplierId === supplierId), [orders, supplierId]);
  const scopedIngredients = useMemo(() => supplierId === "all" ? ingredients : ingredients.filter((item) => item.supplierId === supplierId), [ingredients, supplierId]);
  const receivedOrders = scopedOrders.filter((order) => order.status === "RECEIVED");
  const spend = receivedOrders.reduce((total, order) => total + Number(order.totalAmount), 0);
  const fulfillment = scopedOrders.length ? (receivedOrders.length / scopedOrders.length) * 100 : null;
  const ratedOrders = receivedOrders.filter((order) => order.rating !== null);
  const rating = ratedOrders.length > 0
    ? ratedOrders.reduce((total, order) => total + (order.rating ?? 0), 0) / ratedOrders.length
    : selectedSupplier?.rating ?? null;
  const trackedDeliveryOrders = receivedOrders.filter((order) => order.expectedDate && order.deliveredDate);
  const onTimeOrders = trackedDeliveryOrders.filter(
    (order) => new Date(order.deliveredDate!).getTime() <= new Date(order.expectedDate!).getTime()
  );
  const reliability = trackedDeliveryOrders.length ? (onTimeOrders.length / trackedDeliveryOrders.length) * 100 : null;
  const qualityTotals = receivedOrders.reduce(
    (totals, order) => {
      order.items.forEach((item) => {
        if (item.receivedQuantity !== null) {
          totals.ordered += Number(item.quantity);
          totals.received += Number(item.receivedQuantity);
        }
      });
      return totals;
    },
    { ordered: 0, received: 0 }
  );
  const qualityAcceptance = qualityTotals.ordered > 0
    ? (qualityTotals.received / qualityTotals.ordered) * 100
    : null;
  const monthlySpend = useMemo(() => buildMonthlySpend(scopedOrders, months), [scopedOrders, months]);
  const maxMonthlySpend = Math.max(1, ...monthlySpend.map((month) => month.value));
  const latestDelivery = selectedSupplier?.lastDelivery ?? [...receivedOrders]
    .filter((order) => order.deliveredDate)
    .sort((a, b) => new Date(b.deliveredDate!).getTime() - new Date(a.deliveredDate!).getTime())[0]?.deliveredDate ?? null;
  const reportRows = suppliers.map((supplier) => ({
    supplier: supplier.name,
    category: supplier.category,
    status: supplier.status,
    receivedSpend: supplier.totalSpend,
    rating: supplier.rating ?? "No data",
    reliabilityScore: supplier.reliabilityScore ?? "No data",
    qualityAcceptance: supplier.qualityAcceptance ?? "No data",
    lastDelivery: supplier.lastDelivery ?? "",
  }));

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface text-primary"><Loader2 className="animate-spin" size={32} /></div>;
  if (error) return <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface text-on-surface"><AlertCircle className="text-error" size={36} /><p className="text-on-surface-variant">{error}</p><button onClick={loadData} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary"><RefreshCw size={16} /> Try again</button></div>;

  const metrics = [
    { label: "Received spend", value: currency(spend), note: `${receivedOrders.length} received orders`, icon: CircleDollarSign, tone: "text-primary bg-primary-fixed" },
    { label: "Order fulfillment", value: fulfillment === null ? "No data" : `${fulfillment.toFixed(1)}%`, note: `${receivedOrders.length} of ${scopedOrders.length} orders received`, icon: CheckCircle2, tone: "text-primary bg-primary-fixed" },
    { label: "Reliability score", value: reliability === null ? "No data" : `${reliability.toFixed(1)}%`, note: trackedDeliveryOrders.length ? `${onTimeOrders.length} of ${trackedDeliveryOrders.length} tracked deliveries on time` : "Needs expected and delivered dates", icon: Truck, tone: "text-primary bg-primary-fixed" },
    { label: "Quality acceptance", value: qualityAcceptance === null ? "No data" : `${qualityAcceptance.toFixed(1)}%`, note: qualityTotals.ordered > 0 ? `${qualityTotals.received} of ${qualityTotals.ordered} units received` : "No received quantities recorded", icon: Package, tone: "text-primary bg-primary-fixed" },
    { label: "Supplier rating", value: rating === null ? "No rating" : `${rating.toFixed(1)} / 5`, note: ratedOrders.length ? `Average of ${ratedOrders.length} rated received orders` : selectedSupplier?.rating ? "Profile rating; no order ratings yet" : "No rating has been recorded", icon: Star, tone: "text-tertiary bg-tertiary-fixed" },
    { label: "Last delivery", value: dateFormat(latestDelivery), note: selectedSupplier ? "Selected supplier" : "Across the supplier network", icon: Truck, tone: "text-primary bg-primary-fixed" },
  ];

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface font-body">
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
        <header className="mb-10 flex flex-col gap-6 border-b border-outline-variant/25 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Procurement intelligence</p><h1 className="font-headline text-4xl tracking-tight md:text-5xl">Supplier performance</h1><p className="mt-3 max-w-xl text-on-surface-variant">A live view of purchasing reliability, spend, and the ingredients currently tied to each supplier.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row"><label className="relative min-w-56"><span className="sr-only">Supplier scope</span><select value={supplierId} onChange={(event) => setSupplierId(event.target.value)} className="w-full appearance-none rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 pr-10 text-sm font-medium outline-none focus:border-primary"><option value="all">All suppliers</option>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={17} /></label><button onClick={() => downloadReport(reportRows)} disabled={!reportRows.length} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"><Download size={16} /> Export CSV</button></div>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{metrics.map((metric) => <article key={metric.label} className="rounded-xl bg-surface-container-lowest p-5 shadow-[0_10px_30px_rgba(27,28,26,0.04)]"><div className="mb-7 flex items-start justify-between"><p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{metric.label}</p><metric.icon className={`rounded-lg p-2 ${metric.tone}`} size={34} /></div><p className="font-headline text-2xl">{metric.value}</p><p className="mt-1 text-xs text-on-surface-variant">{metric.note}</p></article>)}</section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <article className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(27,28,26,0.04)] lg:col-span-3"><div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><BarChart3 size={18} className="text-primary" /><h2 className="font-headline text-2xl">Received spend</h2></div><p className="mt-1 text-sm text-on-surface-variant">Issued month, based on received purchase orders</p></div><div className="flex rounded-lg bg-surface-container-low p-1 text-xs font-medium"><button onClick={() => setMonths(6)} className={`rounded-md px-3 py-2 ${months === 6 ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"}`}>6 months</button><button onClick={() => setMonths(12)} className={`rounded-md px-3 py-2 ${months === 12 ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"}`}>12 months</button></div></div>{receivedOrders.length === 0 ? <div className="flex h-64 flex-col items-center justify-center text-center text-sm text-on-surface-variant"><BarChart3 size={28} className="mb-3 text-outline" /><p>No received orders in this scope.</p><p className="mt-1 text-xs">Spend appears here after a purchase order is marked received.</p></div> : <div className="flex h-64 items-end gap-2 border-b border-outline-variant/20 pb-8 sm:gap-4">{monthlySpend.map((month) => <div key={month.key} className="group relative flex h-full flex-1 flex-col items-center justify-end"><div className="absolute -top-7 text-xs font-medium text-on-surface opacity-0 transition-opacity group-hover:opacity-100">{currency(month.value)}</div><div className="w-full max-w-12 rounded-t-md bg-primary transition-all group-hover:bg-inverse-primary" style={{ height: `${month.height}%` }} /><span className="absolute -bottom-6 text-xs text-on-surface-variant">{month.label}</span></div>)}</div>}<div className="mt-7 flex items-center justify-between text-xs text-on-surface-variant"><span>Peak month: {monthlySpend.reduce((peak, month) => month.value > peak.value ? month : peak, monthlySpend[0])?.label ?? "—"}</span><span>{currency(maxMonthlySpend)} highest month</span></div></article>
          <article className="rounded-xl bg-primary p-6 text-on-primary shadow-[0_10px_30px_rgba(27,28,26,0.08)] lg:col-span-2"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider opacity-75">Data coverage</p><h2 className="mt-2 font-headline text-2xl">What the data says</h2></div><CalendarDays size={22} className="opacity-80" /></div><div className="mt-8 space-y-5"><div className="flex items-start gap-3 border-b border-on-primary/15 pb-5"><CheckCircle2 size={18} className="mt-0.5 shrink-0" /><p className="text-sm leading-6">Fulfillment uses real purchase orders marked <strong>Received</strong>.</p></div><div className="flex items-start gap-3 border-b border-on-primary/15 pb-5"><Package size={18} className="mt-0.5 shrink-0" /><p className="text-sm leading-6">Quality acceptance compares ordered quantities with the quantities actually received.</p></div><div className="flex items-start gap-3"><CalendarDays size={18} className="mt-0.5 shrink-0" /><p className="text-sm leading-6">Reliability compares delivered dates with expected dates. Orders without both dates are excluded.</p></div></div></article>
        </section>

        <section className="mt-6 rounded-xl bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(27,28,26,0.04)]"><div className="mb-6 flex items-end justify-between gap-4"><div><div className="flex items-center gap-2"><Package size={18} className="text-primary" /><h2 className="font-headline text-2xl">Supplied ingredients</h2></div><p className="mt-1 text-sm text-on-surface-variant">Inventory currently assigned to {selectedSupplier?.name ?? "the supplier network"}</p></div><span className="text-sm font-medium text-on-surface-variant">{scopedIngredients.length} items</span></div>{scopedIngredients.length === 0 ? <div className="rounded-lg bg-surface-container-low px-4 py-10 text-center text-sm text-on-surface-variant">No inventory items are assigned to this supplier yet.</div> : <div className="overflow-x-auto"><table className="w-full min-w-130 text-left text-sm"><thead><tr className="border-b border-outline-variant/20 text-xs uppercase tracking-wider text-on-surface-variant"><th className="pb-3 font-semibold">Ingredient</th><th className="pb-3 font-semibold">Category</th><th className="pb-3 font-semibold">Stock</th><th className="pb-3 text-right font-semibold">Unit cost</th></tr></thead><tbody>{scopedIngredients.slice(0, 8).map((item) => <tr key={item.id} className="border-b border-outline-variant/10 last:border-0"><td className="py-4 font-medium">{item.name}<span className="ml-2 text-xs text-on-surface-variant">{item.sku}</span></td><td className="py-4 text-on-surface-variant">{item.category}</td><td className="py-4">{item.currentStock} {item.unit}</td><td className="py-4 text-right">{currency(Number(item.costPerUnit))}</td></tr>)}</tbody></table></div>}</section>
      </main>
    </div>
  );
}
