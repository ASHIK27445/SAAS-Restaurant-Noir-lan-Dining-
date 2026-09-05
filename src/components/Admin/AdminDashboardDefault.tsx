import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  DollarSign,
  PackageOpen,
  RefreshCw,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { Link } from "react-router";
import { getOrders } from "../../api/order";
import type { Order } from "../../types/order";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function localDay(offset = 0) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-primary/10 text-primary",
  CANCELLED: "bg-error/10 text-error",
  PREPARING: "bg-tertiary/10 text-tertiary",
  SERVED: "bg-secondary/10 text-secondary",
  OUT_FOR_DELIVERY: "bg-tertiary/10 text-tertiary",
  RECEIVED: "bg-primary/10 text-primary",
};

export default function AdminDashboardDefault() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      setOrders((await getOrders()).data);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  const todayKey = dateKey(localDay());
  const todayOrders = orders.filter(
    (order) => dateKey(new Date(order.createdAt)) === todayKey,
  );
  const yesterdayKey = dateKey(localDay(-1));
  const yesterdayOrders = orders.filter(
    (order) => dateKey(new Date(order.createdAt)) === yesterdayKey,
  );
  const revenue = (items: Order[]) =>
    items
      .filter((order) => order.status !== "CANCELLED")
      .reduce((sum, order) => sum + Number(order.total), 0);
  const todayRevenue = revenue(todayOrders);
  const yesterdayRevenue = revenue(yesterdayOrders);
  const revenueChange = yesterdayRevenue
    ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
    : null;

  const week = useMemo(() => {
    const values = Array.from({ length: 7 }, (_, index) => {
      const date = localDay(index - 6);
      const dayOrders = orders.filter(
        (order) => dateKey(new Date(order.createdAt)) === dateKey(date),
      );
      return {
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        value: revenue(dayOrders),
      };
    });
    const max = Math.max(...values.map((item) => item.value), 1);
    return values.map((item) => ({
      ...item,
      height: Math.max((item.value / max) * 100, item.value ? 10 : 2),
    }));
  }, [orders]);

  const pipeline = [
    {
      label: "Preparing",
      count: orders.filter((order) => order.status === "PREPARING").length,
      icon: Clock3,
    },
    {
      label: "Served",
      count: orders.filter((order) => order.status === "SERVED").length,
      icon: UtensilsCrossed,
    },
    {
      label: "Delivery",
      count: orders.filter((order) =>
        ["OUT_FOR_DELIVERY", "RECEIVED"].includes(order.status),
      ).length,
      icon: Truck,
    },
    {
      label: "Completed",
      count: orders.filter((order) => order.status === "COMPLETED").length,
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="min-h-full space-y-6 p-5 md:p-8">
      <header className="flex flex-col justify-between gap-4 border-b border-outline-variant/20 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">
            Operations overview
          </p>
          <h1 className="mt-1 font-headline text-3xl text-primary">
            Good morning, Admin
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            A live view of today&apos;s restaurant performance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadDashboard()}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-xs font-semibold text-primary hover:bg-surface-container-low"
        >
          <RefreshCw size={14} /> Refresh data
        </button>
      </header>

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Today's revenue"
          value={money(todayRevenue)}
          detail={
            revenueChange === null
              ? "No comparison yet"
              : `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}% vs yesterday`
          }
          icon={DollarSign}
          positive={revenueChange === null || revenueChange >= 0}
        />
        <Metric
          label="Today's orders"
          value={todayOrders.length}
          detail={`${orders.length} total records`}
          icon={PackageOpen}
          positive
        />
        <Metric
          label="Average ticket"
          value={money(
            todayOrders.length ? todayRevenue / todayOrders.length : 0,
          )}
          detail="Based on today's orders"
          icon={Activity}
          positive
        />
        <Metric
          label="Completion rate"
          value={`${todayOrders.length ? Math.round((todayOrders.filter((order) => order.status === "COMPLETED").length / todayOrders.length) * 100) : 0}%`}
          detail="Completed today"
          icon={CheckCircle2}
          positive
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
                Revenue performance
              </p>
              <h2 className="mt-1 font-headline text-xl text-primary">
                Last 7 days
              </h2>
            </div>
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Full report <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-[2.5rem_1fr] gap-3">
            <div className="flex h-48 flex-col justify-between text-right text-[10px] text-secondary">
              {[100, 50, 0].map((percent) => (
                <span key={percent}>
                  {money(
                    Math.round(
                      (Math.max(...week.map((item) => item.value), 1) *
                        percent) /
                        100,
                    ),
                  )}
                </span>
              ))}
            </div>
            <div className="relative h-48 border-b border-outline-variant/30">
              <div className="absolute inset-0 flex flex-col justify-between">
                <span className="border-t border-dashed border-outline-variant/20" />
                <span className="border-t border-dashed border-outline-variant/20" />
                <span className="border-t border-dashed border-outline-variant/20" />
              </div>
              <div className="relative z-10 flex h-full items-end gap-3">
                {week.map((item) => (
                  <div
                    key={item.label}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="relative h-full w-full max-w-12 rounded-t-md bg-primary/5">
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-t-md bg-primary transition-all"
                        style={{ height: `${item.height}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-secondary">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
                Live pipeline
              </p>
              <h2 className="mt-1 font-headline text-xl text-primary">
                Order status
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />{" "}
              Live
            </span>
          </div>
          <div className="mt-5 space-y-2">
            {pipeline.map(({ label, count, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-3"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                  <Icon size={16} className="text-primary" />
                  {label}
                </span>
                <span className="font-headline text-xl text-primary">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/15 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
              Latest activity
            </p>
            <h2 className="mt-1 font-headline text-xl text-primary">
              Recent orders
            </h2>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View all orders
          </Link>
        </div>
        {loading ? (
          <p className="p-8 text-sm text-secondary">Loading live activity...</p>
        ) : orders.length === 0 ? (
          <p className="p-8 text-sm text-secondary">No order activity yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-170 text-left text-sm">
              <thead className="bg-surface-container-low text-[10px] uppercase tracking-widest text-secondary">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {orders.slice(0, 6).map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container-low/50"
                  >
                    <td className="px-5 py-3.5 font-semibold text-primary">
                      {order.orderNumberDisplay}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-variant">
                      {order.customerName || "Guest"}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-on-surface-variant">
                      {order.orderType.replaceAll("_", " ")}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${statusStyles[order.status] || "bg-surface-container text-secondary"}`}
                      >
                        {order.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-headline text-primary">
                      {money(Number(order.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
  positive,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof DollarSign;
  positive: boolean;
}) {
  return (
    <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">
          {label}
        </p>
        <span className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-4 font-headline text-2xl text-primary">{value}</p>
      <p
        className={`mt-1 text-[11px] ${positive ? "text-primary" : "text-error"}`}
      >
        {detail}
      </p>
    </div>
  );
}
