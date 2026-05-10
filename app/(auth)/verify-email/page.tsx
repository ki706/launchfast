"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mail, RefreshCw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email")
  const [countdown, setCountdown] = useState(0)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResend = async () => {
    const supabase = createClient()
    let email = emailParam

    if (!email) {
      const { data: { user } } = await supabase.auth.getUser()
      email = user?.email || null
    }

    if (email) {
      await supabase.auth.resend({ type: "signup", email })
      setSent(true)
      setCountdown(60)
    } else {
      window.location.href = "/login"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950/20 px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">LaunchFast</span>
        </Link>

        <div className="bg-card border border-border rounded-xl shadow-sm p-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold mb-3">Check your inbox</h1>
          <p className="text-muted-foreground mb-8">
            We sent a verification link to your email address. Click it to activate your account and get started.
          </p>

          {sent && (
            <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-600 dark:text-green-400">
              Email resent! Check your inbox.
            </div>
          )}

          <Button
            onClick={handleResend}
            disabled={countdown > 0}
            variant="outline"
            className="w-full mb-4"
          >
            <RefreshCw className="w-4 h-4" />
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend verification email"}
          </Button>

          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Zap className="w-8 h-8 text-blue-600 animate-pulse" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}

