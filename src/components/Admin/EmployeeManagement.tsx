import { Calendar1, CirclePlus, EllipsisVertical, HeartPlus, Mail, Phone, Plus, Search, SquarePen } from "lucide-react";
import { useState } from "react";
import AddEmployeeModal from "./AddEmployeeModal";

const TABS = ["All Staff", "Kitchen (Chef)", "Service (Waiters)", "Front Desk", "Administration"];

type RoleStyle = { bg: string; text: string };

const ROLE_STYLES: Record<string, RoleStyle> = {
  Chef:    { bg: "bg-primary/5",    text: "text-primary" },
  Waiter:  { bg: "bg-secondary/10", text: "text-secondary" },
  Cashier: { bg: "bg-tertiary/5",   text: "text-tertiary" },
};

type Employee = {
  img: string;
  name: string;
  role: string;
  title: string;
  email: string;
  phone: string;
  online: boolean;
  location: string;
};

const EMPLOYEES: Employee[] = [
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFhDTu9Nxhl62DVOj8hWmSvNSDp9D6X_60AzVcpsWIEKx4jhojwfqQLQe0uyVQrCH3ujfo0omNOlruRR0MsnmdhxP5wxC5OFYOXbbtFneUa-RQD2NrmwA3LE_j-CMvGhs0SMZXK-nPoObLObp7N0f3lRYyd_LcT9evOxU_loqm6hnBPMEBuhG8JgXMRIOQh643lRWUmOemonv0n1GtEeRf_qgoPfPRW1h59mtCz11V1FqcDLFa12mqIdPzSmMHPjZsqzuvVcdujTI",
    name: "Elena Moretti", role: "Chef", title: "Executive Chef",
    email: "e.moretti@editorial.com", phone: "+39 342 0981 22",
    online: true, location: "In Kitchen",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbEkr95TrX_iJGHSY3SpT8HPpyIrP_c6dtawp738xyOqXgxf2AhP1bo_F-YeYCDEUqCmLVjoZ0_PJMX33moDB4GqmFTiqctibYqO3rL7o9asQyfAUhuK2Ba397W6SVetlPGyQgl9lcOu_1FtZcjDLAgxmMsjlWD7auG6YHWD_Zu7vGln2hnt9SmxdXIrHCHnhZgzpZGPbMcxT2qS51iD6HqQUileiTQ9OrXPn--43K2J1VWw9MfByQy8QXH3_wy36quWeI4Bm72lA",
    name: "Lucas Vane", role: "Waiter", title: "Senior Server",
    email: "l.vane@editorial.com", phone: "+39 331 4452 90",
    online: false, location: "Returns 6PM",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg6tksxKr4cykmxjro-yOQnI_QzuDfVkoAuaLekmeF2o3hnqDlXZQ2tNj3YjIn04jTy4AnZkpX4XtUV1YFNFVbMi-vwL8y-7a3TjhdcUlxa3XFeLKOe6dZWXep57HaUZmHJJqjTPKiv0kvee0im9FkDp1Tvfm4R5snuwcMX2j485mdLKByUPVX8A7RwxS_DX5qXRTzCpjslgoMMEnNEKqb_-Uysx8L2MPWmcjyBcFr6Fd6i728QvyFDjjWl8i6GNrTkCY_Br2B8ws",
    name: "Sofia Chen", role: "Cashier", title: "Front Desk Coordinator",
    email: "s.chen@editorial.com", phone: "+39 311 0029 88",
    online: true, location: "Reception",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBng27TIYLzG4v0ORCeDsDUDloefkc4KI3egwDg-cMicZFom5Sn7Fe6SqQS-laeQZHRjqzEqxUXSrmVowToD0lFyj5UhbLw8IR2BoCMWV8lzDVhiuleCxXtscE450h4ihgAtOx9BAbTTlEGxgRSwVaX7FbT2D8eaEhAfb_RmpWO6x8PyuNogIkNU7yT9PRmyobzLTuFY1jXZ3GpUnwJRKjMeNABARaLf2xAGUGHBtTtORtS_k7UZZZNaFKi7D1JkYmME1M2yLPf1pY",
    name: "Marco Santoro", role: "Chef", title: "Sous Chef",
    email: "m.santoro@editorial.com", phone: "+39 321 0098 12",
    online: true, location: "Pastry Station",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV-rky5KlOcn9oPrvbnL29z4GQ5GQm4FLAWIkEa5KNir5mPDP4WqsdlnY6bKwXGzggDbDv_7-n0RlTd6EvTl1C88uwqro6NSJ_dzRtwA1y79r2vT0Vb96WwZQVdlNkjbd_V8DEcv8hf8ducZK0j2du-aIjpzAnlPyDmHyHQ7Ug6ejpVVf0ghFzwa-DPSlCo5nXjVX1pxldCK1BS4WBRRjR1bkR-5FFNs3m3ldi3m4I1raSviz8OQNmhyf_G-mW8S5TBoX5_bL71k",
    name: "Julian Thorne", role: "Waiter", title: "Server",
    email: "j.thorne@editorial.com", phone: "+39 312 8876 44",
    online: false, location: "Return Monday",
  },
];

function EmployeeCard({ emp }: { emp: Employee }) {
  const roleStyle = ROLE_STYLES[emp.role] ?? { bg: "bg-secondary/10", text: "text-secondary" };

  return (
    <div className="group bg-surface-container-lowest rounded-xl p-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      {/* Header row */}
      <div className="flex justify-between items-start mb-3">
        <div className="relative">
          <img
            src={emp.img}
            alt={emp.name}
            className="w-14 h-14 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <span
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              emp.online ? "bg-emerald-500" : "bg-slate-300"
            }`}
          />
        </div>
        <div className="flex gap-0.5">
          <button className="p-1.5 text-secondary/40 hover:text-primary transition-colors">
            <SquarePen size={15} />
          </button>
          <button className="p-1.5 text-secondary/40 hover:text-tertiary transition-colors">
            <EllipsisVertical size={15} />
          </button>
        </div>
      </div>

      {/* Name & role */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <h4 className="text-sm font-headline font-bold text-on-surface">{emp.name}</h4>
          <span className={`${roleStyle.bg} ${roleStyle.text} text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded`}>
            {emp.role}
          </span>
        </div>
        <p className="text-xs text-secondary italic">{emp.title}</p>
      </div>

      {/* Contact */}
      <div className="space-y-1.5 py-3 border-t border-outline-variant/10">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Mail size={13} />
          <span className="truncate">{emp.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Phone size={13} />
          <span>{emp.phone}</span>
        </div>
      </div>

      {/* Status */}
      <div className="mt-3 pt-3 flex flex-col border-t border-outline-variant/10">
        <div className="flex flex-col mb-4">
          <span className="text-[9px] text-secondary/60 uppercase font-bold tracking-widest">Status</span>
          <span className={`text-[11px] font-medium ${emp.online ? "text-emerald-600" : "text-secondary/70"}`}>
            {emp.online ? `Online • ${emp.location}` : `Off-duty • ${emp.location}`}
          </span>
        </div>
        <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
          View Schedule
        </button>
      </div>
    </div>
  );
}

export default function EmployeeManagement() {
  const [activeTab, setActiveTab] = useState("All Staff");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [systemAccess, setSystemAccess] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const filtered = EMPLOYEES.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <main className="flex-1 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="bg-surface/70 backdrop-blur-xl flex justify-between items-center w-full px-6 sticky top-0 z-40 h-14">
          <h2 className="text-base font-headline font-bold text-on-surface">Staff Directory</h2>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <input
                className="bg-surface-container-low border-none rounded-full py-1.5 pl-9 pr-4 w-52 text-xs focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-secondary/50"
                placeholder="Search staff members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/60" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-5 max-w-7xl mx-auto w-full">

          {/* Page header + stat */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-headline text-on-surface tracking-tight mb-1">
                Our Culinary Team
              </h3>
              <p className="text-sm text-on-surface-variant max-w-md">
                Managing 24 dedicated professionals who bring the Editorial experience to life every day.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-surface-container-lowest px-2 py-1 rounded-xl flex items-center gap-3 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-secondary font-bold">
                    Currently Active
                  </p>
                  <p className="text-base font-headline text-primary">12 Staff</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all">
                <Plus size={15} />
                Add New Staff
              </button>
              <AddEmployeeModal
                showModal={showModal}
                setShowModal={setShowModal}
                systemAccess={systemAccess}
                setSystemAccess={setSystemAccess}
                avatarPreview={avatarPreview}
                setAvatarPreview={setAvatarPreview}
                handleAvatar={handleAvatar}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mb-5 overflow-x-auto pb-1 border-b border-outline-variant/10">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 border-b-2 text-[11px] uppercase tracking-widest whitespace-nowrap font-medium transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-secondary hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Employee Grid — 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((emp) => (
              <EmployeeCard key={emp.name} emp={emp} />
            ))}

            {/* Add placeholder */}
            <button className="group bg-transparent border-2 border-dashed border-outline-variant/40 rounded-xl p-4 flex flex-col items-center justify-center gap-1 text-secondary/40 hover:text-primary hover:border-primary/40 hover:bg-surface-container-low transition-all duration-300">
              <CirclePlus size={20} />
              <span className="font-headline text-sm">Onboard New Member</span>
              <span className="text-xs">Start official onboarding process</span>
            </button>
          </div>

          {/* Management Tools Bento */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Shift schedule card */}
            <div className="md:col-span-2 bg-surface-container-low rounded-xl p-5 flex flex-col md:flex-row gap-5 items-center">
              <div className="flex-1">
                <h4 className="text-lg font-headline mb-2">Weekly Shift Schedule</h4>
                <p className="text-xs text-secondary mb-4 leading-relaxed">
                  The roster for next week is ready for final approval. Review team availability and
                  coverage for the upcoming holiday weekend events.
                </p>
                <div className="flex gap-2">
                  <button className="bg-primary text-on-primary px-5 py-2 rounded-lg text-xs font-medium hover:opacity-90">
                    Review Roster
                  </button>
                  <button className="bg-surface-container-high text-primary px-5 py-2 rounded-lg text-xs font-medium hover:bg-surface-container-highest">
                    Export PDF
                  </button>
                </div>
              </div>
              <div className="w-full md:w-36 aspect-square rounded-xl bg-surface-container-highest p-3 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <Calendar1 size={18} />
                  <span className="bg-primary text-on-primary text-[9px] font-bold px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-headline text-primary">24</p>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-secondary">
                    October Shifts
                  </p>
                </div>
              </div>
            </div>

            {/* Safety card */}
            <div className="bg-tertiary-container text-on-tertiary rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-lg font-headline text-white mb-2">Staff Safety & Hygiene</h4>
                <p className="text-xs text-white/70">
                  Mandatory certifications expire in 12 days for 3 kitchen staff members.
                </p>
              </div>
              <div className="relative z-10 mt-4">
                <button className="bg-white/10 hover:bg-white/20 text-white w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/20 transition-colors">
                  Alert Team
                </button>
              </div>
              <HeartPlus className="absolute right-4 bottom-4 text-white/5 rotate-12" size={32} />
            </div>
          </div>
        </div>

        <div className="h-12" />
      </main>
    </div>
  );
}