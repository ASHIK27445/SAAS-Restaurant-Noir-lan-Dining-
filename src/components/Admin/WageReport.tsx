import { useEffect, useState } from "react";
import { Calendar, TrendingUp, Clock } from "lucide-react";
import { getAttendance, getWeeklyWageReport, getMonthlyWageReport, getYearlyWageReport } from "../../api/employee";
import type { AttendanceRow, WageSummaryReport, YearlyWageReport } from "../../types/employee";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function todayStr() { return new Date().toISOString().slice(0, 10); }

export default function WageReport() {
  const [view, setView] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");

  const [date, setDate] = useState(todayStr());
  const [daily, setDaily] = useState<AttendanceRow[]>([]);

  const [weekStart, setWeekStart] = useState(todayStr());
  const [weekly, setWeekly] = useState<WageSummaryReport | null>(null);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [monthly, setMonthly] = useState<WageSummaryReport | null>(null);
  const [yearly, setYearly] = useState<YearlyWageReport | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const p =
      view === "daily" ? getAttendance(date).then((r) => setDaily(r.data)) :
      view === "weekly" ? getWeeklyWageReport(weekStart).then((r) => setWeekly(r)) :
      view === "monthly" ? getMonthlyWageReport(year, month).then((r) => setMonthly(r)) :
      getYearlyWageReport(year).then((r) => setYearly(r));
    p.catch((err) => setError(err.message || "Failed to load report")).finally(() => setLoading(false));
  }, [view, date, weekStart, year, month]);

  const dailyTotalWage = daily.reduce((s, r) => s + Number(r.totalWage ?? 0), 0);
  const dailyTotalHours = daily.reduce((s, r) => s + Number(r.regularHours ?? 0) + Number(r.openShiftHours ?? 0), 0);

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen">
      <main className="max-w-5xl mx-auto w-full px-5 py-8 sm:px-8 sm:py-10">
        <header className="mb-6">
          <h1 className="font-headline text-2xl sm:text-3xl text-primary tracking-tight">Wage Reports</h1>
          <p className="text-on-surface-variant text-sm mt-1">Daily, weekly, monthly and yearly payroll — built from saved attendance history.</p>
        </header>

        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl w-fit mb-6 overflow-x-auto">
          {(["daily", "weekly", "monthly", "yearly"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${view === v ? "bg-surface shadow-sm text-primary" : "text-on-surface-variant"}`}>
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Calendar size={16} className="text-on-surface-variant" />
          {view === "daily" && <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none" />}
          {view === "weekly" && <input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} className="bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none" />}
          {view === "monthly" && (
            <>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none">
                {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
              <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-24 bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none" />
            </>
          )}
          {view === "yearly" && <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-24 bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none" />}
        </div>

        {loading ? (
          <p className="text-sm text-on-surface-variant py-8">Loading…</p>
        ) : error ? (
          <p className="text-sm text-error py-8">{error}</p>
        ) : view === "daily" ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-surface-container-lowest rounded-xl p-4">
                <p className="text-[11px] text-on-surface-variant uppercase tracking-wide mb-1 flex items-center gap-1"><Clock size={12} /> Total Hours</p>
                <p className="font-headline text-2xl text-primary">{dailyTotalHours.toFixed(1)}</p>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-4">
                <p className="text-[11px] text-on-surface-variant uppercase tracking-wide mb-1 flex items-center gap-1"><TrendingUp size={12} /> Total Wage</p>
                <p className="font-headline text-2xl text-primary">${dailyTotalWage.toFixed(2)}</p>
              </div>
            </div>
            <SimpleTable
              rows={daily.map((r) => ({
                name: r.staffName,
                hours: (Number(r.regularHours ?? 0) + Number(r.openShiftHours ?? 0)).toFixed(1),
                wage: r.totalWage ? Number(r.totalWage).toFixed(2) : "—",
              }))}
            />
          </>
        ) : (view === "weekly" || view === "monthly") && (weekly || monthly) ? (
          <>
            {(() => {
              const rep = view === "weekly" ? weekly! : monthly!;
              return (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-surface-container-lowest rounded-xl p-4">
                      <p className="text-[11px] text-on-surface-variant uppercase tracking-wide mb-1 flex items-center gap-1"><Clock size={12} /> Total Hours</p>
                      <p className="font-headline text-2xl text-primary">{rep.meta.grandTotalHours.toFixed(1)}</p>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl p-4">
                      <p className="text-[11px] text-on-surface-variant uppercase tracking-wide mb-1 flex items-center gap-1"><TrendingUp size={12} /> Total Payroll</p>
                      <p className="font-headline text-2xl text-primary">${rep.meta.grandTotalWage.toFixed(2)}</p>
                    </div>
                  </div>
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-outline-variant/10 text-on-surface-variant text-[11px] uppercase tracking-wider">
                        <th className="py-2 pr-4 font-medium">Staff</th>
                        <th className="py-2 pr-4 font-medium text-right">Days Worked</th>
                        <th className="py-2 pr-4 font-medium text-right">Total Hours</th>
                        <th className="py-2 pr-0 font-medium text-right">Total Wage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rep.data.map((d) => (
                        <tr key={d.staffId} className="border-b border-outline-variant/5 last:border-0">
                          <td className="py-2.5 pr-4 font-medium text-on-surface">{d.staffName}</td>
                          <td className="py-2.5 pr-4 text-right text-on-surface-variant">{d.daysWorked}</td>
                          <td className="py-2.5 pr-4 text-right text-on-surface-variant">{d.totalHours.toFixed(1)}</td>
                          <td className="py-2.5 pr-0 text-right font-semibold text-primary">${d.totalWage.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              );
            })()}
          </>
        ) : view === "yearly" && yearly ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-surface-container-lowest rounded-xl p-4">
                <p className="text-[11px] text-on-surface-variant uppercase tracking-wide mb-1 flex items-center gap-1"><Clock size={12} /> Total Hours</p>
                <p className="font-headline text-2xl text-primary">{yearly.meta.grandTotalHours.toFixed(1)}</p>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-4">
                <p className="text-[11px] text-on-surface-variant uppercase tracking-wide mb-1 flex items-center gap-1"><TrendingUp size={12} /> Total Payroll</p>
                <p className="font-headline text-2xl text-primary">${yearly.meta.grandTotalWage.toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {yearly.data.map((m) => {
                const max = Math.max(1, ...yearly.data.map((x) => x.totalWage));
                return (
                  <div key={m.month} className="flex items-center gap-3">
                    <span className="text-xs text-on-surface-variant w-16 shrink-0">{MONTH_NAMES[m.month - 1].slice(0, 3)}</span>
                    <div className="flex-1 bg-surface-container-low rounded-full h-4 overflow-hidden">
                      <div className="bg-primary-container h-full rounded-full" style={{ width: `${(m.totalWage / max) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-on-surface w-20 text-right">${m.totalWage.toFixed(0)}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

function SimpleTable({ rows }: { rows: { name: string; hours: string; wage: string }[] }) {
  if (rows.length === 0) return <p className="text-sm text-on-surface-variant text-center py-10">No attendance recorded.</p>;
  return (
    <table className="w-full text-left border-collapse text-sm">
      <thead>
        <tr className="border-b border-outline-variant/10 text-on-surface-variant text-[11px] uppercase tracking-wider">
          <th className="py-2 pr-4 font-medium">Staff</th>
          <th className="py-2 pr-4 font-medium text-right">Hours</th>
          <th className="py-2 pr-0 font-medium text-right">Wage</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b border-outline-variant/5 last:border-0">
            <td className="py-2.5 pr-4 font-medium text-on-surface">{r.name}</td>
            <td className="py-2.5 pr-4 text-right text-on-surface-variant">{r.hours}</td>
            <td className="py-2.5 pr-0 text-right font-semibold text-primary">${r.wage}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}