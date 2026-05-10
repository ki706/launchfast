import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AIClient } from "@/components/dashboard/AIClient"
import { Header } from "@/components/dashboard/Header"

export const dynamic = "force-dynamic"

export default async function AIPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("launchfast_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex-1 flex flex-col bg-background">
      <Header title="AI Assistant" userName={profile?.full_name || "User"} />
      <main className="flex-1 overflow-hidden p-6">
        <AIClient 
          user={{
            id: user.id,
            plan: profile?.plan || "free",
            tokensUsed: profile?.ai_tokens_used_this_month || 0,
          }} 
        />
      </main>
    </div>
  )
}
