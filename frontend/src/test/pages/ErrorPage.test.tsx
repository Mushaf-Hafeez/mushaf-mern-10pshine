import { describe, expect, it } from "vitest"

import ErrorPage from "@/pages/ErrorPage"
import { render, screen } from "@/test/utils/test-utils"

describe("ErrorPage", () => {
  it("renders 404 message", () => {
    render(<ErrorPage />)
    expect(screen.getByText(/404 Page not found/i)).toBeInTheDocument()
  })
})
