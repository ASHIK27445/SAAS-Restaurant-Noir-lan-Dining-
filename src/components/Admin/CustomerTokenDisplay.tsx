import { useQuery } from "@tanstack/react-query";
import { getCustomerTokens } from "../../api/order";

const statusLabel: Record<string, string> = {
  PREPARING: "Preparing",
  SERVED: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  RECEIVED: "Ready",
};

export default function CustomerTokenDisplay() {
  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ["customer-token-display"],
    queryFn: async () => (await getCustomerTokens()).data,
    staleTime: 2 * 1000,
    refetchInterval: 5 * 1000,
    refetchOnWindowFocus: true,
  });

  const ready = tokens.filter(
    (token) => token.status === "SERVED" || token.status === "RECEIVED"
  );

  const preparing = tokens.filter(
    (token) => token.status === "PREPARING"
  );

  const formatToken = (orderNumber: number) =>
    `#${String(orderNumber).padStart(5, "0")}`;

  return (
    <main className="min-h-screen bg-surface px-6 py-8 text-on-surface md:px-12">
      <header className="mx-auto mb-10 max-w-6xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
          Restaurant pickup
        </p>

        <h1 className="mt-2 font-headline text-4xl text-primary md:text-6xl">
          Order Status
        </h1>
      </header>

      {isLoading ? (
        <p className="text-center text-sm text-secondary">
          Loading orders...
        </p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {/* Ready Orders */}
          <section className="rounded-2xl bg-primary p-6 text-on-primary md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase tracking-wider">
                Ready now
              </h2>

              <span className="rounded-full bg-on-primary/15 px-3 py-1 text-sm">
                {ready.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {ready.length ? (
                ready.map((token) => (
                  <div
                    key={token.orderNumber}
                    className="rounded-xl bg-on-primary px-3 py-5 text-center text-primary"
                  >
                    <p className="text-3xl font-black md:text-4xl">
                      {formatToken(token.orderNumber)}
                    </p>

                    {token.customerName && (
                      <p className="mt-2 truncate text-sm font-bold">
                        {token.customerName}
                      </p>
                    )}

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider">
                      {statusLabel[token.status]}
                    </p>
                  </div>
                ))
              ) : (
                <p className="col-span-full py-12 text-center text-sm opacity-70">
                  No orders ready
                </p>
              )}
            </div>
          </section>

          {/* Preparing Orders */}
          <section className="rounded-2xl bg-surface-container-low p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase tracking-wider">
                Preparing
              </h2>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                {preparing.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {preparing.length ? (
                preparing.map((token) => (
                  <div
                    key={token.orderNumber}
                    className="rounded-xl bg-surface-container-lowest px-3 py-5 text-center"
                  >
                    <p className="text-3xl font-black text-primary md:text-4xl">
                      {formatToken(token.orderNumber)}
                    </p>

                    {token.customerName && (
                      <p className="mt-2 truncate text-sm font-bold text-on-surface">
                        {token.customerName}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="col-span-full py-12 text-center text-sm text-secondary">
                  No active orders
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}