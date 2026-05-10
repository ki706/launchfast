import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SettingsClient } from "@/components/dashboard/SettingsClient"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("launchfast_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const userForClient = {
    id: user.id,
    email: user.email,
    full_name: profile?.full_name || user.user_metadata?.full_name || "",
    avatar_url: profile?.avatar_url || "",
    plan: profile?.plan || "free",
  }

  return <SettingsClient user={userForClient} />
}
