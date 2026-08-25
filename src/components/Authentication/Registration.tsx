import { Link } from "react-router";
import { use, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import LoginLeftPanel from "./LoginLeftPanel";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { authFetch } from "../../api/authFetch";
import {
  CreateAccountSchema,
  type CreateAccountFormData,
} from "./ZodLoginSchema";

export default function CreateAccount() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const { createUserEP, profileUpdate, logoutUser } =
    use(AuthContext) as AuthContextType;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(CreateAccountSchema),
  });

  const photo = register("photo");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPhotoPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: CreateAccountFormData) => {
    try {
      const { user } = await createUserEP(data.email, data.password);

      await profileUpdate(data.name, "");

      const token = await user.getIdToken();

      const userInfo = {
        token,
        name: user.displayName,
        phone: data.phone,
      };

      const response = await authFetch("http://localhost:3000/auth/user-create", {
        method: "POST",
        body: JSON.stringify(userInfo),
      });

      const result = await response.json();
      console.log("User created:", result);

      await logoutUser();
      console.log("Logout successful");
    } catch (error) {
      console.error("Account creation failed:", error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#fbf9f5] text-[#1b1c1a]">
      <LoginLeftPanel />

      <section className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="md:hidden mb-5">
            <h1 className="font-['Noto_Serif'] italic text-3xl text-primary">
              The Culinary Editorial
            </h1>
          </div>

          {/* Header */}
          <header className="mb-5">
            <h2 className="font-['Noto_Serif'] text-xl">
              Create Your Account
            </h2>
            <p className="mt-1 text-xs text-on-surface-variant">
              Join for exclusive reservations, chef's journals, and tailored
              culinary experiences.
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Profile Photo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="w-12 h-12 shrink-0 overflow-hidden rounded-full bg-surface-container-low border border-outline-variant/20 flex items-center justify-center hover:opacity-80 transition"
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-5 h-5 text-outline/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                )}
              </button>

              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-secondary">
                  Profile Photo{" "}
                  <span className="normal-case tracking-normal font-normal text-outline/50">
                    (optional)
                  </span>
                </p>

                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="mt-1 text-xs text-primary hover:underline"
                >
                  {photoPreview ? "Change photo" : "Upload a photo"}
                </button>

                <input
                  {...photo}
                  ref={(el) => {
                    photo.ref(el);
                    photoInputRef.current = el;
                  }}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Full Name"
                error={errors.name?.message}
                {...register("name")}
                placeholder="Jane Doe"
              />

              <Field
                label="Phone"
                optional
                error={errors.phone?.message}
                {...register("phone")}
                placeholder="+1 (555) 000-0000"
                type="tel"
              />
            </div>

            {/* Email */}
            <Field
              label="Email Address"
              error={errors.email?.message}
              {...register("email")}
              placeholder="name@domain.com"
              type="email"
            />

            {/* Password */}
            <Field
              label="Password"
              error={errors.password?.message}
              {...register("password")}
              placeholder="••••••••"
              type="password"
            />

            {/* Submit */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-white text-xs uppercase tracking-widest font-medium hover:opacity-90 active:scale-[.98] transition disabled:opacity-50"
            >
              {isSubmitting ? "Creating Account…" : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <div className="relative my-5">
            <div className="border-t border-outline-variant/30" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 bg-[#fbf9f5] text-[10px] uppercase tracking-widest text-secondary whitespace-nowrap">
              Already have a seat?
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10 text-center">
            <h3 className="font-['Noto_Serif'] text-sm">
              Sign In
            </h3>

            <p className="mt-1 mb-3 text-xs text-on-surface-variant">
              Welcome back — your table is waiting.
            </p>

            <Link
              to="/login"
              className="block py-2.5 rounded-xl bg-surface-container-high text-primary text-[10px] uppercase tracking-widest hover:bg-surface-variant transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ───────────────────────────────────────────── */

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  optional?: boolean;
};

function Field({
  label,
  error,
  optional,
  className = "",
  ...props
}: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] uppercase tracking-widest font-semibold text-secondary">
        {label}{" "}
        {optional && (
          <span className="normal-case tracking-normal font-normal text-outline/50">
            (optional)
          </span>
        )}
      </label>

      <input
        {...props}
        className={`w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm outline-none transition focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-high placeholder:text-outline/50 ${className}`}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}