import { CheckCircle, CornerRightDown, Mail, RotateCcw, User } from "lucide-react";
import { useState } from "react";

export default function ResetPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] font-sans text-[#1b1c1a]">

      {/* ── Main ── */}
      <main className="min-h-screen pt-3 pb-3 flex flex-col items-center justify-center px-6 relative">

        {/* Asymmetric background panel */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low -z-10 hidden lg:block" />

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Editorial image + pull-quote ── */}
          <div className="hidden lg:block space-y-8">
            <div className="relative group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf-1M6i_ElnZpVhk7r-yrtpqhDqQLkj0CqeCiEkFRM-w1txFcD5epFsK0Mmm9omqdK8fFVVz-0g792Yg8jxiThJPPlyU2UG_S90YgeTD-ecAIySknax97F-P8PvScc8L3fpxigo6S5GvYRMHF6l1CPUKThmrs168YIHik6hLMWcG3b1Pw0M0ZUJ7Zx6AHQgBIlGEf0AP7lFOnNktQfujBfL9AokPCqaYjYzUJDOyXhyoBzdLDGZJDz6AiWVRh7EIkaDDmzeoM4duA"
                alt="Atmospheric fine dining table with candlelight"
                className="rounded-lg shadow-sm grayscale group-hover:grayscale-0 transition-all duration-700 w-full h-125 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 p-8 bg-primary text-white rounded-xl max-w-xs shadow-xl">
                <p className="font-serif italic text-lg leading-relaxed">
                  "A secure space for your culinary journey, ensuring your
                  preferences remain uniquely yours."
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Reset Password Form ── */}
          <div className="bg-white p-10 md:p-16 rounded-xl shadow-[0_12px_32px_rgba(27,28,26,0.06)] border border-outline-variant/20">
            <div className="max-w-md mx-auto">

              {/* Header */}
              <header className="mb-10">
                <div className="mb-4 text-primary">
                  {/* lock_reset icon via emoji/SVG fallback */}
                  <RotateCcw />
                </div>
                <h1 className="font-serif text-3xl md:text-4xl text-[#1b1c1a] font-bold tracking-tight mb-3">
                  Reset your access
                </h1>
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  Please enter the email address associated with your account.
                  We'll send a secure link to reset your password.
                </p>
              </header>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Email input */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-secondary tracking-widest uppercase"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl"/>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="e.g. julian@cuisine.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-transparent rounded-xl focus:bg-surface-container-high focus:outline-none focus:border-primary/20 transition-all placeholder:text-outline/50 text-sm"
                    />
                  </div>
                </div>

                {/* Success message */}
                {submitted && (
                  <div className="p-4 bg-[#ccead6]/30 rounded-xl border border-primary/10 flex gap-4 items-start">
                    <CheckCircle fill="#173124"/>
                    <p className="text-sm text-[#324c3e]">
                      A reset link has been dispatched to your inbox. Please
                      check your spam folder if you don't see it within a few
                      minutes.
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div className="pt-4 flex flex-col gap-4">
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-4 px-4 rounded-xl font-semibold text-base hover:opacity-95 active:scale-[0.99] transition-all flex justify-center items-center gap-2"
                  >
                    Send Reset Link
                    <CornerRightDown size={16}/>
                  </button>
                  <a
                    href="#"
                    className="text-center text-sm font-semibold text-primary hover:underline underline-offset-4 decoration-primary/30 transition-all py-2"
                  >
                    Return to Sign In
                  </a>
                </div>
              </form>

              {/* Divider */}
              <div className="my-10 h-px bg-outlinetext-outline-variant/20" />

              {/* Security badge */}
              <div className="flex justify-center items-center gap-4 text-on-surface-variant">
                <User color="#c2c8c2" />
                <p className="text-xs uppercase tracking-widest font-medium">
                  Encrypted &amp; Private Connection
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}