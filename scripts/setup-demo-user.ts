/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDemoUser() {
  console.log('Setting up demo user...')

  const email = 'demo@launchfast.com'
  const password = 'demo123456'

  // 1. Check if user already exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.error('Error listing users:', listError.message)
    return
  }

  let demoUser = users.find(u => u.email === email)

  if (!demoUser) {
    console.log('Creating demo user...')
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Demo User' }
    })

    if (createError) {
      console.error('Error creating user:', createError.message)
      return
    }
    demoUser = user as any
    console.log('Demo user created!')
  } else {
    console.log('Demo user already exists.')
  }

  if (demoUser) {
    console.log('Setting up demo profile...')
    
    // Set current_period_end to 1 year from now
    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    const { error: profileError } = await supabase
      .from('launchfast_profiles')
      .upsert({
        id: demoUser.id,
        full_name: 'Demo User',
        plan: 'pro',
        subscription_status: 'active',
        current_period_end: oneYearFromNow.toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Error updating profile:', profileError.message)
    } else {
      console.log('Demo profile setup complete!')
    }
  }
}

setupDemoUser()
