"use client"

import { useState, useEffect } from "react"
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Header } from "@/components/dashboard/Header"
import { useToast } from "@/hooks/use-toast"

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  business: "Business",
}

interface Invoice {
  id: string
  date: string
  amount: string
  status: string
  url: string
}

interface BillingClientProps {
  profile: {
    id: string
    email?: string | null
    plan: string
    subscription_status: string | null
    subscription_period_end: string | null
    stripe_subscription_id: string | null
    stripe_customer_id: string | null
  }
  successParam?: boolean
}

export function BillingClient({ profile, successParam }: BillingClientProps) {
  const { toast } = useToast()
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invoicesLoading, setInvoicesLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("/api/stripe/invoices")
        const data = await res.json()
        if (data.invoices) setInvoices(data.invoices)
      } catch (err) {
        console.error("Error fetching invoices:", err)
      } finally {
        setInvoicesLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  const plan = profile.plan || "free"
  const renewalDate = profile.subscription_period_end
    ? new Date(profile.subscription_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null

  const isDemoUser = profile.email === "demo@launchfast.com"

  const handleCheckout = async (priceId: string) => {
    if (isDemoUser) {
      toast({ title: "Demo Mode", description: "Payments are disabled for the demo account.", variant: "destructive" })
      return
    }
    if (!priceId || priceId === "price_pro" || priceId === "price_business") {
      toast({
        title: "Configuration Required",
        description: "Please add your real Stripe Price IDs to the .env file to enable checkout.",
        variant: "destructive",
      })
      return
    }
    setCheckoutLoading(priceId)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({ title: "Error", description: err.message, variant: "destructive" })
      } else {
        toast({ title: "Error", description: "An unknown error occurred", variant: "destructive" })
      }
      setCheckoutLoading(null)
    }
  }



  return (
    <div className="flex-1 flex flex-col">
      <Header title="Billing" />
      <main className="flex-1 p-6 space-y-6 max-w-3xl">

        {/* Demo banner */}
        {isDemoUser ? (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            👋 <strong>This is a demo subscription</strong> - No real charges will be made. Sign up for a real account to manage your own billing.
          </div>
        ) : (
          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
            🧪 <strong>Demo mode</strong> - Use card <code className="font-mono bg-blue-100 dark:bg-blue-900 rounded px-1">4242 4242 4242 4242</code> · Any future expiry · Any CVC
          </div>
        )}

        {successParam && (
          <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 px-4 py-3 flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Payment successful! Your plan has been upgraded.
          </div>
        )}

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
              <Badge variant={plan !== "free" ? "success" : "outline"}>
                {plan !== "free" 
                  ? (profile.stripe_subscription_id ? "Subscription" : "Lifetime Access") 
                  : "Free"}
              </Badge>
            </div>
            <CardDescription>Your current plan and billing details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Plan</span>
              <span className="font-semibold">{PLAN_LABELS[plan] || plan}</span>
            </div>
            {renewalDate && (
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Renewal Date</span>
                <span className="font-semibold">{renewalDate}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="font-semibold flex items-center gap-1.5">
                {plan !== "free"
                  ? <><CheckCircle className="w-4 h-4 text-green-500" /> {profile.stripe_subscription_id ? "Active" : "Owned"}</>
                  : <><AlertCircle className="w-4 h-4 text-muted-foreground" /> No plan</>
                }
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade options for free users */}
        {plan === "free" && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade your plan</CardTitle>
              <CardDescription>Choose a plan that fits your needs</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  name: "Pro",
                  price: "$49 one-time",
                  priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_pro",
                  features: ["Unlimited projects", "Up to 10 team members", "Advanced analytics", "Priority support"],
                  color: "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                },
                {
                  name: "Business",
                  price: "$149 one-time",
                  priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || "price_business",
                  features: ["Everything in Pro", "Unlimited team members", "White-label", "SLA guarantee"],
                  color: "border-purple-500 bg-purple-50 dark:bg-purple-950/20",
                },
              ].map((p) => (
                <div key={p.name} className={`rounded-xl border-2 p-5 ${p.color}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <span className="font-bold text-foreground">{p.price}</span>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => handleCheckout(p.priceId)}
                    disabled={checkoutLoading === p.priceId || isDemoUser}
                  >
                    {checkoutLoading === p.priceId
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading…</>
                      : `Start ${p.name}`}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Payment history */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {invoicesLoading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground italic">
                        <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                        Loading invoices...
                      </td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground italic">
                        No invoices found.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2">{inv.date}</td>
                        <td className="py-3 px-2 font-medium">{inv.amount}</td>
                        <td className="py-3 px-2">
                          <Badge variant={inv.status === "paid" ? "success" : "outline"} className="capitalize">
                            {inv.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          {inv.url ? (
                            <a 
                              href={inv.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-xs font-medium inline-flex items-center gap-1"
                            >
                              Download <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">...</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
