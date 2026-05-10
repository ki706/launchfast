import Link from "next/link"
import { Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tiers = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for personal projects and experimentation.",
    features: [
      "Next.js 14 Foundation",
      "Supabase Auth & DB",
      "10,000 AI Tokens",
      "Community Support",
      "MIT License",
    ],
    cta: "Get Started",
    href: "/signup",
    variant: "outline",
  },
  {
    name: "Pro",
    price: "49",
    description: "Everything you need to ship a production AI SaaS.",
    features: [
      "All Free features",
      "Stripe Subscription Logic",
      "100,000 AI Tokens",
      "RAG Pipeline (pgvector)",
      "Priority Support",
      "Commercial License",
    ],
    cta: "Buy Pro",
    href: "/signup",
    variant: "premium",
    popular: true,
  },
  {
    name: "Business",
    price: "149",
    description: "Advanced features for high-growth AI platforms.",
    features: [
      "All Pro features",
      "Unlimited AI Tokens",
      "Team Member Support",
      "White Label Options",
      "1-on-1 Setup Call",
      "Enterprise License",
    ],
    cta: "Go Business",
    href: "/signup",
    variant: "outline",
  },
]

export function PricingCard() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
            Pay once. <br />
            <span className="text-muted-foreground">Own it forever.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            No recurring fees for the boilerplate. One-time payment for lifetime access and updates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={cn(
                "relative flex flex-col p-8 rounded-2xl border transition-all duration-300",
                tier.popular 
                  ? "bg-card border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.05)] scale-105 z-10" 
                  : "bg-muted border-border hover:border-foreground/20"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-[10px] font-bold uppercase tracking-widest text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">${tier.price}</span>
                  <span className="text-muted-foreground text-sm font-medium">one-time</span>
                </div>
                <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{tier.description}</p>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={tier.variant === "premium" ? "default" : "outline"}
                className={cn(
                  "w-full h-11 text-xs font-bold uppercase tracking-widest transition-all",
                  tier.variant === "premium" 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                asChild
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-xs font-medium flex items-center justify-center gap-2">
            <Zap className="w-3 h-3 text-amber-500" />
            14-day money-back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </section>
  )
}
