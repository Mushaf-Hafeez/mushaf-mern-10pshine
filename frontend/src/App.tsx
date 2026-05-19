import { lazy, Suspense, useEffect } from "react"

import { Route, Routes } from "react-router-dom"

import { ReactLenis } from "lenis/react"

import Spinner from "./components/custom/Spinner"
import ProtectedRoute from "./components/custom/ProtectedRoute"
import { logger } from "./lib/logger"

import { checkAuth } from "./services/auth.service"
import { useUser } from "./zustand/useUser"

// lazy loading pages
const LandingPage = lazy(() => import("./pages/LandingPage"))
const ErrorPage = lazy(() => import("./pages/ErrorPage"))
const AuthPage = lazy(() => import("./pages/AuthPage"))
const OTPVerification = lazy(() => import("./pages/OTPVerification"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const ResetPassword = lazy(() => import("./pages/ResetPassword"))
const Notes = lazy(() => import("./pages/NotesPage"))
const Layout = lazy(() => import("./pages/Layout"))
const ProfilePage = lazy(() => import("./pages/ProfilePage"))
const SettingsPage = lazy(() => import("./pages/SettingsPage"))
const NotePage = lazy(() => import("./pages/NotePage"))
const CreateNotePage = lazy(() => import("./pages/CreateNotePage"))
const EditNotePage = lazy(() => import("./pages/EditNotePage"))

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
        logger.error({ error: error.message }, "Failed to check auth")
        clearUser()
      }
    }

    getUser()
  }, [])

  return (
    <div>
      <ReactLenis root />

      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-background">
            <Spinner />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/auth" element={<AuthPage />} />

          <Route path="/otp-verification" element={<OTPVerification />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/notes/:id"
            element={
              <ProtectedRoute>
                <NotePage />
              </ProtectedRoute>
            }
          />

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

            <Route path="profile" element={<ProfilePage />} />

            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
