import { useEffect, useState } from "react";
import { Calendar, Check, DollarSign } from "lucide-react";
import { getAttendance, checkIn, checkOut, toggleOpenShiftAttendance, setBonus } from "../../api/employee";
import type { AttendanceRow } from "../../types/employee";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function formatTime(iso: string | null) {
  return iso ? new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "—";
}

function BonusCell({ row, date, onSaved }: { row: AttendanceRow; date: string; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(row.bonus);
  const [saving, setSaving] = useState(false);

  async function save() {
    const n = Number(value);
    if (Number.isNaN(n) || n < 0) return;
    setSaving(true);
    try {
      await setBonus(row.staffId, date, n);
      onSaved();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <button onClick={() => setEditing(true)} className="text-xs text-on-surface-variant hover:text-primary flex items-center gap-1">
        <DollarSign size={11} /> {Number(row.bonus) > 0 ? Number(row.bonus).toFixed(2) : "Add"}
      </button>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <input type="number" min={0} step={0.01} value={value} onChange={(e) => setValue(e.target.value)} className="w-16 bg-surface-container-low rounded px-1.5 py-0.5 text-xs border border-outline-variant/20" />
      <button onClick={save} disabled={saving} className="text-primary text-xs font-semibold">{saving ? "…" : "✓"}</button>
    </div>
  );
}

export default function DailyAttendance() {
  const [date, setDate] = useState(todayStr());
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyStaffId, setBusyStaffId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    return getAttendance(date).then((res) => setRows(res.data)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [date]);

  async function handleCheckIn(staffId: string) {
    setBusyStaffId(staffId);
    try { await checkIn(staffId, date); await load(); } finally { setBusyStaffId(null); }
  }
  async function handleCheckOut(staffId: string) {
    setBusyStaffId(staffId);
    try { await checkOut(staffId, date); await load(); } finally { setBusyStaffId(null); }
  }
  async function handleOpenShiftToggle(row: AttendanceRow) {
    if (!row.openShiftAssignmentId) return;
    setBusyStaffId(row.staffId);
    try {
      await toggleOpenShiftAttendance({
        staffId: row.staffId, date, attended: !row.openShiftAttended, openShiftAssignmentId: row.openShiftAssignmentId,
      });
      await load();
    } finally {
      setBusyStaffId(null);
    }
  }

  const totalWage = rows.reduce((s, r) => s + Number(r.totalWage ?? 0), 0);
  const totalHours = rows.reduce((s, r) => s + Number(r.regularHours ?? 0) + Number(r.openShiftHours ?? 0), 0);

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen">
      <main className="max-w-6xl mx-auto w-full px-5 py-8 sm:px-8 sm:py-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl text-primary tracking-tight">Daily Attendance</h1>
            <p className="text-on-surface-variant text-sm mt-1">Check staff in and out, and record any open-shift work or bonuses.</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-on-surface-variant" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none" />
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-surface-container-lowest rounded-xl p-4">
            <p className="text-[11px] text-on-surface-variant uppercase tracking-wide mb-1">Total Hours</p>
            <p className="font-headline text-2xl text-primary">{totalHours.toFixed(1)}</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-4">
            <p className="text-[11px] text-on-surface-variant uppercase tracking-wide mb-1">Total Wages</p>
            <p className="font-headline text-2xl text-primary">${totalWage.toFixed(2)}</p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-on-surface-variant py-8">Loading…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant/10 text-on-surface-variant text-[11px] uppercase tracking-wider">
                  <th className="py-2 pr-4 font-medium">Staff</th>
                  <th className="py-2 pr-3 font-medium text-center">Start</th>
                  <th className="py-2 pr-3 font-medium text-center">End</th>
                  <th className="py-2 pr-3 font-medium text-center">Open Shift</th>
                  <th className="py-2 pr-3 font-medium text-right">Hours</th>
                  <th className="py-2 pr-3 font-medium text-right">Wage</th>
                  <th className="py-2 pr-3 font-medium text-right">Open Shift Wage</th>
                  <th className="py-2 pr-3 font-medium text-right">Bonus</th>
                  <th className="py-2 pr-0 font-medium text-right">Total Wage</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const busy = busyStaffId === row.staffId;
                  const totalHrs = Number(row.regularHours ?? 0) + Number(row.openShiftHours ?? 0);
                  return (
                    <tr key={row.staffId} className="border-b border-outline-variant/5 last:border-0">
                      <td className="py-2.5 pr-4">
                        <p className="font-medium text-on-surface">{row.staffName}</p>
                        <p className="text-[10px] text-on-surface-variant">{row.scheduleLabel ?? row.staffRole} • {row.scheduleStartTime}–{row.scheduleEndTime}</p>
                      </td>
                      <td className="py-2.5 pr-3 text-center">
                        {row.checkIn ? (
                          <span className="text-xs text-on-surface-variant">{formatTime(row.checkIn)}</span>
                        ) : (
                          <button disabled={busy} onClick={() => handleCheckIn(row.staffId)} className="w-5 h-5 rounded border border-outline-variant/40 hover:border-primary hover:bg-primary/10 transition-colors inline-flex items-center justify-center disabled:opacity-40" title="Mark attendance start" />
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-center">
                        {row.checkOut ? (
                          <span className="text-xs text-on-surface-variant">{formatTime(row.checkOut)}</span>
                        ) : row.checkIn ? (
                          <button disabled={busy} onClick={() => handleCheckOut(row.staffId)} className="w-5 h-5 rounded border border-outline-variant/40 hover:border-primary hover:bg-primary/10 transition-colors inline-flex items-center justify-center disabled:opacity-40" title="Mark attendance end" />
                        ) : (
                          <span className="text-xs text-on-surface-variant/30">—</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-center">
                        {row.hasOpenShiftToday ? (
                          <button
                            disabled={busy}
                            onClick={() => handleOpenShiftToggle(row)}
                            title={row.openShiftLabel ?? "Open shift"}
                            className={`w-5 h-5 rounded border inline-flex items-center justify-center transition-colors disabled:opacity-40 ${
                              row.openShiftAttended ? "bg-tertiary border-tertiary text-on-tertiary" : "border-outline-variant/40 hover:border-tertiary hover:bg-tertiary/10"
                            }`}
                          >
                            {row.openShiftAttended && <Check size={12} />}
                          </button>
                        ) : (
                          <span className="text-xs text-on-surface-variant/30">—</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-right text-on-surface">{totalHrs > 0 ? totalHrs.toFixed(1) : "—"}</td>
                      <td className="py-2.5 pr-3 text-right text-on-surface-variant">{row.regularWage ? `$${Number(row.regularWage).toFixed(2)}` : "—"}</td>
                      <td className="py-2.5 pr-3 text-right text-on-surface-variant">{row.openShiftWage ? `$${Number(row.openShiftWage).toFixed(2)}` : "—"}</td>
                      <td className="py-2.5 pr-3 text-right"><BonusCell row={row} date={date} onSaved={load} /></td>
                      <td className="py-2.5 pr-0 text-right font-semibold text-primary">{row.totalWage ? `$${Number(row.totalWage).toFixed(2)}` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}