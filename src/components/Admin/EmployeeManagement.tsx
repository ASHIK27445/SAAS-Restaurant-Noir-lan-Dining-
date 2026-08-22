import { CirclePlus, EllipsisVertical,  Mail, Phone, Plus, Search, SquarePen, DollarSign, LogIn, LogOut } from "lucide-react";
import React, { useMemo, useState } from "react";
import AddEmployeeModal from "./AddEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";
import EmployeeCardSkeletonLoading from "./SkeletonLoading/EmployeeCardSkeletenLoading";
import { useQuery } from "@tanstack/react-query";
import { getStaffList, updateStaffRate, getAttendance, checkIn, checkOut } from "../../api/employee";
import type { EmployeeListItem, AttendanceRow } from "../../types/employee";

const TABS = ["All Staff", "Kitchen (Chef)", "Service (Waiters)", "Front Desk", "Administration"];

type RoleStyle = { bg: string; text: string };
const ROLE_STYLES: Record<string, RoleStyle> = {
  Chef:    { bg: "bg-primary/8",    text: "text-primary" },
  Waiter:  { bg: "bg-secondary/10", text: "text-secondary" },
  Cashier: { bg: "bg-tertiary/8",   text: "text-tertiary" },
};
const DEFAULT_ROLE_STYLE: RoleStyle = { bg: "bg-secondary/10", text: "text-secondary" };

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ── Rate edit inline popover ──
function RateEditor({ emp, onSaved }: { emp: EmployeeListItem; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(emp.hourlyRate ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const n = Number(value);
    if (Number.isNaN(n) || n < 0) return;
    setSaving(true);
    try {
      await updateStaffRate(emp.id, n);
      onSaved();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-[11px] text-on-surface-variant hover:text-primary transition-colors">
        <DollarSign size={11} />
        {emp.hourlyRate ? `$${Number(emp.hourlyRate).toFixed(2)}/hr` : "Set rate"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="w-16 bg-surface-container-low rounded px-1.5 py-0.5 text-[11px] border border-outline-variant/30 focus:outline-none focus:border-primary/50"
      />
      <button onClick={(e) => { e.stopPropagation(); handleSave(); }} disabled={saving} className="text-[11px] text-primary font-semibold">
        {saving ? "…" : "✓"}
      </button>
    </div>
  );
}

const EmployeeCard = React.memo(function EmployeeCard({
  emp, attendance, onRateSaved, onClockToggle, onEdit,
}: {
  emp: EmployeeListItem;
  attendance: AttendanceRow | undefined;
  onRateSaved: () => void;
  onClockToggle: (staffId: string, clockedIn: boolean) => void;
  onEdit: (employee: EmployeeListItem) => void;
}) {
  const roleStyle = ROLE_STYLES[emp.role] ?? DEFAULT_ROLE_STYLE;
  const isAdmin = emp.role === "Admin"; // Admin isn't attendance-tracked
  const clockedIn = !!attendance?.checkIn && !attendance?.checkOut;
  const hasCheckedOut = !!attendance?.checkOut;

  return (
    <div className="group bg-surface-container-lowest rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      <div className="flex justify-between items-start mb-3">
        <div className="relative">
          <img
            src={emp.img}
            alt={emp.name}
            className="w-14 h-14 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <span
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-surface-container-lowest ${
              emp.online ? "bg-primary" : "bg-outline-variant"
            }`}
          />
        </div>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(emp)} className="p-1.5 text-on-surface-variant/50 hover:text-primary transition-colors"><SquarePen size={15} /></button>
          <button className="p-1.5 text-on-surface-variant/50 hover:text-tertiary transition-colors"><EllipsisVertical size={15} /></button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <h4 className="text-sm font-headline font-bold text-on-surface">{emp.name}</h4>
          <span className={`${roleStyle.bg} ${roleStyle.text} text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full`}>
            {emp.role}
          </span>
        </div>
        <p className="text-xs text-secondary italic">{emp.title} • {emp.department}</p>
        <p className="text-[10px] text-on-surface-variant mt-1">
          {emp.scheduleLabel || "Unassign Shift"}
          {emp.scheduleStartTime && emp.scheduleEndTime
            ? ` • ${emp.scheduleStartTime}–${emp.scheduleEndTime}`
            : " • Time not set"}
        </p>
      </div>

      <div className="space-y-1.5 py-3 border-t border-outline-variant/15">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Mail size={13} className="text-on-surface-variant/60 shrink-0" /> <span className="truncate">{emp.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Phone size={13} className="text-on-surface-variant/60 shrink-0" /> <span>{emp.phone}</span>
        </div>
        <RateEditor emp={emp} onSaved={onRateSaved} />
      </div>

      <div className="pt-3 flex flex-col border-t border-outline-variant/15">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-[9px] text-secondary/70 uppercase font-semibold tracking-widest">Status</span>
            <span className={`text-[11px] font-medium ${emp.online ? "text-primary" : "text-on-surface-variant/60"}`}>
              {emp.online ? `Online • ${emp.location}` : "Off-duty"}
            </span>
          </div>
        </div>
        {isAdmin ? (
          <p className="text-[10px] text-on-surface-variant/50 text-center">Not attendance-tracked</p>
        ) : hasCheckedOut ? (
          <p className="text-[10px] text-on-surface-variant/50 text-center">Shift completed today</p>
        ) : (
          <button
            onClick={() => onClockToggle(emp.id, clockedIn)}
            className={`text-[10px] font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 py-2 rounded-xl transition-colors ${
              clockedIn ? "bg-error/10 text-error hover:bg-error/20" : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {clockedIn ? <><LogOut size={12} /> Clock Out</> : <><LogIn size={12} /> Clock In</>}
          </button>
        )}
      </div>
    </div>
  );
});

export default function EmployeeManagement() {
  const [activeTab, setActiveTab] = useState("All Staff");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeListItem | null>(null);
  const [search, setSearch] = useState("");

  const { data: employees = [], isLoading, refetch } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => (await getStaffList()).data,
    staleTime: 1000 * 60 * 5,
  });

  const { data: todayAttendance = [], refetch: refetchAttendance } = useQuery({
    queryKey: ["today-attendance"],
    queryFn: async () => (await getAttendance(todayStr())).data,
    staleTime: 1000 * 60,
  });

  async function handleClockToggle(staffId: string, clockedIn: boolean) {
    try {
      if (clockedIn) {
        await checkOut(staffId, todayStr());
      } else {
        await checkIn(staffId, todayStr());
      }
      await refetchAttendance();
    } catch (error) {
      console.error("Failed to update clock status:", error);
    }
  }

  const attendanceByStaff = useMemo(() => {
    const map = new Map<string, AttendanceRow>();
    for (const row of todayAttendance) {
      map.set(row.staffId, row);
    }
    return map;
  }, [todayAttendance]);

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase());
      let matchesTab = true;
      if (activeTab === "Kitchen (Chef)") matchesTab = emp.role === "Chef" || emp.role === "SousChef";
      else if (activeTab === "Service (Waiters)") matchesTab = emp.role === "Waiter";
      else if (activeTab === "Front Desk") matchesTab = emp.role === "Cashier";
      else if (activeTab === "Administration") matchesTab = emp.role === "Manager" || emp.role === "Admin";
      return matchesSearch && matchesTab;
    });
  }, [employees, search, activeTab]);

  const activeCount = employees.filter((e) => e.online).length;

  function handleEditEmployee(employee: EmployeeListItem) {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  }

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="glass-panel flex justify-between items-center w-full px-6 sticky top-0 z-40 h-14 border-b border-outline-variant/10">
          <h2 className="text-base font-headline font-bold text-on-surface">Staff Directory</h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <input
                className="bg-surface-container-low border-none rounded-full py-1.5 pl-9 pr-4 w-52 text-xs focus:outline-none focus:ring-1 focus:ring-primary/25 transition-all placeholder:text-secondary/50"
                placeholder="Search staff members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/60" />
            </div>
          </div>
        </header>

        <div className="p-5 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-headline text-on-surface tracking-tight mb-1">Our Culinary Team</h3>
              <p className="text-sm text-on-surface-variant max-w-md">
                Managing {employees?.length} dedicated professionals who bring the Editorial experience to life every day.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-primary-container/12 px-3 py-1.5 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-secondary font-semibold">Currently Active</p>
                  <p className="text-base font-headline text-primary">{activeCount} Staff</p>
                </div>
              </div>
              <button onClick={() => setShowModal(true)} className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all">
                <Plus size={15} /> Add New Staff
              </button>
              <AddEmployeeModal showModal={showModal} setShowModal={setShowModal} onSuccess={refetch} />
              <EditEmployeeModal
                showModal={showEditModal}
                setShowModal={setShowEditModal}
                employee={selectedEmployee}
                onSuccess={refetch}
              />
            </div>
          </div>

          <div className="flex gap-6 mb-5 overflow-x-auto pb-1 border-b border-outline-variant/10">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 border-b-2 text-[11px] uppercase tracking-widest whitespace-nowrap font-medium transition-colors ${
                  activeTab === tab ? "border-primary text-primary font-bold" : "border-transparent text-secondary hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array(7).fill(0).map((_, i) => <EmployeeCardSkeletonLoading key={`skeleton-${i}`} />)
            ) : (
              filtered.map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  emp={emp}
                  attendance={attendanceByStaff.get(emp.id)}
                  onRateSaved={refetch}
                  onClockToggle={handleClockToggle}
                  onEdit={handleEditEmployee}
                />
              ))
            )}
            <button className="group bg-transparent border-2 border-dashed border-outline-variant/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 text-secondary/40 hover:text-primary hover:border-primary/40 hover:bg-surface-container-low transition-all duration-300">
              <CirclePlus size={20} />
              <span className="font-headline text-sm">Onboard New Member</span>
              <span className="text-xs">Start official onboarding process</span>
            </button>
          </div>
        </div>

        <div className="h-12" />
      </main>
    </div>
  );
}