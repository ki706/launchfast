import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: keys, error } = await supabase
    .from("launchfast_api_keys")
    .select("id, name, key_prefix, created_at, last_used_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ keys })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })

  // 1. Generate key
  const randomBytes = crypto.randomBytes(32).toString("hex")
  const key = `lf_${randomBytes}`
  const keyPrefix = key.slice(0, 8)
  const keyHash = crypto.createHash("sha256").update(key).digest("hex")

  // 2. Store hashed key
  const { error } = await supabase.from("launchfast_api_keys").insert({
    user_id: user.id,
    name,
    key_hash: keyHash,
    key_prefix: keyPrefix,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 3. Return plain text key (only time user will see it)
  return NextResponse.json({ key })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

  const { error } = await supabase
    .from("launchfast_api_keys")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
