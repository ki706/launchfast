import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/Header"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, BarChart3, Users, Activity, ArrowUpRight, Zap } from "lucide-react"
import { getPlanFeatures } from "@/lib/stripe/plans"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("launchfast_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const fullName = profile?.full_name || "there"
  const plan = profile?.plan || "free"
  const usedTokens = profile?.ai_tokens_used_this_month || 0
  const features = getPlanFeatures(plan)
  
  const tokenLimit = features.aiTokensPerMonth
  const usagePercentage = tokenLimit === -1 ? 0 : Math.min(100, (usedTokens / tokenLimit) * 100)

  const isDemoUser = user.email === "demo@launchfast.com"

  return (
    <div className="flex-1 flex flex-col bg-background">
      <Header title="Overview" userName={fullName} />
      
      <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
        {/* AI Usage Alert for Free users */}
        {plan === "free" && usagePercentage > 80 && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-amber-500">AI Limit Reaching Soon</p>
                <p className="text-xs text-amber-500/70">You have used {usagePercentage.toFixed(0)}% of your free AI credits.</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-amber-500/20 hover:bg-amber-500/10 text-amber-500 h-8 text-xs font-bold uppercase tracking-wider">
              Upgrade
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={isDemoUser ? "$12,482.00" : "$0.00"}
            icon={BarChart3}
            description={isDemoUser ? "+12% from last month" : "No active sales yet"}
            variant="default"
          />
          <StatsCard
            title="Active Users"
            value={isDemoUser ? "842" : "1"}
            icon={Users}
            description={isDemoUser ? "24 online now" : "Just you so far"}
            variant="default"
          />
          <StatsCard
            title="AI Usage"
            value={usedTokens.toLocaleString()}
            icon={Sparkles}
            description={tokenLimit === -1 ? "Unlimited" : `of ${tokenLimit.toLocaleString()} tokens`}
            variant="blue"
          />
          <StatsCard
            title="System Status"
            value="Healthy"
            icon={Activity}
            description="All systems operational"
            variant="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area */}
          <Card className="lg:col-span-2 bg-card border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border-t border-border">
              <div className="text-center space-y-2">
                <BarChart3 className="w-8 h-8 text-muted mx-auto" />
                <p className="text-xs text-muted-foreground font-medium tracking-tight">No data available for the selected period</p>
              </div>
            </CardContent>
          </Card>

          {/* Side Info */}
          <div className="space-y-4">
            <Card className="bg-card border-border shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold tracking-tight capitalize">{plan}</span>
                  <Badge className="bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border-none rounded-md px-2 py-0.5 text-[10px] font-bold">
                    Active
                  </Badge>
                </div>
                
                {tokenLimit !== -1 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span>AI Credits</span>
                      <span>{usagePercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500" 
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button className="w-full h-9 text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-white/90" asChild>
                  <Link href="/dashboard/billing">Manage Subscription</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2">
                <Button variant="ghost" className="justify-between h-9 px-3 text-xs font-medium text-foreground hover:bg-accent" asChild>
                  <Link href="/dashboard/ai">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      Open AI Assistant
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#333]" />
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-between h-9 px-3 text-xs font-medium text-foreground hover:bg-accent" asChild>
                  <Link href="/dashboard/api-keys">
                    <span className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Manage API Keys
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#333]" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
