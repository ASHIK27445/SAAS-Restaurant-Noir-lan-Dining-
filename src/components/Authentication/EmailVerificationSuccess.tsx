import { CheckCircle } from "lucide-react";
import { Link } from "react-router";

export default function EmailVerificationSuccess() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a] font-sans antialiased">

      {/* ── Main ── */}
      <main className="min-h-screen flex items-center justify-center px-6 pb-10 pt-10 md:pt-0">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-12 items-center">

          {/* ── Left: Editorial Imagery ── */}
          <div className="hidden md:block md:col-span-7 relative">

            {/* Primary image */}
            <div className="relative z-10 rounded-xl overflow-hidden aspect-4/5 w-full max-w-md ml-auto shadow-[0_12px_32px_rgba(27,28,26,0.08)]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwSls_2tnmQcY9DCG9U4D-b0hSpUmml9xRKqyJo8HGAPCP9DvpWwl1D8ph-KjowYZoph-erXnQYMN8cbcYfGp8PVlYSVb7wjt8vNCXQJxmkgK7HMroAxFiQ4554IN765cG5bkhXP6DR_K9WUkuORW-QqwhDhGSZOo9cyLhw9pGh5YPUUFRDsN1H-R9GWElCVXRc2P_mFSbwlDL46tmJ2Hx8a4oWyg_FjKC_rHfLTvgGw_Tvzk2xqzKvRFq-bGFnbv3v2QMj31FeDQ"
                alt="Elegant dinner table with fine linen and crystal glassware"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Asymmetric secondary image */}
            <div className="absolute -bottom-12 -left-4 z-20 w-64 aspect-square rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(27,28,26,0.08)] border-12 border-[#fbf9f5]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvJvHpi8fTcxa4DGCOKml4NxzruIeb33gOCCynr8ncF5lmYEU6GElOSZpo025wEsliojVbunpm83bm4m1poE5K_18bZSuMnRqqOV6HC6pRW-FHUN7686cSO_o3dcWbYanIOkHIWtEDFaFV1tTv3tEZnq1-GfU6So9LWBR8OX7UxCNBF1iw0_oFgzR7iXRccSl7CN0Bpj-PVTcsq0PXxh88wEo-vBTDjwvqm0DDGdUPZ9POFIjRVXWGp5GnghcIeHF0nMjBrzpF10Y"
                alt="Ceramic kitchenware and fresh herbs on stone countertop"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Geometric background accent */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full h-4/5 bg-surface-container-low -z-10 rounded-xl" />
          </div>

          {/* ── Right: Content & CTA ── */}
          <div className="md:col-span-5 flex flex-col items-start space-y-8">
            <div className="space-y-4">

              {/* Verification badge */}
              <div className="flex items-center space-x-3 text-primary">
                <CheckCircle />
                <span className="text-xs uppercase tracking-widest font-medium">
                  Verification Complete
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-5xl md:text-6xl text-[#1b1c1a] leading-tight tracking-tight">
                Welcome to <span className="italic">the Table</span>
              </h1>

              {/* Body */}
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                Your identity has been verified. You are now part of an
                intentional community dedicated to the art of the meal and the
                stories behind the ingredients.
              </p>
            </div>

            {/* CTA + Quote */}
            <div className="w-full space-y-4 pt-4">
              <Link
                to='/'
                className="inline-flex items-center justify-center w-full md:w-auto px-10 py-5 bg-primary text-white font-semibold text-lg rounded-xl hover:opacity-90 transition-all duration-300 active:scale-[0.98]"
              >
                Start Dining
              </Link>

              <div className="pt-6 border-t border-outline-variant/20 w-full">
                <p className="text-sm text-on-secondary-container/60 italic font-serif">
                  "A guest is a jewel resting on the cushion of hospitality."
                </p>
              </div>
            </div>

            {/* Mobile image */}
            <div className="md:hidden w-full pt-12">
              <div className="rounded-xl overflow-hidden aspect-video shadow-[0_12px_32px_rgba(27,28,26,0.08)]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFrrqJSiNGFuqlG3fX-k_bp97Yx1GXkGiutowwem86dAVQFXj-cuRng2WpqUtBbKt1qeqRASBYH-yAlTmJQnZXEo1TRg5hiaitm_JOkXBOSLDFimR-yyVlfkeVjVMtDYDE4O11jJToRxzwxlJpvDN3ww7ZTTOfYhzj0EYjaofS24c8_bbwB6bOUe1RCH6dTxt29380B2eEhlPOL4PC-jHyHxkZbvpxOoYZs51-Ln5ExggQ4wtIRmbLd0UNtmhHsUD7xqMsqgVFLrE"
                  alt="Elegant table setting with soft lighting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}