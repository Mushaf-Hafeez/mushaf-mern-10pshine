// importing components
import Navbar from "../components/custom/Navbar";
import Hero from "../components/custom/Hero";

const LandingPage = () => {
  return (
    <main className="h-screen w-full bg-neutral-900 text-white">
        <Navbar />
        <Hero />
    </main>
  )
}

export default LandingPage