import { useUser } from "@/zustand/useUser"
import { type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = useUser((state) => state.user)
  const navigate = useNavigate()

  if (!user) {
    // redirect to login page
    navigate("/auth?mode=login")
  }

  return children
}

export default ProtectedRoute
