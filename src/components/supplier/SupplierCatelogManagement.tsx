import { useEffect, useMemo, useRef, useState } from "react";
import {
  Package,
  Plus,
  Search,
  ChevronDown,
  Store,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  X,
  Check,
  AlertTriangle,
  PackageX,
} from "lucide-react";
import {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getSuppliers,
} from "../../api/inventory";
import type { InventoryItem, CreateInventoryItemInput, Supplier, StockStatus } from "../../types/inventory";

const CATEGORY_SUGGESTIONS = [
  "Produce",
  "Dairy & Cheese",
  "Meat & Poultry",
  "Seafood",
  "Dry Goods",
  "Fungi & Foraged",
  "Spices & Seasonings",
];

const STATUS_STYLE: Record<StockStatus, { label: string; dot: string; text: string; icon: typeof Package }> = {
  "in-stock": { label: "In Stock", dot: "bg-primary", text: "text-primary", icon: Check },
  "low-stock": { label: "Low Stock", dot: "bg-tertiary", text: "text-tertiary", icon: AlertTriangle },
  "out-of-stock": { label: "Out of Stock", dot: "bg-error", text: "text-error", icon: PackageX },
};

const EMPTY_FORM: CreateInventoryItemInput = {
  name: "",
  sku: "",
  unit: "",
  image: "",
  category: "",
  currentStock: 0,
  minThreshold: 0,
  costPerUnit: 0,
  supplierId: "",
};

const PAGE_SIZE = 8;

type Toast =
  | { id: number; kind: "message"; tone: "success" | "error"; text: string }
  | { id: number; kind: "confirm"; text: string; onConfirm: () => void };

type ToastInput =
  | { kind: "message"; tone: "success" | "error"; text: string }
  | { kind: "confirm"; text: string; onConfirm: () => void };

export default function SupplierCatalogManagement() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockStatus | "">("");

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateInventoryItemInput>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const toastId = useRef(0);

  function pushToast(t: ToastInput) {
    const id = ++toastId.current;
    setToasts((cur) => [...cur, { ...t, id } as Toast]);
    if (t.kind === "message") {
      setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== id)), 3000);
    }
    return id;
  }
  function dismissToast(id: number) {
    setToasts((cur) => cur.filter((t) => t.id !== id));
  }

  function loadItems() {
    setLoading(true);
    setError(null);
    return getInventory({
      search: search || undefined,
      category: categoryFilter || undefined,
      status: statusFilter || undefined,
      page,
      pageSize: PAGE_SIZE,
    })
      .then((res) => {
        setItems(res.data);
        setTotal(res.pagination?.total ?? res.data.length);
      })
      .catch((err) => setError(err.message || "Failed to load catalog"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getSuppliers().then((res) => setSuppliers(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter, statusFilter, page]);

  const knownCategories = useMemo(() => {
    const fromItems = items.map((i) => i.category);
    return Array.from(new Set([...CATEGORY_SUGGESTIONS, ...fromItems])).sort();
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function openAddPanel() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setPanelOpen(true);
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function openEditPanel(item: InventoryItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      sku: item.sku,
      unit: item.unit,
      image: item.image ?? "",
      category: item.category,
      currentStock: Number(item.currentStock),
      minThreshold: Number(item.minThreshold),
      costPerUnit: Number(item.costPerUnit),
      supplierId: item.supplierId ?? "",
    });
    setFormError(null);
    setPanelOpen(true);
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.sku.trim() || !form.unit.trim() || !form.category.trim() || !form.costPerUnit) {
      setFormError("Name, SKU, unit, category and price are required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateInventoryItemInput = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        unit: form.unit.trim(),
        image: form.image?.trim() || undefined,
        category: form.category.trim(),
        currentStock: Number(form.currentStock) || 0,
        minThreshold: Number(form.minThreshold) || 0,
        costPerUnit: Number(form.costPerUnit),
        supplierId: form.supplierId || undefined,
      };

      if (editingId) {
        await updateInventoryItem(editingId, payload);
        pushToast({ kind: "message", tone: "success", text: `${payload.name} updated.` });
      } else {
        await createInventoryItem(payload);
        pushToast({ kind: "message", tone: "success", text: `${payload.name} added to catalog.` });
      }

      closePanel();
      await loadItems();
    } catch (err: any) {
      setFormError(err.message || "Failed to save item");
    } finally {
      setSubmitting(false);
    }
  }

  function requestDelete(item: InventoryItem) {
    pushToast({
      kind: "confirm",
      text: `Remove "${item.name}" from the catalog?`,
      onConfirm: async () => {
        try {
          await deleteInventoryItem(item.id);
          pushToast({ kind: "message", tone: "success", text: `${item.name} removed.` });
          await loadItems();
        } catch (err: any) {
          pushToast({ kind: "message", tone: "error", text: err.message || "Failed to remove item" });
        }
      },
    });
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased">
        <div className="px-5 py-8 md:px-10 lg:px-12">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-headline font-bold text-primary tracking-tight">
                Supplier Catalog
              </h2>
              <p className="text-on-surface-variant mt-2 text-sm max-w-2xl leading-relaxed">
                Every ingredient sourced from your supplier network, kept current.
              </p>
            </div>
            <button
              onClick={panelOpen && !editingId ? closePanel : openAddPanel}
              className="bg-primary text-on-primary hover:opacity-90 transition-opacity duration-300 rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-[0_12px_32px_rgba(27,49,36,0.15)] shrink-0 text-sm font-medium"
            >
              {panelOpen && !editingId ? (
                <>
                  <X size={16} /> Close
                </>
              ) : (
                <>
                  <Plus size={16} /> Add to Catalog
                </>
              )}
            </button>
          </div>

          {/* Inline Add/Edit Panel */}
          {panelOpen && (
            <div
              ref={panelRef}
              className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-5 md:p-6 mb-8 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-headline text-lg text-on-surface">
                  {editingId ? "Edit Catalog Item" : "New Catalog Item"}
                </h3>
                <button
                  onClick={closePanel}
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6">
                {/* Image preview / URL */}
                <div>
                  <div className="w-full aspect-square rounded-xl bg-surface-container-high overflow-hidden flex items-center justify-center border border-outline-variant/10">
                    {form.image ? (
                      <img src={form.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus size={28} className="text-on-surface-variant" />
                    )}
                  </div>
                  <input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Image URL"
                    className="mt-2 w-full bg-surface-container-high rounded-lg px-3 py-2 text-xs border border-transparent focus:border-primary/30 focus:outline-none"
                  />
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                      Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Périgord Black Truffle"
                      className="mt-1 w-full bg-surface-container-high rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                      SKU *
                    </label>
                    <input
                      required
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      placeholder="TRF-PER-01"
                      className="mt-1 w-full bg-surface-container-high rounded-lg px-3 py-2 text-sm font-mono border border-transparent focus:border-primary/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                      Category *
                    </label>
                    <input
                      required
                      list="category-suggestions"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="Fungi & Foraged"
                      className="mt-1 w-full bg-surface-container-high rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                    />
                    <datalist id="category-suggestions">
                      {knownCategories.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                      Price per unit *
                    </label>
                    <input
                      required
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.costPerUnit}
                      onChange={(e) => setForm({ ...form, costPerUnit: Number(e.target.value) })}
                      className="mt-1 w-full bg-surface-container-high rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                      Unit *
                    </label>
                    <input
                      required
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      placeholder="kg, lb, gram…"
                      className="mt-1 w-full bg-surface-container-high rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                      Current stock
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.currentStock}
                      onChange={(e) => setForm({ ...form, currentStock: Number(e.target.value) })}
                      className="mt-1 w-full bg-surface-container-high rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                      Low-stock threshold
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.minThreshold}
                      onChange={(e) => setForm({ ...form, minThreshold: Number(e.target.value) })}
                      className="mt-1 w-full bg-surface-container-high rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                      Supplier
                    </label>
                    <select
                      value={form.supplierId}
                      onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                      className="mt-1 w-full bg-surface-container-high rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                    >
                      <option value="">No supplier linked</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formError && <p className="sm:col-span-2 text-error text-xs">{formError}</p>}

                  <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
                    <button
                      type="button"
                      onClick={closePanel}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {submitting ? "Saving…" : editingId ? "Save Changes" : "Add Item"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Controls: Search & Filter */}
          <div className="bg-surface-container-low p-3 rounded-2xl flex flex-col md:flex-row gap-3 items-center mb-6 relative z-10">
            <div className="relative w-full md:max-w-md flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                placeholder="Search ingredients or SKUs…"
                className="w-full bg-surface-container-highest border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest rounded-xl py-2.5 pl-11 pr-4 text-sm text-on-surface placeholder:text-outline-variant transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setPage(1);
                    setCategoryFilter(e.target.value);
                  }}
                  className="appearance-none bg-surface text-on-surface text-xs font-medium pl-3 pr-8 py-2.5 rounded-lg shadow-sm border border-surface-container-highest hover:bg-surface-container-lowest transition-colors outline-none"
                >
                  <option value="">All Categories</option>
                  {knownCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setPage(1);
                    setStatusFilter(e.target.value as StockStatus | "");
                  }}
                  className="appearance-none bg-surface text-on-surface text-xs font-medium pl-3 pr-8 py-2.5 rounded-lg shadow-sm border border-surface-container-highest hover:bg-surface-container-lowest transition-colors outline-none"
                >
                  <option value="">All Stock Levels</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Catalog List */}
          {loading ? (
            <p className="text-on-surface-variant text-sm py-8">Loading catalog…</p>
          ) : error ? (
            <p className="text-error text-sm py-8">{error}</p>
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest rounded-2xl">
              <p className="text-on-surface-variant text-sm">
                {total === 0 ? "Your catalog is empty — add the first item." : "No items match your search or filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const status = STATUS_STYLE[item.status];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={item.id}
                    className="bg-surface-container-lowest rounded-2xl overflow-hidden group hover:bg-surface-container-low transition-colors duration-300 flex flex-col sm:flex-row"
                  >
                    <div className="w-full sm:w-36 h-36 sm:h-auto shrink-0 bg-surface-container-high flex items-center justify-center">
                      {item.image ? (
                        <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                      ) : (
                        <Package size={28} className="text-on-surface-variant" />
                      )}
                    </div>

                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-semibold tracking-wider text-outline uppercase">
                              {item.category}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide ${status.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                          </div>
                          <h3 className="text-lg font-headline font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-on-surface-variant font-mono mt-0.5">SKU: {item.sku}</p>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <p className="text-[11px] text-on-surface-variant mb-0.5">Price</p>
                          <p className="text-xl font-headline text-primary">
                            ${Number(item.costPerUnit).toFixed(2)}{" "}
                            <span className="text-xs text-outline-variant font-body">/ {item.unit}</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-surface-container pt-3">
                        <div className="flex items-center gap-4 text-xs text-on-surface-variant min-w-0">
                          <span className="flex items-center gap-1.5 truncate">
                            <Store size={14} className="shrink-0" /> {item.supplier?.name ?? "No supplier linked"}
                          </span>
                          <span className="hidden sm:flex items-center gap-1.5 shrink-0">
                            <StatusIcon size={14} /> {Number(item.currentStock)} {item.unit} on hand
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            title="Edit"
                            onClick={() => openEditPanel(item)}
                            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest rounded-lg transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            title="Remove"
                            onClick={() => requestDelete(item)}
                            className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {total > 0 && (
            <div className="mt-8 flex items-center justify-between text-xs text-on-surface-variant">
              <p>
                Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} of {total} items
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="w-6 text-center">…</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                          p === page ? "bg-primary text-on-primary" : "hover:bg-surface-container-high"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

      {/* Toasts */}
      <div className="fixed bottom-5 right-5 z-60 flex flex-col gap-2 w-[calc(100%-2.5rem)] sm:w-80">
        {toasts.map((t) =>
          t.kind === "message" ? (
            <div
              key={t.id}
              className={`rounded-xl px-4 py-3 text-sm shadow-lg flex items-center justify-between gap-3 ${
                t.tone === "success" ? "bg-primary text-on-primary" : "bg-error text-on-error"
              }`}
            >
              <span>{t.text}</span>
              <button onClick={() => dismissToast(t.id)} className="opacity-80 hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div key={t.id} className="rounded-xl px-4 py-3 text-sm shadow-lg bg-surface-container-highest text-on-surface border border-outline-variant/10">
              <p className="mb-3">{t.text}</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => dismissToast(t.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    t.onConfirm();
                    dismissToast(t.id);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-error text-on-error hover:opacity-90 transition-opacity"
                >
                  Remove
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}