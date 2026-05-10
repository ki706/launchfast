"use client"

import { useState, useEffect } from "react"
import { Key, Plus, Trash2, Copy, Check, Loader2, AlertCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"


interface APIKey {
  id: string
  name: string
  key_prefix: string
  created_at: string
  last_used_at: string | null
}

export function APIKeysClient() {
  const [keys, setKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [keyName, setKeyName] = useState("")
  const [creating, setCreating] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/keys")
      const data = await res.json()
      if (data.keys) setKeys(data.keys)
    } catch (err) {
      console.error("Failed to fetch keys:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!keyName.trim()) return
    setCreating(true)
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: keyName }),
      })
      const data = await res.json()
      if (data.key) {
        setNewKey(data.key)
        fetchKeys()
        setKeyName("")
      }
    } catch (err) {
      console.error("Failed to create key:", err)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/keys?id=${id}`, { method: "DELETE" })
      setKeys(prev => prev.filter(k => k.id !== id))
    } catch (err) {
      console.error("Failed to delete key:", err)
    }
  }

  const copyToClipboard = () => {
    if (!newKey) return
    navigator.clipboard.writeText(newKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Secret Keys</h2>
          <p className="text-sm text-muted-foreground">Manage API keys for programmatic access.</p>
        </div>
        <Button 
          onClick={() => setCreateOpen(true)}
          className="bg-white text-black hover:bg-white/90 h-9 text-xs font-bold uppercase tracking-widest gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Key
        </Button>
      </div>

      <Card className="bg-card border-border shadow-none">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Security First</span>
          </div>
          <CardTitle className="text-sm text-foreground">Active Keys</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Your secret keys provide full access to your account resources. Do not share them.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-20" />
              <p className="text-xs font-medium uppercase tracking-widest">Loading keys...</p>
            </div>
          ) : keys.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-[#333]" />
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">No API keys generated yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(255,255,255,0.06)]">
              {keys.map((key) => (
                <div key={key.id} className="p-4 flex items-center justify-between hover:bg-[#161616] transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{key.name}</span>
                      <Badge variant="outline" className="font-mono text-[10px] border-border text-muted-foreground">
                        {key.key_prefix}...
                      </Badge>
                    </div>
                    <p className="text-[10px] text-[#555] font-medium tracking-tight">
                      Created on {new Date(key.created_at).toLocaleDateString()} • {key.last_used_at ? `Last used ${new Date(key.last_used_at).toLocaleDateString()}` : "Never used"}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-[#555] hover:text-red-500 hover:bg-red-500/10 h-8 w-8"
                    onClick={() => handleDelete(key.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Key Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => {
        setCreateOpen(open)
        if (!open) {
          setNewKey(null)
          setKeyName("")
        }
      }}>
        <DialogContent className="bg-muted border-border text-foreground">
          <DialogHeader>
            <DialogTitle>{newKey ? "Secret Key Generated" : "Create New Secret Key"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {newKey ? "Copy this key and save it somewhere safe. You won't be able to see it again." : "Give your key a name to identify it later."}
            </DialogDescription>
          </DialogHeader>

          {newKey ? (
            <div className="space-y-4 py-4">
              <div className="relative">
                <Input 
                  readOnly 
                  value={newKey} 
                  className="bg-card border-border text-blue-400 font-mono pr-12 h-12"
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-white"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Save this key now. We do not store plain-text keys for your security.</span>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Key Name</label>
                <Input 
                  placeholder="e.g. Production API" 
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="bg-card border-border text-foreground h-11"
                  autoFocus
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {newKey ? (
              <Button onClick={() => setCreateOpen(false)} className="w-full bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest text-xs h-11">
                I&apos;ve Saved the Key
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setCreateOpen(false)} className="text-muted-foreground hover:text-white">Cancel</Button>
                <Button 
                  onClick={handleCreate} 
                  disabled={!keyName.trim() || creating}
                  className="bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest text-xs h-11"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Key"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
