import { Link, useSearchParams } from "react-router-dom"
import { logger } from "@/lib/logger"

import Login from "@/components/custom/Login"
import Signup from "@/components/custom/Signup"

const AuthPage = () => {
  const [searchParams] = useSearchParams()

  const modeParam = searchParams.get("mode")?.toLowerCase()
  const isLogin: boolean = modeParam === "login"

  if (modeParam && modeParam !== "login" && modeParam !== "signup") {
    logger.warn({ mode: modeParam }, "Invalid auth mode parameter provided")
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-card text-foreground">
      {/* left gradient */}
      <span className="absolute -top-10 -left-20 z-10 h-96 w-1/2 rounded-full bg-primary/10 blur-3xl md:-left-60 md:h-screen" />

      {/* right gradient */}
      <span className="absolute top-100 -right-20 z-2 h-96 w-1/2 rounded-full bg-primary/10 blur-3xl md:-right-60 md:h-screen" />

      <div className="absolute top-1/2 left-1/2 z-50 h-fit w-10/12 max-w-md -translate-x-1/2 -translate-y-1/2 space-y-8 rounded-2xl bg-secondary/30 p-6 outline outline-border backdrop-blur-md md:p-8">
        <div className="space-x-4">
          <Link
            to="/auth?mode=login"
            className={`text-lg transition-all duration-200 hover:text-foreground ${
              isLogin
                ? "border-b-2 border-primary pb-3 font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Login
          </Link>

          <Link
            to="/auth?mode=signup"
            className={`text-lg transition-all duration-200 hover:text-foreground ${
              !isLogin
                ? "border-b-2 border-primary pb-3 font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
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
