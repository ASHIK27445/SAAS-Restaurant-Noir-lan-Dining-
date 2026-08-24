import { useMemo } from "react";
import { Clock3 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getKitchenQueue, markPrepStart, markPrepComplete } from "../../api/order";

type QueueUnit = { id: string; unitIndex: number; prepStartedAt: string | null; orderItem: { menuItem: { name: string }; order: { orderNumber: number; createdAt: string } } };
type Ticket = { orderNumber: number; createdAt: string; units: QueueUnit[] };

function elapsedSince(createdAt: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function KitchenQueue() {
  const queryClient = useQueryClient();
  const { data: units = [], isLoading } = useQuery({ queryKey: ["kitchen-queue"], queryFn: async () => (await getKitchenQueue()).data as QueueUnit[], staleTime: 2_000, refetchInterval: 5_000, refetchOnWindowFocus: true });
  const prepMutation = useMutation({ mutationFn: ({ unitId, complete }: { unitId: string; complete: boolean }) => complete ? markPrepComplete(unitId) : markPrepStart(unitId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kitchen-queue"] }) });
  const tickets = useMemo<Ticket[]>(() => {
    const grouped = new Map<number, Ticket>();
    for (const unit of units) { const orderNumber = unit.orderItem.order.orderNumber; const ticket = grouped.get(orderNumber) ?? { orderNumber, createdAt: unit.orderItem.order.createdAt, units: [] }; ticket.units.push(unit); grouped.set(orderNumber, ticket); }
    return [...grouped.values()].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [units]);

  return <main className="min-h-screen bg-surface px-5 py-6 text-on-surface sm:px-8 sm:py-8"><header className="mx-auto mb-6 flex max-w-7xl items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">Kitchen display</p><h1 className="mt-1 font-headline text-3xl font-bold text-primary">KDS</h1></div><div className="flex items-center gap-2 text-xs text-on-surface-variant"><Clock3 size={14} />{tickets.length} active orders</div></header>{isLoading ? <p className="mx-auto max-w-7xl rounded-xl bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant">Loading kitchen tickets...</p> : tickets.length === 0 ? <p className="mx-auto max-w-7xl rounded-xl border border-dashed border-outline-variant p-12 text-center text-sm text-on-surface-variant">No active tickets.</p> : <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{tickets.map((ticket) => { const allStarted = ticket.units.every((unit) => unit.prepStartedAt); return <article key={ticket.orderNumber} className={`flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-lg ${allStarted ? "border-l-4 border-primary" : "border-l-4 border-outline-variant"}`}><div className="flex items-start justify-between bg-surface-container-high p-4"><div><span className={`text-[10px] font-black uppercase tracking-widest ${allStarted ? "text-primary" : "text-on-surface-variant"}`}>{allStarted ? "Active" : "Pending"}</span><h2 className="mt-1 text-xl font-black leading-none">#{String(ticket.orderNumber).padStart(5, "0")}</h2><p className="mt-2 text-xs text-on-surface-variant">Kitchen ticket</p></div><div className="text-right"><span className={`font-mono text-2xl font-black ${allStarted ? "text-primary" : "text-on-surface-variant"}`}>{elapsedSince(ticket.createdAt)}</span><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Elapsed</p></div></div><div className="flex-1 space-y-3 p-4">{ticket.units.map((unit) => <div key={unit.id} className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded text-lg font-black ${unit.prepStartedAt ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"}`}>{unit.unitIndex}</span><p className="truncate text-base font-bold">{unit.orderItem.menuItem.name}</p></div><button disabled={prepMutation.isPending} onClick={() => prepMutation.mutate({ unitId: unit.id, complete: Boolean(unit.prepStartedAt) })} className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider transition disabled:opacity-40 ${unit.prepStartedAt ? "bg-primary-container text-on-primary-container" : "border border-primary text-primary hover:bg-primary hover:text-on-primary"}`}>{unit.prepStartedAt ? "Done" : "Start"}</button></div>)}</div><div className="bg-surface-container-low px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">{ticket.units.length} item{ticket.units.length === 1 ? "" : "s"} on ticket</div></article>; })}</section>}</main>;
}
