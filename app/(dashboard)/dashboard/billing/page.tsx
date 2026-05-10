import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BillingClient } from "@/components/dashboard/BillingClient"

export const dynamic = "force-dynamic"


export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("launchfast_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const params = await searchParams
  const success = params?.success === "true"

  return (
    <BillingClient
      profile={{
        id: user.id,
        email: user.email,
        plan: profile?.plan || "free",
        subscription_status: profile?.subscription_status || null,
        subscription_period_end: profile?.subscription_period_end || null,
        stripe_subscription_id: profile?.stripe_subscription_id || null,
        stripe_customer_id: profile?.stripe_customer_id || null,
      }}
      successParam={success}
    />
  )
}
