/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("launchfast_profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ invoices: [] })
    }

    const invoices = await stripe.invoices.list({
      customer: profile.stripe_customer_id,
      limit: 10,
    })

    const formattedInvoices = (invoices as any).data.map((inv: any) => ({
      id: inv.id,
      date: new Date(inv.created * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      amount: `$${(inv.total / 100).toFixed(2)}`,
      status: inv.status,
      url: inv.invoice_pdf,
    }))

    return NextResponse.json({ invoices: formattedInvoices })
  } catch (error: unknown) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}
