// importing components
import Navbar from "../components/custom/Navbar"
import Hero from "../components/custom/Hero"
import Features from "@/components/custom/Features"

const LandingPage = () => {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-neutral-900 text-white">
      {/* left gradient */}
      <span className="absolute -top-10 -left-60 z-1 h-screen w-1/2 rounded-full bg-primary/10 blur-3xl"></span>
      {/* right gradient */}
      <span className="absolute top-[400px] -right-60 z-2 h-screen w-1/2 rounded-full bg-foreground/30 blur-3xl"></span>
      <Navbar />
      <Hero />
      <Features />
    </main>
  )
}

export default LandingPage
