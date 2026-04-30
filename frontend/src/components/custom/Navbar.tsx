import { Link } from "react-router-dom"

// importing shadcn components
import { Button } from "../ui/button"

const Navbar = () => {
  return (
    <header className="fixed top-4 left-1/2 z-50 flex w-xs -translate-x-1/2 items-center justify-between rounded-full bg-foreground/40 px-6 py-4 outline outline-neutral-800 backdrop-blur-md md:w-3xl lg:w-5xl">
      <h2 className="cursor-pointer text-lg font-bold md:text-2xl">
        <Link to={"/"}>NoteFlow</Link>
      </h2>

      {/* Auth buttons */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          to={"/auth?mode=login"}
          className="text-xs font-light text-neutral-400 transition-colors duration-100 hover:text-primary md:text-sm"
        >
          LOGIN
        </Link>

        <Button className="bg-secondary text-xs tracking-wider md:text-sm">
          <Link to={"/auth?mode=signup"}>GET STARTED</Link>
        </Button>
      </div>
    </header>
  )
}

export default Navbar
