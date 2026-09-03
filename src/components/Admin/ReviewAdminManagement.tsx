import { useEffect, useState } from "react";
import { Check, Eye, EyeOff, Star, X } from "lucide-react";
import { getAdminReviews, updateReview, updateReviewSettings } from "../../api/reviewAdmin";
import type { Review } from "../../api/reviews";

function RatingSummary({ review }: { review: Review }) {
  return <span className="text-xs text-secondary">Food {review.foodRating} · Service {review.serviceRating} · Ambience {review.ambienceRating}</span>;
}

export default function ReviewAdminManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [limit, setLimit] = useState(3);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { const result = await getAdminReviews(); setReviews(result.data); setLimit(result.settings.homeReviewLimit); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not load reviews"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  async function saveReview(id: string, input: Parameters<typeof updateReview>[1]) {
    try { await updateReview(id, input); setMessage("Review updated."); await load(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not update review"); }
  }
  async function saveLimit() {
    try { await updateReviewSettings(limit); setMessage("Homepage display limit saved."); await load(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not save setting"); }
  }

  return <div className="min-h-screen bg-surface p-6 text-on-surface md:p-10">
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col justify-between gap-5 border-b border-outline-variant/20 pb-6 md:flex-row md:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary">Guest experience</p><h1 className="mt-2 font-headline text-3xl text-primary">Review management</h1><p className="mt-2 text-sm text-secondary">Moderate guest reflections and choose what appears on the Noir Dining homepage.</p></div><div className="flex items-end gap-3"><label className="text-xs text-secondary">Homepage reviews<input type="number" min="0" max="20" value={limit} onChange={(event) => setLimit(Number(event.target.value))} className="mt-1 block w-24 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-sm text-primary outline-none" /></label><button onClick={() => void saveLimit()} className="rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">Save limit</button></div></header>
      {message && <p className="mt-5 text-sm text-tertiary">{message}</p>}
      {loading ? <p className="py-12 text-sm text-secondary">Loading reviews...</p> : <div className="mt-8 space-y-4">{reviews.length === 0 && <p className="py-12 text-sm text-secondary">No reviews have been submitted yet.</p>}{reviews.map((review) => <article key={review.id} className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start"><div className="max-w-3xl"><div className="flex flex-wrap items-center gap-3"><h2 className="font-headline text-xl text-primary">{review.isAnonymous ? "Anonymous Guest" : review.displayName}</h2><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${review.status === "APPROVED" ? "bg-primary/10 text-primary" : review.status === "REJECTED" ? "bg-error-container text-error" : "bg-secondary-container text-secondary"}`}>{review.status}</span></div><div className="mt-2 flex items-center gap-3"><RatingSummary review={review} /><span className="text-xs text-secondary">{new Date(review.createdAt).toLocaleDateString()}</span></div><p className="mt-4 text-sm leading-6 text-on-surface-variant">{review.content}</p></div><div className="flex flex-wrap items-center gap-2"><button title="Approve" onClick={() => void saveReview(review.id, { status: "APPROVED" })} className="rounded-lg bg-primary p-2 text-white"><Check size={16} /></button><button title="Reject" onClick={() => void saveReview(review.id, { status: "REJECTED" })} className="rounded-lg bg-error p-2 text-white"><X size={16} /></button><button title={review.showOnHome ? "Hide from homepage" : "Show on homepage"} disabled={review.status !== "APPROVED"} onClick={() => void saveReview(review.id, { showOnHome: !review.showOnHome })} className="rounded-lg border border-outline-variant/30 p-2 text-primary disabled:opacity-30">{review.showOnHome ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div><div className="mt-4 flex items-center gap-3 border-t border-outline-variant/10 pt-4"><Star size={15} className={review.showOnHome ? "fill-tertiary text-tertiary" : "text-secondary/30"} /><span className="text-xs text-secondary">Homepage order</span><input type="number" min="0" value={review.homeOrder ?? 0} onChange={(event) => { const homeOrder = Number(event.target.value); setReviews((current) => current.map((item) => item.id === review.id ? { ...item, homeOrder } : item)); }} onBlur={() => void saveReview(review.id, { homeOrder: review.homeOrder ?? 0 })} className="w-16 rounded border border-outline-variant/30 bg-surface px-2 py-1 text-xs" /><span className="text-xs text-secondary">{review.showOnHome ? "Visible on homepage" : "Not shown on homepage"}</span></div></article>)}</div>}
    </div>
  </div>;
}
