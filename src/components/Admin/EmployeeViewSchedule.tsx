import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, Mail, Search, UserRound } from "lucide-react";
import { getAttendance, getMonthlyWageReport, getOpenShifts, getStaff } from "../../api/employee";
import type { AttendanceRow, OpenShift, Staff } from "../../types/employee";

type DatedAttendance = AttendanceRow & { attendanceDate: string };

function todayStr() { return new Date().toISOString().slice(0, 10); }
function formatTime(value: string | null) {
  return value ? new Date(value).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "Not recorded";
}
function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
function dateKey(value: string | Date) { return new Date(value).toISOString().slice(0, 10); }

export default function EmployeeViewSchedule() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
   const [monthAttendance, setMonthAttendance] = useState<DatedAttendance[]>([]); 
  const [events, setEvents] = useState<OpenShift[]>([]);
  const [monthlyHours, setMonthlyHours] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [date, setDate] = useState(todayStr());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStaff()
      .then((response) => {
        setStaff(response.data);
        setSelectedId((current) => current ?? response.data[0]?.id ?? null);
      })
      .catch(() => setError("Unable to load staff members."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setAttendance([]);
    getAttendance(date).then((response) => setAttendance(response.data)).catch(() => setError("Unable to load attendance for this date."));
  }, [date]);

  useEffect(() => {
    const monthStart = new Date(`${date.slice(0, 7)}-01T00:00:00`);
    const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
    Promise.all(Array.from({ length: daysInMonth }, (_, index) => {
      const day = new Date(monthStart);
      day.setDate(index + 1);
      const attendanceDate = day.toISOString().slice(0, 10);
      return getAttendance(attendanceDate).then((response) => ({ attendanceDate, rows: response.data }));
    })).then((responses) => {
      setMonthAttendance(responses.flatMap(({ attendanceDate, rows: responseRows }) => responseRows
        .filter((row) => row.staffId === selectedId)
        .map((row) => ({ ...row, attendanceDate }))));
    }).catch(() => setError("Unable to load monthly attendance."));
  }, [date, selectedId]);

  useEffect(() => {
    const monthStart = `${date.slice(0, 7)}-01`;
    const monthEndDate = new Date(`${monthStart}T00:00:00`);
    monthEndDate.setMonth(monthEndDate.getMonth() + 1, 0);
    const monthEnd = dateKey(monthEndDate);
    Promise.all([
      getOpenShifts({ startDate: monthStart, endDate: monthEnd }),
      getMonthlyWageReport(monthEndDate.getFullYear(), monthEndDate.getMonth() + 1),
    ]).then(([shiftResponse, wageResponse]) => {
      setEvents(shiftResponse.data.filter((shift) => shift.assignments.some((assignment) => assignment.staffId === selectedId)));
      const entry = wageResponse.data.find((item) => item.staffId === selectedId);
      setMonthlyHours(entry?.totalHours ?? 0);
    }).catch(() => setError("Unable to load schedule events."));
  }, [date, selectedId]);

  const visibleStaff = useMemo(
    () => staff.filter((member) => member.name.toLowerCase().includes(search.toLowerCase())),
    [staff, search],
  );
  const selectedStaff = staff.find((member) => member.id === selectedId) ?? visibleStaff[0] ?? null;
  const selectedAttendance = attendance.find((row) => row.staffId === selectedStaff?.id);
  const monthStartDate = new Date(`${date.slice(0, 7)}-01T00:00:00`);
  const monthDays = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth() + 1, 0).getDate();
  const firstDay = monthStartDate.getDay();
  const calendarCells = Array.from({ length: firstDay + monthDays }, (_, index) => index < firstDay ? null : index - firstDay + 1);
  const eventsByDate = new Map(events.map((event) => [dateKey(event.date), event]));
  const attendanceByDate = new Map(monthAttendance.map((row) => [row.attendanceDate, row]));
  const upcomingEvents = events.filter((event) => dateKey(event.date) >= dateKey(new Date())).sort((a, b) => dateKey(a.date).localeCompare(dateKey(b.date))).slice(0, 4);

  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm text-on-surface-variant">Loading staff schedules...</div>;

  return (
    <div className="min-h-screen bg-surface px-5 py-6 text-on-surface sm:px-8 sm:py-8">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary">Admin / Staff</p><h1 className="font-headline text-3xl text-primary">Staff View Schedule</h1><p className="mt-1 text-sm text-on-surface-variant">Select a staff member to view their real schedule and attendance.</p></div>
        <label className="flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-2 text-xs"><CalendarDays size={14} className="text-primary" /><input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="bg-transparent outline-none" /></label>
      </header>

      {error && <p className="mb-4 rounded-lg bg-error/10 px-3 py-2 text-xs text-error">{error}</p>}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-4">
          <div className="relative mb-4"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search staff" className="w-full rounded-lg bg-surface-container-low py-2 pl-9 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary/30" /></div>
          <div className="space-y-1">
            {visibleStaff.map((member) => <button key={member.id} onClick={() => setSelectedId(member.id)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors ${selectedStaff?.id === member.id ? "bg-primary text-on-primary" : "hover:bg-surface-container-low"}`}><div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-bold">{member.avatar ? <img src={member.avatar} alt="" className="h-full w-full object-cover" /> : member.name.charAt(0)}</div><span className="truncate text-xs font-medium">{member.name}</span></button>)}
            {!visibleStaff.length && <p className="px-2 py-4 text-xs text-on-surface-variant">No staff found.</p>}
          </div>
        </aside>

        {selectedStaff ? <main className="min-w-0">
          <section className="mb-6 rounded-2xl bg-primary p-5 text-on-primary sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/15 text-2xl font-bold">{selectedStaff.avatar ? <img src={selectedStaff.avatar} alt={selectedStaff.name} className="h-full w-full object-cover" /> : selectedStaff.name.charAt(0)}</div><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">{selectedStaff.title}</p><h2 className="mt-1 font-headline text-3xl">{selectedStaff.name}</h2><p className="mt-1 text-sm opacity-80">{selectedStaff.role} · {selectedStaff.department}</p><p className="mt-2 flex items-center gap-2 text-xs opacity-80"><Mail size={13} /> {selectedStaff.email}</p></div></div></section>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4"><div className="rounded-xl bg-surface-container-low p-4"><p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Schedule label</p><p className="mt-2 font-headline text-xl text-primary">{selectedStaff.scheduleLabel || "Unassign Shift"}</p></div><div className="rounded-xl bg-surface-container-low p-4"><p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Scheduled time</p><p className="mt-2 flex items-center gap-2 font-headline text-xl text-primary"><Clock size={17} />{selectedStaff.scheduleStartTime && selectedStaff.scheduleEndTime ? `${selectedStaff.scheduleStartTime}–${selectedStaff.scheduleEndTime}` : "Not set"}</p></div><div className="rounded-xl bg-surface-container-low p-4"><p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Monthly hours</p><p className="mt-2 font-headline text-xl text-primary">{monthlyHours === null ? "Loading..." : `${monthlyHours}h`}</p></div><div className="rounded-xl bg-surface-container-low p-4"><p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Selected date</p><p className="mt-2 font-headline text-xl text-primary">{formatDate(date).split(",")[0]}</p></div></div>

          <section className="mt-6 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-5"><div className="mb-5 flex items-center justify-between"><div><h3 className="font-headline text-xl text-primary">Schedule Calendar</h3><p className="mt-1 text-xs text-on-surface-variant">{monthStartDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p></div><CalendarDays size={20} className="text-primary" /></div><div className="mb-4 flex flex-wrap gap-3 text-[10px] text-on-surface-variant"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-500" /> Regular attendance</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-sky-500" /> Open shift</span></div><div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-outline-variant/15 bg-outline-variant/15">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="bg-surface-container-high py-2 text-center text-[10px] font-bold uppercase text-on-surface-variant">{day}</div>)}{calendarCells.map((day, index) => { const key = day ? `${date.slice(0, 7)}-${String(day).padStart(2, "0")}` : ""; const event = day ? eventsByDate.get(key) : undefined; const dayAttendance = day ? attendanceByDate.get(key) : undefined; const regular = !!dayAttendance?.checkIn; const openShift = !!dayAttendance?.openShiftAttended; const statusClass = regular && openShift ? "border-2 border-sky-500 bg-gradient-to-br from-emerald-500 to-sky-500 text-white" : regular ? "border-2 border-emerald-500 bg-emerald-500 text-white" : openShift ? "border-2 border-sky-500 bg-sky-500 text-white" : "border border-transparent bg-white text-on-surface"; return <div key={index} className={`min-h-20 p-2 text-[10px] ${statusClass} ${day === Number(date.slice(8, 10)) ? "ring-2 ring-inset ring-primary" : ""}`}>{day && <><div className="flex items-center justify-center"><span className="text-base font-bold leading-none">{day}</span></div><div className="mt-1 flex justify-center gap-0.5">{regular && <i className="h-2 w-2 rounded-full bg-white" />}{openShift && <i className="h-2 w-2 rounded-full bg-white" />}</div>{event && <div className="mt-1 rounded-md bg-white/20 p-1 text-[9px]"><p className="truncate font-semibold">{event.label}</p><p>{event.startTime}–{event.endTime}</p></div>}</>}</div>; })}</div></section>

          <section className="mt-6 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-5"><div className="mb-4 flex items-center justify-between"><div><h3 className="font-headline text-xl text-primary">Upcoming Events</h3><p className="mt-1 text-xs text-on-surface-variant">Events assigned to {selectedStaff.name}</p></div><Clock size={20} className="text-tertiary" /></div>{upcomingEvents.length ? <div className="space-y-2">{upcomingEvents.map((event) => <div key={event.id} className="flex items-center justify-between rounded-xl bg-surface-container-low p-3"><div><p className="text-sm font-semibold">{event.label}</p><p className="text-xs text-on-surface-variant">{formatDate(dateKey(event.date))}</p></div><span className="text-xs text-on-surface-variant">{event.startTime}–{event.endTime}</span></div>)}</div> : <p className="py-4 text-center text-xs text-on-surface-variant">No upcoming events assigned.</p>}</section>

          <section className="mt-6 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-5"><div className="mb-5 flex items-center justify-between"><div><h3 className="font-headline text-xl text-primary">Attendance Details</h3><p className="mt-1 text-xs text-on-surface-variant">{formatDate(date)}</p></div><UserRound size={20} className="text-primary" /></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="rounded-xl bg-surface-container-low p-4"><p className="text-[10px] uppercase text-on-surface-variant">Start</p><p className="mt-2 text-lg font-semibold">{formatTime(selectedAttendance?.checkIn ?? null)}</p></div><div className="rounded-xl bg-surface-container-low p-4"><p className="text-[10px] uppercase text-on-surface-variant">End</p><p className="mt-2 text-lg font-semibold">{formatTime(selectedAttendance?.checkOut ?? null)}</p></div><div className="rounded-xl bg-surface-container-low p-4"><p className="text-[10px] uppercase text-on-surface-variant">Hours</p><p className="mt-2 text-lg font-semibold">{selectedAttendance?.regularHours ?? "Not recorded"}</p></div></div></section>
        </main> : <div className="flex min-h-64 items-center justify-center rounded-2xl bg-surface-container-low text-sm text-on-surface-variant">No staff member selected.</div>}
      </div>
    </div>
  );
}
