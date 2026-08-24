import { useEffect, useState } from "react";
import { getKitchenQueue, markPrepStart, markPrepComplete } from "../../api/order";

export default function KitchenQueue() {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async() => {
    return getKitchenQueue().then((res) => setUnits(res.data)).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen p-6">
      <h1 className="font-headline text-2xl text-primary mb-4">Kitchen Queue</h1>
      <p className="text-xs text-on-surface-variant mb-6">Minimal prep-tracking view — full KDS comes later.</p>
      {loading ? (
        <p className="text-sm text-on-surface-variant">Loading…</p>
      ) : units.length === 0 ? (
        <p className="text-sm text-on-surface-variant">Nothing pending.</p>
      ) : (
        <div className="space-y-2">
          {units.map((u) => (
            <div key={u.id} className="flex items-center justify-between bg-surface-container-lowest rounded-xl p-3">
              <div>
                <p className="text-sm font-medium">{u.orderItem.menuItem.name} <span className="text-xs text-on-surface-variant">(unit {u.unitIndex})</span></p>
                <p className="text-[10px] text-on-surface-variant">Order {u.orderItem.order.orderNumber} • {new Date(u.orderItem.order.createdAt).toLocaleTimeString()}</p>
              </div>
              {!u.prepStartedAt ? (
                <button onClick={() => markPrepStart(u.id).then(load)} className="text-xs font-semibold text-primary hover:underline">Start Prep</button>
              ) : (
                <button onClick={() => markPrepComplete(u.id).then(load)} className="text-xs font-semibold text-tertiary hover:underline">Mark Done</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}