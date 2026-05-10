import { Zap, Shield, Sparkles, CreditCard, Code2, Users } from "lucide-react"

const features = [
  {
    title: "Auth that just works",
    description: "Email, Password, Google, and GitHub. All pre-configured and hardened with Supabase.",
    icon: Shield,
  },
  {
    title: "Billing without the headache",
    description: "Subscription plans, usage tracking, and a full customer portal. Powered by Stripe.",
    icon: CreditCard,
  },
  {
    title: "AI in 5 minutes",
    description: "Multi-model support for Groq, Claude, and GPT-4. Usage tracking and limits included.",
    icon: Sparkles,
  },
  {
    title: "Your database, ready",
    description: "Supabase PostgreSQL with pgvector enabled for semantic AI search out of the box.",
    icon: Zap,
  },
  {
    title: "Emails that look good",
    description: "Beautiful transactional emails for every user action using Resend and React Email.",
    icon: Users,
  },
  {
    title: "Clean Architecture",
    description: "No bloat. Just well-structured, typed code that's easy to understand and extend.",
    icon: Code2,
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-background border-t border-border">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
            Everything you need. <br />
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Stop building the same auth and billing logic for every project. Focus on your product.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="p-8 rounded-xl border border-border bg-muted hover:bg-card transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition-colors">
                <feature.icon className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Hero Code Moment */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-4xl font-bold tracking-tight text-foreground mb-4">
              Adding AI features takes <span className="text-blue-500">5 minutes</span>.
            </h3>
            <p className="text-muted-foreground">
              One unified client. Every model. Automated usage tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Traditional way</p>
              <div className="p-6 rounded-xl border border-border bg-muted font-mono text-[11px] text-muted-foreground opacity-50 select-none pointer-events-none">
                <pre>
{`// Initialize API clients
// Setup streaming logic
// Write manual token counters
// Check database for plan limits
// Handle rate limit errors
// Record usage logs
// 200+ lines of infrastructure...`}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-500 px-1">LaunchFast way</p>
              <div className="p-6 rounded-xl border border-blue-500/20 bg-muted font-mono text-[11px] text-blue-600 dark:text-blue-100 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                <pre>
{`import { chat } from '@/lib/ai/client'

const response = await chat({
  model: 'groq',
  messages: [{ role: 'user', content: prompt }],
  userId: user.id
})

// Done. 
// Usage tracked. Plan checked. 
// Rate limited. Cost recorded.`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
