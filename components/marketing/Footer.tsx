import Link from "next/link"
import { Zap } from "lucide-react"

const footerLinks = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
]

export function Footer() {
  return (
    <footer className="border-t border-border py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center transition-transform group-hover:scale-105">
                <Zap className="w-4 h-4 text-background fill-background" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">LaunchFast</span>
            </Link>
            <p className="text-sm text-muted-foreground font-medium tracking-tight">The only Next.js starter built for the AI era.</p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-8">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            © {new Date().getFullYear()} LaunchFast. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
              Built with Next.js & Supabase
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
              Developed by <a href="https://addus-five.vercel.app" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">Addus</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
