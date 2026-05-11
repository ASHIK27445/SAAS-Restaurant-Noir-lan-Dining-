import { Link } from "react-router";
import LoginLeftPanel from "./LoginLeftPanel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAccountSchema, type CreateAccountFormData } from "./ZodLoginSchema";
import { use, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
// import bcrypt from "bcryptjs";

// ── Component ────────────────────────────────────────────────────────────────
export default function CreateAccount() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const {createUserEP, profileUpdate, logoutUser} = use(AuthContext) as AuthContextType

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(CreateAccountSchema),
  });

  const { ref: photoRef, ...photoRest } = register("photo");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };
 

  const onSubmit = async(data: CreateAccountFormData) => {
    console.log(data);
    //  const hasedPassword = await bcrypt.hash(data.password, 10)
    //  console.log(hasedPassword)
    // // data.password = hasedPassword
    // console.log(data.password)
    // TODO: wire up to your auth context / API

    //Firebase
    await createUserEP(data.email, data.password)
      .then(async res => {
        console.log(res.user)
        try {
          await profileUpdate(data.name, '');
          const token = await res.user.getIdToken()

          const userInfo = {
            token,
            name: res.user.displayName,
            phone: data.phone,
          }

          console.log(userInfo)

          await fetch('http://localhost:3000/auth/user-create', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
          }).then(async(res)=> {
            const data = await res.json()
            console.log(data)
            logoutUser()
              .then(()=> console.log('logout success'))
              .catch((err)=> console.log(err))
          })
        } catch (err) {
          return console.log(err);
        }
      })
      .catch(err => console.log(err))
  };

  return (
    <div className="min-h-screen h-screen flex flex-col md:flex-row overflow-hidden bg-[#fbf9f5] text-[#1b1c1a] font-['Inter',sans-serif]">

      {/* ── Left Panel ── */}
      <LoginLeftPanel />

      {/* ── Right Panel ── */}
      <div className="flex-1 bg-[#fbf9f5] flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden">
        <div className="w-full max-w-md">

          {/* Mobile title */}
          <div className="md:hidden mb-3">
            <h1 className="font-['Noto_Serif',serif] italic text-3xl text-primary leading-tight tracking-tight">
              The Culinary Editorial
            </h1>
          </div>

          {/* Heading */}
          <div className="mb-3">
            <h2 className="font-['Noto_Serif',serif] text-base lg:text-lg text-[#1b1c1a]">
              Create Your Account
            </h2>
            <p className="text-on-surface-variant text-xs mt-0.5">
              Join for exclusive reservations, chef's journals, and tailored culinary experiences.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">

            {/* Photo (optional) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="shrink-0 w-11 h-11 rounded-full bg-surface-container-low border border-outline-variant/20 overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity"
                title="Upload profile photo">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-outline/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )}
              </button>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="font-['Inter',sans-serif] text-[10px] uppercase tracking-widest text-secondary font-semibold">
                  Profile Photo <span className="normal-case tracking-normal font-normal text-outline/50">(optional)</span>
                </span>
                <button type="button" onClick={() => photoInputRef.current?.click()} className="text-left text-xs text-primary hover:underline underline-offset-4 decoration-primary/30 transition-all">
                  {photoPreview ? "Change photo" : "Upload a photo"}
                </button>
                <input
                  {...photoRest}
                  ref={(e) => { photoRef(e); (photoInputRef as React.MutableRefObject<HTMLInputElement | null>).current = e; }}
                  type="file" accept="image/*" className="hidden" onChange={handlePhotoChange}
                />
              </div>
            </div>

            {/* Name + Phone side by side */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label htmlFor="name" className="block font-['Inter',sans-serif] text-[10px] uppercase tracking-widest text-secondary font-semibold">
                  Full Name
                </label>
                <input {...register("name")} id="name" type="text" placeholder="Jane Doe"
                  className="w-full bg-surface-container-low border-none rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none text-sm text-[#1b1c1a] placeholder:text-outline/50"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <label htmlFor="phone" className="block font-['Inter',sans-serif] text-[10px] uppercase tracking-widest text-secondary font-semibold">
                  Phone <span className="normal-case tracking-normal font-normal text-outline/50">(optional)</span>
                </label>
                <input {...register("phone")} id="phone" type="tel" placeholder="+1 (555) 000-0000"
                  className="w-full bg-surface-container-low border-none rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none text-sm text-[#1b1c1a] placeholder:text-outline/50"
                />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block font-['Inter',sans-serif] text-[10px] uppercase tracking-widest text-secondary font-semibold">
                Email Address
              </label>
              <input {...register("email")} id="email" type="email" placeholder="name@domain.com"
                className="w-full bg-surface-container-low border-none rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none text-sm text-[#1b1c1a] placeholder:text-outline/50"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block font-['Inter',sans-serif] text-[10px] uppercase tracking-widest text-secondary font-semibold">
                Password
              </label>
              <input {...register("password")} id="password" type="password" placeholder="••••••••"
                className="w-full bg-surface-container-low border-none rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none text-sm text-[#1b1c1a] placeholder:text-outline/50"
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button disabled={isSubmitting} type="submit"
                className="w-full bg-primary text-white font-['Inter',sans-serif] uppercase tracking-widest text-xs py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
                style={{ boxShadow: "0 12px 32px -4px rgba(27,28,26,0.04)" }}>
                {isSubmitting ? "Creating Account…" : "Create Account"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative py-2.5">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-['Inter',sans-serif]">
              <span className="bg-[#fbf9f5] px-4 text-secondary">Already have a seat?</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/10 text-center">
            <h3 className="font-['Noto_Serif',serif] text-sm text-[#1b1c1a] mb-1">Sign In</h3>
            <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">Welcome back — your table is waiting.</p>
            <Link to="/login"
              className="block w-full bg-surface-container-high text-primary font-['Inter',sans-serif] uppercase tracking-widest text-[10px] py-2 rounded-xl border border-primary/5 hover:bg-surface-variant transition-colors">
              Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}