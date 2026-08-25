import { use, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendEmailVerification } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { LoginSchema, type LoginFormData } from "./ZodLoginSchema";
import { bootstrapAdmin, getCurrentUser } from "../../api/authorization";

const MANAGEMENT_ROLES = ["Admin", "DemoAdmin", "Manager", "Chef", "SousChef", "Waiter", "Cashier"];

function destinationForRole(role: string) {
  if (["Cashier", "Chef", "SousChef", "Waiter"].includes(role)) return "/pos-login";
  return "/admin";
}

export default function ManagementLogin() {
  const navigate = useNavigate();
  const { loginUser, logoutUser } = use(AuthContext) as AuthContextType;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({ resolver: zodResolver(LoginSchema) });
  const [error, setError] = useState("");

  async function onSubmit(data: LoginFormData) {
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
          setError("A verification link has been sent to your management email. Verify it, then sign in again.");
        } catch (verificationError) {
          await logoutUser();
          const code = verificationError && typeof verificationError === "object" && "code" in verificationError
            ? String(verificationError.code)
            : "unknown";
          setError(`Verification email could not be sent (${code}). Check that Email/Password is enabled in Firebase Authentication.`);
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

  return (
    <main className="min-h-screen flex items-center justify-center overflow-hidden bg-[#061a2a] px-5 py-8 text-white sm:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(0,148,218,0.5),transparent_42%),radial-gradient(circle_at_10%_90%,rgba(0,203,255,0.28),transparent_38%)]" />
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-12 md:flex-row md:justify-center md:gap-16">
        <section className="w-full max-w-sm rounded-xl bg-[#171717] p-6 shadow-2xl sm:p-7">
          <div className="mb-5"><h1 className="text-2xl font-bold">Sign in</h1><p className="mt-1 text-[10px] text-white/65">Staff access for your restaurant</p></div>
          {error && <p role="alert" className="mb-4 rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-200">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div><input id="management-email" {...register("email")} type="email" autoComplete="username" placeholder="Email address" className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/55 focus:border-white/50" />{errors.email && <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>}</div>
            <div><input id="management-password" {...register("password")} type="password" autoComplete="current-password" placeholder="Password" className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/55 focus:border-white/50" />{errors.password && <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>}</div>
            <button disabled={isSubmitting} type="submit" className="w-full rounded-lg bg-white py-2.5 text-xs font-semibold text-[#171717] hover:bg-white/90">{isSubmitting ? "Signing in..." : "Continue"}</button>
          </form>
          <p className="mt-5 text-center text-[10px] text-white/60">Need access? Contact your administrator.</p>
        </section>
        <div className="max-w-xs text-center md:text-left"><p className="text-3xl font-bold tracking-tight">Restaurant Admin</p><p className="mt-3 text-sm leading-relaxed text-white/80">Manage your team, orders, and hospitality operations from one place.</p></div>
      </div>
    </main>
  );
}
