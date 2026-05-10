import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("launchfast_profiles")
      .select("stripe_subscription_id")
      .eq("id", user.id)
      .single()

    if (!profile?.stripe_subscription_id) {
      return NextResponse.json({ error: "No subscription found" }, { status: 400 })
    }

    // Update to cancel at the end of the period
    await stripe.subscriptions.update(profile.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    // We don't update the profile to 'free' immediately.
    // The subscription is still active until the period ends.
    // We update the status to 'canceling' (optional) or just wait for the webhook.
    await supabase.from("launchfast_profiles").update({
      subscription_status: "canceling",
    }).eq("id", user.id)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 })
  }
}

