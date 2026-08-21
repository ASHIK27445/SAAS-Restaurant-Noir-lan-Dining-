import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Star,
  StarHalf,
  MapPin,
  User,
  Landmark,
  ArrowRight,
  Filter,
  Loader2,
  PackageX,
  AlertCircle,
} from "lucide-react";
import { getSupplier, getInventory, getPurchaseOrders } from "../../api/inventory";
import type { InventoryItem, PurchaseOrder, SupplierDetail } from "../../types/inventory";

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const dateFmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const STATUS_STYLES: Record<PurchaseOrder["status"], { badge: string; dot: string }> = {
  RECEIVED: { badge: "bg-primary-fixed text-on-primary-fixed", dot: "bg-primary" },
  SHIPPED: { badge: "bg-tertiary/15 text-tertiary", dot: "bg-tertiary" },
  PENDING: { badge: "bg-surface-dim text-on-surface", dot: "bg-outline-variant" },
  CANCELLED: { badge: "bg-error/10 text-error", dot: "bg-error" },
};

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) {
    return <p className="font-body text-xs text-outline">No rating yet</p>;
  }
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex text-tertiary mt-1 gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} size={18} fill="currentColor" />;
        if (i === full && half) return <StarHalf key={i} size={18} fill="currentColor" />;
        return <Star key={i} size={18} className="text-outline-variant" />;
      })}
    </div>
  );
}

// Buckets received purchase orders into their issue month and sums totalAmount,
// so the chart only ever shows real spend, never invented data.
function buildVolumeTrend(orders: PurchaseOrder[]) {
  const buckets = new Map<string, number>();
  orders
    .filter((po) => po.status === "RECEIVED")
    .forEach((po) => {
      const d = new Date(po.issuedDate);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets.set(key, (buckets.get(key) ?? 0) + Number(po.totalAmount));
    });

  const sorted = [...buckets.entries()]
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .slice(-8);

  const max = Math.max(1, ...sorted.map(([, v]) => v));
  return sorted.map(([key, value]) => {
    const [year, month] = key.split("-").map(Number);
    const label = new Date(year, month, 1).toLocaleDateString("en-US", { month: "short" });
    return { label, value, height: Math.round((value / max) * 100) };
  });
}

export default function SupplierProfile() {
  const { supplierId } = useParams<{ supplierId: string }>();

  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const [ingredients, setIngredients] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supplierId) return;
    const id = supplierId; // narrows to string for use inside the nested closure
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [supplierRes, inventoryRes, ordersRes] = await Promise.all([
          getSupplier(id),
          getInventory({ supplierId: id, pageSize: 50 }),
          getPurchaseOrders({ supplierId: id }),
        ]);
        if (cancelled) return;
        setSupplier(supplierRes.data);
        setIngredients(inventoryRes.data);
        setOrders(ordersRes.data);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to load supplier");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [supplierId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-surface">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-surface gap-3">
        <AlertCircle className="text-error" size={32} />
        <p className="font-body text-on-surface-variant">{error || "Supplier not found"}</p>
      </div>
    );
  }

  const volumeTrend = buildVolumeTrend(orders);
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime())
    .slice(0, 6);

  return (
    <div className="font-body text-on-background flex min-h-screen bg-surface">
      <main className="flex-1 flex flex-col w-full min-h-screen">
        <div className="flex-1 overflow-y-auto pb-24 md:pb-12">
          {/* Hero / Profile Header */}
          <section className="relative w-full h-115 min-h-100 mb-16 bg-surface-container-low">
            <div className="absolute inset-0 w-full h-full">
              {supplier.category && (
                <div className="w-full h-full bg-surface-container-low" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 transform translate-y-1/3">
              <div className="max-w-5xl mx-auto">
                <div className="glass-panel rounded-xl p-8 md:p-10 ambient-shadow ghost-border flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="inline-block px-3 py-1 bg-tertiary/10 text-tertiary rounded-full font-body text-xs font-medium tracking-wide uppercase">
                        {supplier.category}
                      </span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-body text-xs font-medium tracking-wide uppercase ${
                          supplier.status === "ACTIVE"
                            ? "bg-primary/10 text-primary"
                            : "bg-surface-dim text-on-surface-variant"
                        }`}
                      >
                        {supplier.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <h1 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">
                      {supplier.name}
                    </h1>
                    {supplier.lastDelivery && (
                      <p className="font-body text-on-surface-variant max-w-xl text-lg">
                        Last delivery received on {dateFmt(supplier.lastDelivery)}.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                    <a
                      href={supplier.email ? `mailto:${supplier.email}` : undefined}
                      className={`px-6 py-3 bg-surface-container-high text-primary rounded-xl font-body font-medium hover:bg-surface-container-highest transition-colors text-center ${
                        !supplier.email ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      Contact Supplier
                    </a>
                    <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-body font-medium hover:opacity-90 transition-opacity">
                      New Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 md:px-12 mt-32 space-y-24">
            {/* Bento Grid: Performance & Contact */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 ambient-shadow ghost-border">
                <h2 className="font-headline text-2xl text-on-surface mb-8">
                  Performance Dashboard
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <p className="font-body text-sm text-on-surface-variant uppercase tracking-wider">
                      Order Fulfillment
                    </p>
                    <div className="flex items-baseline space-x-2">
                      <span className="font-headline text-4xl text-primary">
                        {supplier.fulfillmentRate !== null
                          ? `${supplier.fulfillmentRate.toFixed(1)}%`
                          : "—"}
                      </span>
                    </div>
                    <p className="font-body text-xs text-outline mt-1">
                      {supplier.receivedOrderCount} of {supplier.totalOrders} orders received
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-body text-sm text-on-surface-variant uppercase tracking-wider">
                      Product Quality Score
                    </p>
                    <div className="flex items-baseline space-x-2">
                      <span className="font-headline text-4xl text-primary">
                        {supplier.qualityScore !== null ? supplier.qualityScore.toFixed(1) : "—"}
                      </span>
                      {supplier.qualityScore !== null && (
                        <span className="text-xs text-on-surface-variant">/ 5.0</span>
                      )}
                    </div>
                    <StarRating rating={supplier.qualityScore} />
                    <p className="font-body text-xs text-outline mt-1">
                      {supplier.ratedOrderCount > 0
                        ? `From ${supplier.ratedOrderCount} rated order${supplier.ratedOrderCount === 1 ? "" : "s"}`
                        : "No orders rated yet"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-body text-sm text-on-surface-variant uppercase tracking-wider">
                      Total Spend
                    </p>
                    <div className="flex items-baseline space-x-2">
                      <span className="font-headline text-4xl text-primary">
                        {currency(supplier.totalSpend)}
                      </span>
                    </div>
                    <p className="font-body text-xs text-outline mt-1">
                      From received orders
                    </p>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-surface-container-high">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-body text-sm font-medium text-on-surface">
                      Volume Trend (Monthly)
                    </h3>
                  </div>
                  {volumeTrend.length === 0 ? (
                    <p className="font-body text-sm text-outline py-8 text-center">
                      No received orders yet to chart.
                    </p>
                  ) : (
                    <div className="h-32 w-full bg-surface-container-low rounded-lg relative overflow-hidden flex items-end px-4 gap-2">
                      {volumeTrend.map((bucket, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                          <div
                            className={`w-full rounded-t-sm transition-colors ${
                              i === volumeTrend.length - 1
                                ? "bg-primary-container"
                                : "bg-primary-container/40 hover:bg-primary-container"
                            }`}
                            style={{ height: `${bucket.height}%` }}
                          />
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {currency(bucket.value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-8">
                <h2 className="font-headline text-2xl text-on-surface mb-8">
                  Contact &amp; Details
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="text-secondary mt-1" size={20} />
                    <div>
                      <p className="font-body text-sm font-medium text-on-surface">
                        Address
                      </p>
                      <p className="font-body text-sm text-on-surface-variant mt-1 leading-relaxed">
                        {supplier.address || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <User className="text-secondary mt-1" size={20} />
                    <div>
                      <p className="font-body text-sm font-medium text-on-surface">
                        Account Contact
                      </p>
                      <p className="font-body text-sm text-on-surface-variant mt-1">
                        {supplier.contactName || "Not specified"}
                      </p>
                      {supplier.email && (
                        <a
                          href={`mailto:${supplier.email}`}
                          className="font-body text-sm text-primary hover:underline block mt-1"
                        >
                          {supplier.email}
                        </a>
                      )}
                      {supplier.phone && (
                        <p className="font-body text-sm text-on-surface-variant mt-1">
                          {supplier.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Landmark className="text-secondary mt-1" size={20} />
                    <div>
                      <p className="font-body text-sm font-medium text-on-surface">
                        Category
                      </p>
                      <p className="font-body text-sm text-on-surface-variant mt-1">
                        {supplier.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Supplied Ingredients Catalog */}
            <section>
              <div className="flex justify-between items-end mb-10">
                <h2 className="font-headline text-3xl text-on-surface">
                  Supplied Ingredients
                </h2>
                {ingredients.length > 0 && (
                  <button className="text-primary font-body text-sm font-medium hover:underline flex items-center gap-1">
                    View Full Catalog <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {ingredients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                  <PackageX className="text-outline" size={32} />
                  <p className="font-body text-sm text-on-surface-variant">
                    No inventory items linked to this supplier yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {ingredients.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="aspect-4/3 rounded-lg overflow-hidden bg-surface-container-low mb-6 relative flex items-center justify-center">
                        {item.image ? (
                          <img
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            src={item.image}
                          />
                        ) : (
                          <PackageX className="text-outline-variant" size={32} />
                        )}
                      </div>
                      <h3 className="font-headline text-xl text-on-surface mb-2">
                        {item.name}
                      </h3>
                      <p className="font-body text-sm text-on-surface-variant mb-4">
                        {item.category} · {item.status.replace("-", " ")}
                      </p>
                      <div className="flex justify-between items-center border-t border-surface-container-high pt-4">
                        <span className="font-headline text-lg text-primary">
                          {currency(Number(item.costPerUnit))} / {item.unit}
                        </span>
                        <span className="font-body text-xs text-outline">
                          SKU: {item.sku}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Recent Purchase Orders Timeline */}
            <section className="bg-surface-container-lowest rounded-xl p-8 ambient-shadow ghost-border">
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-headline text-2xl text-on-surface">
                  Recent Activity
                </h2>
                <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low">
                  <Filter size={20} />
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <p className="font-body text-sm text-outline text-center py-8">
                  No purchase orders with this supplier yet.
                </p>
              ) : (
                <div className="space-y-0">
                  {recentOrders.map((po, i) => {
                    const style = STATUS_STYLES[po.status];
                    const detail = po.items
                      .map((it) => `${it.inventoryItem?.name ?? "Item"} × ${it.quantity}`)
                      .join(", ");
                    return (
                      <div
                        key={po.id}
                        className={`relative pl-8 py-6 group hover:bg-surface-container-low transition-colors -mx-4 px-12 ${
                          i !== recentOrders.length - 1
                            ? "border-b border-surface-container-high"
                            : ""
                        }`}
                      >
                        <div
                          className={`absolute left-0 top-8 w-3 h-3 rounded-full ${style.dot} ring-4 ring-surface-container-lowest`}
                        />
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <span className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">
                                {po.poNumber}
                              </span>
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${style.badge}`}>
                                {po.status.charAt(0) + po.status.slice(1).toLowerCase()}
                              </span>
                            </div>
                            <p className="font-body text-sm text-on-surface-variant">
                              {detail || "No line items"}
                            </p>
                          </div>
                          <div className="text-left md:text-right">
                            <p className="font-body text-sm text-on-surface-variant">
                              {dateFmt(po.issuedDate)}
                            </p>
                            <p className="font-headline text-lg text-primary mt-1">
                              {currency(Number(po.totalAmount))}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}