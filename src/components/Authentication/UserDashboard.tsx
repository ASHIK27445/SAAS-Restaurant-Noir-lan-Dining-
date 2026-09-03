import { useEffect, useState } from "react";
import { use } from "react";
import { LogOut, Mail, Phone, UserRound } from "lucide-react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { getCurrentUser, type UserSummary } from "../../api/authorization";

export default function UserDashboard() {
  const { user, logoutUser } = use(AuthContext) as AuthContextType;
  const [profile, setProfile] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then((result) => setProfile(result.user))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Could not load your information"))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await logoutUser();
  }

  const displayName = profile?.name || user?.displayName || "Guest";
  const email = profile?.email || user?.email || "Not available";

  return <main className="min-h-screen bg-[#F5F0E6] px-6 pb-24 pt-36 text-[#1a1715] sm:px-10 md:px-16"><div className="mx-auto max-w-5xl"><header className="flex flex-col justify-between gap-6 border-b border-[#1a1715]/20 pb-8 sm:flex-row sm:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b33b1e]">Your account</p><h1 className="mt-4 font-['Cormorant_Garamond',serif] text-6xl italic leading-[0.9] sm:text-8xl">Welcome,<br />{displayName}.</h1></div><button type="button" onClick={() => void handleLogout()} className="inline-flex items-center gap-2 self-start border border-[#1a1715]/30 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] transition hover:bg-[#1a1715] hover:text-[#F5F0E6] sm:self-auto"><LogOut size={14} /> Sign out</button></header>{loading && <p className="py-12 text-sm text-[#4b463f]">Loading your information...</p>}{error && <p className="py-12 text-sm text-[#b33b1e]">{error}</p>}{!loading && !error && <section className="mt-12 max-w-2xl border border-[#1a1715]/15 bg-white/45 p-6 sm:p-10"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b33b1e]">Personal information</p><div className="mt-8 space-y-6"><div className="flex items-center gap-4 border-b border-[#1a1715]/10 pb-5"><UserRound size={19} className="text-[#b33b1e]" /><div><p className="text-[10px] uppercase tracking-[0.16em] text-[#4b463f]/60">Name</p><p className="mt-1 font-serif text-xl">{displayName}</p></div></div><div className="flex items-center gap-4 border-b border-[#1a1715]/10 pb-5"><Mail size={19} className="text-[#b33b1e]" /><div><p className="text-[10px] uppercase tracking-[0.16em] text-[#4b463f]/60">Email</p><p className="mt-1 text-sm">{email}</p></div></div><div className="flex items-center gap-4"><Phone size={19} className="text-[#b33b1e]" /><div><p className="text-[10px] uppercase tracking-[0.16em] text-[#4b463f]/60">Phone</p><p className="mt-1 text-sm">{profile?.phone || user?.phoneNumber || "Not added"}</p></div></div></div></section>}</div></main>;
}
