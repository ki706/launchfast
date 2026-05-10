import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { groq, trackUsage } from '@/lib/ai/client'
import { getPlanFeatures } from '@/lib/stripe/plans'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    // 1. Check plan limits
    const { data: profile } = await supabase
      .from('launchfast_profiles')
      .select('plan, ai_tokens_used_this_month')
      .eq('id', user.id)
      .single()
      
    const features = getPlanFeatures(profile?.plan || 'free')
    const used = profile?.ai_tokens_used_this_month || 0
    
    if (features.aiTokensPerMonth !== -1 && used >= features.aiTokensPerMonth) {
      return NextResponse.json({ 
        error: "Monthly AI limit reached. Please upgrade your plan." 
      }, { status: 403 })
    }

    // 2. Execute Groq call
    if (!groq) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
    }

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama3-8b-8192', // Fast default
    })

    const responseText = completion.choices[0].message.content || ''
    
    // 3. Track usage (async)
    const tokensIn = completion.usage?.prompt_tokens || 0
    const tokensOut = completion.usage?.completion_tokens || 0
    
    // We don't await this to keep the response fast
    trackUsage({
      userId: user.id,
      model: 'groq-llama3-8b',
      tokensIn,
      tokensOut,
      costUsd: 0, // Groq is currently very cheap/free for many models
      endpoint: '/api/ai/chat'
    }).catch(err => console.error('Usage tracking error:', err))

    return NextResponse.json({ 
      message: responseText,
      usage: { tokensIn, tokensOut }
    })

  } catch (error: unknown) {
    console.error('AI Chat Error:', error)
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
