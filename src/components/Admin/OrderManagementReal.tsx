import { CalendarDays, CheckCircle2, Clock3, Download, Printer, Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getOrders } from "../../api/order";
import type { Order } from "../../types/order";
import ReceiptPreview from "./ReceiptPreview";
import type { ReceiptOrder } from "./ReceiptPreview";

type RangeMode = "range" | "monthly" | "yearly";
type StatusFilter = "ALL" | "PREPARING" | "SERVED" | "OUT_FOR_DELIVERY" | "RECEIVED" | "COMPLETED" | "CANCELLED";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
	{ value: "ALL", label: "All" }, { value: "PREPARING", label: "Preparing" }, { value: "SERVED", label: "Served" },
	{ value: "OUT_FOR_DELIVERY", label: "Out for delivery" }, { value: "RECEIVED", label: "Received" },
	{ value: "COMPLETED", label: "Completed" }, { value: "CANCELLED", label: "Cancelled" },
];

function localDate(offset = 0) {
	const date = new Date();
	date.setHours(12, 0, 0, 0);
	date.setDate(date.getDate() + offset);
	return date.toISOString().slice(0, 10);
}
function initials(name: string | null) { return name ? name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() : "G"; }
function statusClass(status: Order["status"]) {
	if (status === "COMPLETED") return "bg-primary/10 text-primary";
	if (status === "CANCELLED") return "bg-error/10 text-error";
	if (status === "OUT_FOR_DELIVERY" || status === "RECEIVED") return "bg-tertiary/10 text-tertiary";
	return "bg-surface-container text-on-surface-variant";
}
function money(value: string | number) { return `$${Number(value).toFixed(2)}`; }
function toReceipt(order: Order): ReceiptOrder {
	return { orderNumber: order.orderNumber, orderType: order.orderType, serverName: order.serverName, tableNo: order.tableNo, customerName: order.customerName, paymentMethod: order.paymentMethod, subtotal: order.subtotal, tax: order.tax, serviceCharge: order.serviceCharge, total: order.total, items: order.items.map((item) => ({ quantity: item.quantity, unitPrice: item.unitPrice, note: item.note, menuItem: item.menuItem ? { name: item.menuItem.name } : undefined })) };
}

export default function OrderManagementReal() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [mode, setMode] = useState<RangeMode>("range");
	const [fromDate, setFromDate] = useState(localDate(-1));
	const [toDate, setToDate] = useState(localDate());
	const [month, setMonth] = useState(localDate().slice(0, 7));
	const [year, setYear] = useState(localDate().slice(0, 4));
	const [status, setStatus] = useState<StatusFilter>("ALL");
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedReceipt, setSelectedReceipt] = useState<ReceiptOrder | null>(null);

	const query = useMemo(() => {
		if (mode === "monthly") {
			const [selectedYear, selectedMonth] = month.split("-").map(Number);
			return { fromDate: `${month}-01`, toDate: new Date(Date.UTC(selectedYear, selectedMonth, 0)).toISOString().slice(0, 10) };
		}
		if (mode === "yearly") return { fromDate: `${year}-01-01`, toDate: `${year}-12-31` };
		return { fromDate, toDate };
	}, [mode, fromDate, toDate, month, year]);

	useEffect(() => {
		setLoading(true); setError(null);
		getOrders(query).then((response) => setOrders(response.data)).catch((reason: any) => setError(reason.message || "Failed to load orders")).finally(() => setLoading(false));
	}, [query]);

	const visibleOrders = useMemo(() => orders.filter((order) => {
		const term = search.trim().toLowerCase();
		return (status === "ALL" || order.status === status) && (!term || order.orderNumberDisplay.toLowerCase().includes(term) || (order.customerName ?? "").toLowerCase().includes(term));
	}), [orders, status, search]);
	const totalRevenue = orders.filter((order) => order.status !== "CANCELLED").reduce((sum, order) => sum + Number(order.total), 0);
	const completed = orders.filter((order) => order.status === "COMPLETED").length;
	const active = orders.filter((order) => !["COMPLETED", "CANCELLED"].includes(order.status)).length;

	function printOrder(order: Order) {
		setSelectedReceipt(toReceipt(order));
		window.setTimeout(() => window.print(), 100);
	}

	return <div className="min-h-screen bg-surface px-5 py-6 text-on-surface sm:px-8 sm:py-8">
		<header className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">Operations</p><h1 className="mt-1 font-headline text-3xl text-primary">Order Management</h1><p className="mt-1 text-sm text-on-surface-variant">Real order history and performance for the selected period.</p></div><div className="relative w-full lg:w-72"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order or customer" className="w-full rounded-xl bg-surface-container-lowest py-2.5 pl-9 pr-3 text-sm ring-1 ring-outline-variant/20 outline-none focus:ring-2 focus:ring-primary/20" /></div></div>
			<div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl bg-surface-container-low p-2">{(["range", "monthly", "yearly"] as RangeMode[]).map((item) => <button key={item} onClick={() => setMode(item)} className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize ${mode === item ? "bg-white text-primary shadow-sm" : "text-secondary hover:text-primary"}`}>{item === "range" ? "Date range" : item}</button>)}{mode === "range" && <><input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="rounded-lg bg-white px-2 py-2 text-xs" /><span className="text-xs text-secondary">to</span><input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="rounded-lg bg-white px-2 py-2 text-xs" /></>}{mode === "monthly" && <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="rounded-lg bg-white px-2 py-2 text-xs" />}{mode === "yearly" && <input type="number" value={year} onChange={(event) => setYear(event.target.value)} className="w-24 rounded-lg bg-white px-2 py-2 text-xs" />}<span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-secondary"><CalendarDays size={14} /> {query.fromDate} to {query.toDate}</span></div>
			<div className="mt-5 flex max-w-full gap-1 overflow-x-auto border-b border-outline-variant/20 pb-1">{STATUS_FILTERS.map((item) => <button key={item.value} onClick={() => setStatus(item.value)} className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-semibold ${status === item.value ? "bg-primary text-on-primary" : "text-secondary hover:bg-surface-container-low"}`}>{item.label}</button>)}</div>
			<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"><Stat label="Total orders" value={orders.length} icon={Users} /><Stat label="Active" value={active} icon={Clock3} /><Stat label="Completed" value={completed} icon={CheckCircle2} /><Stat label="Revenue" value={money(totalRevenue)} icon={Printer} /></div>
		</header>
		<main className="mx-auto mt-6 max-w-7xl"><section className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/10"><div className="flex items-center justify-between border-b border-outline-variant/10 px-5 py-4"><div><h2 className="font-headline text-xl text-primary">Orders</h2><p className="text-xs text-secondary">Real orders in this period</p></div><button type="button" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-primary hover:bg-surface-container-low"><Download size={14} /> Export</button></div>{loading ? <p className="p-8 text-sm text-secondary">Loading real orders...</p> : error ? <p className="p-8 text-sm text-error">{error}</p> : visibleOrders.length === 0 ? <p className="p-8 text-sm text-secondary">No orders found for this period.</p> : <div className="overflow-x-auto"><table className="w-full min-w-190 text-left text-sm"><thead className="bg-surface-container-low"><tr>{["Order", "Customer", "Date & time", "Type", "Status", "Total", "Action"].map((heading) => <th key={heading} className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-secondary">{heading}</th>)}</tr></thead><tbody className="divide-y divide-outline-variant/10">{visibleOrders.map((order) => <tr key={order.id} className="hover:bg-surface-container-low/50"><td className="px-5 py-4 font-bold text-primary">{order.orderNumberDisplay}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-xs font-bold text-on-secondary-container">{initials(order.customerName)}</div><div><p className="font-semibold text-primary">{order.customerName || "------"}</p><p className="text-[10px] text-secondary">Guest</p></div></div></td><td className="px-5 py-4 text-xs text-on-surface-variant">{new Date(order.createdAt).toLocaleString()}</td><td className="px-5 py-4 text-xs font-semibold text-on-surface-variant">{order.orderType.replace("_", " ")}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusClass(order.status)}`}>{order.status.replaceAll("_", " ")}</span></td><td className="px-5 py-4 font-headline font-bold text-primary">{money(order.total)}</td><td className="px-5 py-4"><button type="button" onClick={() => printOrder(order)} className="rounded-lg p-2 text-primary hover:bg-surface-container" title="Print receipt"><Printer size={16} /></button></td></tr>)}</tbody></table></div>}</section><div className="mt-6 grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-primary p-5 text-on-primary md:col-span-2"><p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">Advisory</p><h3 className="mt-2 font-headline text-xl">Kitchen Load Advisory</h3><p className="mt-2 text-sm text-on-primary-container">Advisory insights will use real operational data here later.</p></div><div className="rounded-2xl bg-surface-container-low p-5"><p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Goal</p><h3 className="mt-2 font-headline text-xl text-primary">Order Quality Goal</h3><p className="mt-2 text-sm text-secondary">Goal tracking remains available for a future data source.</p></div></div></main>
		{selectedReceipt && <div className="printable-receipt"><ReceiptPreview order={selectedReceipt} /></div>}
	</div>;
}

function Stat({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof Users }) { return <div className="flex items-center gap-3 rounded-xl bg-surface-container-lowest px-4 py-3 ring-1 ring-outline-variant/10"><Icon size={17} className="text-primary" /><div><p className="text-[10px] font-bold uppercase tracking-wider text-secondary">{label}</p><p className="mt-0.5 font-headline text-xl text-primary">{value}</p></div></div>; }
