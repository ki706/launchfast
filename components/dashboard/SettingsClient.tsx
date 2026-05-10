"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Loader2, 
  Upload, 
  Smartphone, 
  Moon, 
  Sun,
  Lock,
  User,
  Palette
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/dashboard/Header"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface SettingsClientProps {
  user: {
    id: string
    email?: string
    full_name?: string
    avatar_url?: string
    plan?: string
  }
}

export function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "")
  const [fullName, setFullName] = useState(user.full_name || "")
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [mfaEnabled, setMfaEnabled] = useState(false)

  const initials = (user.full_name || user.email || "U")
    .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  const isDemoUser = user.email === "demo@launchfast.com"

  useEffect(() => {
    // Check MFA status
    const checkMFA = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (error) console.error("MFA check error:", error)
      if (data?.currentLevel === 'aal2') setMfaEnabled(true)
    }
    checkMFA()
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDemoUser) return
    const file = e.target.files?.[0]
    if (!file) return
    const supabase = createClient()
    const ext = file.name.split(".").pop()
    const path = `${user.id}/avatar.${ext}`
    
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true })
      
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" })
      return
    }
    
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path)
    await supabase.from("launchfast_profiles").update({ avatar_url: publicUrl }).eq("id", user.id)
    setAvatarUrl(publicUrl)
    toast({ title: "Avatar updated!", variant: "default" })
  }

  const handleProfileSave = async () => {
    if (isDemoUser) return
    setProfileLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("launchfast_profiles")
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq("id", user.id)
    setProfileLoading(false)
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Profile saved!", variant: "default" })
      router.refresh()
    }
  }

  const handlePasswordUpdate = async () => {
    if (isDemoUser) return
    setPasswordError(null)
    if (passwords.newPass.length < 8) {
      setPasswordError("Password must be at least 8 characters.")
      return
    }
    if (passwords.newPass !== passwords.confirm) {
      setPasswordError("Passwords do not match.")
      return
    }
    setPasswordLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: passwords.newPass })
    setPasswordLoading(false)
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Password updated!", variant: "default" })
      setPasswords({ current: "", newPass: "", confirm: "" })
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <Header title="Settings" userName={user.full_name} />
      <main className="flex-1 p-6 space-y-12 max-w-3xl mx-auto w-full">
        
        {/* Profile Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <User className="w-4 h-4" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Personal Information</h3>
          </div>
          
          <Card className="bg-card border-border shadow-none">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-20 h-20 border-2 border-border transition-opacity group-hover:opacity-80">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-xl bg-accent text-foreground">{initials}</AvatarFallback>
                  </Avatar>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full"
                  >
                    <Upload className="w-5 h-5 text-white" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">Profile Picture</h4>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-background border-border text-foreground h-10"
                    disabled={isDemoUser}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email address</Label>
                  <Input id="email" value={user.email || ""} disabled className="bg-background border-border text-muted-foreground/50 h-10" />
                </div>
              </div>

              <Button onClick={handleProfileSave} disabled={profileLoading || isDemoUser} className="bg-white text-black hover:bg-white/90 h-9 text-xs font-bold uppercase tracking-widest">
                {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Security Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Lock className="w-4 h-4" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Security & Privacy</h3>
          </div>

          <div className="space-y-4">
            {/* Password */}
            <Card className="bg-card border-border shadow-none overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold text-foreground">Account Password</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Update your login credentials.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">New Password</Label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
                      className="bg-background border-border" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Confirm Password</Label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      className="bg-background border-border" 
                    />
                  </div>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-500 font-medium">{passwordError}</p>
                )}
                <Button onClick={handlePasswordUpdate} disabled={passwordLoading || isDemoUser} variant="outline" className="h-9 text-xs font-bold uppercase tracking-widest border-border text-foreground">
                  {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                </Button>
              </CardContent>
            </Card>

            {/* MFA */}
            <Card className="bg-card border-border shadow-none">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Smartphone className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Two-Factor Authentication</h4>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <Button variant="outline" className="h-9 text-xs font-bold uppercase tracking-widest border-border text-foreground" asChild>
                  <a href="#">{mfaEnabled ? "Configure" : "Enable"}</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Appearance */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Palette className="w-4 h-4" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Interface Preferences</h3>
          </div>
          
          <Card className="bg-card border-border shadow-none">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Appearance Mode</h4>
                  <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
                </div>
              </div>
              <div className="flex bg-background p-1 rounded-md border border-border">
                <button 
                  onClick={() => setTheme('light')}
                  className={cn("px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all", theme === 'light' ? "bg-white text-black" : "text-muted-foreground/50 hover:text-muted-foreground")}
                >
                  Light
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={cn("px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all", theme === 'dark' ? "bg-white text-black" : "text-muted-foreground/50 hover:text-muted-foreground")}
                >
                  Dark
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Danger Zone */}
        <section className="pt-8">
          <Card className="bg-red-500/5 border-red-500/20 shadow-none">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-red-500">Delete Account</h4>
                <p className="text-xs text-red-500/60">Permanently remove your account and all data.</p>
              </div>
              <Button variant="destructive" className="h-9 text-xs font-bold uppercase tracking-widest bg-red-600 hover:bg-red-500">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
