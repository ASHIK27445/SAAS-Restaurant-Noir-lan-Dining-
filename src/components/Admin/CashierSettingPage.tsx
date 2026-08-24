import { CheckCircle2, Printer, Save, Settings2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import ReceiptPreview from "./ReceiptPreview";
import type { ReceiptOrder } from "./ReceiptPreview";
import { createPromoCode, deletePromoCode, getCashierSetting, getPosSettings, getPromoCodes, setCashierSetting, updatePosSettings, updatePromoCode, type PosSettings, type PromoCode } from "../../api/order";
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
  const [settings, setSettings] = useState<PosSettings | null>(null);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState("10");
  const [promoLimit, setPromoLimit] = useState("");
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [staffQuery, cashierQuery, settingsQuery, promosQuery] = useQueries({
    queries: [
      { queryKey: ["staff", "waiters"], queryFn: getStaff, staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
      { queryKey: ["cashier-setting"], queryFn: getCashierSetting, staleTime: 30 * 1000, refetchOnWindowFocus: false },
      { queryKey: ["pos-settings"], queryFn: getPosSettings, staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
      { queryKey: ["promo-codes"], queryFn: getPromoCodes, staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
    ],
  });

  function showAlert(type: "success" | "error", message: string) {
    setAlert({ type, message });
    window.setTimeout(() => setAlert(null), 3200);
  }

  useEffect(() => {
    if (staffQuery.data) setStaff(staffQuery.data.data.map((s: any) => ({ id: s.id, name: s.name, role: s.role })));
    if (cashierQuery.data) setCurrent(cashierQuery.data.data?.activeCashier ?? null);
    if (settingsQuery.data) setSettings(settingsQuery.data.data);
    if (promosQuery.data) setPromos(promosQuery.data.data);
  }, [staffQuery.data, cashierQuery.data, settingsQuery.data, promosQuery.data]);

  async function saveSettings(message = "POS settings saved") {
    if (!settings) return;
    try {
      const res = await updatePosSettings({ taxRate: Number(settings.taxRate), serviceCharge: Number(settings.serviceCharge), autoPrintReceipt: settings.autoPrintReceipt });
      setSettings(res.data);
      showAlert("success", message);
    } catch (error: any) {
      showAlert("error", error.message || "Could not save POS settings");
    }
  }

  async function savePromo() {
    const code = promoCode.trim().toUpperCase();
    const discount = Number(promoDiscount);
    if (!code || !Number.isFinite(discount) || discount <= 0 || discount > 100) {
      showAlert("error", "Enter a valid promo code and discount between 1% and 100%");
      return;
    }
    try {
      const input = { code, discountPercent: discount, usageLimit: promoLimit === "" ? null : Number(promoLimit), isActive: true, showInPos: true };
      const result = editingPromoId ? await updatePromoCode(editingPromoId, input) : await createPromoCode(input);
      setPromos((current) => editingPromoId ? current.map((promo) => promo.id === editingPromoId ? result.data : promo) : [result.data, ...current]);
      setPromoCode("");
      setPromoDiscount("10");
      setPromoLimit("");
      setEditingPromoId(null);
      showAlert("success", editingPromoId ? "Promo code updated" : "Promo code created");
    } catch (error: any) {
      showAlert("error", error.message || "Could not save promo code");
    }
  }

  function editPromo(promo: PromoCode) {
    setEditingPromoId(promo.id);
    setPromoCode(promo.code);
    setPromoDiscount(String(promo.discountPercent));
    setPromoLimit(promo.usageLimit === null ? "" : String(promo.usageLimit));
  }

  async function deletePromo(id: string) {
    try {
      await deletePromoCode(id);
      setPromos((current) => current.filter((promo) => promo.id !== id));
      if (editingPromoId === id) setEditingPromoId(null);
      showAlert("success", "Promo code deleted");
    } catch (error: any) {
      showAlert("error", error.message || "Could not delete promo code");
    }
  }

  async function updatePromo(id: string, changes: Partial<PromoCode>) {
    try {
      const res = await updatePromoCode(id, changes);
      setPromos((current) => current.map((promo) => promo.id === id ? res.data : promo));
      showAlert("success", "Promo code setting updated");
    } catch (error: any) {
      showAlert("error", error.message || "Could not update promo code");
    }
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await setCashierSetting(selected);
      setCurrent(res.data.activeCashier ?? null);
      showAlert("success", "Active cashier updated");
    } catch (error: any) {
      showAlert("error", error.message || "Could not update active cashier");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface px-5 py-6 text-on-surface font-body sm:px-8 sm:py-8">
      {alert && (
        <div className={`fixed right-5 top-5 z-50 flex max-w-sm items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${alert.type === "success" ? "bg-primary" : "bg-error"}`} role="alert">
          {alert.type === "success" ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
          <span>{alert.message}</span>
        </div>
      )}
      <header className="mx-auto mb-8 max-w-6xl">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-primary p-3 text-on-primary"><Settings2 size={22} /></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">POS control center</p>
            <h1 className="mt-1 font-headline text-3xl text-primary">Cashier Settings</h1>
            <p className="mt-1 text-sm text-on-surface-variant">Manage who is on the till, pricing rules, promotions, and receipts.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-5">
          <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">On duty now</p>
            <p className="mt-3 font-headline text-2xl text-primary">{current?.name ?? "No cashier selected"}</p>
            <p className="mt-1 text-sm text-on-surface-variant">{current ? current.role : "Choose a staff member for the active shift."}</p>
            <div className="mt-5 flex gap-2">
              <select value={selected} onChange={(e) => setSelected(e.target.value)} className="min-w-0 flex-1 rounded-xl bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20">
        <option value="">Select staff…</option>
        {staff.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
              </select>
              <button onClick={handleSave} disabled={saving || !selected} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-on-primary disabled:opacity-50"><Save size={14} />{saving ? "Saving" : "Set"}</button>
            </div>
          </section>

          <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/10">
            <div className="flex items-center gap-2"><Printer size={17} className="text-primary" /><h2 className="font-headline text-lg text-primary">Receipt behavior</h2></div>
            <label className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-surface-container-low px-4 py-3 text-sm">
        <span>
          <span className="block font-semibold text-on-surface">Automatically print receipt</span>
          <span className="block text-xs text-on-surface-variant">Print after every order is placed. Manual printing is always available in POS.</span>
        </span>
        <input type="checkbox" checked={settings?.autoPrintReceipt ?? false} onChange={(e) => setSettings((current) => current ? { ...current, autoPrintReceipt: e.target.checked } : current)} className="h-4 w-4 shrink-0 accent-primary" />
            </label>
            <button type="button" onClick={() => saveSettings("Receipt setting saved")} disabled={!settings} className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-primary px-3 py-2 text-xs font-semibold text-primary disabled:opacity-50"><Save size={14} /> Save receipt setting</button>
          </section>

          <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/10">
            <h2 className="font-headline text-lg text-primary">Pricing rules</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-xs font-semibold text-secondary">Tax (%)<input type="number" min="0" step="0.01" value={settings?.taxRate ?? ""} onChange={(e) => setSettings((current) => current ? { ...current, taxRate: e.target.value } : current)} className="mt-1 w-full rounded-xl bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20" /></label>
              <label className="text-xs font-semibold text-secondary">Service charge<input type="number" min="0" step="0.01" value={settings?.serviceCharge ?? ""} onChange={(e) => setSettings((current) => current ? { ...current, serviceCharge: e.target.value } : current)} className="mt-1 w-full rounded-xl bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20" /></label>
            </div>
            <button type="button" onClick={() => saveSettings("Tax and service charge saved")} disabled={!settings} className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-on-primary disabled:opacity-50"><Save size={14} /> Save pricing</button>
          </section>
        </div>

        <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-headline text-lg text-primary">Promo Codes</h2>
            <p className="mt-1 text-xs text-on-surface-variant">Create, edit, activate, delete, and choose which codes appear in POS.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_6rem_6rem_auto]">
          <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Code" className="rounded-lg bg-surface-container-lowest px-3 py-2 text-sm uppercase" />
          <input type="number" min="1" max="100" value={promoDiscount} onChange={(e) => setPromoDiscount(e.target.value)} placeholder="% off" className="rounded-lg bg-surface-container-lowest px-3 py-2 text-sm" />
          <input type="number" min="1" value={promoLimit} onChange={(e) => setPromoLimit(e.target.value)} placeholder="Limit" className="rounded-lg bg-surface-container-lowest px-3 py-2 text-sm" />
          <button type="button" onClick={savePromo} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-on-primary">{editingPromoId ? "Update" : "Add"}</button>
        </div>
        <div className="mt-3 space-y-2">
          {promos.map((promo) => (
            <div key={promo.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-container-low px-3 py-3 text-xs">
              <span className="min-w-0 flex-1 font-semibold">{promo.code} <span className="font-normal text-on-surface-variant">({promo.discountPercent}% off)</span></span>
              <label className="flex items-center gap-1 text-on-surface-variant"><input type="checkbox" checked={promo.isActive} onChange={(e) => updatePromo(promo.id, { isActive: e.target.checked })} /> Active</label>
              <label className="flex items-center gap-1 text-on-surface-variant"><input type="checkbox" checked={promo.showInPos} onChange={(e) => updatePromo(promo.id, { showInPos: e.target.checked })} /> POS</label>
              <button type="button" onClick={() => editPromo(promo)} className="font-semibold text-primary">Edit</button>
              <button type="button" onClick={() => deletePromo(promo.id)} className="font-semibold text-error">Delete</button>
            </div>
          ))}
          {promos.length === 0 && <p className="text-xs text-on-surface-variant">No promo codes created.</p>}
        </div>
        </section>

        <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/10">
        <h2 className="font-headline text-lg text-primary">Receipt Preview</h2>
        <p className="mt-1 text-xs text-on-surface-variant">This is the design used when a receipt is printed from POS.</p>
        <div className="mt-4 max-w-sm rounded-xl bg-surface-container-low p-3">
          <ReceiptPreview order={PREVIEW_RECEIPT} />
        </div>
        </section>
      </main>
    </div>
  );
}