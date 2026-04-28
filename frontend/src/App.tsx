import { Route, Routes } from "react-router-dom"

// importing pages
import LandingPage from "./pages/LandingPage"
import ErrorPage from "./pages/ErrorPage"

const App = () => {
  return (
    <div>
      {/* defining routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}

export default App
