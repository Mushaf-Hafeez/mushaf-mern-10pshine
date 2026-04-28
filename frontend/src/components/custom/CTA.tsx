import { Link } from "react-router-dom"
import { Button } from "../ui/button"

const CTA = () => {
  return (
    <section className="h-fit w-full px-4 py-10">
      <div className="relative mx-auto col-center h-fit max-w-5xl space-y-4 overflow-hidden rounded-2xl bg-neutral-800/30 p-8 text-center outline outline-neutral-800 md:h-7/12 md:py-20">
        <span className="absolute top-40 -left-40 size-96 rounded-full bg-primary/15 blur-3xl"></span>
        {/* title */}
        <h2 className="text-2xl font-semibold md:text-5xl">
          Ready to begin your focus journey?
        </h2>
        <p className="text-md max-w-md md:text-lg">
          Join 50,000+ architects, developers, and writers who have found their
          sanctuary in NoteFlow.
        </p>
        <Button className="bg-secondary p-4 tracking-wider">
          <Link to={"/signup"} className="text-xs md:text-sm">
            Start for Free
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default CTA
