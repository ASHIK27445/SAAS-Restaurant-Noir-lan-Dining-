import {
  Search,
  Truck,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  CreditCard,
  Check,
  ArrowRight,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createPurchaseOrder,
  getInventory,
  getPurchaseOrders,
  getSuppliers,
  updatePurchaseOrderStatus,
} from "../../api/inventory";
import type { InventoryItem, PurchaseOrder, PurchaseOrderStatus, Supplier } from "../../types/inventory";

type Tab = "all" | "pending" | "completed";

function StatusBadge({ status }: { status: PurchaseOrderStatus }) {
  switch (status) {
    case "SHIPPED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-inverse-primary/20 text-primary text-xs font-medium border border-primary/10">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Shipped
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface-variant text-xs font-medium border border-outline-variant/30">
          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant" />
          Pending
        </span>
      );
    case "RECEIVED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/10">
          <Check size={12} />
          Received
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-error-container/50 text-on-error-container text-xs font-medium border border-error-container">
          <span className="w-1.5 h-1.5 rounded-full bg-on-error-container" />
          Cancelled
        </span>
      );
  }
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

type ItemRow = { inventoryItemId: string; quantity: string; unitPrice: string };
const EMPTY_ROW: ItemRow = { inventoryItemId: "", quantity: "1", unitPrice: "" };

export default function ProcurementPOTracking() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // New order inline panel
  const [showForm, setShowForm] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [poNumber, setPoNumber] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [rows, setRows] = useState<ItemRow[]>([{ ...EMPTY_ROW }]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function loadOrders() {
    setLoading(true);
    setError(null);
    return getPurchaseOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message || "Failed to load purchase orders"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function openForm() {
    setFormError(null);
    setPoNumber("");
    setSupplierId("");
    setExpectedDate("");
    setRows([{ ...EMPTY_ROW }]);
    setShowForm(true);

    if (suppliers.length === 0) {
      getSuppliers()
        .then((res) => setSuppliers(res.data))
        .catch(() => {});
    }
    if (inventoryItems.length === 0) {
      getInventory({ pageSize: 100 })
        .then((res) => setInventoryItems(res.data))
        .catch(() => {});
    }
  }

  function updateRow(i: number, patch: Partial<ItemRow>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { ...EMPTY_ROW }]);
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  function itemPicked(i: number, inventoryItemId: string) {
    const item = inventoryItems.find((it) => it.id === inventoryItemId);
    updateRow(i, {
      inventoryItemId,
      unitPrice: item ? item.costPerUnit : rows[i].unitPrice,
    });
  }

  const formTotal = useMemo(
    () =>
      rows.reduce((sum, r) => sum + (Number(r.quantity) || 0) * (Number(r.unitPrice) || 0), 0),
    [rows]
  );

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const validRows = rows.filter((r) => r.inventoryItemId && Number(r.quantity) > 0);
    if (!poNumber.trim() || !supplierId || validRows.length === 0) {
      setFormError("PO number, supplier, and at least one line item are required.");
      return;
    }

    setSubmitting(true);
    try {
      await createPurchaseOrder({
        poNumber: poNumber.trim(),
        supplierId,
        expectedDate: expectedDate || undefined,
        items: validRows.map((r) => ({
          inventoryItemId: r.inventoryItemId,
          quantity: Number(r.quantity),
          unitPrice: Number(r.unitPrice) || 0,
        })),
      });
      setShowForm(false);
      await loadOrders();
    } catch (err: any) {
      setFormError(err.message || "Failed to create purchase order");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, status: PurchaseOrderStatus) {
    setActionLoadingId(id);
    try {
      await updatePurchaseOrderStatus(id, status);
      await loadOrders();
    } catch (err: any) {
      setError(err.message || "Failed to update order status");
    } finally {
      setActionLoadingId(null);
    }
  }

  const filtered = orders.filter((o) => {
    if (tab === "pending" && o.status !== "PENDING") return false;
    if (tab === "completed" && o.status !== "RECEIVED") return false;
    if (
      search &&
      !o.poNumber.toLowerCase().includes(search.toLowerCase()) &&
      !o.supplier?.name.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const inTransitCount = orders.filter((o) => o.status === "SHIPPED").length;
  const actionRequiredCount = orders.filter((o) => o.status === "PENDING").length;

  const now = new Date();
  const monthSpend = orders
    .filter((o) => {
      const d = new Date(o.issuedDate);
      return o.status !== "CANCELLED" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <div className="flex h-screen overflow-hidden antialiased selection:bg-primary selection:text-on-primary bg-surface text-on-surface font-body">
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-surface relative">
        <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:px-16">
          {/* Page Header */}
          <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline text-4xl md:text-5xl text-on-surface tracking-tight mb-2">
                Procurement
              </h1>
              <p className="font-body text-on-surface-variant text-lg max-w-xl">
                Manage active purchase orders and track incoming ingredient sourcing.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-surface-container-low p-1.5 rounded-xl">
                <button
                  onClick={() => setTab("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === "all"
                      ? "bg-surface shadow-[0_2px_8px_rgba(27,28,26,0.04)] text-primary"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => setTab("pending")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === "pending"
                      ? "bg-surface shadow-[0_2px_8px_rgba(27,28,26,0.04)] text-primary"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setTab("completed")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === "completed"
                      ? "bg-surface shadow-[0_2px_8px_rgba(27,28,26,0.04)] text-primary"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  Completed
                </button>
              </div>
              <button
                onClick={() => (showForm ? setShowForm(false) : openForm())}
                className="bg-primary text-on-primary rounded-xl px-5 py-3 font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                {showForm ? <X size={18} /> : <Plus size={18} />}
                {showForm ? "Close" : "New Purchase Order"}
              </button>
            </div>
          </div>

          {/* Inline New Order Panel — sits right below the header/button, no modal */}
          {showForm && (
            <div className="max-w-6xl mx-auto mb-10 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
              <h3 className="font-headline text-xl text-on-surface mb-4">New Purchase Order</h3>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                      PO Number *
                    </label>
                    <input
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      placeholder="PO-2026-001"
                      className="mt-1 w-full bg-surface rounded-lg px-3 py-2 text-sm border border-outline-variant/20 focus:border-primary/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                      Supplier *
                    </label>
                    <select
                      value={supplierId}
                      onChange={(e) => setSupplierId(e.target.value)}
                      className="mt-1 w-full bg-surface rounded-lg px-3 py-2 text-sm border border-outline-variant/20 focus:border-primary/30 focus:outline-none"
                    >
                      <option value="">Select supplier…</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                      Expected Date
                    </label>
                    <input
                      type="date"
                      value={expectedDate}
                      onChange={(e) => setExpectedDate(e.target.value)}
                      className="mt-1 w-full bg-surface rounded-lg px-3 py-2 text-sm border border-outline-variant/20 focus:border-primary/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
                    Line Items *
                  </label>
                  <div className="mt-2 space-y-2">
                    {rows.map((row, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <select
                          value={row.inventoryItemId}
                          onChange={(e) => itemPicked(i, e.target.value)}
                          className="flex-1 bg-surface rounded-lg px-3 py-2 text-sm border border-outline-variant/20 focus:border-primary/30 focus:outline-none"
                        >
                          <option value="">Select ingredient…</option>
                          {inventoryItems.map((it) => (
                            <option key={it.id} value={it.id}>
                              {it.name} ({it.unit})
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min={0}
                          step={0.1}
                          value={row.quantity}
                          onChange={(e) => updateRow(i, { quantity: e.target.value })}
                          placeholder="Qty"
                          className="w-24 bg-surface rounded-lg px-3 py-2 text-sm border border-outline-variant/20 focus:border-primary/30 focus:outline-none"
                        />
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={row.unitPrice}
                          onChange={(e) => updateRow(i, { unitPrice: e.target.value })}
                          placeholder="Unit price"
                          className="w-28 bg-surface rounded-lg px-3 py-2 text-sm border border-outline-variant/20 focus:border-primary/30 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeRow(i)}
                          disabled={rows.length === 1}
                          className="p-2 text-on-surface-variant hover:text-error transition-colors disabled:opacity-30"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addRow}
                    className="mt-2 text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add line item
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                  <p className="text-sm text-on-surface-variant">
                    Order total:{" "}
                    <span className="font-headline text-lg text-on-surface">{formatCurrency(formTotal)}</span>
                  </p>
                  <div className="flex gap-3">
                    {formError && <p className="text-error text-sm self-center">{formError}</p>}
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {submitting ? "Creating…" : "Create Purchase Order"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Dashboard Overview Cards — all computed from real fetched orders */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group hover:bg-surface-container-low transition-colors duration-300">
              <Truck
                className="absolute -right-4 -bottom-4 text-primary-container/20 group-hover:text-primary-container/30 transition-colors pointer-events-none"
                size={120}
              />
              <p className="text-on-surface-variant text-sm font-medium mb-1">In Transit</p>
              <h3 className="font-headline text-3xl text-on-surface mb-4">{inTransitCount} Orders</h3>
              <p className="text-primary text-sm flex items-center gap-1 font-medium">
                <TrendingUp size={16} /> Currently shipped
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group hover:bg-surface-container-low transition-colors duration-300">
              <AlertTriangle
                className="absolute -right-4 -bottom-4 text-tertiary-container/10 group-hover:text-tertiary-container/20 transition-colors pointer-events-none"
                size={120}
              />
              <p className="text-on-surface-variant text-sm font-medium mb-1">Action Required</p>
              <h3 className="font-headline text-3xl text-on-surface mb-4">{actionRequiredCount} Pending</h3>
              <p className="text-tertiary text-sm flex items-center gap-1 font-medium">
                <AlertCircle size={16} /> Awaiting approval
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group hover:bg-surface-container-low transition-colors duration-300">
              <CreditCard
                className="absolute -right-4 -bottom-4 text-primary-container/10 group-hover:text-primary-container/20 transition-colors pointer-events-none"
                size={120}
              />
              <p className="text-on-surface-variant text-sm font-medium mb-1">This Month&apos;s Spend</p>
              <h3 className="font-headline text-3xl text-on-surface mb-4">{formatCurrency(monthSpend)}</h3>
              <p className="text-on-surface-variant text-sm flex items-center gap-1">
                Sum of non-cancelled orders issued this month
              </p>
            </div>
          </div>

          {/* Purchase Orders Table */}
          <div className="max-w-6xl mx-auto bg-surface-container-lowest rounded-xl overflow-hidden pb-4">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="font-headline text-2xl text-on-surface">Orders</h2>
              <div className="relative w-full sm:w-auto">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
                  size={18}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search PO number or supplier..."
                  className="w-full sm:w-80 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/50 border-0 rounded-lg py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-high transition-colors text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-container-high/50 text-on-surface-variant text-xs uppercase tracking-wider font-medium">
                    <th className="py-4 px-6 font-body">PO Number</th>
                    <th className="py-4 px-6 font-body">Supplier</th>
                    <th className="py-4 px-6 font-body">Date Issued</th>
                    <th className="py-4 px-6 font-body">Expected</th>
                    <th className="py-4 px-6 font-body text-right">Amount</th>
                    <th className="py-4 px-6 font-body">Status</th>
                    <th className="py-4 px-6 font-body text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-10 px-6 text-center text-on-surface-variant">
                        Loading purchase orders…
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="py-10 px-6 text-center text-error">
                        {error}
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 px-6 text-center text-on-surface-variant">
                        No purchase orders yet.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row) => {
                      const cancelled = row.status === "CANCELLED";
                      const busy = actionLoadingId === row.id;
                      return (
                        <tr
                          key={row.id}
                          className={`group hover:bg-surface-container-low/50 transition-colors border-b border-surface-container-low last:border-0 ${
                            cancelled ? "opacity-70" : ""
                          }`}
                        >
                          <td
                            className={`py-4 px-6 font-medium ${
                              cancelled
                                ? "text-on-surface-variant line-through decoration-on-surface-variant/30"
                                : "text-primary"
                            }`}
                          >
                            {row.poNumber}
                          </td>
                          <td className="py-4 px-6 text-on-surface font-medium">
                            {row.supplier?.name ?? "—"}
                          </td>
                          <td className="py-4 px-6 text-on-surface-variant">{formatDate(row.issuedDate)}</td>
                          <td className="py-4 px-6 text-on-surface-variant">{formatDate(row.expectedDate)}</td>
                          <td
                            className={`py-4 px-6 font-headline text-base text-right ${
                              cancelled ? "text-on-surface-variant" : "text-on-surface"
                            }`}
                          >
                            {formatCurrency(Number(row.totalAmount))}
                          </td>
                          <td className="py-4 px-6">
                            <StatusBadge status={row.status} />
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {row.status === "PENDING" && (
                                <>
                                  <button
                                    disabled={busy}
                                    onClick={() => handleStatusChange(row.id, "SHIPPED")}
                                    className="text-primary hover:underline text-xs font-semibold disabled:opacity-50"
                                  >
                                    Mark Shipped
                                  </button>
                                  <button
                                    disabled={busy}
                                    onClick={() => handleStatusChange(row.id, "CANCELLED")}
                                    className="text-error hover:underline text-xs font-semibold disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {row.status === "SHIPPED" && (
                                <>
                                  <button
                                    disabled={busy}
                                    onClick={() => handleStatusChange(row.id, "RECEIVED")}
                                    className="text-primary hover:underline text-xs font-semibold disabled:opacity-50"
                                  >
                                    Mark Received
                                  </button>
                                  <button
                                    disabled={busy}
                                    onClick={() => handleStatusChange(row.id, "CANCELLED")}
                                    className="text-error hover:underline text-xs font-semibold disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {(row.status === "RECEIVED" || row.status === "CANCELLED") && (
                                <span className="text-on-surface-variant text-xs">—</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 pt-4 mt-2 flex justify-center border-t border-surface-container-low">
              <p className="text-on-surface-variant text-xs flex items-center gap-2">
                {filtered.length} of {orders.length} orders shown
                <ArrowRight size={14} />
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}