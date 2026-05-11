import { useState, useEffect, use } from "react";
import { useLocation, useNavigate } from "react-router";
import { Mail, Lock, ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { LoginSchema, type LoginFormData } from "./ZodLoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { sendEmailVerification } from "firebase/auth";

const COOLDOWN_KEY = "resend_verification_cooldown";
const COOLDOWN_DURATION = 300; // 5 minutes

function getRemainingCooldown(now: number): number {
  try {
    const stored = localStorage.getItem(COOLDOWN_KEY);
    if (!stored) return 0;
    const { startedAt, duration } = JSON.parse(stored);
    const elapsed = Math.floor((now - startedAt) / 1000);
    return Math.max(duration - elapsed, 0);
  } catch {
    return 0;
  }
}

function startCooldown() {
  localStorage.setItem(
    COOLDOWN_KEY,
    JSON.stringify({ startedAt: Date.now(), duration: COOLDOWN_DURATION })
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ResendVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, user } = use(AuthContext) as AuthContextType;

  const email = location.state as string | undefined;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: email ?? "",
      password: "",
    },
  });

  const [now, setNow] = useState(Date.now());
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Derived — always correct, no manual sync needed
  const cooldown = getRemainingCooldown(now);
  const progressPercent = ((COOLDOWN_DURATION - cooldown) / COOLDOWN_DURATION) * 100;

  const handleResend = async (data: LoginFormData) => {
    if (cooldown > 0) return;

    if (user?.emailVerified) {
      alert("Already verified!");
      navigate("/");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await loginUser(data.email, data.password);
      await sendEmailVerification(res.user);
      startCooldown();
      setNow(Date.now()); // trigger immediate re-derive
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a] font-sans antialiased">
      <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8 relative overflow-hidden">

        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-surface-container-low opacity-50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-secondary-container opacity-30 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-sm text-secondary hover:text-[#062014] transition-colors duration-200 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back
          </button>

          <header className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-secondary mb-3">
              Account Recovery
            </p>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#062014] leading-tight mb-4">
              Resend Verification
            </h1>
            <div className="h-1 w-16 bg-primary" />
          </header>

          <div className="mb-6 p-4 rounded-xl border border-outline-variant/20 bg-surface-container-low flex items-center gap-3">
            <Mail size={16} color="#173124" className="shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-secondary uppercase tracking-widest mb-0.5">Sending to</p>
              <p className="text-sm font-medium text-[#062014] truncate">
                {email ?? "your registered email"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleResend)}>
            {/* Hidden email field so zod can validate it */}
            <input type="hidden" {...register("email")} />

            <div className="mb-5">
              <label className="block text-xs uppercase tracking-widest text-secondary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={15} color="#173124" className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-outline-variant/30 bg-white text-[#1b1c1a] text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-secondary hover:text-[#062014] transition-colors duration-200 select-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {(errors.password || (status === "error" && errorMsg)) && (
                <p className="mt-2 text-xs text-red-500 leading-snug">
                  {errors.password?.message ?? errorMsg}
                </p>
              )}
            </div>

            {status === "success" && (
              <div className="mb-5 p-4 rounded-xl bg-[#062014]/5 border border-primary/10 flex items-start gap-3">
                <ShieldCheck size={16} color="#173124" className="mt-0.5 shrink-0" />
                <p className="text-sm text-primary leading-snug">
                  Verification link sent! Check your inbox (and spam folder).
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={cooldown > 0 || isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-primary text-white font-medium rounded-xl transition-all duration-300 hover:opacity-90 active:scale-[0.98] shadow-[0_12px_32px_rgba(27,28,26,0.08)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <RefreshCw size={15} className={isSubmitting ? "animate-spin" : ""} />
              {isSubmitting
                ? "Sending…"
                : cooldown > 0
                ? `Resend in ${formatTime(cooldown)}`
                : "Resend Verification Link"}
            </button>
          </form>

          {cooldown > 0 && (
            <div className="mt-3">
              <div className="h-1 w-full rounded-full bg-outline-variant/20 overflow-hidden">
                <div
                  className="h-full bg-primary/40 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-center text-on-surface-variant/50">
                You can request another link in {formatTime(cooldown)}
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <span className="text-xs text-on-surface-variant/60 uppercase tracking-widest">
              Already verified?{" "}
            </span>
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-primary underline decoration-primary/20 underline-offset-4 hover:text-[#062014] transition-colors duration-200"
            >
              Login Here
            </button>
          </div>
        </div>

        <footer className="mt-16 text-center">
          <p className="font-serif italic text-xl text-primary-container opacity-40">
            The Culinary Editorial
          </p>
        </footer>
      </main>

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAyc9cyRY_aawJW2vGI18agpp_PVRUAwf43sLZH8u1tbclRJrUWXdHWNoptvE_n_DHpTuWYaKrBT4qU3d_YPzMwIUHrgux636IwzvTe7IZzjRZTHa5KvE2dy70jgxq0NFs_zXmKouJxEu3oeNUj1HhLWP7YZs0W7yuDhAqc5nZZGtHIP9rlvCfqLGkadhkRBsevFQUtqq0okzRG1ZGZ1Q-EkE6_SlGZ8vR6lvNWQzoS5hV1Fjcidki6VDuN0TD8diVYc1Y5xrs26ag')",
        }}
      />
    </div>
  );
}