import { NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // 1. Get profile to find Stripe subscription
    const { data: profile } = await supabase
      .from("launchfast_profiles")
      .select("stripe_subscription_id")
      .eq("id", user.id)
      .single()

    // 2. Cancel Stripe subscription if exists
    if (profile?.stripe_subscription_id) {
      try {
        await stripe.subscriptions.cancel(profile.stripe_subscription_id)
      } catch (stripeError) {
        console.error("Error canceling Stripe subscription during account deletion:", stripeError)
        // Continue anyway to ensure account is deleted
      }
    }

    // 3. Delete user from auth.users (this will cascade to profiles)
    const supabaseAdmin = await createServiceClient()
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteError) {
      throw new Error(`Failed to delete user: ${deleteError.message}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Account deletion error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 })
  }
}

