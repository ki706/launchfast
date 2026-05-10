import { Navbar } from "@/components/marketing/Navbar"
import { PricingCard } from "@/components/marketing/PricingCard"
import { Footer } from "@/components/marketing/Footer"
import { Zap } from "lucide-react"

export const metadata = {
  title: "Pricing | LaunchFast",
  description: "Simple, transparent pricing. Pay once, own it forever.",
}

const faqs = [
  {
    q: "Is it really a one-time payment?",
    a: "Yes. Once you purchase a license, you own it forever. This includes all future updates to the boilerplate foundation.",
  },
  {
    q: "Do I need to pay for Supabase or Stripe?",
    a: "LaunchFast uses the free tiers of Supabase, Stripe, and Resend. You only need to pay those providers if you exceed their generous free limits.",
  },
  {
    q: "Can I use it for multiple projects?",
    a: "The Pro license is for a single project. The Business license allows for unlimited projects and commercial use.",
  },
  {
    q: "Do you offer support?",
    a: "Yes, Pro and Business users get priority email support. We usually respond within 24 hours.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground mb-6">
              Simple, transparent <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">one-time pricing.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop paying monthly for your foundation. Buy the boilerplate once, and build as many AI apps as you want.
            </p>
          </div>

          {/* Pricing Component (already contains the tiers) */}
          <PricingCard />

          {/* FAQ */}
          <div className="mt-32 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4 text-center">Frequently asked questions</h2>
              <p className="text-muted-foreground text-sm">Everything you need to know about LaunchFast.</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-border bg-muted p-6 hover:bg-card transition-colors">
                  <h3 className="font-bold text-foreground mb-2">{q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              Trusted by 500+ developers worldwide
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
