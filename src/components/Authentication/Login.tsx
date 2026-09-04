import { Link, useNavigate } from "react-router";
import { LoginSchema, type LoginFormData } from "./ZodLoginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { sendEmailVerification } from "firebase/auth";
import { authFetch } from "../../api/authFetch";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

export default function LoginPage() {
  const navigate = useNavigate()
  const {register, handleSubmit,
    formState: {errors, isSubmitting},} = useForm<LoginFormData>({
      resolver: zodResolver(LoginSchema)
    })

  const {loginUser, signInWithGoogle, user, logoutUser} = use(AuthContext) as AuthContextType
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

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
    setGoogleError("");
    try {
      const { user: googleUser } = await signInWithGoogle();
      const response = await authFetch(`${BASE_URL}/auth/user-create`, {
        method: "POST",
        body: JSON.stringify({ name: googleUser.displayName, phone: googleUser.phoneNumber }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(result?.message ?? `Unable to create customer account (${response.status})`);
      }
      navigate("/");
    } catch (err) {
      console.error("Google customer login failed", err);
      await logoutUser();
      setGoogleError(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-4 overflow-hidden">
      <div className="w-full max-w-[420px] bg-white border border-[#E5E1D8] rounded-[28px] px-5 sm:px-8 md:px-10 py-6 md:py-8 flex flex-col items-center">
        {/* Flower logo */}
        <svg width="56" height="56" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
          <ellipse cx="50" cy="28" rx="16" ry="22" fill="#171412" />
          <ellipse cx="50" cy="72" rx="16" ry="22" fill="#171412" />
          <ellipse cx="28" cy="50" rx="22" ry="16" fill="#171412" />
          <ellipse cx="72" cy="50" rx="22" ry="16" fill="#171412" />
          <ellipse cx="34" cy="34" rx="16" ry="20" transform="rotate(-45 34 34)" fill="#171412" />
          <circle cx="50" cy="50" r="10" fill="#171412" />
        </svg>

        <h1 className="text-[26px] font-semibold text-[#171412] mb-2">Welcome back</h1>
        <p className="text-[14px] text-[#171412] mb-7">Log in to Noir Dining.</p>

        <form onSubmit={handleSubmit(onsubmit)} className="w-full">
          {/* Email */}
          <div className="relative w-full mb-1">
            <label
              htmlFor="email"
              className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[12px] font-medium text-[#171412]"
            >
              Email address<span className="text-red-500">*</span>
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="w-full border border-[#171412] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:ring-1 focus:ring-[#171412]"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mb-4">{errors.email.message}</p>
          )}
          {!errors.email && <div className="mb-5" />}

          {/* Password */}
          <div className="relative w-full mb-1">
            <label
              htmlFor="password"
              className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[12px] font-medium text-[#171412]"
            >
              Password<span className="text-red-500">*</span>
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className="w-full border border-[#171412] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:ring-1 focus:ring-[#171412]"
            />
          </div>
          <div className="flex justify-end mt-2 mb-5">
            <Link to={"/"} className="text-[12px] font-semibold underline text-[#171412]">
              Forgot password?
            </Link>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs -mt-3 mb-4">{errors.password.message}</p>
          )}

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-[#171412] hover:bg-[#2a2521] transition-colors text-white text-[14px] font-medium rounded-xl py-3.5 mb-5 disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Continue"}
          </button>
        </form>

        <p className="text-[13px] text-[#171412] mb-6">
          Don&apos;t have an account?{" "}
          <Link to="/registration" className="font-semibold underline">
            Join Noir Dining
          </Link>
        </p>

        <div className="w-full flex items-center gap-3 mb-6">
          <span className="flex-1 h-px bg-[#E5E1D8]" />
          <span className="text-[11px] tracking-wide text-[#171412]">OR</span>
          <span className="flex-1 h-px bg-[#E5E1D8]" />
        </div>

        <button
          type="button"
          disabled={googleLoading}
          onClick={() => void handleGoogleLogin()}
          className="w-full flex items-center justify-center gap-3 border border-[#E5E1D8] rounded-xl py-3.5 text-[14px] text-[#171412] hover:bg-[#FAFAF8] transition-colors disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.99 36.902 44 30.999 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          {googleLoading ? "Signing in..." : "Continue with Google"}
        </button>
        {googleError && (
          <p role="alert" className="mt-3 w-full text-center text-xs text-red-500">{googleError}</p>
        )}
      </div>
    </div>
  );
}