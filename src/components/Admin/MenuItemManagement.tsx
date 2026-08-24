import { useEffect, useMemo, useState } from "react";
import { Search, SquarePen, Trash2, X, ImagePlus } from "lucide-react";

type Category = { id: string; name: string; bucketType: string };
type Allergen = { id: string; name: string };
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  sku: string;
  image: string | null;
  calories: number | null;
  isActive: boolean;
  dietaryType: string[];
  categoryId: string;
  category?: Category;
  allergens: { allergen: Allergen }[];
};

const BASE_URL = "http://localhost:3000";


function EditItemModal({
  item, categories, allergens, onClose, onSaved,
}: { item: MenuItem; categories: Category[]; allergens: Allergen[]; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);
  const [sku, setSku] = useState(item.sku);
  const [categoryId, setCategoryId] = useState(item.categoryId);
  const [calories, setCalories] = useState(item.calories?.toString() ?? "");
  const [image, setImage] = useState(item.image ?? "");
  const [isActive, setIsActive] = useState(item.isActive);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(item.allergens.map((a) => a.allergen.id));
  const [dietary, setDietary] = useState({
    vegan: item.dietaryType.includes("VEGAN"),
    vegetarian: item.dietaryType.includes("VEGETARIAN"),
    glutenFree: item.dietaryType.includes("GLUTEN_FREE"),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleAllergen(id: string) {
    setSelectedAllergens((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !categoryId || !price) {
      setError("Name, category and price are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/menu/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description,
          price: Number(price),
          sku: sku.trim(),
          categoryId,
          calories: calories ? Number(calories) : undefined,
          image: image.trim() || undefined,
          isActive,
          allergens: selectedAllergens,
          dietary,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Failed to update item");
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update item");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-surface rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10 sticky top-0 bg-surface">
          <h3 className="font-headline text-lg text-on-surface">Edit Menu Item</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 text-sm">
          <div className="flex gap-4">
            <div className="w-24 h-24 shrink-0 rounded-lg bg-surface-container-high overflow-hidden flex items-center justify-center border border-outline-variant/10">
              {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : <ImagePlus size={22} className="text-on-surface-variant" />}
            </div>
            <div className="flex-1 space-y-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name"
                className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none" />
              <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL"
                className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-xs border border-transparent focus:border-primary/30 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Price *</label>
              <input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">SKU</label>
              <input value={sku} onChange={(e) => setSku(e.target.value)}
                className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm font-mono border border-transparent focus:border-primary/30 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Category *</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Calories</label>
              <input type="number" min={0} value={calories} onChange={(e) => setCalories(e.target.value)}
                className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide mb-1.5 block">Allergens</label>
            <div className="flex flex-wrap gap-1.5">
              {allergens.map((a) => (
                <button key={a.id} type="button" onClick={() => toggleAllergen(a.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                    selectedAllergens.includes(a.id) ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-surface-container-high text-secondary hover:bg-primary-fixed"
                  }`}>
                  {a.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low/50 p-3 rounded-lg flex gap-5">
            {([
              { key: "vegan", label: "Vegan" },
              { key: "vegetarian", label: "Vegetarian" },
              { key: "glutenFree", label: "Gluten-Free" },
            ] as const).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-1.5 cursor-pointer text-xs">
                <input type="checkbox" checked={dietary[key]} onChange={(e) => setDietary((d) => ({ ...d, [key]: e.target.checked }))} className="accent-primary" />
                {label}
              </label>
            ))}
          </div>

          <label className="flex items-center justify-between bg-surface-container-low rounded-lg px-3 py-2.5 cursor-pointer">
            <span className="text-sm font-medium text-on-surface">Active on menu</span>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-primary" />
          </label>

          {error && <p className="text-error text-xs">{error}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-5 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50">
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MenuItemManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);


  function loadItems() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryFilter) params.set("categoryId", categoryFilter);
    return fetch(`${BASE_URL}/menu/items?${params}`)
      .then((r) => r.json())
      .then((res) => { if (res.success) setItems(res.data); })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetch(`${BASE_URL}/menu/categories`).then((r) => r.json()).then((res) => { if (res.success) setCategories(res.data); });
    fetch(`${BASE_URL}/menu/allergens`).then((r) => r.json()).then((res) => { if (res.success) setAllergens(res.data); });
  }, []);

  useEffect(() => {
    const t = setTimeout(loadItems, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search, categoryFilter]);

    async function toggleStatus(item: MenuItem) {
    try {
        const res = await fetch(`${BASE_URL}/menu/items/${item.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            isActive: !item.isActive,
        }),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update status");
        }

        alert(
        `${item.name} ${!item.isActive ? "activated" : "deactivated"}.`
        );

        loadItems();
    } catch (error: any) {
        alert(error.message || "Failed to update status");
    }
    }

    async function requestDelete(item: MenuItem) {
    const confirmed = window.confirm(
        `Delete "${item.name}" from the menu?`
    );

    if (!confirmed) return;

    try {
        const res = await fetch(`${BASE_URL}/menu/items/${item.id}`, {
        method: "DELETE",
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to delete item");
        }

        alert(`${item.name} deleted.`);

        loadItems();
    } catch (error: any) {
        alert(error.message || "Failed to delete item");
    }
    }

  const grouped = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const item of items) {
      const key = item.category?.name ?? "Uncategorized";
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return [...map.entries()];
  }, [items]);

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen">
      <main className="max-w-6xl mx-auto w-full px-6 py-8">
        <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl text-primary tracking-tight">Menu Item Management</h1>
            <p className="text-on-surface-variant text-sm mt-1">Edit, deactivate, or remove dishes from the digital menu.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items…"
                className="w-full bg-surface-container-low rounded-lg pl-9 pr-3 py-2 text-sm border border-transparent focus:border-primary/20 focus:outline-none" />
            </div>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/20 focus:outline-none">
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </header>

        {loading ? (
          <p className="text-sm text-on-surface-variant py-8">Loading items…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-16">No menu items match your search.</p>
        ) : (
          <div className="space-y-8">
            {grouped.map(([categoryName, groupItems]) => (
              <section key={categoryName}>
                <h2 className="font-headline text-lg text-on-surface mb-3">{categoryName}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupItems.map((item) => (
                    <div key={item.id} className={`bg-surface-container-lowest rounded-xl p-3 flex gap-3 ${!item.isActive ? "opacity-60" : ""}`}>
                      <div className="w-16 h-16 shrink-0 rounded-lg bg-surface-container-high overflow-hidden flex items-center justify-center">
                        {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <ImagePlus size={18} className="text-on-surface-variant" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-on-surface truncate">{item.name}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setEditingItem(item)} className="p-1 text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                              <SquarePen size={14} />
                            </button>
                            <button onClick={() => requestDelete(item)} className="p-1 text-on-surface-variant hover:text-error transition-colors" title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-on-surface-variant truncate">${Number(item.price).toFixed(2)} • {item.sku}</p>
                        <button onClick={() => toggleStatus(item)}
                          className={`mt-1.5 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                            item.isActive ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container-high text-on-surface-variant"
                          }`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {editingItem && (
        <EditItemModal item={editingItem} categories={categories} allergens={allergens} onClose={() => setEditingItem(null)} onSaved={loadItems} />
      )}
    </div>
  );
}