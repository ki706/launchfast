"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  LogOut,
  Zap,
  Menu,
  X,
  Sparkles,
  BarChart3,
  Key,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface SidebarProps {
  user: {
    id: string
    email?: string
    full_name?: string
    avatar_url?: string
    plan?: string
  }
}

const navSections = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/dashboard/ai", label: "AI Assistant", icon: Sparkles, badge: "AI" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
      { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
      { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
    ],
  },
]

const planColors: Record<string, string> = {
  free: "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50",
  pro: "border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
  business: "border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = (user.full_name || user.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const plan = user.plan || "free"

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card text-foreground">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center transition-transform group-hover:scale-105">
            <Zap className="w-4 h-4 text-background fill-background" />
          </div>
          <span className="text-lg font-bold tracking-tight">LaunchFast</span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 px-4 py-2 space-y-8 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items.map(({ href, label, icon: Icon, badge }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-4 h-4 shrink-0", active ? "text-accent-foreground" : "text-muted-foreground")} />
                      {label}
                    </div>
                    {badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/20">
                        {badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* User */}
      <div className="p-4 border-t border-border bg-muted">
        <div className="flex items-center gap-3 px-2 mb-4">
          <Avatar className="w-8 h-8 rounded border border-border">
            <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
            <AvatarFallback className="bg-accent text-foreground rounded text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-foreground">{user.full_name || "User"}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <div className={cn(
            "flex items-center justify-between px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-wider mb-2",
            planColors[plan]
          )}>
            <span>{plan} plan</span>
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-[10px] font-bold uppercase tracking-widest text-[#888880] hover:text-red-400 hover:bg-red-900/10 gap-2 h-8"
            onClick={handleLogout}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-[rgba(255,255,255,0.06)] shrink-0 h-screen sticky top-0 bg-[#0A0A0A]">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-[#0A0A0A] border-b border-[rgba(255,255,255,0.06)]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#F0EDE6] rounded flex items-center justify-center">
            <Zap className="w-4 h-4 text-black fill-black" />
          </div>
          <span className="font-bold text-sm tracking-tight text-[#F0EDE6]">LaunchFast</span>
        </Link>
        <Button variant="ghost" size="icon" className="text-[#F0EDE6]" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 z-50 flex flex-col w-64 h-full border-r border-[rgba(255,255,255,0.06)]">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
