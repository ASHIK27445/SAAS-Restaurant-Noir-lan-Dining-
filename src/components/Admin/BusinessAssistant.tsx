import { type FormEvent, useState } from "react";
import { Bot, LoaderCircle, Send} from "lucide-react";
import { useLocation } from "react-router";
import { askAssistant, type AssistantResponse } from "../../api/assistant";

const suggestions = [
  "What was our revenue in the last 30 days?",
  "Which menu item sold the most?",
  "What is our average order value?",
  "Which order type is most popular?",
];

export default function BusinessAssistant() {
  const location = useLocation();
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (location.pathname === "/admin/orders") return null;

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    const value = question.trim();
    if (!value || loading) return;
    setLoading(true);
    setError("");
    try { setResult(await askAssistant(value)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to answer that question"); }
    finally { setLoading(false); }
  }

  return <section className="overflow-hidden rounded-xl border border-black bg-black text-white shadow-sm">
    <div className="grid min-w-0 gap-6 p-5 md:p-6">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70"><Bot size={14} /> Business assistant</div>
        <h2 className="mt-2 font-headline text-2xl">Ask about your business</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">Get quick answers from approved, read-only restaurant reports.</p>
        <div className="mt-5 flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => { setQuestion(suggestion); void askAssistant(suggestion).then(setResult).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to answer that question")); }} className="rounded-full border border-white/25 px-3 py-1.5 text-left text-[11px] text-white/80 transition hover:bg-white/10">{suggestion}</button>)}</div>
      </div>
      <div className="min-w-0 rounded-lg border border-white/15 bg-white/5 p-4">
        <form onSubmit={submit} className="flex gap-2">
          <label htmlFor="business-question" className="sr-only">Ask a business question</label>
          <input id="business-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question about sales..." className="min-w-0 flex-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/50 focus:border-white/70" />
          <button type="submit" disabled={!question.trim() || loading} aria-label="Ask question" className="rounded-lg bg-white px-3 text-black transition hover:bg-white/85 disabled:opacity-50">{loading ? <LoaderCircle size={17} className="animate-spin" /> : <Send size={17} />}</button>
        </form>
        {error && <p role="alert" className="mt-3 text-xs text-white">{error}</p>}
        {result ? <div className="mt-5 rounded-lg border border-white/15 bg-white/5 p-4"><div className="flex items-start gap-3"><Bot size={19} className="mt-0.5 shrink-0 text-white/70" /><div><p className="text-sm leading-relaxed text-white">{result.answer}</p><p className="mt-3 text-[10px] uppercase tracking-wider text-white/50">Based on {result.period.fromDate} to {result.period.toDate}</p></div></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{result.highlights.map((item) => <div key={item.label} className="rounded-md border border-white/15 bg-white/5 px-3 py-2"><p className="text-[10px] text-white/60">{item.label}</p><p className="mt-1 text-sm font-bold text-white">{item.value}</p></div>)}</div></div> : <p className="mt-5 text-xs text-white/55">Try one of the suggested questions to begin.</p>}
      </div>
    </div>
  </section>;
}