import { use, useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser } from "../../api/authorization";
import { auth } from "../../Firebase/firebase.init";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";

const SUPPLIER_ROLES = ["Admin", "Manager", "Accountant", "Supplier"];

export default function SupplierLogin() {
  const navigate = useNavigate();
  const { loginUser, logoutUser } = use(AuthContext) as AuthContextType;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await loginUser(email, password);
      const response = await getCurrentUser();
      const allowed = SUPPLIER_ROLES.includes(response.user.role)
        || response.user.accessGrants?.some((grant) => grant.module === "SUPPLIERS" && grant.status === "APPROVED");
      if (!allowed) {
        await logoutUser();
        setError("Your account does not have supplier access.");
        return;
      }
      if (response.user.emailVerificationNeeded && !auth.currentUser?.emailVerified) {
        await logoutUser();
        setError("Verify your email before entering the supplier workspace.");
        return;
      }
      sessionStorage.setItem("supplier-access-granted", "true");
      navigate("/supplier");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0ece3] px-5 py-8 text-[#25231f]">
      <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-[#fffdf8] shadow-2xl md:flex-row">
        <div className="min-h-56 flex-1 bg-[#475c52] p-8 text-white md:min-h-140 md:p-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e2c891]">Culinary supply network</p>
          <h1 className="mt-5 max-w-sm font-headline text-5xl leading-tight">Good ingredients, carefully managed.</h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">A focused workspace for purchasing, catalog, and supplier performance.</p>
        </div>
        <section className="flex flex-1 items-center p-7 sm:p-12">
          <div className="w-full max-w-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#475c52]">Supplier workspace</p>
            <h2 className="mt-2 font-headline text-3xl">Welcome back</h2>
            <p className="mt-2 text-sm text-[#716d64]">Sign in with your approved business account.</p>
            {error && <p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
            <form onSubmit={submit} className="mt-7 space-y-4">
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Business email" className="w-full rounded-lg border border-[#d6d0c4] bg-white px-4 py-3 text-sm outline-none focus:border-[#475c52]" />
              <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="w-full rounded-lg border border-[#d6d0c4] bg-white px-4 py-3 text-sm outline-none focus:border-[#475c52]" />
              <button disabled={busy} className="w-full rounded-lg bg-[#475c52] py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? "Signing in..." : "Enter supplier workspace"}</button>
            </form>
            <button type="button" onClick={() => navigate("/management-login")} className="mt-5 text-xs font-semibold text-[#475c52] hover:underline">Use another portal</button>
          </div>
        </section>
      </div>
    </main>
  );
}
