import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPlanFeatures } from '@/lib/stripe/plans'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('launchfast_profiles')
      .select('plan, ai_tokens_used_this_month, ai_tokens_reset_at')
      .eq('id', user.id)
      .single()
      
    if (error || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const features = getPlanFeatures(profile.plan || 'free')
    
    return NextResponse.json({
      plan: profile.plan,
      used: profile.ai_tokens_used_this_month || 0,
      limit: features.aiTokensPerMonth,
      resetAt: profile.ai_tokens_reset_at,
    })

  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
