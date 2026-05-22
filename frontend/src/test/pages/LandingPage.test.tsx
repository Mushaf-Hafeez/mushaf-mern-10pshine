import { describe, expect, it, vi } from "vitest"

import LandingPage from "@/pages/LandingPage"
import { render, screen } from "@/test/utils/test-utils"

vi.mock("@/zustand/useUser", () => ({
  useUser: vi.fn((selector) =>
    selector({ user: null, setUser: vi.fn(), clearUser: vi.fn() })
  ),
}))

describe("LandingPage", () => {
  it("renders landing sections", () => {
    render(<LandingPage />)

    expect(screen.getByText(/Your thoughts/i)).toBeInTheDocument()
    expect(screen.getByText("Engineered for Clarity")).toBeInTheDocument()
    expect(screen.getByText("Three steps to mastery")).toBeInTheDocument()
    expect(
      screen.getByText(/Ready to begin your focus journey/i)
    ).toBeInTheDocument()
  })
})
