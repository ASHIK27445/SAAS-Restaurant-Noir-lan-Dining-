import { AlertCircle, ArrowRight, Ban, CheckCircle2, ChefHat, Clock3, Eye, MapPin, Printer, ReceiptText, Truck, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { completeDineInWithPayment, getOrders, updateOrderStatus } from "../../api/order";
import type { Order } from "../../types/order";
import ReceiptPreview from "./ReceiptPreview";
import type { ReceiptOrder } from "./ReceiptPreview";

type Filter = "ALL" | "PREPARING" | "SERVED" | "OUT_FOR_DELIVERY" | "RECEIVED" | "COMPLETED" | "CANCELLED";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "All orders" },
  { key: "PREPARING", label: "Preparing" },
  { key: "SERVED", label: "Ready to serve" },
  { key: "OUT_FOR_DELIVERY", label: "Delivering" },
  { key: "RECEIVED", label: "Received" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

function money(value: string) { return Number(value).toFixed(2); }

function prepState(order: Order) {
  if (order.status !== "PREPARING") return null;
  const units = order.items.flatMap((item) => item.units ?? []);
  if (units.length > 0 && units.every((unit) => unit.prepCompletedAt)) return "Preparation done, ready for serve";
  if (units.some((unit) => unit.prepStartedAt)) return "Preparing";
  return "Waiting for preparation";
}

function statusStyle(order: Order) {
  if (order.status === "COMPLETED") return "bg-primary/10 text-primary";
  if (order.status === "CANCELLED") return "bg-error/10 text-error";
  if (order.status === "OUT_FOR_DELIVERY") return "bg-tertiary/10 text-tertiary";
  return "bg-surface-container text-on-surface-variant";
}

function statusSpine(order: Order) {
  if (order.status === "COMPLETED") return "border-primary";
  if (order.status === "CANCELLED") return "border-error";
  if (order.status === "OUT_FOR_DELIVERY") return "border-tertiary";
  return "border-outline-variant/40";
}

function toReceipt(order: Order): ReceiptOrder {
  return {
    orderNumber: order.orderNumber,
    orderType: order.orderType,
    serverName: order.serverName,
    tableNo: order.tableNo,
    customerName: order.customerName,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    tax: order.tax,
    serviceCharge: order.serviceCharge,
    total: order.total,
    items: order.items.map((item) => ({ quantity: item.quantity, unitPrice: item.unitPrice, note: item.note, menuItem: item.menuItem ? { name: item.menuItem.name } : undefined })),
  };
}

export default function OrderPos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptOrder | null>(null);

  function getLocalDate(offsetDays = 0) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().slice(0, 10);
  }

  async function loadOrders() {
    try {
      const [today, previousDay] = await Promise.all([
        getOrders({ date: getLocalDate() }),
        getOrders({ date: getLocalDate(-1) }),
      ]);
      setOrders([...today.data, ...previousDay.data]);
    } finally { setLoading(false); }
  }

  async function changeStatus(order: Order, status: Order["status"]) {
    try {
      if (status === "COMPLETED" && order.orderType === "DINE_IN") await completeDineInWithPayment(order.id, "cash");
      else await updateOrderStatus(order.id, status);
      await loadOrders();
    } catch (error: any) {
      window.alert(error.message || "Could not update order status");
    }
  }

  useEffect(() => {
    loadOrders();
    const timer = window.setInterval(loadOrders, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const filtered = useMemo(() => orders.filter((order) => filter === "ALL" || order.status === filter), [orders, filter]);

  function printOrder(order: Order) {
    setSelectedReceipt(toReceipt(order));
    window.setTimeout(() => window.print(), 100);
  }

  const activeCount = orders.filter((order) => order.status !== "COMPLETED" && order.status !== "CANCELLED").length;
  const prepCount = orders.filter((order) => order.status === "PREPARING").length;

  return (
    <div className="min-h-screen bg-surface px-5 py-6 text-on-surface sm:px-8 sm:py-8">
      <header className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">POS operations</p>
            <h1 className="mt-1 font-headline text-3xl text-primary">Order Center</h1>
            <p className="mt-1 text-sm text-on-surface-variant">Live order tracking, preparation status, and receipts.</p>
          </div>
          <p className="text-xs font-semibold text-secondary">Today + previous day</p>
        </div>

        <div className="mt-5 flex w-max max-w-full gap-2 overflow-x-auto">
          <Stat label="Total orders" value={orders.length} icon={ReceiptText} />
          <Stat label="Active orders" value={activeCount} icon={Clock3} />
          <Stat label="In preparation" value={prepCount} icon={ChefHat} />
        </div>

        <div className="custom-scrollbar mt-4 flex w-max max-w-full gap-1 overflow-x-auto border-b border-outline-variant/20 pb-1">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
                filter === item.key ? "bg-primary text-on-primary" : "text-secondary hover:bg-surface-container-low hover:text-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-7xl">
        {loading ? (
          <p className="py-12 text-center text-sm text-on-surface-variant font-headline italic">Loading orders…</p>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-on-surface-variant">No orders match this filter.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            {filtered.map((order) => <OrderCard key={order.id} order={order} onPrint={() => printOrder(order)} onStatusChange={changeStatus} />)}
          </div>
        )}
      </main>

      {selectedReceipt && <div className="printable-receipt"><ReceiptPreview order={selectedReceipt} /></div>}
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof ChefHat }) {
  return <div className="flex shrink-0 items-center gap-2 rounded-xl bg-surface-container-lowest px-3 py-2 shadow-sm ring-1 ring-outline-variant/10"><Icon size={15} className="text-primary" /><span className="text-[10px] font-bold uppercase tracking-wider text-secondary">{label}</span><span className="font-headline text-lg text-primary">{value}</span></div>;
}

function OrderCard({ order, onPrint, onStatusChange }: { order: Order; onPrint: () => void; onStatusChange: (order: Order, status: Order["status"]) => void }) {
  const preparation = prepState(order);
  const isReady = preparation?.startsWith("Preparation done") ?? false;
  const DetailIcon = order.orderType === "DELIVERY" ? MapPin : order.orderType === "DINE_IN" ? UserRound : Truck;
  const detail = order.orderType === "DELIVERY" ? order.deliveryAddress ?? "Delivery order" : order.orderType === "DINE_IN" ? `${order.tableNo ? `Table ${order.tableNo}` : "Dine-in"}${order.guestCount ? ` · ${order.guestCount} guests` : ""}` : "Takeaway order";
  const typeTint = order.orderType === "DELIVERY" ? "bg-secondary/10 text-secondary" : order.orderType === "DINE_IN" ? "bg-primary/10 text-primary" : "bg-tertiary/10 text-tertiary";

  const nextAction = order.status === "PREPARING"
    ? order.orderType === "DINE_IN" ? { label: isReady ? "Ready to serve" : "Waiting for kitchen", status: isReady ? "SERVED" as const : null }
      : order.orderType === "TAKEAWAY" ? { label: "Complete pickup", status: "COMPLETED" as const }
      : { label: "Out for delivery", status: "OUT_FOR_DELIVERY" as const }
    : order.status === "SERVED" ? { label: "Complete & paid", status: "COMPLETED" as const }
      : order.status === "OUT_FOR_DELIVERY" ? { label: "Mark received", status: "RECEIVED" as const }
        : order.status === "RECEIVED" ? { label: "Complete", status: "COMPLETED" as const }
          : null;

  return (
    <article className={`flex min-h-62 flex-col rounded-2xl bg-surface-container-lowest pl-4 pr-4 py-4 shadow-[0_1px_5px_rgba(23,49,36,0.08)] ring-1 ring-outline-variant/10 border-l-[3px] ${statusSpine(order)} transition-transform hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-tertiary">{order.orderNumberDisplay}</p>
          <h2 className="mt-1 font-headline text-xl text-primary">{order.customerName ?? order.orderType.replace("_", " ")}</h2>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase ${statusStyle(order)}`}>{order.status.replaceAll("_", " ")}</span>
      </div>

      <div className="mt-4 space-y-2 text-xs text-on-surface-variant">
        <p className="flex items-center gap-2"><Clock3 size={14} className="text-on-surface-variant/60" /> {new Date(order.createdAt).toLocaleString()}</p>
        <p className="flex items-center gap-2">
          <span className={`inline-flex h-5 w-5 items-center justify-center rounded-md ${typeTint}`}><DetailIcon size={12} /></span>
          <span className="truncate">{detail}</span>
        </p>
        {order.serverName && <p className="flex items-center gap-2"><UserRound size={14} className="text-on-surface-variant/60" /> Server: {order.serverName}</p>}
      </div>

      {preparation && (
        <div className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold ${isReady ? "bg-primary/10 text-primary" : "bg-surface-container-low text-on-surface-variant"}`}>
          {isReady ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />} <span className="line-clamp-2">{preparation}</span>
        </div>
      )}

      <div className="mt-auto pt-4">
        <div className="flex items-end justify-between border-t border-dashed border-outline-variant/20 pt-3">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-secondary">Total</p>
            <p className="font-headline text-lg text-primary">${money(order.total)}</p>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={onPrint} className="inline-flex items-center rounded-xl p-2 text-primary hover:bg-surface-container" title="Print receipt"><Printer size={16} /></button>
            <Link to={`/pos-koh/orders/${order.id}`} className="inline-flex items-center gap-1 rounded-xl bg-surface-container px-2.5 py-2 text-[10px] font-semibold text-primary"><Eye size={13} /> Details</Link>
          </div>
        </div>
        {nextAction?.status && (
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => onStatusChange(order, nextAction.status!)} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary px-2 py-2 text-[10px] font-bold text-on-primary hover:opacity-90">
              <ArrowRight size={13} /> {nextAction.label}
            </button>
            {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
              <button type="button" onClick={() => onStatusChange(order, "CANCELLED")} className="inline-flex items-center justify-center rounded-xl border border-error/30 px-2.5 py-2 text-error hover:bg-error/10" title="Cancel order"><Ban size={14} /></button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}