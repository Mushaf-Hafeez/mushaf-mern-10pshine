import { Link } from "react-router-dom"
import { Button } from "../ui/button"

const CTA = () => {
  return (
    <section className="h-fit w-full px-4 py-10">
      <div className="relative mx-auto col-center h-fit max-w-5xl space-y-4 overflow-hidden rounded-2xl bg-secondary/30 p-8 text-center outline outline-border md:h-7/12 md:py-20">
        <span className="absolute top-40 -left-40 size-96 rounded-full bg-primary/15 blur-3xl"></span>
        <h2 className="text-2xl font-semibold md:text-5xl">
          Ready to begin your focus journey?
        </h2>
        <p className="text-md max-w-md md:text-lg">
          Join 50,000+ architects, developers, and writers who have found their
          sanctuary in NoteFlow.
        </p>
        <Button className="bg-primary p-4 tracking-wider text-primary-foreground">
          <Link to={"/auth?mode=signup"} className="text-xs md:text-sm">
            Start for Free
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default CTA
