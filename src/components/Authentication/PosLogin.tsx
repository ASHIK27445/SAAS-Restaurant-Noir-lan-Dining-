import { use, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { getCurrentUser } from "../../api/authorization";
import { verifyPosPin } from "../../api/order";
import { auth } from "../../Firebase/firebase.init";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  async function submitLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await loginUser(email, password);
      const response = await getCurrentUser();
      const allowed =
        POS_ROLES.includes(response.user.role) ||
        response.user.accessGrants?.some(
          (grant) => grant.module === "POS" && grant.status === "APPROVED",
        );
      if (!allowed) {
        await logoutUser();
        setError("Your account does not have POS access.");
        return;
      }
      if (
        response.user.emailVerificationNeeded &&
        !auth.currentUser?.emailVerified
      ) {
        await logoutUser();
        setError("Verify your email before entering the POS.");
        return;
      }
      setStep("pin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  async function submitPin(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await verifyPosPin(pin);
      if (!response.valid) {
        setError("Incorrect POS PIN.");
        return;
      }
      sessionStorage.setItem("pos-access-granted", "true");
      navigate("/pos-koh");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to verify POS PIN",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white px-4 py-6 text-[#171412]">
      <section className="flex w-full max-w-105 flex-col items-center rounded-[28px] border border-[#E5E1D8] bg-white px-5 py-7 sm:px-8 md:px-10">
        <svg
          width="56"
          height="56"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-6"
        >
          <ellipse cx="50" cy="28" rx="16" ry="22" fill="#171412" />
          <ellipse cx="50" cy="72" rx="16" ry="22" fill="#171412" />
          <ellipse cx="28" cy="50" rx="22" ry="16" fill="#171412" />
          <ellipse cx="72" cy="50" rx="22" ry="16" fill="#171412" />
          <ellipse
            cx="34"
            cy="34"
            rx="16"
            ry="20"
            transform="rotate(-45 34 34)"
            fill="#171412"
          />
          <circle cx="50" cy="50" r="10" fill="#171412" />
        </svg>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b665f]">
          Front of house
        </p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight text-[#171412]">
          POS access
        </h1>
        <p className="mt-2 text-[14px] text-[#6b665f]">
          Sign in to manage the restaurant floor.
        </p>

        {error && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
            {error}
          </p>
        )}

        {step === "login" ? (
          <form onSubmit={submitLogin} className="mt-7 w-full">
            <div className="relative mb-1 w-full">
              <label
                htmlFor="pos-email"
                className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[12px] font-medium text-[#171412]"
              >
                Email address
              </label>
              <input
                id="pos-email"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-[#171412] px-4 py-3.5 text-[14px] outline-none focus:ring-1 focus:ring-[#171412]"
              />
            </div>
            <div className="mb-5" />
            <div className="relative mb-1 w-full">
              <label
                htmlFor="pos-password"
                className="absolute z-10 -top-2.5 left-3.5 bg-white px-1.5 text-[12px] font-medium text-[#171412]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="pos-password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-[#171412] px-4 py-3.5 pr-14 text-[14px] text-[#171412] outline-none focus:ring-1 focus:ring-[#171412]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/3 z-10 bg-transparent px-1 text-[#6b665f] hover:text-[#171412]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              disabled={busy}
              type="submit"
              className="mt-7 w-full rounded-xl bg-[#171412] py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2521] disabled:opacity-60"
            >
              {busy ? "Checking access..." : "Continue to PIN"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitPin} className="mt-7 w-full">
            <div className="relative mb-1 w-full">
              <label
                htmlFor="pos-pin"
                className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[12px] font-medium text-[#171412]"
              >
                POS security PIN
              </label>
              <input
                id="pos-pin"
                required
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pin}
                onChange={(event) =>
                  setPin(event.target.value.replace(/\D/g, ""))
                }
                className="w-full rounded-xl border border-[#171412] px-4 py-3.5 text-[14px] tracking-[0.35em] outline-none focus:ring-1 focus:ring-[#171412]"
              />
            </div>
            <button
              disabled={busy}
              type="submit"
              className="mt-7 w-full rounded-xl bg-[#171412] py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2521] disabled:opacity-60"
            >
              {busy ? "Verifying PIN..." : "Unlock POS"}
            </button>
            <button
              type="button"
              onClick={() => setStep("login")}
              className="mt-5 w-full text-center text-[12px] font-semibold underline underline-offset-4"
            >
              Use another email
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
