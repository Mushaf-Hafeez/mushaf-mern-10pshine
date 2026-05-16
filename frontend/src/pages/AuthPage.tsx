import { Link, useSearchParams } from "react-router-dom"
import { logger } from "@/lib/logger"

// importing components
import Login from "@/components/custom/Login"
import Signup from "@/components/custom/Signup"

const AuthPage = () => {
  const [searchParams] = useSearchParams()

  const modeParam = searchParams.get("mode")?.toLowerCase()
  const isLogin: boolean = modeParam === "login"

  // Warn if invalid mode is provided
  if (modeParam && modeParam !== "login" && modeParam !== "signup") {
    logger.warn({ mode: modeParam }, "Invalid auth mode parameter provided")
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-900 text-white">
      {/* left gradient */}
      <span className="absolute -top-10 -left-20 z-1 h-96 w-1/2 rounded-full bg-primary/10 blur-3xl md:-left-60 md:h-screen"></span>
      {/* right gradient */}
      <span className="absolute top-100 -right-20 z-2 h-96 w-1/2 rounded-full bg-foreground/30 blur-3xl md:-right-60 md:h-screen"></span>

      {/* This will contains the login/signup form */}
      <div className="absolute top-1/2 left-1/2 z-5 h-fit w-10/12 max-w-md -translate-x-1/2 -translate-y-1/2 space-y-8 rounded-2xl bg-neutral-800/30 p-6 outline outline-neutral-800 backdrop-blur-md md:p-8">
        {/* tabs to switch login/signup */}
        <div className="space-x-4">
          <Link
            to={"/auth?mode=login"}
            className={`text-lg text-neutral-400 hover:text-white ${isLogin && "border-b-3 border-primary pb-3 font-semibold text-white"}`}
          >
            Login
          </Link>
          <Link
            to={"/auth?mode=signup"}
            className={`text-lg text-neutral-400 hover:text-white ${!isLogin && "border-b-3 border-primary pb-3 font-semibold text-white"}`}
          >
            Signup
          </Link>
        </div>

        {isLogin ? <Login /> : <Signup />}
      </div>
    </section>
  )
}

export default AuthPage
