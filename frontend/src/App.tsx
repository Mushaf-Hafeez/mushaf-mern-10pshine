import { Route, Routes } from "react-router-dom"

import { ReactLenis } from "lenis/react"

// importing pages
import LandingPage from "./pages/LandingPage"
import ErrorPage from "./pages/ErrorPage"
import AuthPage from "./pages/AuthPage"

const App = () => {
  return (
    <div>
      <ReactLenis root />
      {/* defining routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}

export default App
