import { use, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { getCurrentUser } from "../../api/authorization";
import { verifyPosPin } from "../../api/order";
import { auth } from "../../Firebase/firebase.init";

const POS_ROLES = ["Admin", "Manager", "Cashier"];

export default function PosLogin() {
  const navigate = useNavigate();
  const { loginUser, logoutUser } = use(AuthContext) as AuthContextType;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"login" | "pin">("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitLogin(event: React.FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      await loginUser(email, password);
      const response = await getCurrentUser();
      const allowed = POS_ROLES.includes(response.user.role) || response.user.accessGrants?.some((grant) => grant.module === "POS" && grant.status === "APPROVED");
      if (!allowed) { await logoutUser(); setError("Your account does not have POS access."); return; }
      if (response.user.emailVerificationNeeded && !auth.currentUser?.emailVerified) { await logoutUser(); setError("Verify your email before entering the POS."); return; }
      setStep("pin");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to sign in"); }
    finally { setBusy(false); }
  }

  async function submitPin(event: React.FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await verifyPosPin(pin);
      if (!response.valid) { setError("Incorrect POS PIN."); return; }
      sessionStorage.setItem("pos-access-granted", "true");
      navigate("/pos-koh");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to verify POS PIN"); }
    finally { setBusy(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#10251d] px-5 py-8 text-white"><div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(206,164,92,0.25),transparent_35%),radial-gradient(circle_at_90%_85%,rgba(54,122,91,0.35),transparent_40%)]" /><section className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#172c23]/95 p-7 shadow-2xl"><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d7b77a]">Front of house</p><h1 className="mt-2 font-headline text-4xl">Point of Sale</h1><p className="mt-2 text-sm text-white/65">Secure access for the restaurant floor.</p>{error && <p className="mt-5 rounded-lg bg-red-400/15 px-3 py-2 text-xs text-red-100">{error}</p>}{step === "login" ? <form onSubmit={submitLogin} className="mt-7 space-y-4"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Work email" className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/45 focus:border-[#d7b77a]" /><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/45 focus:border-[#d7b77a]" /><button disabled={busy} className="w-full rounded-lg bg-[#d7b77a] py-3 text-sm font-bold text-[#172c23] disabled:opacity-50">{busy ? "Checking access..." : "Continue to PIN"}</button></form> : <form onSubmit={submitPin} className="mt-7 space-y-4"><div><label htmlFor="pos-pin" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/65">POS security PIN</label><input id="pos-pin" required inputMode="numeric" pattern="[0-9]*" maxLength={8} autoFocus value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))} placeholder="Enter PIN" className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-center text-2xl tracking-[0.45em] outline-none placeholder:text-white/35 focus:border-[#d7b77a]" /></div><button disabled={busy} className="w-full rounded-lg bg-[#d7b77a] py-3 text-sm font-bold text-[#172c23] disabled:opacity-50">{busy ? "Verifying..." : "Enter POS"}</button></form>}<button type="button" onClick={() => navigate("/management-login")} className="mt-5 w-full text-center text-xs text-white/55 hover:text-white">Use another portal</button></section></main>;
}
