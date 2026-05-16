import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { logger } from "./lib/logger.ts"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter } from "react-router-dom"

window.onerror = (message, source, lineno, colno, error) => {
  logger.error(
    {
      message,
      source,
      lineno,
      colno,
      error,
    },
    "Global Error"
  )
}

window.onunhandledrejection = (event) => {
  logger.error(event.reason, "Unhandled Promise Rejection")
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
)
