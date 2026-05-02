import { useEffect } from "react"

import { Route, Routes } from "react-router-dom"

import { ReactLenis } from "lenis/react"

// importing pages
import LandingPage from "./pages/LandingPage"
import ErrorPage from "./pages/ErrorPage"
import AuthPage from "./pages/AuthPage"
import OTPVerification from "./pages/OTPVerification"
import ForgotPassword from "./pages/ForgotPassword"

import { checkAuth } from "./services/auth.service"
import { useUser } from "./zustand/useUser"

const App = () => {
  const { setUser, clearUser } = useUser((state) => state)

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await checkAuth()

        if (response.status === 200) {
          setUser(response.data.user)
        }
      } catch (error: any) {
        console.log("error is: ", error)
        localStorage.removeItem("token")
        clearUser()
      }
    }
    getUser()
  }, [])

  return (
    <div>
      <ReactLenis root />
      {/* defining routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}

export default App
