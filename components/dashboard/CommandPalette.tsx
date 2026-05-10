"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Sparkles,
  Key,
  LogOut,
  Moon,
  Sun,
  Search,
} from "lucide-react"
import { Command } from "cmdk"
import { useTheme } from "next-themes"
import { createClient } from "@/lib/supabase/client"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-[640px] bg-card border border-border rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-border px-4">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <Command.Input
            placeholder="Type a command or search..."
            className="flex h-12 w-full bg-transparent py-3 text-sm outline-none text-foreground placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-muted">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
          
          <Command.Group heading="Navigation" className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Command.Item
              onSelect={() => runCommand(() => router.push("/dashboard"))}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/dashboard/ai"))}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent"
            >
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>AI Assistant</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/dashboard/billing"))}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent"
            >
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/dashboard/settings"))}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/dashboard/api-keys"))}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent"
            >
              <Key className="h-4 w-4" />
              <span>API Keys</span>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="h-px bg-border my-2" />

          <Command.Group heading="Preferences" className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Command.Item
              onSelect={() => runCommand(() => setTheme("light"))}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent"
            >
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => setTheme("dark"))}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent"
            >
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="h-px bg-border my-2" />

          <Command.Group heading="Account" className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Command.Item
              onSelect={() => runCommand(handleLogout)}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-red-400 hover:bg-red-500/10 aria-selected:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
        <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            LaunchFast Navigation <span className="text-muted-foreground/50 ml-1">v1.0.0</span>
          </p>
          <div className="flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-accent px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">ESC</kbd>
            <span className="text-[10px] text-muted-foreground/50">to close</span>
          </div>
        </div>
      </div>
    </Command.Dialog>
  )
}
