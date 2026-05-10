"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, Loader2, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getPlanFeatures } from "@/lib/stripe/plans"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AIClientProps {
  user: {
    id: string
    plan: string
    tokensUsed: number
  }
}

export function AIClient({ user }: AIClientProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tokensUsed, setTokensUsed] = useState(user.tokensUsed)
  const [error, setError] = useState<string | null>(null)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const features = getPlanFeatures(user.plan)
  const limit = features.aiTokensPerMonth

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: "groq",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response")
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.message }])
      
      // Update usage estimate (real usage syncs via webhook/API)
      if (data.usage) {
        setTokensUsed(prev => prev + data.usage.tokensIn + data.usage.tokensOut)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      setMessages(prev => prev.slice(0, -1)) // Remove the user message on error
    } finally {
      setIsLoading(false)
    }
  }

  const usagePercentage = limit === -1 ? 0 : Math.min(100, (tokensUsed / limit) * 100)

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-5xl mx-auto">
      {/* Top Status */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-600/10 text-blue-400 border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Groq Llama-3
          </Badge>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {limit === -1 ? "Unlimited Tokens" : `${tokensUsed.toLocaleString()} / ${limit.toLocaleString()} tokens`}
          </span>
        </div>
        {limit !== -1 && (
          <div className="w-32 h-1 bg-accent rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500",
                usagePercentage > 90 ? "bg-red-500" : usagePercentage > 70 ? "bg-amber-500" : "bg-blue-500"
              )} 
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        )}
      </div>

      <Card className="flex-1 bg-muted border-border overflow-hidden flex flex-col shadow-none">
        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#1A1A1A]"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">How can I help you today?</h3>
                <p className="text-xs text-muted-foreground max-w-xs">Ask anything about your projects, code, or just chat. LaunchFast AI is ready.</p>
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex gap-4 max-w-3xl",
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-border",
                  m.role === "user" ? "bg-accent" : "bg-blue-600/10"
                )}>
                  {m.role === "user" ? <User className="w-4 h-4 text-muted-foreground" /> : <Sparkles className="w-4 h-4 text-blue-500" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  m.role === "user" 
                    ? "bg-white text-black" 
                    : "bg-card text-foreground border border-border"
                )}>
                  {m.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-4 mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-border flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border h-12 w-32" />
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-background border-t border-border">
          <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message LaunchFast AI..."
              className="w-full bg-card border border-border focus:border-blue-500/50 rounded-xl py-3 pl-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all outline-none"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              size="icon" 
              className="absolute right-1.5 top-1.5 h-8 w-8 bg-blue-600 hover:bg-blue-500 disabled:bg-accent transition-colors rounded-lg"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </form>
          <p className="mt-3 text-center text-[10px] text-[#555] font-medium tracking-tight">
            LaunchFast AI can make mistakes. Check important info.
          </p>
        </div>
      </Card>
    </div>
  )
}
