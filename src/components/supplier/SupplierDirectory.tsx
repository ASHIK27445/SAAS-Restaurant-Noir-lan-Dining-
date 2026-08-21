import { Package, Search, Menu, UserPlus, MoreVertical, Fish, Leaf, Store, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createSupplier, getSupplierDirectory } from "../../api/inventory";
import type { SupplierDirectoryEntry, SupplierStatus } from "../../types/inventory";
import { Link } from "react-router";

const CATEGORY_ICON: Record<string, typeof Fish> = {
  Seafood: Fish,
  Produce: Leaf,
};

function formatCurrency(n: number) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "No deliveries yet";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

const EMPTY_FORM = {
  name: "",
  category: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  rating: "",
  status: "ACTIVE" as SupplierStatus,
};

export default function SupplierDirectory() {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState<SupplierDirectoryEntry[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadDirectory = async() => {
    setLoading(true);
    setError(null);
    return getSupplierDirectory()
      .then((res) => {
        setSuppliers(res.data);
        setActiveCount(res.meta.activeSupplierCount);
      })
      .catch((err) => setError(err.message || "Failed to load suppliers"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadDirectory();
  }, []);

  const filtered = useMemo(
    () =>
      suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.category.toLowerCase().includes(search.toLowerCase())
      ),
    [suppliers, search]
  );

  // Highest real spend becomes the featured card
  const featured = useMemo(
    () => [...filtered].sort((a, b) => b.totalSpend - a.totalSpend)[0],
    [filtered]
  );
  const rest = filtered.filter((s) => s.id !== featured?.id);

  function openModal() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.category.trim()) {
      setFormError("Name and category are required.");
      return;
    }

    setSubmitting(true);
    try {
      await createSupplier({
        name: form.name.trim(),
        category: form.category.trim(),
        contactName: form.contactName.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        rating: form.rating ? Number(form.rating) : null,
        status: form.status,
      });
      setModalOpen(false);
      await loadDirectory();
    } catch (err: any) {
      setFormError(err.message || "Failed to create supplier");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden antialiased selection:bg-primary-container selection:text-on-primary-container bg-surface text-on-surface font-body">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-surface relative">
        {/* TopAppBar (Mobile Only) */}
        <header className="md:hidden flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 bg-surface-container-low/80 backdrop-blur-xl">
          <span className="font-headline text-2xl italic tracking-tighter text-primary">
            The Culinary Editorial
          </span>
          <div className="flex items-center space-x-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-300">
              <Search size={22} />
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-300">
              <Menu size={22} />
            </button>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Page Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-on-surface-variant text-sm font-medium tracking-widest uppercase mb-2">
                  Procurement Network
                </p>
                <h2 className="font-headline text-4xl md:text-5xl text-on-surface tracking-tight leading-tight">
                  Supplier Directory
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
                <div className="relative w-full sm:w-72 group">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant z-10"
                    size={20}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search suppliers, ingredients..."
                    className="w-full bg-surface-container-low focus:bg-surface-container-high border border-outline-variant/20 focus:border-primary/20 rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-0 transition-all duration-300"
                  />
                </div>
                <button
                  onClick={openModal}
                  className="w-full sm:w-auto bg-primary text-on-primary rounded-xl py-3 px-6 font-medium flex items-center justify-center hover:opacity-90 transition-opacity whitespace-nowrap shadow-[0_12px_32px_rgba(27,28,26,0.04)]"
                >
                  <UserPlus className="mr-2" size={20} />
                  Add New Supplier
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-on-surface-variant text-sm">Loading suppliers…</p>
            ) : error ? (
              <p className="text-error text-sm">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="text-on-surface-variant text-sm">
                {suppliers.length === 0 ? "No suppliers yet. Add your first one." : "No suppliers match your search."}
              </p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Featured Supplier (Span 8) — highest real spend in the network */}
                {featured && (
                  <Link 
                  to={`/supplier/${featured.id}`}
                  className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 relative overflow-hidden group transition-colors duration-500 hover:bg-surface-container-low flex flex-col justify-between min-h-100">
                    <div className="relative z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold uppercase tracking-wider mb-6">
                        Top Partner
                      </span>
                      <h3 className="font-headline text-3xl text-on-surface mb-2">{featured.name}</h3>
                      <p className="text-on-surface-variant max-w-md">
                        {featured.category} supplier · {featured.status === "ACTIVE" ? "Active partner" : "Inactive"}
                      </p>
                    </div>
                    <div className="relative z-10 grid grid-cols-3 gap-6 mt-12 border-t border-outline-variant/20 pt-6">
                      <div>
                        <p className="text-on-surface-variant text-xs uppercase tracking-wider mb-1">Category</p>
                        <p className="font-medium text-on-surface flex items-center gap-1">
                          <Store size={16} /> {featured.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-on-surface-variant text-xs uppercase tracking-wider mb-1">
                          Last Delivery
                        </p>
                        <p className="font-headline text-lg text-primary">{formatDate(featured.lastDelivery)}</p>
                      </div>
                      <div>
                        <p className="text-on-surface-variant text-xs uppercase tracking-wider mb-1">Total Spend</p>
                        <p className="font-headline text-lg text-on-surface">
                          {formatCurrency(featured.totalSpend)}
                        </p>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Network summary (Span 4) */}
                <div className="lg:col-span-4 bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline text-2xl mb-6">Network Health</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-primary-fixed-dim">On-Time Deliveries</span>
                          <span className="font-bold">{featured?.reliabilityScore != null ? `${featured.reliabilityScore.toFixed(1)}%` : "No data"}</span>
                        </div>
                        <div className="w-full bg-primary-container rounded-full h-1.5">
                          <div
                            className="bg-primary-fixed h-1.5 rounded-full"
                            style={{ width: `${featured?.reliabilityScore ?? 0}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-primary-fixed-dim">Quality Acceptance</span>
                          <span className="font-bold">{featured?.qualityAcceptance != null ? `${featured.qualityAcceptance.toFixed(1)}%` : "No data"}</span>
                        </div>
                        <div className="w-full bg-primary-container rounded-full h-1.5">
                          <div
                            className="bg-primary-fixed h-1.5 rounded-full"
                            style={{ width: `${featured?.qualityAcceptance ?? 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12">
                    <p className="text-primary-fixed-dim text-sm mb-1">Total Active Suppliers</p>
                    <p className="font-headline text-5xl">{activeCount}</p>
                  </div>
                </div>

                {/* Standard supplier cards */}
                {rest.map((s) => {
                  const Icon = CATEGORY_ICON[s.category] ?? Package;
                  return (
                    <Link
                      to={`/supplier/${s.id}`}
                      key={s.id}
                      className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 transition-colors duration-300 hover:bg-surface-container-low cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-high shrink-0 flex items-center justify-center font-headline text-xl text-on-surface-variant">
                          {s.name.charAt(0)}
                        </div>
                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                      <h4 className="font-headline text-xl text-on-surface mb-1">{s.name}</h4>
                      <p className="text-on-surface-variant text-sm mb-6 flex items-center gap-1">
                        <Icon size={16} /> {s.category}
                      </p>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                          <span className="text-on-surface-variant">Last Delivery</span>
                          <span className="text-on-surface">{formatDate(s.lastDelivery)}</span>
                        </div>
                        <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                          <span className="text-on-surface-variant">Rating</span>
                          <span className="text-on-surface font-medium">
                            {s.rating != null ? s.rating.toFixed(1) : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-on-surface-variant">Total Spend</span>
                          <span className="font-headline text-base text-on-surface">
                            {formatCurrency(s.totalSpend)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          {/* Spacer for bottom padding */}
          <div className="h-24" />
        </main>
      </div>

      {/* Add Supplier Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-lg bg-surface rounded-xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
              <h3 className="font-headline text-xl text-on-surface">Add New Supplier</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    Category *
                  </label>
                  <input
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Produce, Seafood, Dairy & Cheese…"
                    className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    Contact name
                  </label>
                  <input
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as SupplierStatus })}
                    className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    Address
                  </label>
                  <input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    Rating (0–5)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                  />
                </div>
              </div>

              {formError && <p className="text-error text-sm">{formError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Saving…" : "Add Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}