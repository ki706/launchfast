import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const techStack = [
  "Next.js 14",
  "Supabase",
  "Stripe",
  "Groq",
  "TypeScript",
  "shadcn/ui",
  "Tailwind CSS",
  "Resend"
]

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-blue-600/10 blur-[120px] -z-10" />
      
      <div className="container px-4 mx-auto text-center">
        {/* Tech Stack Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {techStack.map((tech) => (
            <span 
              key={tech}
              className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border border-border rounded-full bg-muted/50 backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-foreground mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Ship your AI SaaS <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">in days, not months.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg lg:text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          The only Next.js starter with a production-ready AI layer. Auth, billing, and AI infrastructure: all wired together.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-sm font-bold uppercase tracking-widest" asChild>
            <Link href="/dashboard">
              Live Demo <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-sm font-bold uppercase tracking-widest border-border text-foreground hover:bg-muted" asChild>
            <Link href="https://github.com/miftah-ab/launchfast">
              <GitHubIcon className="mr-2 w-4 h-4" /> View on GitHub
            </Link>
          </Button>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-20 relative max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000 delay-500 group">
          <div className="absolute inset-0 bg-blue-600/10 blur-[100px] -z-10 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-blue-500/10">
            {/* Header */}
            <div className="h-12 bg-muted/50 border-b border-border flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                </div>
                <div className="h-4 w-px bg-border mx-2" />
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dashboard</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600/10 border border-blue-500/20" />
                <div className="h-2 w-12 bg-muted rounded-full" />
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 bg-background">
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Revenue", val: "$24,510", color: "text-blue-500" },
                  { label: "Users", val: "842", color: "text-emerald-500" },
                  { label: "AI Tokens", val: "1.2M", color: "text-purple-500" },
                  { label: "Status", val: "99.9%", color: "text-amber-500" },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl border border-border bg-card/50">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</div>
                    <div className={`text-lg font-bold ${stat.color}`}>{stat.val}</div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 h-64 rounded-xl bg-muted/30 border border-border flex flex-col p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">User Growth</div>
                    <div className="flex gap-1">
                      <div className="w-8 h-2 bg-blue-600 rounded-full" />
                      <div className="w-8 h-2 bg-blue-600/20 rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-end justify-between gap-2">
                    {[40, 60, 45, 80, 55, 90, 70, 100, 85, 95].map((h, i) => (
                      <div 
                        key={i} 
                        className="w-full bg-gradient-to-t from-blue-600/5 to-blue-600/40 rounded-t-sm"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-64 rounded-xl bg-muted/30 border border-border p-6 space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Activity</div>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-card border border-border shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-2 w-full bg-muted rounded-full" />
                        <div className="h-1.5 w-2/3 bg-muted/50 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}
