import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Printer,
  Search,
  TrendingUp,
} from "lucide-react";
import { getOrders } from "../../api/order";
import type { Order } from "../../types/order";
import ReceiptPreview from "./ReceiptPreview";
import type { ReceiptOrder } from "./ReceiptPreview";

type PayType = "Card" | "Cash" | "Mobile" | "Unpaid";

type InvoiceRow = {
  id: string;
  inv: string;
  ord: string;
  date: string;
  amount: number;
  type: PayType;
  customerName: string | null;
  orderStatus: string;
  createdAt: string;
};

const TYPE_STYLE: Record<PayType, { pill: string; text: string }> = {
  Card: { pill: "bg-primary/5", text: "text-primary" },
  Cash: { pill: "bg-secondary/10", text: "text-secondary" },
  Mobile: { pill: "bg-tertiary-container/10", text: "text-tertiary-container" },
  Unpaid: { pill: "bg-error/10", text: "text-error" },
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

const normalizePaymentType = (value: string | null | undefined): PayType => {
  const normalized = (value ?? "").toLowerCase();

  if (!normalized) return "Unpaid";
  if (normalized.includes("card") || normalized.includes("visa") || normalized.includes("mastercard")) return "Card";
  if (normalized.includes("cash")) return "Cash";
  if (normalized.includes("mobile") || normalized.includes("bkash") || normalized.includes("ssl") || normalized.includes("wallet")) return "Mobile";

  return "Card";
};

const getMonthLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);

const getRangeStart = () => {
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  return now.toISOString().slice(0, 10);
};

const getToday = () => new Date().toISOString().slice(0, 10);

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

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
    items: order.items.map((item) => ({
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      note: item.note,
      menuItem: item.menuItem ? { name: item.menuItem.name } : undefined,
    })),
  };
}

export default function InvoiceHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [payType, setPayType] = useState<"ALL" | PayType>("ALL");
  const [fromDate, setFromDate] = useState(getRangeStart());
  const [toDate, setToDate] = useState(getToday());
  const [activePage, setActivePage] = useState(1);
  const [refreshToken, setRefreshToken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptOrder | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getOrders()
      .then((response) => setOrders(response.data))
      .catch((reason: any) => {
        setError(reason?.message || "Failed to load invoice history.");
      })
      .finally(() => setLoading(false));
  }, [refreshToken]);

  const invoiceRows = useMemo<InvoiceRow[]>(() => {
    return orders
      .map((order) => ({
        id: order.id,
        inv: `#INV-${String(order.orderNumber).padStart(5, "0")}`,
        ord: `ORD-${String(order.orderNumber).padStart(4, "0")}`,
        date: new Date(order.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        amount: Number(order.total),
        type: normalizePaymentType(order.paymentMethod),
        customerName: order.customerName,
        orderStatus: order.status,
        createdAt: order.createdAt,
      }))
      .filter((row) => {
        const text = `${row.inv} ${row.ord} ${row.customerName ?? ""}`.toLowerCase();
        const matchesSearch = text.includes(search.toLowerCase());
        const matchesType = payType === "ALL" || row.type === payType;
          const orderDate = row.createdAt.slice(0, 10);
          const matchesDate = orderDate >= fromDate && orderDate <= toDate;
          return matchesSearch && matchesType && matchesDate;
      });
        }, [orders, search, payType, fromDate, toDate]);

  useEffect(() => {
    setActivePage(1);
  }, [search, payType, fromDate, toDate]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(invoiceRows.length / pageSize));
  const visibleRows = invoiceRows.slice((activePage - 1) * pageSize, activePage * pageSize);

  const totalRevenue = invoiceRows.reduce((sum, row) => sum + row.amount, 0);
  const paidOrders = invoiceRows.filter((row) => row.type !== "Unpaid").length;
  const avgTicket = invoiceRows.length ? totalRevenue / invoiceRows.length : 0;

  const monthlyPerformance = useMemo(() => {
    const monthMap = new Map<string, number>();

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = getMonthKey(date);
      monthMap.set(key, (monthMap.get(key) ?? 0) + Number(order.total));
    });

    const now = new Date();
    const series = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const key = getMonthKey(date);
      return {
        label: getMonthLabel(date),
        value: monthMap.get(key) ?? 0,
      };
    });

    const maxValue = Math.max(...series.map((item) => item.value), 1);
    return series.map((item) => ({ ...item, height: (item.value / maxValue) * 100 }));
  }, [orders]);

  const currentMonthPerformance = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const selectedOrders = orders.filter((order) => {
      const date = new Date(order.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    const total = selectedOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const previousMonth = new Date(currentYear, currentMonth - 1, 1);
    const previousTotal = orders
      .filter((order) => {
        const date = new Date(order.createdAt);
        return date.getFullYear() === previousMonth.getFullYear() && date.getMonth() === previousMonth.getMonth();
      })
      .reduce((sum, order) => sum + Number(order.total), 0);
    const change = previousTotal ? ((total - previousTotal) / previousTotal) * 100 : null;

    return { label: getMonthLabel(now), total, count: selectedOrders.length, change };
  }, [orders]);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const exportCsv = () => {
    const rows = [
      ["Invoice", "Order ID", "Date & Time", "Amount", "Payment Type", "Status"],
      ...invoiceRows.map((row) => [
        row.inv,
        row.ord,
        row.date,
        row.amount.toFixed(2),
        row.type,
        row.orderStatus,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <main className="grow flex flex-col min-w-0">
        <header className="bg-surface/70 backdrop-blur-xl flex justify-between items-center w-full px-6 sticky top-0 h-14 z-40 border-b border-outline-variant/10">
          <h2 className="font-headline text-2xl text-primary font-bold tracking-tight">
            Invoice History
          </h2>
          <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                className="bg-surface-container-low border-none rounded-xl pl-9 pr-4 py-1.5 text-xs uppercase tracking-widest focus:ring-1 focus:ring-primary/20 w-52 transition-all outline-none"
                placeholder="SEARCH INVOICES..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
          </div>
        </header>

        <section className="p-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-headline text-primary mb-1 tracking-wide">
                Archive
              </h2>
              <p className="text-sm text-on-surface-variant italic">
                Real transaction records from the restaurant system.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-widest font-bold text-secondary px-1">
                  Date Range
                </label>
                <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-xl gap-2">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    className="bg-transparent text-[11px] font-medium text-primary outline-none"
                  />
                  <ArrowRight size={11} className="text-outline" />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                    className="bg-transparent text-[11px] font-medium text-primary outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-widest font-bold text-secondary px-1">
                  Payment Type
                </label>
                <select
                  className="bg-surface-container-low border-none rounded-xl text-[11px] font-medium text-primary pr-8 focus:ring-0 py-1.5 px-3 outline-none"
                  value={payType}
                  onChange={(event) => setPayType(event.target.value as "ALL" | PayType)}
                >
                  <option value="ALL">ALL METHODS</option>
                  <option value="Card">CARD</option>
                  <option value="Cash">CASH</option>
                  <option value="Mobile">MOBILE</option>
                  <option value="Unpaid">UNPAID</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setRefreshToken((current) => current + 1)}
                className="bg-primary text-on-primary px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 self-end hover:opacity-90 transition-opacity"
              >
                <ListFilter size={12} />
                Apply Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col justify-between border border-outline-variant/10">
              <p className="text-[9px] uppercase tracking-widest text-secondary font-bold mb-2">
                Total Revenue
              </p>
              <p className="text-3xl font-headline text-primary">{formatMoney(totalRevenue)}</p>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between">
              <p className="text-[9px] uppercase tracking-widest text-secondary font-bold mb-2">
                Transaction Count
              </p>
              <p className="text-3xl font-headline text-primary">{invoiceRows.length}</p>
            </div>

            <div className="relative rounded-xl overflow-hidden group h-32 md:h-auto">
              <div className="absolute inset-0 bg-primary/30 z-10" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBppRjpI_3R8_PLR2xCvsFCLXVx28KJ14d4BzMY8wf8SmOoaIovUS4yJweY9Qp4KFn66PZMdUNzpiVfuwBOw-Fh3BLLopbJvVdxuZftZzaw98xVScDA4dVibsBiBHlqRe-yazkuYc-O1Nm8YLdGB7C32FF9HYLuVvhMXUoDkEgt4YIGgps9fAs1n0G9Osp7QG-bDNIlY5blz8mv7rmfuRBxxf1cU9L5tX96XQI9EitYcnGJX47brNzlsEitwnoYz-zkpRWu6g3-r40"
                alt="October monthly performance"
                className="absolute inset-0 w-full h-full object-cover scale-110"
              />
              <div className="relative z-20 flex h-full flex-col justify-end p-5">
                <p className="text-[10px] uppercase tracking-widest text-white/80">
                  Monthly Performance
                </p>
                <p className="font-headline text-base text-white">
                  {currentMonthPerformance.label} Monthly Performance
                </p>
                <p className="text-[10px] uppercase tracking-widest text-white/75 mt-1">
                  {currentMonthPerformance.count
                    ? `${formatMoney(currentMonthPerformance.total)} · ${currentMonthPerformance.count} orders${currentMonthPerformance.change === null ? "" : ` · ${currentMonthPerformance.change >= 0 ? "+" : ""}${currentMonthPerformance.change.toFixed(1)}% vs last month`}`
                    : "No current-month records yet"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                  Revenue Trends
                </p>
                <h3 className="mt-1 font-headline text-2xl text-primary">Dashboard Performance</h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                <TrendingUp size={14} />
                {orders.length ? "Live data" : "No data"}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-[2.5rem_1fr] gap-3">
              <div className="flex h-44 flex-col justify-between text-right text-[10px] font-semibold text-secondary">
                {[100, 75, 50, 25, 0].map((percent) => (
                  <span key={percent}>{formatMoney(Math.round((Math.max(...monthlyPerformance.map((item) => item.value), 1) * percent) / 100))}</span>
                ))}
              </div>
              <div className="relative h-44 border-b border-outline-variant/30">
                {[0, 25, 50, 75, 100].map((percent) => (
                  <span key={percent} className="absolute inset-x-0 border-t border-dashed border-outline-variant/20" style={{ bottom: `${percent}%` }} />
                ))}
                <div className="relative z-10 flex h-full items-end gap-3">
                  {monthlyPerformance.map((month) => (
                    <div key={month.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                      <span className="text-[10px] font-semibold text-secondary">{formatMoney(month.value)}</span>
                      <div className="relative h-full w-full max-w-14 rounded-t-lg bg-primary/10">
                        <div
                          className="absolute inset-x-0 bottom-0 rounded-t-lg bg-linear-to-t from-primary to-primary/60 shadow-sm"
                          style={{ height: `${month.value ? Math.max(month.height, 8) : 2}%` }}
                        />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-secondary">{month.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10">
            <div className="flex items-center justify-between border-b border-outline-variant/10 px-5 py-3.5">
              <div>
                <h3 className="font-headline text-xl text-primary">Transactions</h3>
                <p className="text-xs text-secondary">
                  Showing {visibleRows.length} of {invoiceRows.length} records
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg bg-surface-container px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                  CSV
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-sm text-secondary">Loading real invoice data...</div>
            ) : error ? (
              <div className="p-8 text-sm text-error">{error}</div>
            ) : visibleRows.length === 0 ? (
              <div className="p-8 text-sm text-secondary">No invoice records match your current filters.</div>
            ) : (
              <>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      {[
                        { label: "Invoice #", align: "" },
                        { label: "Order ID", align: "" },
                        { label: "Date & Time", align: "" },
                        { label: "Amount", align: "text-right" },
                        { label: "Type", align: "" },
                        { label: "Status", align: "" },
                        { label: "Actions", align: "text-center" },
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
                    {visibleRows.map((row) => {
                      const style = TYPE_STYLE[row.type];
                      const statusClass =
                        row.orderStatus === "COMPLETED"
                          ? "bg-primary/10 text-primary"
                          : row.orderStatus === "CANCELLED"
                            ? "bg-error/10 text-error"
                            : "bg-surface-container text-on-surface-variant";

                      return (
                        <tr key={row.id} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-xs text-primary">{row.inv}</td>
                          <td className="px-5 py-3.5 text-[11px] text-secondary tracking-widest">{row.ord}</td>
                          <td className="px-5 py-3.5 text-xs text-on-surface-variant font-medium">{row.date}</td>
                          <td className="px-5 py-3.5 text-right text-sm font-headline text-primary">{formatMoney(row.amount)}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 ${style.pill} ${style.text} rounded-full`}>
                              {row.type}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${statusClass}`}>
                              {row.orderStatus}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const order = orders.find((item) => item.id === row.id);
                                if (!order) return;
                                setSelectedReceipt(toReceipt(order));
                                window.setTimeout(() => window.print(), 100);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-2 py-1.5 text-[10px] font-semibold text-primary hover:bg-surface-container-low transition-colors"
                            >
                              <Printer size={12} />
                              Print Receipt
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="px-5 py-3.5 flex justify-between items-center bg-surface-container-low/30">
                  <p className="text-[11px] text-on-surface-variant">
                    Showing {Math.min((activePage - 1) * pageSize + 1, invoiceRows.length)} to {Math.min(activePage * pageSize, invoiceRows.length)} of {invoiceRows.length} records
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActivePage((current) => Math.max(1, current - 1))}
                      disabled={activePage === 1}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-outline hover:text-primary transition-colors disabled:opacity-40"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        onClick={() => setActivePage(page)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                          activePage === page ? "bg-primary text-on-primary" : "text-secondary hover:bg-surface-container-high"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setActivePage((current) => Math.min(totalPages, current + 1))}
                      disabled={activePage === totalPages}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-outline hover:text-primary transition-colors disabled:opacity-40"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      {selectedReceipt && <div className="printable-receipt"><ReceiptPreview order={selectedReceipt} /></div>}
    </div>
  );
}