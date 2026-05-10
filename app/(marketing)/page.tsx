import { Navbar } from "@/components/marketing/Navbar"
import { Hero } from "@/components/marketing/Hero"
import { Features } from "@/components/marketing/Features"
import { PricingCard } from "@/components/marketing/PricingCard"
import { Footer } from "@/components/marketing/Footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <PricingCard />
      </main>
      <Footer />
    </div>
  )
}
