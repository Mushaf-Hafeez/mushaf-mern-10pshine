import { Link } from "react-router-dom"

// importing shadcn components
import { Button } from "../ui/button"

const Navbar = () => {
  return (
    <header className="fixed top-4 left-1/2 flex w-full max-w-5xl -translate-x-1/2 items-center justify-between rounded-full bg-foreground/40 px-8 py-4 outline outline-neutral-800 backdrop-blur-md">
      <h2 className="cursor-pointer text-2xl font-bold">
        <Link to={"/"}>NoteFlow</Link>
      </h2>

      {/* Auth buttons */}
      <div className="flex items-center gap-4 text-sm">
        <Link
          to={"/login"}
          className="font-light text-neutral-400 transition-colors duration-100 hover:text-primary"
        >
          LOGIN
        </Link>

        <Button className="bg-secondary tracking-wider">
          <Link to={"/signup"}>GET STARTED</Link>
        </Button>
      </div>
    </header>
  )
}

export default Navbar
