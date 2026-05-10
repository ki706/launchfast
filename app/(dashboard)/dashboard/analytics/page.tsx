import { Header } from "@/components/dashboard/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  TrendingUp, 
  MousePointer2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Globe,
  Smartphone
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const mockStats = [
  {
    label: "Total Visitors",
    value: "12,482",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    label: "Conversion Rate",
    value: "3.2%",
    change: "+0.8%",
    trend: "up",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    label: "Avg. Session Duration",
    value: "4m 32s",
    change: "-2.1%",
    trend: "down",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    label: "Click-Through Rate",
    value: "18.4%",
    change: "+4.2%",
    trend: "up",
    icon: MousePointer2,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
]

const realStats = [
  { label: "Total Visitors", value: "0", change: "0%", trend: "up", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Conversion Rate", value: "0%", change: "0%", trend: "up", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Avg. Session Duration", value: "0s", change: "0%", trend: "up", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Click-Through Rate", value: "0%", change: "0%", trend: "up", icon: MousePointer2, color: "text-purple-500", bg: "bg-purple-500/10" },
]

const mockActivity = [
  { id: 1, event: "New signup from USA", time: "2 mins ago", icon: Globe },
  { id: 2, event: "Pro plan purchased", time: "15 mins ago", icon: ArrowUpRight },
  { id: 3, event: "Dashboard session started", time: "1 hour ago", icon: Smartphone },
  { id: 4, event: "Support ticket resolved", time: "3 hours ago", icon: Activity },
]

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const isDemoUser = user.email === "demo@launchfast.com"
  const stats = isDemoUser ? mockStats : realStats
  const recentActivity = isDemoUser ? mockActivity : []
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Analytics" />
      <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border bg-card/50 backdrop-blur-sm shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.change}
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Placeholder */}
          <Card className="lg:col-span-2 border-border bg-card/50 backdrop-blur-sm shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Daily active users over the last 30 days</CardDescription>
                </div>
                <div className="flex bg-muted p-1 rounded-md">
                  <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-background text-foreground rounded shadow-sm">30D</button>
                  <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">90D</button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[300px] flex items-end justify-between gap-2 pt-6">
              {(isDemoUser ? [40, 60, 45, 70, 55, 80, 65, 90, 75, 100, 85, 95, 70, 60, 80] : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]).map((h, i) => (
                <div 
                  key={i} 
                  className="w-full bg-blue-600/20 rounded-t-sm relative group transition-all hover:bg-blue-600/40"
                  style={{ height: `${Math.max(h, 2)}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h * (isDemoUser ? 12 : 0)} Users
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border bg-card/50 backdrop-blur-sm shadow-none">
            <CardHeader>
              <CardTitle>Live Feed</CardTitle>
              <CardDescription>Real-time events and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {recentActivity.length > 0 ? recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center">
                  <Activity className="w-8 h-8 text-muted mx-auto mb-2 opacity-20" />
                  <p className="text-xs text-muted-foreground">No recent activity</p>
                </div>
              )}
              <button className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg transition-colors">
                View All Activity
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-border bg-card/50 backdrop-blur-sm shadow-none">
            <CardHeader>
              <CardTitle>Browser Usage</CardTitle>
              <CardDescription>Distribution of user browser agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(isDemoUser ? [
                { label: "Chrome", value: "65%", color: "bg-blue-500" },
                { label: "Safari", value: "22%", color: "bg-blue-300" },
                { label: "Firefox", value: "8%", color: "bg-orange-500" },
                { label: "Edge", value: "5%", color: "bg-blue-600" },
              ] : [
                { label: "No data available", value: "0%", color: "bg-muted" },
              ]).map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground">{item.value}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm shadow-none">
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Where your traffic is coming from</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isDemoUser ? [
                { label: "Google", value: "4,281", percent: "45%" },
                { label: "Direct", value: "2,194", percent: "25%" },
                { label: "Twitter / X", value: "1,248", percent: "15%" },
                { label: "GitHub", value: "892", percent: "10%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-foreground">{item.value}</span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">{item.percent}</span>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center border border-dashed border-border rounded-lg">
                  <p className="text-xs text-muted-foreground">Waiting for traffic...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
