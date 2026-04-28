// importing components
import Navbar from "../components/custom/Navbar"
import Hero from "../components/custom/Hero"
import Features from "@/components/custom/Features"
import Steps from "@/components/custom/Steps"
import CTA from "@/components/custom/CTA"
import Footer from "@/components/custom/Footer"

const LandingPage = () => {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-neutral-900 text-white">
      {/* left gradient */}
      <span className="absolute -top-10 -left-20 z-1 h-96 w-1/2 rounded-full bg-primary/10 blur-3xl md:-left-60 md:h-screen"></span>
      {/* right gradient */}
      <span className="absolute top-100 -right-20 z-2 h-96 w-1/2 rounded-full bg-foreground/30 blur-3xl md:-right-60 md:h-screen"></span>
      <Navbar />
      <Hero />
      <Features />
      <Steps />
      <CTA />
      <Footer />
    </main>
  )
}

export default LandingPage
