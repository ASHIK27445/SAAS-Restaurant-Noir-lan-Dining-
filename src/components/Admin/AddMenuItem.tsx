import { Bell, ChevronRight, ImageUp, LogOut, Menu, Search } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  "Starter",
  "Main Course",
  "Side Dish",
  "Dessert",
  "Wine & Spirits",
  "Specials",
];

const ALLERGENS = ["Dairy", "Gluten", "Nuts", "Soy", "Shellfish"];


export default function AddMenuItem() {
  const [activeCategory, setActiveCategory] = useState("Starter");
  const [activeAllergens, setActiveAllergens] = useState<string[]>(["Dairy", "Soy"]);
  const [isActive, setIsActive] = useState(true);
  const [dietary, setDietary] = useState({ vegan: false, vegetarian: true, glutenFree: false });

  const toggleAllergen = (a: string) =>
    setActiveAllergens((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 bg-surface">

        {/* Top App Bar */}
        <header className="flex justify-between items-center w-full px-8 h-20 sticky top-0 z-40 bg-surface/70 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-primary">
              <Menu />
            </button>
            <nav className="hidden md:flex gap-6 items-center">
              <a className="text-sm uppercase tracking-widest text-primary border-b-2 border-primary pb-1">Catalog</a>
              <a href="#" className="text-sm uppercase tracking-widest text-secondary hover:opacity-80 transition-opacity">Categories</a>
              <a href="#" className="text-sm uppercase tracking-widest text-secondary hover:opacity-80 transition-opacity">Inventory</a>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-64 focus-within:ring-1 ring-primary/20">
              <Search size={15}/>
              <input
                className="bg-transparent border-none text-sm focus:ring-0 w-full placeholder:text-secondary/50"
                placeholder="Search menu items..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="text-secondary hover:opacity-80">
                <Bell size={18} />
              </button>
              <div className="h-10 w-10 rounded-full overflow-hidden bg-surface-container-high ring-1 ring-outline-variant/20">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLObpXipzaA4qABg6S_Q-RL6llLB7cdmPnQfyg3Y7J6lflDMU5PFHIeMyVvgxLDjY6AstseIqF-CPTccQ2Ba4VGzgOqFaPh7qke7NDrwuV_13IOUObyInwN6FRGjNrzSbv8WYlkSaO0i3O5Kpz8a86LR71RzG1Upw7iUwmZNnoLrZ4fCCp1hECA5U5lBY2uEgivyKzL1WC9XN8zULTrI_g-XXQOvRTlpgCc_DBWit3EPaEgtsHwb_UEpXJBxrFSeZ72n52sM8HjGY"
                  alt="Chef portrait"
                  className="h-full w-full object-cover"
                />
              </div>
              <LogOut size={18} className="cursor-pointer"/>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="max-w-6xl mx-auto px-8 py-12">

          {/* Page Header */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-secondary mb-4">
                <span>Menu Management</span>
                <ChevronRight size={20}/>
                <span className="text-primary font-bold">Add New Item</span>
              </nav>
              <h2 className="text-5xl font-headline font-bold text-primary tracking-tight">
                Curation Details
              </h2>
              <p className="text-secondary mt-2 max-w-lg">
                Define the essence of your new culinary offering. All entries will be
                formatted for the guest-facing digital editorial.
              </p>
            </div>
            <div className="hidden md:flex gap-4">
              <button className="px-8 py-3 bg-surface-container-high text-primary text-sm font-bold rounded-xl hover:opacity-80 transition-all">
                Save Draft
              </button>
              <button className="px-8 py-3 bg-primary text-on-primary text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg">
                Publish to Menu
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* ── Left Column ── */}
            <div className="lg:col-span-5 space-y-12">

              {/* Image Upload */}
              <section>
                <h3 className="font-headline text-xl text-primary mb-6">Editorial Photography</h3>
                <div className="relative group aspect-4/5 bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-surface-container-high">
                  <div className="flex flex-col justify-center items-center p-8">
                    <ImageUp size={30} className="text-primary/40 mb-4"/>
                    <p className="text-sm text-secondary font-medium">Drag and drop dish image</p>
                    <p className="text-xs text-secondary/60 mt-2">Recommended: High-resolution portrait, minimum 1200×1500px</p>
                  </div>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-widest">
                      Select File
                    </div>
                  </div>
                </div>
              </section>

              {/* Status & Category */}
              <section className="bg-surface-container-lowest p-8 rounded-xl ring-1 ring-outline-variant/10 shadow-sm space-y-8">

                {/* Toggle */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-secondary mb-4">Item Status</label>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium">Active on digital menu</span>
                    <button
                      onClick={() => setIsActive((v) => !v)}
                      role="switch"
                      aria-checked={isActive}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        isActive ? "bg-primary" : "bg-surface-container-high"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="pt-6 border-t border-outline-variant/10">
                  <label className="block text-xs uppercase tracking-widest text-secondary mb-4">Menu Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          activeCategory === cat
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-low text-secondary hover:bg-surface-container-high"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* ── Right Column ── */}
            <div className="lg:col-span-7 space-y-12">

              {/* Plate Information */}
              <section className="space-y-8">
                <h3 className="font-headline text-xl text-primary pb-2 border-b border-outline-variant/20">
                  Plate Information
                </h3>
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-xs uppercase tracking-widest text-secondary mb-2 group-focus-within:text-primary transition-colors">
                      Item Nomenclature
                    </label>
                    <input
                      className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 transition-all text-xl font-headline py-4 px-0 placeholder:text-secondary/30 rounded-none border-b"
                      placeholder="e.g. Wild Forest Mushroom Risotto"
                      type="text"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs uppercase tracking-widest text-secondary mb-2 group-focus-within:text-primary transition-colors">
                      Chef's Narrative (Description)
                    </label>
                    <textarea
                      className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 rounded-xl transition-all text-base py-4 px-4 placeholder:text-secondary/30 resize-none"
                      placeholder="Describe the textures, origins, and preparation method..."
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="group">
                      <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Price Point</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 font-headline text-primary">$</span>
                        <input
                          className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 rounded-xl transition-all font-headline text-lg py-3 pl-8"
                          placeholder="0.00"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Internal SKU</label>
                      <input
                        className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 rounded-xl transition-all py-3 px-4"
                        placeholder="MEN-001"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Nutritional Profile */}
              <section className="space-y-8">
                <h3 className="font-headline text-xl text-primary pb-2 border-b border-outline-variant/20">
                  Nutritional Profile
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-xs uppercase tracking-widest text-secondary">Caloric Count</label>
                    <div className="relative flex items-center">
                      <input
                        className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 rounded-xl transition-all py-3 px-4"
                        placeholder="450"
                        type="number"
                      />
                      <span className="absolute right-4 text-xs text-secondary uppercase">kcal</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs uppercase tracking-widest text-secondary">Allergen Registry</label>
                    <div className="flex flex-wrap gap-2">
                      {ALLERGENS.map((a) => (
                        <button
                          key={a}
                          onClick={() => toggleAllergen(a)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                            activeAllergens.includes(a)
                              ? "bg-tertiary-fixed text-on-tertiary-fixed"
                              : "bg-surface-container-high text-secondary hover:bg-primary-fixed"
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                      <button className="px-3 py-1 rounded-full bg-surface-container-low text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20 hover:bg-primary/5">
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dietary checkboxes */}
                <div className="bg-surface-container-low/50 p-6 rounded-xl space-y-4">
                  <label className="block text-xs uppercase tracking-widest text-secondary">
                    Dietary Accommodations
                  </label>
                  <div className="flex gap-8">
                    {(
                      [
                        { key: "vegan", label: "Vegan" },
                        { key: "vegetarian", label: "Vegetarian" },
                        { key: "glutenFree", label: "Gluten-Free" },
                      ] as const
                    ).map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dietary[key]}
                          onChange={() => setDietary((d) => ({ ...d, [key]: !d[key] }))}
                          className="rounded text-primary focus:ring-primary border-outline-variant"
                        />
                        <span className="text-sm font-medium text-primary">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              {/* Kitchen Notes */}
              <section className="space-y-4">
                <label className="block text-xs uppercase tracking-widest text-secondary">
                  Private Kitchen Notes (Hidden from Menu)
                </label>
                <textarea
                  className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 rounded-xl transition-all text-sm py-4 px-4 placeholder:text-secondary/30 resize-none italic"
                  placeholder="Preparation tips or specific supplier requests..."
                  rows={3}
                />
              </section>
            </div>
          </div>
        </div>

        {/* Mobile sticky actions */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl p-4 flex gap-4 border-t border-outline-variant/10 z-50">
          <button className="flex-1 py-4 bg-surface-container-high text-primary font-bold rounded-xl text-sm uppercase tracking-widest">
            Discard
          </button>
          <button className="flex-1 py-4 bg-primary text-on-primary font-bold rounded-xl text-sm uppercase tracking-widest">
            Save Item
          </button>
        </div>
      </main>

      {/* Decorative background gradient */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-screen bg-linear-to-l from-primary-fixed/20 to-transparent pointer-events-none" />

    </div>
  );
}