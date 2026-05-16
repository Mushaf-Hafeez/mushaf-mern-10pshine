import { useUser } from "@/zustand/useUser"
import { type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { logger } from "@/lib/logger"

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = useUser((state) => state.user)
  const navigate = useNavigate()

  if (!user) {
    logger.warn({}, "Unauthorized access attempt to protected route")
    // redirect to login page
    navigate("/auth?mode=login")
  }

  return children
}

export default ProtectedRoute
