import { useEffect, useMemo, useState } from "react";
import { Armchair, ChefHat, Coffee, DoorOpen, Users } from "lucide-react";
import { getAttendance, getStaff } from "../../api/employee";
import type { AttendanceRow, Staff } from "../../types/employee";

type FloorCategory = "KITCHEN" | "DINING" | "BAR" | "HOST";

type CategoryConfig = {
  label: string;
  icon: typeof Users;
  roles: string[];
  text: string;
  tagBg: string;
  tint: string;
  ring: string;
  roomBorder: string;
  spine: string;
};

const CATEGORY_CONFIG: Record<FloorCategory, CategoryConfig> = {
  KITCHEN: {
    label: "Kitchen", icon: ChefHat, roles: ["Chef", "SousChef"],
    text: "text-primary", tagBg: "bg-primary text-on-primary", tint: "bg-primary/8",
    ring: "ring-primary/25", roomBorder: "border-primary/30", spine: "border-primary",
  },
  DINING: {
    label: "Dining", icon: Armchair, roles: ["Waiter"],
    text: "text-secondary", tagBg: "bg-secondary text-on-secondary", tint: "bg-secondary/10",
    ring: "ring-secondary/25", roomBorder: "border-secondary/30", spine: "border-secondary",
  },
  BAR: {
    label: "Bar", icon: Coffee, roles: [],
    text: "text-tertiary", tagBg: "bg-tertiary text-on-tertiary", tint: "bg-tertiary/8",
    ring: "ring-tertiary/25", roomBorder: "border-tertiary/30", spine: "border-tertiary",
  },
  HOST: {
    label: "Host", icon: DoorOpen, roles: ["Cashier", "Manager", "Admin"],
    text: "text-on-surface-variant", tagBg: "bg-outline text-surface", tint: "bg-outline/10",
    ring: "ring-outline/25", roomBorder: "border-outline/30", spine: "border-outline",
  },
};

function todayStr() { return new Date().toISOString().slice(0, 10); }
function formatTime(value: string | null) {
  return value ? new Date(value).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "—";
}
function categoryForRole(role: string): FloorCategory {
  const category = (Object.keys(CATEGORY_CONFIG) as FloorCategory[]).find((key) => CATEGORY_CONFIG[key].roles.includes(role));
  return category ?? "HOST";
}

export default function FloorAdmin() {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [category, setCategory] = useState<FloorCategory | "all">("all");
  const [loading, setLoading] = useState(true);

  function load() {
    return Promise.all([
      getAttendance(todayStr()).then((response) => setRows(response.data)),
      getStaff().then((response) => setStaff(response.data)),
    ]).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const onFloor = rows.filter((row) => row.checkIn && !row.checkOut);
  const ended = rows.filter((row) => row.checkOut);
  const upcoming = rows.filter((row) => !row.checkIn);
  const visibleOnFloor = category === "all" ? onFloor : onFloor.filter((row) => categoryForRole(row.staffRole) === category);
  const staffById = useMemo(() => new Map(staff.map((member) => [member.id, member])), [staff]);
  const categoryCounts = useMemo(() => {
    const counts: Record<FloorCategory, number> = { KITCHEN: 0, DINING: 0, BAR: 0, HOST: 0 };
    onFloor.forEach((row) => { counts[categoryForRole(row.staffRole)] += 1; });
    return counts;
  }, [onFloor]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-on-surface-variant font-headline italic">
        Reading the floor…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-5 py-6 text-on-surface sm:px-8 sm:py-8">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary">Operations</p>
          <h1 className="font-headline text-3xl text-primary">Floor Distribution</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Live overview of today&apos;s staff placement and service coverage.</p>
        </div>
        <span className="text-sm font-medium text-primary flex items-center gap-2 bg-primary/8 px-3 py-1.5 rounded-full">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Live today
        </span>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-primary-container/20 p-4"><p className="text-[10px] uppercase tracking-wider text-on-surface-variant">On floor</p><p className="mt-1 font-headline text-3xl text-primary">{onFloor.length}</p></div>
        <div className="rounded-xl bg-surface-container-low p-4"><p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Upcoming</p><p className="mt-1 font-headline text-3xl text-secondary">{upcoming.length}</p></div>
        <div className="rounded-xl bg-surface-container-low p-4"><p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Shift ended</p><p className="mt-1 font-headline text-3xl text-tertiary">{ended.length}</p></div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section
          className="rounded-2xl border border-outline-variant/15 bg-surface-container-low p-4 sm:p-6"
          style={{
            backgroundImage:
              "radial-gradient(circle, color-mix(in srgb, var(--color-outline-variant) 55%, transparent) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tertiary mb-1 block">Live Blueprint</span>
              <h2 className="font-headline text-xl text-primary">Service Areas</h2>
              <p className="text-xs text-on-surface-variant">Current staff grouped by operating area</p>
            </div>
            <Users size={20} className="text-primary" />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {(Object.keys(CATEGORY_CONFIG) as FloorCategory[]).map((key) => {
              const config = CATEGORY_CONFIG[key];
              const Icon = config.icon;
              const staff = onFloor.filter((row) => categoryForRole(row.staffRole) === key);
              return (
                <div key={key} className={`relative rounded-2xl border-2 border-dashed ${config.roomBorder} bg-surface pt-7 pb-4 px-4`}>
                  <div className={`absolute -top-3.5 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${config.tagBg}`}>
                    <Icon size={11} /> {config.label}
                  </div>
                  <span className="absolute top-3 right-4 text-[10px] text-on-surface-variant">{categoryCounts[key]} active</span>

                  {staff.length ? (
                    <div className="flex flex-wrap gap-3 mt-1">
                      {staff.map((row) => (
                        <div key={row.staffId} className={`flex flex-col items-center gap-1 w-20 text-center rounded-xl p-2 ${config.tint} ring-1 ${config.ring}`}>
                          <div className="relative">
                            {staffById.get(row.staffId)?.avatar ? <img src={staffById.get(row.staffId)?.avatar ?? ""} alt={row.staffName} className="w-9 h-9 rounded-full object-cover" /> : <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${config.tagBg}`}>{row.staffName.charAt(0)}</div>}
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface animate-pulse" />
                          </div>
                          <p className={`text-[11px] font-semibold truncate w-full ${config.text}`}>{row.staffName}</p>
                          <p className="text-[9px] text-on-surface-variant">{formatTime(row.checkIn)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-6">
                      <div className="flex flex-col items-center gap-1.5 text-on-surface-variant/40">
                        <div className="w-9 h-9 rounded-full border-2 border-dashed border-outline-variant/40 flex items-center justify-center">
                          <Users size={14} />
                        </div>
                        <p className="text-[10px]">No staff on floor</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <aside className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2"><Users size={17} className="text-primary" /><h2 className="font-headline text-xl">Staff on Duty</h2></div>

          <div className="mb-5 flex flex-wrap gap-2">
            {(["all", "KITCHEN", "DINING", "BAR", "HOST"] as const).map((key) => {
              const active = category === key;
              const activeClass = key === "all" ? "bg-primary text-on-primary" : CATEGORY_CONFIG[key].tagBg;
              return (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active ? activeClass : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`}
                >
                  {key === "all" ? "All" : CATEGORY_CONFIG[key].label}
                </button>
              );
            })}
          </div>

          {visibleOnFloor.length ? (
            <div className="space-y-2">
              {visibleOnFloor.map((row) => {
                const config = CATEGORY_CONFIG[categoryForRole(row.staffRole)];
                return (
                  <div key={row.staffId} className={`flex items-center gap-3 rounded-lg bg-surface px-3 py-2 border-l-[3px] ${config.spine}`}>
                    {staffById.get(row.staffId)?.avatar ? <img src={staffById.get(row.staffId)?.avatar ?? ""} alt={row.staffName} className="h-9 w-9 rounded-full object-cover" /> : <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${config.tagBg}`}>{row.staffName.charAt(0)}</div>}
                    <div>
                      <p className="text-sm font-medium">{row.staffName}</p>
                      <p className="text-[10px] text-on-surface-variant">{row.staffRole} · {formatTime(row.checkIn)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-5 text-center text-xs text-on-surface-variant">No staff on duty</p>
          )}

          <div className="mt-6 border-t border-dashed border-outline-variant/15 pt-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Upcoming</p>
            {upcoming.length ? (
              <div className="space-y-2">
                {upcoming.map((row) => (
                  <div key={row.staffId} className="flex items-center justify-between text-xs">
                    <span>{row.staffName}</span>
                    <span className="text-on-surface-variant">{row.scheduleStartTime ?? "Not scheduled"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant">Everyone scheduled has checked in.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}