import { Link } from "react-router-dom"

import { ArrowRight } from "lucide-react"

// importing shadcn components
import { Button } from "../ui/button"

const Hero = () => {
  return (
    <section className="flex-center h-screen w-full overflow-hidden py-10">
      <div className="col-center max-w-5xl gap-4">
        {/* Title */}
        <h1 className="text-center text-7xl font-bold">
          Your thoughts,{" "}
          <span className="text-gradient">
            organized
            <br />
            beautifully
          </span>
        </h1>

        {/* text */}
        <p className="w-3/4 text-center">
          A minimal, powerful note-taking experience built for focus. Reject the
          clutter and embrace the nocturnal workspace designed for architects of
          ideas.
        </p>

        {/* CTA */}
        <Button className="bg-secondary p-4 tracking-wider">
          <Link to={"/signup"} className="flex items-center gap-2">
            GET STARTED <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default Hero
