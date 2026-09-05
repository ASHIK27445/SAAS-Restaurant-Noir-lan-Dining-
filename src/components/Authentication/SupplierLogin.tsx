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
    <main className="flex min-h-screen items-center justify-center bg-white px-5 py-8 text-slate-900">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">Supplier workspace</p>
        <h1 className="mt-2 font-headline text-4xl text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in with your approved business account.</p>

        {error && <p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

        <form onSubmit={submit} className="mt-7 space-y-4">
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Business email" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-red-400" />
          <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-red-400" />
          <button disabled={busy} className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-500 disabled:opacity-60">{busy ? "Signing in..." : "Enter supplier workspace"}</button>
        </form>

        <button type="button" onClick={() => navigate("/management-login")} className="mt-5 text-xs font-semibold text-slate-500 hover:text-red-700">Use another portal</button>
      </div>
    </main>
  );
}
