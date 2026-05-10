'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Something went wrong</h1>
          <p className="text-muted-foreground">
            We&apos;ve encountered an unexpected error. Our team has been notified and we&apos;re working to fix it.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try again
          </Button>
          <Button
            variant="outline"
            asChild
            className="w-full sm:w-auto gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Go home
            </Link>
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-muted rounded-lg text-left overflow-auto max-h-40">
            <p className="text-xs font-mono text-muted-foreground">{error.message}</p>
            {error.stack && (
              <pre className="mt-2 text-[10px] font-mono text-muted-foreground/70">
                {error.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
