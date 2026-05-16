import {
  CalendarDays,
  Menu,
  ChevronRight,
  Search,
  Bell,
  Mail,
  Clock,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Star,
  ArrowRight,
  Home,
  CalendarRange,
} from "lucide-react";

const juliannaAvatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDMY2XKfLuJrPOzntNVjJsKU_dl9LOSbINTNeRejf7Vhsq1SY-02LbVnAZsPvsT1uUparnVGuNqZAjUanalpfBug2iVPQGsiDN4YwO-3jhlG9c1xUDaKV3YcM9F_Ayata4N06REbmVOACIK7vkcd10OJCKUPkxt60STrjv5SLuALul0-mRokHPJTi5snIL9NOQee_IIlgjLjLnWsoqhHezyRE7L4Dx1IigXkLFhUhWyvXWRwVZL5icjtWSyD_mbjQ-lk8xkpK3NJew";

const mobileAvatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAuzcpPsx5dWWYa5Z5vYVRw20RK9Jnz1A5mdfHBpIxcg_7nrjFtowtJAEc3x1LX-8JfprsZtIfBPCdF2G8mk3VwZ7NsW2ztU4iSxCUFZAHwZ4Qq0_Fwi8RQDiQf6_Rs8bMofRpdealUKr6raFGxczxKhAu_qjxYGFi91fEAHMaaLfT_w6BqF0jXfWWXNoowRVrcDbrvQ3pYcbVxW4YSl6_CpDP2d_8J-vdOptqO--OJQot0HfMri82MYVgAOkpbi_o9GlODE0IvuAM";

type DayData =
  | { type: "empty"; label: string }
  | { type: "blank" }
  | { type: "today" }
  | {
      type: "shift";
      date: number;
      time: string;
      label?: string;
      variant: "primary" | "tertiary";
    };

const calendarDays: DayData[] = [
  { type: "empty", label: "24" },
  { type: "empty", label: "25" },
  { type: "empty", label: "26" },
  { type: "empty", label: "27" },
  { type: "empty", label: "28" },
  { type: "empty", label: "29" },
  { type: "empty", label: "30" },
  { type: "blank" },
  { type: "shift", date: 2, time: "16:00 - 00:00", label: "Dinner Service", variant: "primary" },
  { type: "blank" },
  { type: "blank" },
  { type: "shift", date: 5, time: "16:00 - 00:00", variant: "primary" },
  { type: "shift", date: 6, time: "12:00 - 22:00", variant: "primary" },
  { type: "blank" },
  { type: "blank" },
  { type: "shift", date: 9, time: "09:00 - 15:00", label: "Cellar Tasting", variant: "tertiary" },
  { type: "today" },
  { type: "shift", date: 11, time: "16:00 - 00:00", variant: "primary" },
  { type: "shift", date: 12, time: "16:00 - 00:00", variant: "primary" },
  { type: "shift", date: 13, time: "12:00 - 22:00", variant: "primary" },
  { type: "blank" },
  { type: "blank" },
  { type: "blank" },
  { type: "blank" },
  { type: "blank" },
  { type: "shift", date: 19, time: "16:00 - 00:00", variant: "primary" },
  { type: "shift", date: 20, time: "12:00 - 22:00", variant: "primary" },
  { type: "blank" },
];

const agendaItems = [
  {
    month: "Oct",
    date: "05",
    title: "Evening Shift",
    time: "4:00 PM - Midnight",
    accent: "primary" as const,
  },
  {
    month: "Oct",
    date: "06",
    title: "Double Service",
    time: "12:00 PM - 10:00 PM",
    accent: "primary" as const,
  },
  {
    month: "Oct",
    date: "09",
    title: "Private Event",
    time: "9:00 AM - 3:00 PM",
    accent: "tertiary" as const,
  },
];

const stats = [
  { value: "152h", label: "Scheduled Hours", color: "text-primary" },
  { value: "18", label: "Total Shifts", color: "text-primary" },
  { value: "4", label: "Special Events", color: "text-tertiary" },
  { value: "0", label: "Conflicts", color: "text-primary" },
];

function CalendarDay({ data }: { data: DayData }) {
  if (data.type === "empty") {
    return (
      <div className="bg-surface min-h-20 p-1.5 text-outline-variant opacity-30 text-[10px]">
        {data.label}
      </div>
    );
  }
  if (data.type === "blank") {
    return <div className="bg-surface min-h-20 p-1.5 text-on-surface-variant text-[10px]" />;
  }
  if (data.type === "today") {
    return (
      <div className="bg-surface min-h-20 p-1.5 text-[10px] font-bold text-primary ring-1 ring-inset ring-primary/20 bg-primary-fixed/10">
        10
      </div>
    );
  }
  const isPrimary = data.variant === "primary";
  return (
    <div className="bg-surface-container-lowest min-h-20 p-1.5 flex flex-col gap-1">
      <span className="text-on-surface font-bold text-[10px]">{data.date}</span>
      <div
        className={`text-[9px] p-1 rounded-lg border ${
          isPrimary
            ? "bg-primary-fixed/30 text-on-primary-fixed-variant border-primary/10"
            : "bg-tertiary-fixed/40 text-on-tertiary-fixed-variant border-tertiary/10"
        }`}
      >
        <span className="block font-bold leading-tight">{data.time}</span>
        {data.label && <span className="opacity-70 italic">{data.label}</span>}
      </div>
    </div>
  );
}

export default function EmployeeViewSchedule() {
  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body">


      {/* Main */}
      <main className="flex-1 pb-16 md:pb-0">
        {/* Top Bar */}
        <header
          className="flex justify-between items-center px-6 py-3 w-full max-w-screen-2xl mx-auto sticky top-0 z-40"
          style={{ background: "rgba(251,249,245,0.85)", backdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 rounded-full hover:bg-surface-container-low transition-colors">
              <Menu size={16} />
            </button>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-on-surface-variant">Schedules</span>
              <ChevronRight size={12} className="text-on-surface-variant" />
              <span className="font-semibold text-primary">Julianna Vane</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                className="bg-surface-container-low border-none rounded-full pl-9 pr-3 py-1.5 text-xs w-52 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="Search roster..."
                type="text"
              />
            </div>
            <button className="p-1.5 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant">
              <Bell size={16} />
            </button>
          </div>
        </header>

        <div className="px-6 pb-10 max-w-7xl mx-auto">
          {/* Employee Profile */}
          <section className="mt-6 mb-8 flex flex-col md:flex-row gap-6 items-end justify-between">
            <div className="flex items-center gap-5">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src={juliannaAvatar}
                    alt="Julianna Vane"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center border-2 border-background shadow">
                  <Star size={10} fill="currentColor" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tertiary mb-1 block">
                  Lead Sommelier
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-on-surface font-headline italic">
                  Julianna Vane
                </h2>
                <p className="text-on-surface-variant mt-1 max-w-sm text-xs leading-relaxed">
                  Dedicated curator of the Verdant Hearth cellar. Specialized in cool-climate
                  varietals and bio-dynamic pairings.
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="bg-surface-container-high text-primary px-4 py-2 rounded-xl font-medium text-xs hover:bg-surface-container-highest transition-colors flex items-center gap-1.5">
                <Mail size={13} />
                Contact
              </button>
              <button className="bg-primary text-on-primary px-4 py-2 rounded-xl font-medium text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md">
                <CalendarDays size={13} />
                Edit Schedule
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-8">
              <div className="bg-surface-container-low rounded-2xl p-5">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-bold font-headline italic text-primary">
                    October 2023
                  </h3>
                  <div className="flex gap-1.5">
                    <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors border border-outline-variant/10">
                      <ChevronLeft size={15} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors border border-outline-variant/10">
                      <ChevronRightIcon size={15} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-outline-variant/20 bg-outline-variant/20">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div
                      key={d}
                      className="bg-surface-container-high py-2.5 text-center text-[9px] font-bold uppercase tracking-widest text-on-secondary-container"
                    >
                      {d}
                    </div>
                  ))}
                  {calendarDays.map((day, i) => (
                    <CalendarDay key={i} data={day} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Next Shift */}
              <div className="bg-primary text-on-primary rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-container/20 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-60 mb-3 block">
                    Next Shift
                  </span>
                  <h4 className="text-2xl font-bold font-headline italic mb-3">Monday, 2nd</h4>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <Clock size={14} className="text-primary-fixed-dim shrink-0" />
                      <p className="text-xs font-medium">16:00 — 00:00 (8h)</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <UtensilsCrossed size={14} className="text-primary-fixed-dim shrink-0" />
                      <p className="text-xs font-medium">Dinner Service & Wine Pairing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Agenda */}
              <div>
                <h3 className="text-base font-bold text-on-surface font-headline italic mb-4">
                  Upcoming Agenda
                </h3>
                <div className="space-y-2.5">
                  {agendaItems.map(({ month, date, title, time, accent }) => (
                    <div
                      key={date}
                      className="bg-surface-container-lowest p-4 rounded-xl flex justify-between items-center group hover:bg-surface transition-colors duration-200"
                    >
                      <div className="flex gap-3">
                        <div
                          className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg group-hover:${
                            accent === "tertiary" ? "bg-tertiary-fixed" : "bg-primary-fixed"
                          } bg-surface-container-low transition-colors duration-200`}
                        >
                          <span className="text-[8px] font-bold text-on-surface-variant uppercase">
                            {month}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              accent === "tertiary" ? "text-tertiary" : "text-primary"
                            }`}
                          >
                            {date}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-xs">{title}</p>
                          <p className="text-[10px] text-on-surface-variant">{time}</p>
                        </div>
                      </div>
                      <ArrowRight
                        size={13}
                        className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-secondary-container/30 rounded-2xl p-5 border border-outline-variant/10">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-secondary-fixed-variant mb-4">
                  Monthly Analytics
                </h4>
                <div className="grid grid-cols-2 gap-5">
                  {stats.map(({ value, label, color }) => (
                    <div key={label}>
                      <p className={`text-2xl font-bold font-headline ${color}`}>{value}</p>
                      <p className="text-[9px] uppercase font-bold text-on-secondary-container mt-0.5">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center py-3 px-4 z-50 border-t border-outline-variant/10"
        style={{ background: "rgba(251,249,245,0.92)", backdropFilter: "blur(20px)" }}
      >
        {[
          { icon: Home, label: "Home", active: false },
          { icon: CalendarRange, label: "Schedule", active: true },
          { icon: Bell, label: "Alerts", active: false },
        ].map(({ icon: Icon, label, active }) => (
          <a
            key={label}
            href="#"
            className={`flex flex-col items-center gap-0.5 ${
              active ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <Icon size={18} fill={active ? "currentColor" : "none"} />
            <span className="text-[9px] font-bold">{label}</span>
          </a>
        ))}
        <a href="#" className="flex flex-col items-center gap-0.5 text-on-surface-variant">
          <div className="h-4.5 w-4.5 rounded-full overflow-hidden">
            <img src={mobileAvatar} alt="Me" className="h-full w-full object-cover" />
          </div>
          <span className="text-[9px] font-bold">Me</span>
        </a>
      </nav>
    </div>
  );
}