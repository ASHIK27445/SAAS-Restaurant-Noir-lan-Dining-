import { use, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendEmailVerification } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { LoginSchema, type LoginFormData } from "./ZodLoginSchema";
import { bootstrapAdmin, getCurrentUser } from "../../api/authorization";
import { verifyPosPin } from "../../api/order";
import { auth } from "../../Firebase/firebase.init";
import { Eye, EyeOff } from "lucide-react";

const MANAGEMENT_ROLES = [
  "Admin",
  "DemoAdmin",
  "Manager",
  "Chef",
  "SousChef",
  "Waiter",
  "Cashier",
];
const POS_ROLES = ["Admin", "Manager", "Cashier"];
const SUPPLIER_ROLES = ["Admin", "Manager", "Accountant", "Supplier"];

function destinationForRole(role: string) {
  if (["Cashier", "Chef", "SousChef", "Waiter"].includes(role))
    return "/pos-login";
  return "/admin";
}

type Portal = "management" | "pos" | "supplier";

const PORTALS: { id: Portal; label: string }[] = [
  { id: "management", label: "Management" },
  { id: "pos", label: "POS" },
  { id: "supplier", label: "Supplier" },
];

export default function ManagementLogin() {
  const navigate = useNavigate();
  const { loginUser, logoutUser } = use(AuthContext) as AuthContextType;
  const [portal, setPortal] = useState<Portal>("management");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- Management form (react-hook-form + zod, unchanged logic) ---
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(LoginSchema) });

  async function onManagementSubmit(data: LoginFormData) {
    setError("");
    try {
      const result = await loginUser(data.email, data.password);
      await result.user.reload();
      let response;
      try {
        response = await getCurrentUser();
      } catch {
        await bootstrapAdmin(await result.user.getIdToken(), {
          name: result.user.displayName,
          phone: result.user.phoneNumber,
        });
        response = await getCurrentUser();
      }

      if (response.user.emailVerificationNeeded && !result.user.emailVerified) {
        try {
          await sendEmailVerification(result.user, {
            url: `${window.location.origin}/email-verification-success`,
            handleCodeInApp: true,
          });
          await logoutUser();
          setError(
            "A verification link has been sent to your management email. Verify it, then sign in again.",
          );
        } catch (verificationError) {
          await logoutUser();
          const code =
            verificationError &&
            typeof verificationError === "object" &&
            "code" in verificationError
              ? String(verificationError.code)
              : "unknown";
          setError(
            `Verification email could not be sent (${code}). Check that Email/Password is enabled in Firebase Authentication.`,
          );
        }
        return;
      }
      if (!MANAGEMENT_ROLES.includes(response.user.role)) {
        await logoutUser();
        setError("This account is for customer access only.");
        return;
      }
      navigate(destinationForRole(response.user.role));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in");
    }
  }

  // --- POS form (email/password -> PIN step) ---
  const [posEmail, setPosEmail] = useState("");
  const [posPassword, setPosPassword] = useState("");
  const [posPin, setPosPin] = useState("");
  const [posStep, setPosStep] = useState<"login" | "pin">("login");
  const [posBusy, setPosBusy] = useState(false);

  async function submitPosLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPosBusy(true);
    try {
      await loginUser(posEmail, posPassword);
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
      setPosStep("pin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in");
    } finally {
      setPosBusy(false);
    }
  }

  async function submitPosPin(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPosBusy(true);
    try {
      const response = await verifyPosPin(posPin);
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
      setPosBusy(false);
    }
  }

  // --- Supplier form ---
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierPassword, setSupplierPassword] = useState("");
  const [supplierBusy, setSupplierBusy] = useState(false);

  async function submitSupplier(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSupplierBusy(true);
    try {
      await loginUser(supplierEmail, supplierPassword);
      const response = await getCurrentUser();
      const allowed =
        SUPPLIER_ROLES.includes(response.user.role) ||
        response.user.accessGrants?.some(
          (grant) => grant.module === "SUPPLIERS" && grant.status === "APPROVED",
        );
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
      setSupplierBusy(false);
    }
  }

  function switchPortal(next: Portal) {
    setPortal(next);
    setError("");
    setShowPassword(false);
    setPosStep("login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center overflow-hidden bg-[#061a2a] px-5 py-8 text-white sm:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(0,148,218,0.5),transparent_42%),radial-gradient(circle_at_10%_90%,rgba(0,203,255,0.28),transparent_38%)]" />
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-12 md:flex-row md:justify-center md:gap-16">
        <section className="w-full max-w-sm rounded-xl bg-[#171717] p-6 shadow-2xl sm:p-7">
          <div className="mb-5">
            <h1 className="text-2xl font-bold">Sign in</h1>
            <p className="mt-1 text-[10px] text-white/65">
              Staff access for your restaurant
            </p>
          </div>

          {/* Portal switcher */}
          <div className="mb-5 grid grid-cols-3 gap-1 rounded-lg border border-white/20 p-1">
            {PORTALS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => switchPortal(id)}
                className={`rounded-md py-1.5 text-[11px] font-semibold transition-colors ${
                  portal === id
                    ? "bg-white text-[#171717]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-200"
            >
              {error}
            </p>
          )}

          {portal === "management" && (
            <form onSubmit={handleSubmit(onManagementSubmit)} className="space-y-3">
              <div>
                <input
                  id="management-email"
                  {...register("email")}
                  type="email"
                  autoComplete="username"
                  placeholder="Email address"
                  className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/55 focus:border-white/50"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <input
                    id="management-password"
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Password"
                    className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2.5 pr-10 text-xs text-white outline-none placeholder:text-white/55 focus:border-white/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>
                )}
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full rounded-lg bg-white py-2.5 text-xs font-semibold text-[#171717] hover:bg-white/90"
              >
                {isSubmitting ? "Signing in..." : "Continue"}
              </button>
            </form>
          )}

          {portal === "pos" && posStep === "login" && (
            <form onSubmit={submitPosLogin} className="space-y-3">
              <input
                required
                type="email"
                value={posEmail}
                onChange={(event) => setPosEmail(event.target.value)}
                placeholder="Email address"
                className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/55 focus:border-white/50"
              />
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={posPassword}
                  onChange={(event) => setPosPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2.5 pr-10 text-xs text-white outline-none placeholder:text-white/55 focus:border-white/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                disabled={posBusy}
                type="submit"
                className="w-full rounded-lg bg-white py-2.5 text-xs font-semibold text-[#171717] hover:bg-white/90"
              >
                {posBusy ? "Checking access..." : "Continue to PIN"}
              </button>
            </form>
          )}

          {portal === "pos" && posStep === "pin" && (
            <form onSubmit={submitPosPin} className="space-y-3">
              <input
                required
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={posPin}
                onChange={(event) => setPosPin(event.target.value.replace(/\D/g, ""))}
                placeholder="POS security PIN"
                className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2.5 text-xs tracking-[0.35em] text-white outline-none placeholder:text-white/55 placeholder:tracking-normal focus:border-white/50"
              />
              <button
                disabled={posBusy}
                type="submit"
                className="w-full rounded-lg bg-white py-2.5 text-xs font-semibold text-[#171717] hover:bg-white/90"
              >
                {posBusy ? "Verifying PIN..." : "Unlock POS"}
              </button>
              <button
                type="button"
                onClick={() => setPosStep("login")}
                className="w-full text-center text-[10px] font-semibold text-white/60 underline underline-offset-4 hover:text-white"
              >
                Use another email
              </button>
            </form>
          )}

          {portal === "supplier" && (
            <form onSubmit={submitSupplier} className="space-y-3">
              <input
                required
                type="email"
                value={supplierEmail}
                onChange={(event) => setSupplierEmail(event.target.value)}
                placeholder="Business email"
                className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/55 focus:border-white/50"
              />
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={supplierPassword}
                  onChange={(event) => setSupplierPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2.5 pr-10 text-xs text-white outline-none placeholder:text-white/55 focus:border-white/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                disabled={supplierBusy}
                type="submit"
                className="w-full rounded-lg bg-white py-2.5 text-xs font-semibold text-[#171717] hover:bg-white/90"
              >
                {supplierBusy ? "Signing in..." : "Enter supplier workspace"}
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-[10px] text-white/60">
            Need access? Contact your administrator.
          </p>
        </section>
        <div className="max-w-xs text-center md:text-left">
          <p className="text-3xl font-bold tracking-tight">Restaurant Admin</p>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Manage your team, orders, and hospitality operations from one place.
          </p>
        </div>
      </div>
    </main>
  );
}