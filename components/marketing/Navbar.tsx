"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-border py-3" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-foreground rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden relative">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill 
              className="object-cover"
              priority
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">LaunchFast</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link href="https://github.com/miftah-ab/launchfast" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            <GitHubIcon className="w-4 h-4" /> GitHub
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}
          <Link href="/login" className="text-sm font-medium text-foreground hover:opacity-80 transition-opacity">Log in</Link>
          <Button size="sm" className="h-9 px-4 text-xs font-bold uppercase tracking-widest" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] z-40 bg-background p-6 animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col gap-6">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-foreground">Features</Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-foreground">Pricing</Link>
            <Link href="https://github.com/miftah-ab/launchfast" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-foreground">GitHub</Link>
            <div className="h-px bg-border my-2" />
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-foreground">Log in</Link>
            <Button size="lg" className="w-full h-12 text-sm font-bold uppercase tracking-widest" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}
