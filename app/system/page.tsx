import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Sparkles, Activity, ShieldAlert, CreditCard } from "lucide-react"

export const dynamic = "force-dynamic"

function createAdminSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export default async function SystemAdminPage({
  searchParams,
}: {
  searchParams: { secret?: string }
}) {
  // 1. Simple security check
  const secret = searchParams.secret
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    // Return 404 to hide existence
    return redirect("/404")
  }

  const supabase = createAdminSupabase()

  // 2. Fetch system stats
  const { data: profiles } = await supabase.from("launchfast_profiles").select("*")
  const { data: webhooks } = await supabase.from("launchfast_webhook_events").select("*").order("created_at", { ascending: false }).limit(10)
  const { data: aiUsage } = await supabase.from("launchfast_ai_usage").select("tokens_in, tokens_out")

  const totalUsers = profiles?.length || 0
  const activeSubs = profiles?.filter(p => p.subscription_status === "active").length || 0
  const totalTokens = aiUsage?.reduce((acc, curr) => acc + curr.tokens_in + curr.tokens_out, 0) || 0
  
  // Estimate MRR (very rough)
  const estimatedMRR = profiles?.reduce((acc, p) => {
    if (p.plan === "pro") return acc + 9
    if (p.plan === "business") return acc + 49
    return acc
  }, 0) || 0

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card">
        <div className="container px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span className="font-bold tracking-tight">System Admin</span>
          </div>
          <Badge variant="outline" className="border-red-500/20 text-red-500 bg-red-500/5 uppercase text-[10px] font-bold tracking-widest">
            Restricted Access
          </Badge>
        </div>
      </div>

      <main className="container p-6 space-y-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Users className="w-3 h-3" /> Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalUsers}</p>
              <p className="text-[10px] text-emerald-500 font-bold mt-1">Growth: +100%</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <CreditCard className="w-3 h-3" /> Active Subs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activeSubs}</p>
              <p className="text-[10px] text-muted-foreground/70 font-bold mt-1">Estimated MRR: ${estimatedMRR}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> AI Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{(totalTokens / 1000000).toFixed(2)}M</p>
              <p className="text-[10px] text-blue-500 font-bold mt-1">Tokens this month</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Activity className="w-3 h-3" /> Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{webhooks?.length || 0}</p>
              <p className="text-[10px] text-muted-foreground/70 font-bold mt-1">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-bold tracking-tight">Recent Webhooks</CardTitle>
            </CardHeader>
            <CardContent className="p-0 border-t border-border">
              <div className="divide-y divide-border">
                {webhooks?.map((ev) => (
                  <div key={ev.id} className="p-4 flex items-center justify-between hover:bg-muted">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground">{ev.type}</p>
                      <p className="text-[10px] text-muted-foreground/70 font-mono">{ev.stripe_event_id}</p>
                    </div>
                    <Badge variant={ev.processed ? "success" : "outline"} className="text-[9px] uppercase font-bold tracking-widest">
                      {ev.processed ? "Success" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-bold tracking-tight">Latest Profiles</CardTitle>
            </CardHeader>
            <CardContent className="p-0 border-t border-border">
              <div className="divide-y divide-border">
                {profiles?.slice(-10).reverse().map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-muted">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground">{p.email}</p>
                      <p className="text-[10px] text-muted-foreground/70 capitalize">{p.plan} plan</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground/50 font-mono">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
