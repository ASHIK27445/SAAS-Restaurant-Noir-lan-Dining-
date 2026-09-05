import BusinessAssistant from "./BusinessAssistant";

export default function AdminBusinessAssistant() {
  return (
    <main className="min-h-full bg-white p-5 text-slate-900 md:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 border-b border-black/10 pb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/55">
            Admin tools
          </p>
          <h1 className="mt-1 font-headline text-3xl font-bold text-black">
            Business Assistant
          </h1>
          <p className="mt-1 text-sm text-black/60">
            Ask questions about approved restaurant reports.
          </p>
        </header>
        <BusinessAssistant />
      </div>
    </main>
  );
}
