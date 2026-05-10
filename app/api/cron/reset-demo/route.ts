import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error("Cron attempt failed: Unauthorized or CRON_SECRET missing");
    return new NextResponse('Unauthorized', { status: 401 });
  }


  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Find the demo user
  const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers()
  if (userError) return NextResponse.json({ error: userError.message }, { status: 500 })
  
  const demoUser = users.find(u => u.email === 'demo@launchfast.com')
  if (!demoUser) return NextResponse.json({ error: 'Demo user not found' }, { status: 404 })

  // 2. Reset the profile
  const { error: profileError } = await supabaseAdmin
    .from('launchfast_profiles')
    .update({
      full_name: 'Demo User',
      plan: 'pro',
      avatar_url: null,
      subscription_status: 'active',
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', demoUser.id)

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

  return NextResponse.json({ success: true, message: 'Demo account reset successfully' })
}
