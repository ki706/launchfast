import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { CommandPalette } from "@/components/dashboard/CommandPalette"

import { DemoBanner } from "@/components/dashboard/DemoBanner"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("launchfast_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const userForSidebar = {
    id: user.id,
    email: user.email,
    full_name: profile?.full_name || user.user_metadata?.full_name || "User",
    avatar_url: profile?.avatar_url || "",
    plan: profile?.plan || "free",
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DemoBanner />
      <div className="flex flex-1 bg-background">
        <Sidebar user={userForSidebar} />
        <CommandPalette />
        <div className="flex-1 flex flex-col min-w-0 lg:pl-0 pt-14 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  )
}
