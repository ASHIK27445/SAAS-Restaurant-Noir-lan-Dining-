import { useEffect, useMemo, useState } from 'react';
import { CakeSlice, IceCream, Minus, Plus, Printer, Search, Soup, Utensils, Wine } from 'lucide-react';
import { getMenuItemsByBucket, createOrder, getNextOrderNumber, getPosSettings, getPromoCodes, type PosSettings, type PromoCode } from '../../api/order';
import { getStaff as getStaffMembers } from '../../api/employee';
import type { MenuItemWithCategory, OrderType } from '../../types/order';
import ReceiptPreview from './ReceiptPreview';
import type { ReceiptOrder } from './ReceiptPreview';

type CategoryButtonProps = { icon: any; label: string; active: boolean; onClick: () => void };
function CategoryButton({ icon, label, active, onClick }: CategoryButtonProps) {
  const Icon = icon;
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 group${active ? "" : " opacity-40 hover:opacity-100 transition-opacity"}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-active:scale-95 ${active ? "bg-primary text-on-primary" : "bg-surface-container-high text-secondary"}`}>
        <Icon size={20} />
      </div>
      <span className={`text-[9px] font-bold tracking-tighter${active ? " text-primary" : ""}`}>{label}</span>
    </button>
  );
}

function FoodCard({ item, onClick }: { item: MenuItemWithCategory; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-surface-container-lowest rounded-xl p-3 group cursor-pointer hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col">
      <div className="relative h-40 mb-3 overflow-hidden rounded-lg bg-surface-container-high">
        {item.image && <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} alt={item.name} />}
        <div className="absolute top-2 right-2 bg-primary text-on-primary px-2 py-1 rounded-full text-xs font-bold tracking-wider">${Number(item.price).toFixed(2)}</div>
      </div>
      <div className="px-1">
        <h3 className="text-base font-serif text-on-surface">{item.name}</h3>
        <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 italic">{item.description}</p>
      </div>
    </div>
  );
}

type OrderLine = { menuItemId: string; name: string; price: number; qty: number; note?: string };

function ReceiptItem({ name, note, qty, price, onIncrease, onDecrease, onRemove }: {
  name: string; note?: string; qty: number; price: string;
  onIncrease?: () => void; onDecrease?: () => void; onRemove?: () => void;
}) {
  return (
    <div className="flex flex-col group">
      <div className="flex-1 min-w-0 mr-2">
        <h4 className="text-sm font-semibold text-on-surface truncate">{name}</h4>
        {note && <p className="text-xs text-on-surface-variant italic truncate">{note}</p>}
      </div>
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center border border-surface-container border-dotted rounded-lg p-0.5">
          <button onClick={onDecrease} className="w-4 h-4 flex items-center justify-center text-primary hover:bg-surface-container rounded-full transition-colors"><Minus /></button>
          <span className="w-5 text-center text-xs font-bold">{qty}</span>
          <button onClick={onIncrease} className="w-4 h-4 flex items-center justify-center text-primary hover:bg-surface-container rounded-full transition-colors"><Plus /></button>
        </div>
        <div className="flex-1 border-b border-dashed border-on-surface-variant opacity-40 mx-1"></div>
        <div className='flex'>
          <span className="text-xs font-serif font-bold min-w-11 text-right">{price}</span>
          <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 w-4 flex justify-center text-red-500 text-xs transition">✕</button>
        </div>
      </div>
    </div>
  );
}

const BUCKETS: { key: string; label: string; icon: any }[] = [
  { key: "MEALS", label: "MEALS", icon: Utensils },
  { key: "DRINKS", label: "DRINKS", icon: Wine },
  { key: "DESSERTS", label: "DESSERTS", icon: IceCream },
  { key: "SIDES", label: "SIDES", icon: CakeSlice },
];

const paymentMethods = [
  { id: "cash", label: "Cash" },
  { id: "card", label: "Card" },
  { id: "bkash", label: "bKash" },
  { id: "rocket", label: "Rocket" },
];

export default function Pos() {
  const [activeBucket, setActiveBucket] = useState("MEALS");
  const [items, setItems] = useState<MenuItemWithCategory[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [search, setSearch] = useState("");

  const [orderItems, setOrderItems] = useState<OrderLine[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [specialNote, setSpecialNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [tableNo, setTableNo] = useState<number | null>(null);
  const [guestCount, setGuestCount] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const [waiters, setWaiters] = useState<{ id: string; name: string }[]>([]);
  const [serverStaffId, setServerStaffId] = useState(() => localStorage.getItem('pos-selected-server-id') ?? '');
  const [nextOrderNumber, setNextOrderNumber] = useState<number | null>(null);
  const [posSettings, setPosSettings] = useState<PosSettings | null>(null);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastOrderReceipt, setLastOrderReceipt] = useState<any>(null);

  useEffect(() => {
    setLoadingItems(true);
    getMenuItemsByBucket(activeBucket).then((res) => setItems(res.data)).finally(() => setLoadingItems(false));
  }, [activeBucket]);

  useEffect(() => {
    getStaffMembers({ role: "Waiter" }).then((res) => setWaiters(res.data.map((s: any) => ({ id: s.id, name: s.name }))));
    getNextOrderNumber().then((res) => setNextOrderNumber(res.data.orderNumber));
    Promise.all([getPosSettings(), getPromoCodes()]).then(([settings, promos]) => {
      setPosSettings(settings.data);
      setPromoCodes(promos.data);
    });
  }, []);

  useEffect(() => {
    if (serverStaffId) localStorage.setItem('pos-selected-server-id', serverStaffId);
    else localStorage.removeItem('pos-selected-server-id');
  }, [serverStaffId]);

  const filteredItems = useMemo(
    () => items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const addToOrder = (item: MenuItemWithCategory) => {
    const price = Number(item.price);
    setOrderItems((prev) => {
      const existing = prev.find((l) => l.menuItemId === item.id);
      if (existing) return prev.map((l) => (l.menuItemId === item.id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { menuItemId: item.id, name: item.name, price, qty: 1 }];
    });
  };

  const updateQuantity = (menuItemId: string, change: number) => {
    setOrderItems((prev) =>
      prev.map((l) => (l.menuItemId === menuItemId ? { ...l, qty: l.qty + change } : l)).filter((l) => l.qty > 0)
    );
  };
  const removeItem = (menuItemId: string) => setOrderItems((prev) => prev.filter((l) => l.menuItemId !== menuItemId));
  const clearOrder = () => { setOrderItems([]); setSpecialNote(''); };

  const subtotal = orderItems.reduce((sum, l) => sum + l.price * l.qty, 0);
  const taxRate = Number(posSettings?.taxRate ?? 8);
  const serviceCharge = Number(posSettings?.serviceCharge ?? 0);
  const discount = appliedPromo ? subtotal * Number(appliedPromo.discountPercent) / 100 : 0;
  const tax = subtotal * taxRate / 100;
  const total = subtotal + tax + serviceCharge - discount;
  const selectedServerName = waiters.find((w) => w.id === serverStaffId)?.name ?? 'Unassigned';
  const needsServer = orderType !== 'DELIVERY';
  const draftReceipt: ReceiptOrder | null = orderItems.length === 0 ? null : {
    orderNumber: nextOrderNumber ?? 0,
    orderType,
    serverName: needsServer ? selectedServerName : null,
    tableNo: tableNo ? String(tableNo) : null,
    customerName: customerName || null,
    paymentMethod: orderType === 'DINE_IN' ? null : paymentMethod,
    subtotal,
    tax,
    discount,
    serviceCharge,
    total,
    items: orderItems.map((item) => ({
      quantity: item.qty,
      unitPrice: item.price,
      note: item.note ?? null,
      menuItem: { name: item.name },
    })),
  };
  const receiptToPrint = draftReceipt ?? (lastOrderReceipt as ReceiptOrder | null);

  function printReceipt() {
    window.setTimeout(() => window.print(), 100);
  }

  function applyPromoCode() {
    const code = promoInput.trim().toUpperCase();
    const promo = promoCodes.find((item) => item.code === code && item.isActive && item.showInPos && (item.usageLimit === null || item.usageCount < item.usageLimit));
    if (!promo) {
      setAppliedPromo(null);
      setError('Invalid or unavailable promo code');
      return;
    }
    setAppliedPromo(promo);
    setError(null);
  }

  async function handlePlaceOrder() {
    setError(null);
    if (orderItems.length === 0) return;
    if (orderType === "DELIVERY" && !deliveryAddress.trim()) { setError("Delivery address is required"); return; }
    const upfrontPaid = orderType === "TAKEAWAY" || orderType === "DELIVERY";

    setSubmitting(true);
    try {
      const res = await createOrder({
        orderType,
        serverStaffId: needsServer ? serverStaffId || undefined : undefined,
        tableNo: orderType === "DINE_IN" && tableNo ? String(tableNo) : undefined,
        guestCount: orderType === "DINE_IN" ? guestCount ?? undefined : undefined,
        customerName: orderType === "DINE_IN" ? customerName || undefined : undefined,
        deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : undefined,
        note: specialNote || undefined,
        paymentMethod: upfrontPaid ? paymentMethod : undefined,
        items: orderItems.map((l) => ({ menuItemId: l.menuItemId, quantity: l.qty, unitPrice: l.price, note: l.note })),
        subtotal, tax, serviceCharge, total,
        promoCode: appliedPromo?.code,
      });

      setLastOrderReceipt(res.data);
      setNextOrderNumber(res.data.orderNumber + 1);
      if (posSettings?.autoPrintReceipt) printReceipt();

      clearOrder();
      setPromoInput('');
      setAppliedPromo(null);
      setTableNo(null);
      setGuestCount(null);
      setCustomerName('');
      setDeliveryAddress('');
    } catch (err: any) {
      setError(err.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-surface text-on-surface h-screen flex overflow-hidden">
      <main className="w-full flex h-screen overflow-hidden">
        <section className="w-20 shrink-0 bg-surface-container-low flex flex-col items-center py-6 gap-5 border-r border-outline-variant/10">
          {BUCKETS.map((b) => (
            <CategoryButton key={b.key} icon={b.icon} label={b.label} active={activeBucket === b.key} onClick={() => setActiveBucket(b.key)} />
          ))}
        </section>

        <section style={{ flex: '60' }} className="custom-scrollbar min-w-0 p-6 overflow-y-auto bg-surface border-r border-outline-variant/10">
          <header className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-serif italic text-primary">{BUCKETS.find((b) => b.key === activeBucket)?.label}</h2>
            </div>
            <div className="relative w-52">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="Search menu..."
              />
            </div>
          </header>
          {loadingItems ? (
            <p className="text-sm text-on-surface-variant">Loading…</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No items in this category.</p>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredItems.map((item) => <FoodCard key={item.id} item={item} onClick={() => addToOrder(item)} />)}
            </div>
          )}
        </section>

        <section style={{ flex: '25' }} className="min-w-0 flex flex-col h-screen border-r border-outline-variant/10 bg-surface-container-lowest">
          <div className="p-4 border-b border-outline-variant/20 shrink-0">
            <div className="flex w-full items-start justify-between gap-3">
              <h2 className="min-w-0 flex-1 text-lg font-serif text-primary truncate">
                {orderType === 'DINE_IN' && tableNo ? `Table ${tableNo}` : 'Current Order'}
                {orderType === 'DINE_IN' && guestCount && ` • Guests: ${guestCount}`}
              </h2>
              <span className="shrink-0 bg-tertiary/10 text-tertiary px-2 py-1 rounded-full text-[9px] font-bold uppercase">
                {orderType.replace("_", "-")}
              </span>
            </div>
            <p className="mt-1 w-full text-xs font-medium text-secondary wrap-break-word">
              Order #{nextOrderNumber === null ? '-----' : String(nextOrderNumber).padStart(5, '0')}
              {needsServer && ` • Server: ${selectedServerName}`}
            </p>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto p-4 space-y-4">
            {orderItems.length > 0 ? (
              orderItems.map((l) => (
                <ReceiptItem key={l.menuItemId} name={l.name} qty={l.qty} price={`$${(l.price * l.qty).toFixed(2)}`}
                  onIncrease={() => updateQuantity(l.menuItemId, 1)} onDecrease={() => updateQuantity(l.menuItemId, -1)} onRemove={() => removeItem(l.menuItemId)} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-secondary/40">
                <Soup size={25} /><p className="text-xs">Tap menu items to add</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low shrink-0">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-secondary"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-xs text-secondary"><span>Tax ({taxRate}%)</span><span>${tax.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-xs text-tertiary"><span>Discount{appliedPromo ? ` (${appliedPromo.code})` : ''}</span><span>-${discount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-xs text-secondary"><span>Service Charge</span><span>${serviceCharge.toFixed(2)}</span></div>
              <div className="flex justify-between text-base font-serif text-primary border-t-2 border-outline-variant/30 pt-2.5 mt-1">
                <span>Total</span><span className="font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        <section style={{ flex: '15' }} className="custom-scrollbar min-w-0 flex flex-col h-screen bg-surface-container-low overflow-y-auto">
          <div className="p-4 border-b border-outline-variant/20 shrink-0">
            <p className="text-[10px] font-bold tracking-widest uppercase text-secondary">Order Type</p>
            <div className="grid grid-cols-1 gap-1.5 mt-2">
              {(['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as OrderType[]).map((type) => (
                <button key={type} onClick={() => setOrderType(type)}
                  className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${orderType === type ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-secondary bg-surface-container-lowest hover:border-primary'}`}>
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {needsServer && (
            <div className="p-4 border-b border-outline-variant/20 shrink-0">
              <p className="text-[10px] font-bold tracking-widest uppercase text-secondary mb-2">Server</p>
              <select value={serverStaffId} onChange={(e) => setServerStaffId(e.target.value)} className="w-full px-2 py-1.5 text-xs rounded-lg border border-outline-variant bg-surface-container-lowest">
                <option value="">Select server…</option>
                {waiters.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
          )}

          {(orderType === "TAKEAWAY" || orderType === "DELIVERY") && (
            <div className="p-4 border-b border-outline-variant/20 shrink-0">
              <p className="text-[10px] font-bold tracking-widest uppercase text-secondary mb-2">Payment (paid now)</p>
              <div className="grid grid-cols-2 gap-1.5">
                {paymentMethods.map((m) => (
                  <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                    className={`p-2 rounded-lg border text-[9px] font-bold transition-all ${paymentMethod === m.id ? 'border-primary bg-primary/10' : 'border-outline-variant/50 hover:border-primary'}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {orderType === "DINE_IN" && (
            <div className="p-4 border-b border-outline-variant/20 shrink-0 space-y-2">
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name (pays later)"
                className="w-full px-2 py-1.5 text-xs rounded-lg border border-outline-variant bg-surface-container-lowest" />
              <div className="flex gap-1.5">
                <select value={tableNo ?? ''} onChange={(e) => setTableNo(Number(e.target.value))} className="flex-1 px-1.5 py-1 text-xs rounded-md border border-outline bg-surface-container-lowest">
                  <option value="" disabled>Table</option>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>T{n}</option>)}
                </select>
                <select value={guestCount ?? ''} onChange={(e) => setGuestCount(Number(e.target.value))} className="flex-1 px-1.5 py-1 text-xs rounded-md border border-outline bg-surface-container-lowest">
                  <option value="" disabled>Guests</option>
                  {[1,2,3,4,5,6,7,8,9,10,12,15,20].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          )}

          {orderType === "DELIVERY" && (
            <div className="p-4 border-b border-outline-variant/20 shrink-0">
              <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Delivery address *"
                className="w-full h-16 text-xs bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-2 resize-none" />
            </div>
          )}

          <div className="p-4 border-b border-outline-variant/20 shrink-0">
            <textarea value={specialNote} onChange={(e) => setSpecialNote(e.target.value)} placeholder="Special notes / allergies…"
              className="w-full h-16 text-xs bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-2 resize-none" />
          </div>

          {error && <p className="px-4 pt-3 text-xs text-error">{error}</p>}

          <div className="p-4 flex flex-col gap-2 mt-auto">
            {promoCodes.some((promo) => promo.isActive && promo.showInPos && (promo.usageLimit === null || promo.usageCount < promo.usageLimit)) && (
              <div className="flex gap-1.5">
                <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Promo code" className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-2 py-2 text-xs uppercase" />
                <button type="button" onClick={applyPromoCode} className="shrink-0 rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10">Apply</button>
              </div>
            )}
            {orderType === "DINE_IN" && (
              <button type="button" onClick={printReceipt} disabled={!draftReceipt} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary px-2 py-2 text-sm font-bold text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40" title="Print current order">
                <Printer size={15} /> Print
              </button>
            )}
            <button onClick={handlePlaceOrder} disabled={submitting || orderItems.length === 0}
              className="w-full px-2 py-2 rounded-lg bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50">
              {submitting ? "Placing…" : (orderType === "DINE_IN" ? "Place Order" : "Place Order & Pay")}
            </button>
          </div>
        </section>
      </main>
      {receiptToPrint && <div className="printable-receipt"><ReceiptPreview order={receiptToPrint} /></div>}
    </div>
  );
}