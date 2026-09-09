import { ExternalLink, Mail, Phone } from "lucide-react";
import type { SVGProps } from "react";

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5A5 5 0 0 1 16 8Z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const channels = [
  { label: "LinkedIn", detail: "Connect professionally", value: "md-ashikul-islam-as278", href: "https://www.linkedin.com/in/md-ashikul-islam-as278/", icon: LinkedinIcon },
  { label: "GitHub", detail: "Explore the code", value: "github.com/ASHIK27445", href: "https://github.com/ASHIK27445", icon: GithubIcon },
  { label: "Portfolio", detail: "See the work", value: "md-ashikul-islam-portfolio.vercel.app", href: "https://md-ashikul-islam-portfolio.vercel.app/", icon: ExternalLink },
  { label: "Email", detail: "Send a message", value: "mdashikulislam27889@gmail.com", href: "mailto:mdashikulislam27889@gmail.com", icon: Mail },
  { label: "Phone", detail: "Call directly", value: "+880 1767 643149", href: "tel:+8801767643149", icon: Phone },
];

export default function SupportPage() {
  return (
    <section className="min-h-full bg-white text-black">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-4">
          <span className="text-xs uppercase tracking-[0.18em] text-black/50">Operations / Support</span>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-black sm:block">Direct channel</span>
        </div>

        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-black/50">Support desk</p>
        <h1 className="max-w-lg text-4xl font-semibold leading-tight sm:text-5xl">Need a hand with the system?</h1>
        <p className="mt-5 max-w-lg text-sm leading-7 text-black/60">Reach Ashikul directly for product questions, technical support, hiring conversations, or a quick code discussion.</p>
        <div className="mt-6 flex items-center gap-2 text-xs text-black/50">
          <span className="h-1.5 w-1.5 rounded-full bg-black" /> Usually replies within 24-48 hours
        </div>

        <p className="mb-2 mt-12 text-xs font-bold uppercase tracking-[0.22em] text-black/50">Available channels</p>
        <h2 className="text-2xl font-semibold sm:text-3xl">Let&apos;s connect.</h2>
        <p className="mt-3 max-w-lg text-sm leading-6 text-black/60">Choose the channel that fits your question. Each link opens the quickest route to a response.</p>

        <div className="mt-7 divide-y divide-black/10 border-y border-black/10">
          {channels.map(({ label, detail, value, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 py-4 transition-colors hover:bg-black/3 sm:gap-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-black">
                <Icon size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-black/50">{label} / {detail}</span>
                <span className="mt-1 block truncate text-sm font-semibold text-black">{value}</span>
              </span>
              <ExternalLink size={16} className="shrink-0 text-black/30 transition-colors group-hover:text-black" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}