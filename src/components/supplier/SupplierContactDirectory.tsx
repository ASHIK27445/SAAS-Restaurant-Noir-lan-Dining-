import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Leaf,
  Fish,
  Beef,
  Milk,
  Wheat,
  Star,
  Mail,
  Phone,
  Clock,
  MapPin,
  UserPlus,
  X,
  Building2,
} from "lucide-react";
import {
  getSupplierContacts,
  createSupplierContact,
  toggleSupplierContactFavorite,
} from "../../api/inventory";
import type { SupplierContact, CreateSupplierContactInput } from "../../types/inventory";

const CATEGORY_ICON: Record<string, typeof Fish> = {
  Produce: Leaf,
  Seafood: Fish,
  "Meat & Poultry": Beef,
  "Dairy & Cheese": Milk,
  "Dry Goods": Wheat,
};

const FILTERS = ["All", "Produce", "Dairy & Cheese", "Meat & Poultry", "Seafood", "Dry Goods"];

const EMPTY_FORM: CreateSupplierContactInput = {
  companyName: "",
  category: "",
  contactName: "",
  role: "",
  email: "",
  phone: "",
  address: "",
  businessHours: "",
};

export default function SupplierContactDirectory() {
  const [contacts, setContacts] = useState<SupplierContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CreateSupplierContactInput>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    return getSupplierContacts()
      .then((res) => setContacts(res.data))
      .catch((err) => setError(err.message || "Failed to load contacts"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      contacts.filter((c) => {
        const matchesFilter = activeFilter === "All" || c.category === activeFilter;
        const q = search.toLowerCase();
        const matchesSearch =
          c.companyName.toLowerCase().includes(q) || (c.contactName ?? "").toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
      }),
    [contacts, search, activeFilter]
  );

  async function handleToggleFavorite(id: string) {
    setTogglingId(id);
    const prev = contacts;
    setContacts((cur) => cur.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)));
    try {
      await toggleSupplierContactFavorite(id);
    } catch {
      setContacts(prev);
    } finally {
      setTogglingId(null);
    }
  }

  function openModal() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.companyName.trim()) {
      setFormError("Company name is required.");
      return;
    }

    setSubmitting(true);
    try {
      await createSupplierContact({
        companyName: form.companyName.trim(),
        category: form.category?.trim() || undefined,
        contactName: form.contactName?.trim() || undefined,
        role: form.role?.trim() || undefined,
        email: form.email?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        address: form.address?.trim() || undefined,
        businessHours: form.businessHours?.trim() || undefined,
      });
      setModalOpen(false);
      await load();
    } catch (err: any) {
      setFormError(err.message || "Failed to save contact");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen">
      <main className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-headline text-2xl text-primary tracking-tight sm:text-3xl lg:text-4xl">
              Supplier Contacts
            </h1>
            <p className="text-on-surface-variant text-sm mt-1 max-w-xl">
              Every company you might work with — saved so you can reach out when you need to.
            </p>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <div className="relative flex-1 sm:w-64 sm:flex-none">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                size={16}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts…"
                className="w-full bg-surface-container-low text-on-surface text-sm rounded-lg pl-9 pr-3 py-2 border border-transparent focus:bg-surface-container-high focus:border-outline-variant/20 focus:outline-none transition-colors placeholder:text-on-surface-variant"
              />
            </div>
            <button
              onClick={openModal}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
            >
              <UserPlus size={16} />
              <span className="hidden sm:inline">Add Contact</span>
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === f
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-on-surface-variant text-sm">Loading contacts…</p>
        ) : error ? (
          <p className="text-error text-sm">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-on-surface-variant text-sm">
              {contacts.length === 0
                ? "No contacts saved yet — add the first one."
                : "No contacts match your search or filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {filtered.map((c) => {
              const Icon = (c.category && CATEGORY_ICON[c.category]) || Building2;
              const isFav = c.isFavorite;

              return (
                <article
                  key={c.id}
                  className={`group relative rounded-xl p-5 flex flex-col justify-between overflow-hidden transition-colors ${
                    isFav
                      ? "bg-primary-container hover:bg-[#253c30]"
                      : "bg-surface-container-lowest hover:bg-surface-container-low border border-transparent hover:border-outline-variant/10"
                  }`}
                >
                  {!isFav && (
                    <Icon
                      className="absolute -right-2 -top-2 text-primary opacity-[0.06] group-hover:opacity-10 transition-opacity"
                      size={88}
                    />
                  )}

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        {c.category && (
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-wider block mb-0.5 ${
                              isFav ? "text-on-primary-container" : "text-secondary"
                            }`}
                          >
                            {c.category}
                          </span>
                        )}
                        <h3
                          className={`font-headline text-lg leading-tight truncate ${
                            isFav ? "text-on-primary" : "text-on-surface"
                          }`}
                        >
                          {c.companyName}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleToggleFavorite(c.id)}
                        disabled={togglingId === c.id}
                        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                        aria-pressed={isFav}
                        className="shrink-0 -mr-1 -mt-1 p-1.5 rounded-full hover:bg-black/5 disabled:opacity-50 transition-colors"
                      >
                        <Star
                          size={17}
                          className={
                            isFav
                              ? "text-tertiary-fixed fill-tertiary-fixed"
                              : "text-on-surface-variant"
                          }
                        />
                      </button>
                    </div>

                    {(c.contactName || c.role) && (
                      <div className="mb-4">
                        {c.contactName && (
                          <p className={`text-sm font-medium ${isFav ? "text-on-primary" : "text-primary"}`}>
                            {c.contactName}
                          </p>
                        )}
                        {c.role && (
                          <p className={`text-xs ${isFav ? "text-on-primary-container" : "text-on-surface-variant"}`}>
                            {c.role}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2 text-xs">
                      {c.email && (
                        <a
                          href={`mailto:${c.email}`}
                          className={`flex items-center gap-2 truncate transition-colors ${
                            isFav ? "text-on-primary hover:text-primary-fixed" : "text-on-surface hover:text-primary"
                          }`}
                        >
                          <Mail className={isFav ? "text-on-primary-container shrink-0" : "text-on-surface-variant shrink-0"} size={14} />
                          <span className="truncate">{c.email}</span>
                        </a>
                      )}
                      {c.phone && (
                        <p
                          className={`flex items-center gap-2 transition-colors ${
                            isFav ? "text-on-primary hover:text-primary-fixed" : "text-on-surface hover:text-primary"
                          }`}
                        >
                          <Phone className={isFav ? "text-on-primary-container shrink-0" : "text-on-surface-variant shrink-0"} size={14} />
                          {c.phone}
                        </p>
                      )}
                      {c.address && (
                        <div className={`flex items-center gap-2 ${isFav ? "text-on-primary-container" : "text-on-surface-variant"}`}>
                          <MapPin size={14} className="shrink-0" />
                          <span className="truncate">{c.address}</span>
                        </div>
                      )}
                      {c.businessHours && (
                        <div className={`flex items-center gap-2 ${isFav ? "text-on-primary-container" : "text-on-surface-variant"}`}>
                          <Clock size={14} className="shrink-0" />
                          {c.businessHours}
                        </div>
                      )}
                      {!c.email && !c.phone && !c.address && !c.businessHours && (
                        <p className={isFav ? "text-on-primary-container" : "text-on-surface-variant"}>
                          No contact details saved yet
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Add New Contact tile */}
            <button
              onClick={openModal}
              className="rounded-xl p-5 flex flex-col items-center justify-center text-center border border-dashed border-outline-variant/50 hover:bg-surface-container-low transition-colors min-h-44"
            >
              <div className="w-11 h-11 rounded-full bg-surface-container-low flex items-center justify-center mb-3 text-primary">
                <UserPlus size={20} />
              </div>
              <h3 className="font-headline text-sm text-primary font-semibold mb-1">Add Contact</h3>
              <p className="text-xs text-on-surface-variant max-w-44">
                Save a company you may work with in the future.
              </p>
            </button>
          </div>
        )}
      </main>

      {/* Add Contact Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-md bg-surface rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10 sticky top-0 bg-surface">
              <h3 className="font-headline text-lg text-on-surface">Add Contact</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3 text-sm">
              <div>
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                  Company name *
                </label>
                <input
                  required
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                  >
                    <option value="">None</option>
                    {FILTERS.filter((f) => f !== "All").map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    Role
                  </label>
                  <input
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Owner, Manager…"
                    className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                  />
                </div>
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

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div>
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
                  Business hours
                </label>
                <input
                  value={form.businessHours}
                  onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
                  placeholder="Mon-Fri, 9am - 5pm"
                  className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 focus:outline-none"
                />
              </div>

              {formError && <p className="text-error text-xs">{formError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Saving…" : "Add Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}