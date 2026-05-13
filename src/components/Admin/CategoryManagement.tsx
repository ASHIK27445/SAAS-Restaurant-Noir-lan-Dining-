import { ChevronRight, CookingPot, GripHorizontal, ListFilterPlus, Martini, Plus, Search, SquarePen } from "lucide-react";
import { useState } from "react";
import CategoryAddModal from "./CategoryAddModal";

const TABLE_ROWS = [
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuApbXtcqDDYuWVsKAQ1IkSrsoqDoFpqUnm7eHMwqgWrJdj6cI0waeS-TGDRO1D7F4WzyQJ7MdcfmysVZTEjq0I63vXX4sHSlQ9PX1xS2CFw2QAgryFoYazI84ZO7A1fylAHu--c_VWUZOy8UwNN0pnogX5dNH1MK3ac2pltTY0iSStjPfj0ngsWzYgIrOeEzYJu6nwt7-jciAUFIiwtgwTrB9IgJ9Almjk-6AVZcLMqgOqPNasgnPRsDzlY1pphrK5KfmPfMakoG34",
    title: "Bread & Provisions",
    subtitle: "House-made staples",
    count: "08",
    active: true,
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg2fuWpaFa1112QdfjeDpj1lJuyn65yQ6b1nai3M2ZQcomGaSlQDAHV-wyk4N_HxACf3CVx6ERDW5pF-LwzrJmhdnoDAg_KT0irev-2KTp4xFRw3hGTqOzJIpAoJwoLm79pNe4fwQAOb2M405d0A2fNJcSoDo94aAUCVb1iX50dmM17fawVPOcqf-Mbe6qHdIF2muB2-l2GfsXmaibUZ0M6yJAJ9epNuidu_o_YnIRKFYij0EoaCvz2835SqjFbr0xRDkoa1CSkV4",
    title: "The Grand Finale",
    subtitle: "Desserts & Confections",
    count: "14",
    active: true,
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5A7SDlRgELpbTlZiOAwxUxAn7bcN5ZwKuzEl6Ds5nxWeYmdw-I-cziAu52jOjKbluSLpq-REWlsysQ6MxvKfuLabwvB6E2fLE2dXAhs9uW-yGNr4aPTRX4zvakpOODbVi7BPKc5lVAyr4Lb35U2WqK_XSj_f3jI0Ctqa3gsJrLqcEwHScbNF1POOqJIZRBIVnQywafRQw0p5Oix9KS1nU_pk57wAjrkYquAt7P3N60NHld_O6_RWRPBPriOAdCF0gh1kQINmwPJE",
    title: "Midnight Botanicals",
    subtitle: "Archive / Seasonal",
    count: "09",
    active: false,
  },
];

export default function CategoryManagement() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = TABLE_ROWS.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-body">

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-h-screen">

        <section className="px-12 pt-3 pb-12 space-y-12">

          {/* Page Header */}
          <div className="flex justify-between items-end">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-headline font-bold text-primary tracking-tight mb-4">
                Refine Your Editorial Canvas
              </h2>
              <p className="text-secondary leading-relaxed">
                Organize your offerings into curated collections that guide guests through their
                dining journey. Use these categories to structure the digital menu experience.
              </p>
            </div>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-xl font-medium shadow-md hover:shadow-xl transition-all active:scale-95">
              <Plus />
              <span>Add New Category</span>
            </button>
            
            <CategoryAddModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />
          </div>

          {/* ── Bento Grid ── */}
          <div className="grid grid-cols-12 gap-6">

            {/* Starters — wide card */}
            <div className="col-span-12 md:col-span-8 group relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-80">
                <div className="w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold uppercase tracking-widest">
                        Active
                      </span>
                      <span className="text-on-surface-variant text-xs font-medium">
                        Updated 2 days ago
                      </span>
                    </div>
                    <h3 className="text-4xl font-headline text-on-surface mb-2">Starters</h3>
                    <p className="text-on-surface-variant line-clamp-3">
                      Light, evocative beginnings to pique interest. Includes seasonal amuse-bouche
                      and cold-pressed garden selections.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-surface-container-low flex items-center justify-center text-xs font-bold text-primary">
                        12
                      </div>
                      <span className="text-sm text-on-surface-variant">Menu Items</span>
                    </div>
                    <button className="p-3 text-primary hover:bg-surface-container-low rounded-full transition-colors">
                      <ChevronRight />
                    </button>
                  </div>
                </div>
                <div className="w-1/2 relative overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWn4eY25KyZ8Ia6QJXf5DUD0hJyxQY8ZWiNl8H-vTPo79E6pGmNvy_gzQx196Tc0BXPTxDEiQZ2WDipUDji_yjlCbbHX2-7FzpIeKKBvEryKo7diSazx7jzZ7bPyjSBBIskZosKySO8QalpKqaWBBf5kpOTrLbqtApb8lVc6RMvXOK3fJBXNABA9Dato4yZy1a48qIZb9IixP-t7hDnE-FW_XIvbLhMMFmIJSJTA_XuoIm704IdWf3v1aknh-6_xro2LCkAA6Inuc"
                    alt="Starters"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Wine Cellar */}
            <div className="col-span-12 md:col-span-4 group bg-surface-container-lowest rounded-xl shadow-sm p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-xl bg-surface-container-low text-primary">
                    <Martini />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold uppercase tracking-widest">
                    Active
                  </span>
                </div>
                <h3 className="text-3xl font-headline text-on-surface mb-2">Wine Cellar</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  A curated selection of vintages and contemporary pairings from our private estate.
                </p>
              </div>
              <div className="pt-6 border-t border-outline-variant/10 flex justify-between items-center">
                <span className="text-sm font-bold text-on-surface">48 Select Vintages</span>
                <button className="text-primary hover:underline font-medium text-sm">
                  Manage List
                </button>
              </div>
            </div>

            {/* Main Course */}
            <div className="col-span-12 md:col-span-4 group bg-surface-container-lowest rounded-xl shadow-sm p-8 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-xl bg-primary text-on-primary shadow-lg">
                    <CookingPot />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold uppercase tracking-widest">
                    Active
                  </span>
                </div>
                <h3 className="text-3xl font-headline text-on-surface mb-2">Main Course</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  The heart of the editorial. Robust, chef-curated entries that define our season.
                </p>
              </div>
              <div className="pt-6 relative z-10 border-t border-outline-variant/10 flex justify-between items-center">
                <span className="text-sm font-bold text-on-surface">18 Signature Dishes</span>
                <button className="text-primary hover:underline font-medium text-sm">
                  View Details
                </button>
              </div>
            </div>

            {/* Seasonal Specials — wide card reversed */}
            <div className="col-span-12 md:col-span-8 group relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-80 flex-row-reverse">
                <div className="w-1/2 p-8 flex flex-col justify-between bg-primary-container text-on-primary-container">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 rounded bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest">
                        Inactive
                      </span>
                      <span className="text-on-primary-container/70 text-xs font-medium italic">
                        Launching Autumn 2024
                      </span>
                    </div>
                    <h3 className="text-4xl font-headline text-on-primary mb-2">
                      Seasonal Specials
                    </h3>
                    <p className="text-on-primary-container/80 line-clamp-3">
                      Limited-time explorations of rare ingredients and harvesting techniques. A
                      dialogue with nature.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">6 Draft Items</span>
                    <button className="px-6 py-2 bg-on-primary-container text-primary rounded-lg font-bold text-sm hover:bg-white transition-colors">
                      Enable Now
                    </button>
                  </div>
                </div>
                <div className="w-1/2 relative overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIXB_iwgW6EEHVvG55_U6fWxKBKLN95R_qC0duwckTce5l92YUzT3amKJR9hO1yDVqOpWoQW5b1sCVDRrOmKNCkltn7Mm-js4WTJUD89TwiZNGcFoPkdJFruTqDK0o5fnnftHyQ9-_To1U7z4gjRNmzpigDhxxa2HuxobQZIZ4S_KtVENEI9qlfU6XEnbqTXzVhMlF7XOQQydDOH-9cAZ43w_F-1Qo_R2x_OS1STfPkxQAnKtxfx5Zsdd7PJGu0bU_58-4AZtr6a8"
                    alt="Seasonal Ingredients"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Management Table ── */}
          <div className="bg-surface-container-low rounded-3xl p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-2xl font-headline text-on-surface">All Categories</h4>
                <p className="text-on-surface-variant text-sm mt-1">
                  Direct management and ordering of your menu sections.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-surface-container-lowest px-4 py-2 rounded-xl flex items-center gap-3">
                  <Search />
                  <input
                    className="bg-transparent border-none focus:ring-0 text-sm w-48"
                    placeholder="Filter categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant">
                  <ListFilterPlus />
                </button>
              </div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-12 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">
              <div className="col-span-5">Category Title</div>
              <div className="col-span-2 text-center">Items</div>
              <div className="col-span-3 text-center">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Rows */}
            <div className="space-y-3">
              {filtered.map((row) => (
                <div
                  key={row.title}
                  className={`grid grid-cols-12 px-6 py-6 items-center bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all ${
                    !row.active ? "opacity-60" : ""
                  }`}
                >
                  <div className="col-span-5 flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-surface-container-low overflow-hidden ${
                        !row.active ? "grayscale" : ""
                      }`}
                    >
                      <img
                        src={row.img}
                        alt={row.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{row.title}</p>
                      <p className="text-xs text-on-surface-variant">{row.subtitle}</p>
                    </div>
                  </div>

                  <div className="col-span-2 text-center font-medium text-on-surface">
                    {row.count}
                  </div>

                  <div className="col-span-3 flex justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        row.active
                          ? "bg-primary-fixed text-on-primary-fixed"
                          : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      {row.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  <div className="col-span-2 flex justify-end gap-2">
                      <button
                        className="p-2 hover:bg-surface-container-low rounded-lg text-on-surface-variant transition-colors">
                            <SquarePen size={16}/>
                      </button>
                      <button
                        className="p-2 hover:bg-surface-container-low rounded-lg text-on-surface-variant transition-colors">
                            <GripHorizontal size={16} />
                      </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}