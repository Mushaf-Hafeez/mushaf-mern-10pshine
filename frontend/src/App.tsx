import { useEffect } from "react"

import { Route, Routes } from "react-router-dom"

import { ReactLenis } from "lenis/react"

// importing pages
import LandingPage from "./pages/LandingPage"
import ErrorPage from "./pages/ErrorPage"
import AuthPage from "./pages/AuthPage"
import OTPVerification from "./pages/OTPVerification"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Notes from "./pages/NotesPage"
import ProtectedRoute from "./components/custom/ProtectedRoute"
import Layout from "./pages/Layout"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import CreateNotePage from "./pages/CreateNotePage"
import EditNotePage from "./pages/EditNotePage"

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
    if (localStorage.getItem("token")) {
      getUser()
    }
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
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/notes/create"
          element={
            <ProtectedRoute>
              <CreateNotePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/edit/:id"
          element={
            <ProtectedRoute>
              <EditNotePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Notes />} />
          <Route path="notes" element={<Notes />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}

export default App
