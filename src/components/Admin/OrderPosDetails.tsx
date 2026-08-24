import { ArrowLeft, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getOrders } from "../../api/order";
import type { Order } from "../../types/order";
import ReceiptPreview from "./ReceiptPreview";
import type { ReceiptOrder } from "./ReceiptPreview";

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

export default function OrderPosDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    getOrders().then((response) => setOrder(response.data.find((item) => item.id === orderId) ?? null)).finally(() => setLoading(false));
  }, [orderId]);

  function printReceipt() {
    setPrinting(true);
    window.setTimeout(() => { window.print(); setPrinting(false); }, 100);
  }

  if (loading) return <div className="p-8 text-sm text-on-surface-variant">Loading order details...</div>;
  if (!order) return <div className="p-8"><p className="text-sm text-error">Order not found.</p><Link to="/pos-koh/orders" className="mt-4 inline-flex text-sm font-semibold text-primary">Back to orders</Link></div>;

  const completedUnits = order.items.flatMap((item) => item.units ?? []).filter((unit) => unit.prepCompletedAt).length;
  const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const receipt = toReceipt(order);

  return <div className="min-h-screen bg-surface px-5 py-6 text-on-surface sm:px-8 sm:py-8">
    <div className="mx-auto max-w-4xl">
      <Link to="/pos-koh/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-tertiary"><ArrowLeft size={16} /> Back to orders</Link>
      <header className="mt-6 flex flex-col justify-between gap-4 border-b border-outline-variant/20 pb-5 sm:flex-row sm:items-start"><div><p className="text-[11px] font-bold uppercase tracking-widest text-tertiary">{order.orderNumberDisplay}</p><h1 className="mt-1 font-headline text-3xl text-primary">{order.customerName ?? order.orderType.replace("_", " ")}</h1><p className="mt-1 text-sm text-on-surface-variant">{new Date(order.createdAt).toLocaleString()}</p></div><div className="flex items-center gap-2"><span className="rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold uppercase text-on-surface-variant">{order.status.replaceAll("_", " ")}</span><button type="button" onClick={printReceipt} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-on-primary"><Printer size={15} /> {printing ? "Printing" : "Print receipt"}</button></div></header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_18rem]">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-outline-variant/10"><h2 className="font-headline text-xl text-primary">Order items</h2><div className="mt-4 divide-y divide-surface-container">{order.items.map((item) => <div key={item.id} className="flex justify-between gap-4 py-3 text-sm"><div><p className="font-semibold">{item.menuItem?.name ?? "Menu item"} × {item.quantity}</p>{item.note && <p className="mt-1 text-xs italic text-on-surface-variant">{item.note}</p>}</div><span className="font-semibold">${(Number(item.unitPrice) * item.quantity).toFixed(2)}</span></div>)}</div></section>
        <aside className="space-y-5"><section className="rounded-2xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/10"><h2 className="font-headline text-lg text-primary">Order information</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-on-surface-variant">Type</dt><dd className="font-semibold">{order.orderType.replace("_", " ")}</dd></div>{order.serverName && <div className="flex justify-between gap-3"><dt className="text-on-surface-variant">Server</dt><dd className="font-semibold">{order.serverName}</dd></div>}{order.tableNo && <div className="flex justify-between gap-3"><dt className="text-on-surface-variant">Table</dt><dd className="font-semibold">{order.tableNo}</dd></div>}{order.deliveryAddress && <div><dt className="text-on-surface-variant">Address</dt><dd className="mt-1 font-semibold">{order.deliveryAddress}</dd></div>}<div className="flex justify-between gap-3"><dt className="text-on-surface-variant">Payment</dt><dd className="font-semibold">{order.paymentStatus}{order.paymentMethod ? ` · ${order.paymentMethod}` : ""}</dd></div></dl></section><section className="rounded-2xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/10"><h2 className="font-headline text-lg text-primary">Preparation</h2><p className="mt-3 text-sm text-on-surface-variant">{completedUnits} of {totalUnits} units completed by kitchen.</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-container"><div className="h-full bg-primary" style={{ width: `${totalUnits ? completedUnits / totalUnits * 100 : 0}%` }} /></div></section></aside>
      </div>
      <div className="printable-receipt"><ReceiptPreview order={receipt} /></div>
    </div>
  </div>;
}
