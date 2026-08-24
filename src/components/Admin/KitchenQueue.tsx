import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getKitchenQueue, markPrepStart, markPrepComplete } from "../../api/order";

export default function KitchenQueue() {
  const queryClient = useQueryClient();
  const { data: units = [], isLoading: loading } = useQuery({
    queryKey: ["kitchen-queue"],
    queryFn: async () => (await getKitchenQueue()).data,
    staleTime: 2 * 1000,
    refetchInterval: 5 * 1000,
    refetchOnWindowFocus: true,
  });
  const prepMutation = useMutation({
    mutationFn: ({ unitId, complete }: { unitId: string; complete: boolean }) =>
      complete ? markPrepComplete(unitId) : markPrepStart(unitId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kitchen-queue"] }),
  });

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
                <button disabled={prepMutation.isPending} onClick={() => prepMutation.mutate({ unitId: u.id, complete: false })} className="text-xs font-semibold text-primary hover:underline disabled:opacity-50">Start Preparing</button>
              ) : (
                <button disabled={prepMutation.isPending} onClick={() => prepMutation.mutate({ unitId: u.id, complete: true })} className="text-xs font-semibold text-tertiary hover:underline disabled:opacity-50">Mark Done</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}