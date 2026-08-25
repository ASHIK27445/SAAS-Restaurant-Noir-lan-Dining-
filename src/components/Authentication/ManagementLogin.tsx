import { use, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendEmailVerification } from "firebase/auth";
import LoginLeftPanel from "./LoginLeftPanel";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { LoginSchema, type LoginFormData } from "./ZodLoginSchema";
import { getCurrentUser } from "../../api/authorization";

const MANAGEMENT_ROLES = ["Admin", "DemoAdmin", "Manager", "Chef", "SousChef", "Waiter", "Cashier"];

function destinationForRole(role: string) {
  if (role === "Cashier") return "/pos-koh";
  if (role === "Chef" || role === "SousChef") return "/pos-koh/kitchen-queue";
  if (role === "Waiter") return "/POS";
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
      if (!result.user.emailVerified) {
        await sendEmailVerification(result.user);
        await logoutUser();
        setError("Please verify your email before using the management portal.");
        return;
      }
      const response = await getCurrentUser();
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
    <main className="min-h-screen flex flex-col md:flex-row bg-[#fbf9f5] text-[#1b1c1a]">
      <LoginLeftPanel />
      <section className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-7">
          <div><p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">Team access</p><h1 className="font-['Noto_Serif',serif] text-3xl mt-2">Management Portal</h1><p className="text-sm text-on-surface-variant mt-2">Sign in with your staff or administrator account.</p></div>
          {error && <p role="alert" className="rounded-lg bg-error/10 text-error px-4 py-3 text-sm">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div><label htmlFor="management-email" className="block text-xs uppercase tracking-widest text-secondary font-semibold mb-2">Work email</label><input id="management-email" {...register("email")} type="email" autoComplete="username" className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary/30 outline-none" />{errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}</div>
            <div><label htmlFor="management-password" className="block text-xs uppercase tracking-widest text-secondary font-semibold mb-2">Password</label><input id="management-password" {...register("password")} type="password" autoComplete="current-password" className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary/30 outline-none" />{errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}</div>
            <button disabled={isSubmitting} type="submit" className="w-full bg-primary text-white rounded-xl py-3 uppercase tracking-widest text-xs font-bold hover:opacity-90">{isSubmitting ? "Signing in..." : "Sign in to management"}</button>
          </form>
        </div>
      </section>
    </main>
  );
}
