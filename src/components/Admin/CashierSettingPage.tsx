import { useEffect, useState } from "react";
import ReceiptPreview from "./ReceiptPreview";
import type { ReceiptOrder } from "./ReceiptPreview";
import { getCashierSetting, setCashierSetting } from "../../api/order";
import { getStaff } from "../../api/employee";

const PREVIEW_RECEIPT: ReceiptOrder = {
  orderNumber: 3249,
  orderType: "DINE_IN",
  serverName: "Marco",
  tableNo: "T4",
  customerName: "Guest",
  paymentMethod: "cash",
  subtotal: "24.00",
  tax: "1.92",
  serviceCharge: "5.00",
  total: "30.92",
  items: [
    { quantity: 2, unitPrice: "8.00", note: null, menuItem: { name: "Herb Roast" } },
    { quantity: 1, unitPrice: "8.00", note: "No onions", menuItem: { name: "Garden Bowl" } },
  ],
};

export default function CashierSettingPage() {
  const [staff, setStaff] = useState<{ id: string; name: string; role: string }[]>([]);
  const [current, setCurrent] = useState<{ id: string; name: string; role: string } | null>(null);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [autoPrintReceipt, setAutoPrintReceipt] = useState(() => localStorage.getItem("pos-auto-print-receipt") !== "false");

  useEffect(() => {
    getStaff().then((res) => setStaff(res.data.map((s: any) => ({ id: s.id, name: s.name, role: s.role }))));
    getCashierSetting().then((res) => setCurrent(res.data?.activeCashier ?? null));
  }, []);

  useEffect(() => {
    localStorage.setItem("pos-auto-print-receipt", String(autoPrintReceipt));
  }, [autoPrintReceipt]);

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await setCashierSetting(selected);
      setCurrent(res.data.activeCashier ?? null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen max-w-3xl p-6">
      <h1 className="font-headline text-2xl text-primary mb-4">Cashier Setting</h1>
      <p className="text-sm text-on-surface-variant mb-2">
        Current active cashier: <strong className="text-on-surface">{current ? `${current.name} (${current.role})` : "None set"}</strong>
      </p>
      <p className="text-xs text-on-surface-variant mb-4">Change this whenever the shift's cashier changes.</p>
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm mb-3">
        <option value="">Select staff…</option>
        {staff.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
      </select>
      <button onClick={handleSave} disabled={saving || !selected} className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
        {saving ? "Saving…" : "Set Active Cashier"}
      </button>

      <label className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-surface-container-low px-4 py-3 text-sm">
        <span>
          <span className="block font-semibold text-on-surface">Automatically print receipt</span>
          <span className="block text-xs text-on-surface-variant">Print after every order is placed. Manual printing is always available in POS.</span>
        </span>
        <input type="checkbox" checked={autoPrintReceipt} onChange={(e) => setAutoPrintReceipt(e.target.checked)} className="h-4 w-4 shrink-0 accent-primary" />
      </label>

      <div className="mt-3 rounded-xl border border-outline-variant/20 px-4 py-3">
        <p className="text-sm font-semibold text-on-surface">Manual printing</p>
        <p className="mt-1 text-xs text-on-surface-variant">The <strong>Print</strong> button is available above Place Order for dine-in orders, so the current cart can be printed without submitting it.</p>
      </div>

      <section className="mt-8">
        <h2 className="font-headline text-lg text-primary">Receipt Preview</h2>
        <p className="mt-1 text-xs text-on-surface-variant">This is the design used when a receipt is printed from POS.</p>
        <div className="mt-4 max-w-sm rounded-xl bg-surface-container-low p-3">
          <ReceiptPreview order={PREVIEW_RECEIPT} />
        </div>
      </section>
    </div>
  );
}