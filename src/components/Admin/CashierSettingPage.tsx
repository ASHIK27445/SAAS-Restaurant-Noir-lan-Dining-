import { useEffect, useState } from "react";
import { getCashierSetting, setCashierSetting } from "../../api/order";
import { getStaff } from "../../api/employee";

export default function CashierSettingPage() {
  const [staff, setStaff] = useState<{ id: string; name: string; role: string }[]>([]);
  const [current, setCurrent] = useState<{ id: string; name: string; role: string } | null>(null);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getStaff().then((res) => setStaff(res.data.map((s: any) => ({ id: s.id, name: s.name, role: s.role }))));
    getCashierSetting().then((res) => setCurrent(res.data?.activeCashier ?? null));
  }, []);

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
    <div className="bg-surface text-on-surface font-body min-h-screen p-6 max-w-md">
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
    </div>
  );
}