/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { createServerClient } from "@supabase/ssr"
import Stripe from "stripe"
import { PlanType } from "@/lib/stripe/plans"

const getPlanFromPriceId = (priceId: string): PlanType => {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) return "pro"
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID) return "business"
  return "free"
}

function createAdminSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("Webhook signature error:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  // 1. Idempotency check
  const { data: existingEvent } = await supabase
    .from("launchfast_webhook_events")
    .select("id, processed")
    .eq("stripe_event_id", event.id)
    .single()

  if (existingEvent?.processed) {
    return NextResponse.json({ received: true, alreadyProcessed: true })
  }

  // Record event if not exists
  if (!existingEvent) {
    await supabase.from("launchfast_webhook_events").insert({
      stripe_event_id: event.id,
      type: event.type,
    })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const priceId = session.metadata?.priceId
        if (!userId || !priceId) break

        const plan = getPlanFromPriceId(priceId)
        
        // If it's a subscription, get the end date
        let subscriptionPeriodEnd = null
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          subscriptionPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()
        }

        await supabase.from("launchfast_profiles").update({
          plan,
          stripe_customer_id: session.customer as string,
          subscription_status: "active",
          stripe_subscription_id: (session.subscription as string) || null,
          subscription_period_end: subscriptionPeriodEnd,
        }).eq("id", userId)
        break
      }


      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await supabase.from("launchfast_profiles").update({
          subscription_status: "past_due",
        }).eq("stripe_customer_id", invoice.customer as string)
        break
      }
    }

    // Mark as processed
    await supabase.from("launchfast_webhook_events")
      .update({ processed: true })
      .eq("stripe_event_id", event.id)

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error("Webhook handler error:", err)
    await supabase.from("launchfast_webhook_events")
      .update({ error: err.message })
      .eq("stripe_event_id", event.id)
    return NextResponse.json({ error: "Handler failed" }, { status: 500 })
  }
}
