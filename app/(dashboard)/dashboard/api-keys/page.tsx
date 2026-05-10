import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { APIKeysClient } from "@/components/dashboard/APIKeysClient"
import { Header } from "@/components/dashboard/Header"

export const dynamic = "force-dynamic"

export default async function APIKeysPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("launchfast_profiles")
    .select("plan")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex-1 flex flex-col bg-background">
      <Header title="API Keys" userName={user.user_metadata?.full_name || "User"} />
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <APIKeysClient user={{ id: user.id, plan: profile?.plan || "free" }} />
      </main>
    </div>
  )
}
