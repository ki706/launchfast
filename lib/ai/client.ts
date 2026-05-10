import Groq from 'groq-sdk'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { getPlanFeatures } from '@/lib/stripe/plans'

// Initialize clients if keys exist
export const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null
export const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null
export const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null

export type AIModel = 'groq' | 'claude' | 'gpt4'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function chat({
  userId,
}: {
  model: AIModel
  messages: ChatMessage[]
  userId: string
}) {
  const supabase = await createClient()
  
  // 1. Check user plan and usage
  const { data: profile, error: profileError } = await supabase
    .from('launchfast_profiles')
    .select('plan, ai_tokens_used_this_month')
    .eq('id', userId)
    .single()
    
  if (profileError || !profile) throw new Error('User profile not found or unauthorized')
  
  const features = getPlanFeatures(profile.plan || 'free')
  const used = profile.ai_tokens_used_this_month || 0
  
  if (features.aiTokensPerMonth !== -1 && used >= features.aiTokensPerMonth) {
    throw new Error('Monthly AI limit reached. Please upgrade your plan.')
  }

  // 2. Placeholder for model-specific logic
  // This will be fully implemented in the next steps with streaming support
  return { success: true, message: "AI layer initialized. Ready for implementation." }
}

export async function trackUsage({
  userId,
  model,
  tokensIn,
  tokensOut,
  costUsd,
  endpoint,
}: {
  userId: string
  model: string
  tokensIn: number
  tokensOut: number
  costUsd: number
  endpoint?: string
}) {
  const supabase = await createClient()
  
  // 1. Record detailed usage
  await supabase.from('launchfast_ai_usage').insert({
    user_id: userId,
    model,
    tokens_in: tokensIn,
    tokens_out: tokensOut,
    cost_usd: costUsd,
    endpoint,
  })
  
  // 2. Increment monthly total in profile
  const totalTokens = tokensIn + tokensOut
  const { data: profile } = await supabase
    .from('launchfast_profiles')
    .select('ai_tokens_used_this_month')
    .eq('id', userId)
    .single()
    
  const currentTotal = profile?.ai_tokens_used_this_month || 0
  
  await supabase.from('launchfast_profiles').update({
    ai_tokens_used_this_month: currentTotal + totalTokens,
    updated_at: new Date().toISOString(),
  }).eq('id', userId)
}
