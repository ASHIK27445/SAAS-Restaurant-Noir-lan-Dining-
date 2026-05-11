import { Info, MailCheck } from "lucide-react";
import { use } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";


export default function EmailVerificationSent() {
  const navigate = useNavigate()
  const location = useLocation()
  const {user} = use(AuthContext) as AuthContextType
  const email = location.state
  const handleResend = () => {
    if(user && user.emailVerified){
      alert('email Already verified')
      navigate('/')
      return;
    }
    navigate('/resent-verification', {
    state: email})
  }
  
  console.log(email, location)
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a] font-sans antialiased">

      <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8 relative overflow-hidden">

        {/* ── Decorative blobs ── */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-surface-container-low opacity-50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-secondary-container opacity-30 blur-3xl pointer-events-none" />

        {/* ── Verification Canvas ── */}
        <div className="w-full max-w-xl flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* ── Left: Visual Anchor ── */}
          <div className="hidden relative w-full md:w-1/2 aspect-4/5 md:flex items-center justify-center">

            {/* Rotated bg card */}
            <div className="absolute inset-0 bg-surface-container-high rounded-xl rotate-3 scale-95 opacity-50" />

            {/* Main card */}
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(27,28,26,0.04)] bg-white flex items-center justify-center border border-outline-variant/10">
              <div className="flex flex-col items-center">
                <MailCheck color="#173124" />
                <div className="h-0.5 w-12 bg-tertiary/20" />
              </div>
            </div>

            {/* Bleeding edge photo */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-lg overflow-hidden shadow-[0_12px_32px_rgba(27,28,26,0.04)] border-4 border-[#fbf9f5] rotate-6">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCGgOH5hPsCKNYVLyaua5Zz6jX-RrFdhyURLIys6zj03dXOddkRqdmICSHdzBMWVr7tNs1z1WfYIpItFuvmNRDBtJSEuGSFanPb_dLt4GIlhveuz4hE89qkZYamvkLoccjRO8JMFmSYFi9pJ-XSClFZ84sN6nHAJhSbM8zaLrAL1YgTXM2vIW5_exY4-o33a7jjcwWctKqfC3NGHuGdfq3X9uBdbO0rLc2i2H63WRuTmQst5-6CF_4RuSymC3za7cF0Hm5xnQxTBk"
                alt="Fresh herbs and olive oil on ceramic plate"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* ── Right: Content ── */}
          <div className="w-full md:w-3/4 text-center md:text-left">
            <header className="mb-8">
              <p className="text-xs uppercase tracking-[0.2em] text-secondary mb-3">
                Refining Your Experience
              </p>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#062014] leading-tight mb-4">
                Verify Your Palette
              </h1>
              <div className="h-1 w-16 bg-primary mb-6 md:mx-0 mx-auto" />
            </header>

            <div className="space-y-5">
              <p className="text-on-surface-variant text-base leading-relaxed">
                To preserve the integrity of our editorial community, please
                click the confirmation link sent to your inbox.
              </p>

              {/* Info box */}
              <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/20">
                <div className="flex items-start gap-4">
                  <Info className="hidden md:flex items-center mt-1" color="#173124" size={70}/>
                  <p className="text-sm text-secondary leading-snug">
                    If you don't see the email within a few minutes, check your
                    promotions or spam folder.
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col items-center justify-center gap-4 pt-4">
                <Link
                  to='/login'
                  className="w-1/2 md:w-full inline-flex items-center justify-center px-4 md:px-8 py-3 md:py-4 bg-primary text-white font-medium rounded-xl transition-all duration-300 hover:opacity-90 active:scale-[0.98] shadow-[0_12px_32px_rgba(27,28,26,0.04)]"
                >
                  Is email Verified? Login Here
                </Link>

                <div className="flex flex-col items-center md:items-start gap-1">
                  <span className="text-xs text-on-surface-variant/60 uppercase tracking-widest">
                    Didn't receive it?
                  </span>
                  <button
                    onClick={handleResend}
                    className="text-primabg-primary font-semibold text-sm hover:text-tertiary transition-colors duration-200 underline decoration-primabg-primary/20 underline-offset-4 cursor-pointer">
                    Resent Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Minimalist footer ── */}
        <footer className="mt-16 text-center">
          <p className="font-serif italic text-xl text-primary-container opacity-40">
            The Culinary Editorial
          </p>
        </footer>
      </main>

      {/* ── Background texture overlay ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAyc9cyRY_aawJW2vGI18agpp_PVRUAwf43sLZH8u1tbclRJrUWXdHWNoptvE_n_DHpTuWYaKrBT4qU3d_YPzMwIUHrgux636IwzvTe7IZzjRZTHa5KvE2dy70jgxq0NFs_zXmKouJxEu3oeNUj1HhLWP7YZs0W7yuDhAqc5nZZGtHIP9rlvCfqLGkadhkRBsevFQUtqq0okzRG1ZGZ1Q-EkE6_SlGZ8vR6lvNWQzoS5hV1Fjcidki6VDuN0TD8diVYc1Y5xrs26ag')",
        }}
      />
    </div>
  );
}