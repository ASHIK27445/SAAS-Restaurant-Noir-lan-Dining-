import type { Order } from "../../types/order";

export type ReceiptOrder = Pick<Order, "orderNumber" | "orderType" | "serverName" | "tableNo" | "customerName" | "paymentMethod"> & {
  subtotal: string | number;
  tax: string | number;
  discount?: string | number;
  serviceCharge: string | number;
  total: string | number;
  items: {
    quantity: number;
    unitPrice: string | number;
    note: string | null;
    menuItem?: { name: string };
  }[];
};

function money(value: string | number) {
  return Number(value).toFixed(2);
}

export default function ReceiptPreview({ order }: { order: ReceiptOrder }) {
  return (
    <article className="receipt-paper mx-auto w-full max-w-sm bg-white px-6 py-7 text-[#1b1c1a] shadow-lg">
      <header className="border-b border-dashed border-[#8a8a84] pb-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-secondary">The Culinary Editorial</p>
        <h2 className="mt-1 font-serif text-2xl font-bold">Order Receipt</h2>
        <p className="mt-2 text-xs text-secondary">
          Order #{String(order.orderNumber).padStart(5, "0")} · {order.orderType.replace("_", "-")}
        </p>
      </header>

      <div className="border-b border-dashed border-[#8a8a84] py-3 text-xs text-secondary">
        <div className="flex justify-between gap-4"><span>Server</span><span className="font-semibold text-[#1b1c1a]">{order.serverName ?? "Unassigned"}</span></div>
        {order.tableNo && <div className="mt-1 flex justify-between gap-4"><span>Table</span><span className="font-semibold text-[#1b1c1a]">{order.tableNo}</span></div>}
        {order.customerName && <div className="mt-1 flex justify-between gap-4"><span>Customer</span><span className="font-semibold text-[#1b1c1a]">{order.customerName}</span></div>}
      </div>

      <div className="space-y-3 border-b border-dashed border-[#8a8a84] py-4">
        {order.items.map((item, index) => (
          <div key={`${item.menuItem?.name ?? "item"}-${index}`} className="flex justify-between gap-4 text-sm">
            <div className="min-w-0">
              <p className="font-semibold">{item.menuItem?.name ?? "Menu item"}</p>
              <p className="text-xs text-secondary">{item.quantity} × ${money(item.unitPrice)}</p>
              {item.note && <p className="text-xs italic text-secondary">{item.note}</p>}
            </div>
            <span className="shrink-0 font-semibold">${money(Number(item.unitPrice) * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 py-4 text-xs text-secondary">
        <div className="flex justify-between"><span>Subtotal</span><span>${money(order.subtotal)}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>${money(order.tax)}</span></div>
        {order.discount !== undefined && Number(order.discount) > 0 && <div className="flex justify-between text-[#2f6849]"><span>Discount</span><span>-${money(order.discount)}</span></div>}
        <div className="flex justify-between"><span>Service charge</span><span>${money(order.serviceCharge)}</span></div>
        <div className="mt-2 flex justify-between border-t border-[#1b1c1a] pt-2 text-base font-bold text-[#1b1c1a]"><span>Total</span><span>${money(order.total)}</span></div>
      </div>

      <footer className="border-t border-dashed border-[#8a8a84] pt-4 text-center text-[10px] uppercase tracking-[0.16em] text-secondary">
        {order.paymentMethod ? `Paid by ${order.paymentMethod}` : "Payment due at checkout"}
        <p className="mt-2 normal-case tracking-normal">Thank you for dining with us.</p>
      </footer>
    </article>
  );
}
