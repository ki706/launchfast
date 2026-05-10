import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { priceId } = await req.json()
    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
    }

    // Validate priceId against allowed prices
    const allowedPrices = [
      process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
    ]

    if (!allowedPrices.includes(priceId)) {
      return NextResponse.json({ error: "Invalid Price ID" }, { status: 400 })
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("launchfast_profiles")
      .select("stripe_customer_id, full_name")
      .eq("id", user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || undefined,
        metadata: { userId: user.id },
      })
      customerId = customer.id
      await supabase
        .from("launchfast_profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://launchfast-saas.vercel.app"

    // Retrieve price details to determine mode (payment vs subscription)
    const price = await stripe.prices.retrieve(priceId)
    const mode = price.type === 'recurring' ? 'subscription' : 'payment'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode,
      success_url: `${baseUrl}/dashboard/billing?success=true`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: { userId: user.id, priceId: priceId },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 })
  }
}
