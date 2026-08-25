import { Link, useNavigate } from "react-router";
import LoginLeftPanel from "./LoginLeftPanel";
import { LoginSchema, type LoginFormData } from "./ZodLoginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { sendEmailVerification } from "firebase/auth";
import { authFetch } from "../../api/authFetch";

export default function LoginPage() {
  const navigate = useNavigate()
  const {register, handleSubmit, 
    formState: {errors, isSubmitting},} = useForm<LoginFormData>({
      resolver: zodResolver(LoginSchema)
    })
  
  const {loginUser, signInWithGoogle, user, logoutUser} = use(AuthContext) as AuthContextType
  const [googleLoading, setGoogleLoading] = useState(false);

  const onsubmit = async(data: LoginFormData) => {
    console.log(data);
    if (user) {
      alert("Already logged in!");
      return;
    }

    //firebase
    try {
      const res = await loginUser(data.email, data.password)
      await res.user.reload()

      //sent user verfication mail
      if(!res.user.emailVerified){
        await sendEmailVerification(res.user, {
          url: `${window.location.origin}/email-verification-success`,
          handleCodeInApp: true,
        })
        await logoutUser()
        console.log(res.user.email)
        alert('verified email please!')
        navigate('/sent-email-verfication', {
          state: res.user.email
        })
        return
      }
      console.log(res.user)
      navigate('/')
    } catch (err) {
      console.log(err)
    }

  };

  const handleGoogleLogin = async () => {
    if (user) return;
    setGoogleLoading(true);
    try {
      const { user: googleUser } = await signInWithGoogle();
      const response = await authFetch("http://localhost:3000/auth/user-create", {
        method: "POST",
        body: JSON.stringify({ name: googleUser.displayName, phone: googleUser.phoneNumber }),
      });
      if (!response.ok) throw new Error("Unable to create customer account");
      navigate("/");
    } catch (err) {
      console.error("Google customer login failed", err);
      await logoutUser();
      alert("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col md:flex-row overflow-hidden bg-[#fbf9f5] text-[#1b1c1a] font-['Inter',sans-serif]">

      {/* ── Left Panel ── */}
      <LoginLeftPanel/>
      
      {/* ── Right Panel ── */}
      <div className="flex-1 bg-[#fbf9f5] flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 relative overflow-hidden">
        <div className="w-full max-w-md lg:space-y-1">

          {/* Mobile title */}
          <div className="md:hidden mb-5">
            <h1 className="font-['Noto_Serif',serif] italic text-3xl text-primary leading-tight tracking-tight">
              The Culinary Editorial
            </h1>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="font-['Noto_Serif',serif] text-base lg:text-xl text-[#1b1c1a]">Welcome Back</h2>
            <p className="text-on-surface-variant text-sm lg:text-sm">
              Please enter your credentials to access your journal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onsubmit)} className="space-y-2 lg:space-y-3">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block font-['Inter',sans-serif] text-[10px] lg:text-xs uppercase tracking-widest text-secondary font-semibold">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="name@domain.com"
                className="w-full bg-surface-container-low border-none rounded-lg px-3 py-2 lg:py-2.5 focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none text-sm lg:text-sm text-[#1b1c1a] placeholder:text-outline/50"
              />

            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block font-['Inter',sans-serif] text-[10px] lg:text-xs uppercase tracking-widest text-secondary font-semibold">
                  Password
                </label>
                <Link
                  to={'/'}
                  className="text-[9px] lg:text-[10px] uppercase tracking-widest text-primary font-bold hover:underline underline-offset-4 decoration-primary/30">
                  Forgot Password?
                </Link>
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full bg-surface-container-low border-none rounded-lg px-3 py-2 lg:py-2.5 focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none text-sm lg:text-sm text-[#1b1c1a] placeholder:text-outline/50"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-primary text-white font-['Inter',sans-serif] uppercase tracking-widest text-xs lg:text-sm py-2 lg:py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
                style={{ boxShadow: "0 12px 32px -4px rgba(27,28,26,0.04)" }}>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <button type="button" disabled={googleLoading} onClick={() => void handleGoogleLogin()} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-white py-2.5 text-xs font-semibold text-[#1b1c1a] hover:bg-surface-container-low disabled:opacity-60">
            <span className="text-sm font-bold">G</span>
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="relative py-3 lg:py-4">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30" />
            </div>
            <div className="relative flex justify-center text-[10px] lg:text-xs uppercase tracking-widest font-['Inter',sans-serif]">
              <span className="bg-[#fbf9f5] px-4 text-secondary">New to the Table?</span>
            </div>
          </div>

          {/* Register Card */}
          <div className="space-y-4">
            <div className="p-4 lg:p-5 rounded-xl bg-surface-container-low border border-outline-variant/10 text-center">
              <h3 className="font-['Noto_Serif',serif] text-sm lg:text-base text-[#1b1c1a] mb-1.5">
                Create Account
              </h3>
              <p className="text-xs lg:text-sm text-on-surface-variant mb-4 leading-relaxed">
                Join for exclusive reservations, chef's journals, and tailored culinary experiences.
              </p>
              <Link to='/registration' className="w-full bg-surface-container-high text-primary font-['Inter',sans-serif] uppercase tracking-widest text-[10px] lg:text-xs px-2 py-2 lg:py-2.5 rounded-xl border border-primary/5 hover:bg-surface-variant transition-colors">
                Register Now
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}