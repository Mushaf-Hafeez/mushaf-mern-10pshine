import { describe, expect, it, vi } from "vitest"

import AuthPage from "@/pages/AuthPage"
import { render, screen } from "@/test/utils/test-utils"

vi.mock("@/services/auth.service")
vi.mock("@/services/note.service")
vi.mock("@/services/profile.service")

vi.mock("@/zustand/useUser", () => ({
  useUser: vi.fn((selector) =>
    selector({ user: null, setUser: vi.fn(), clearUser: vi.fn() })
  ),
}))

describe("AuthPage", () => {
  it("renders login form when mode is login", () => {
    render(<AuthPage />, {
      routerProps: { initialEntries: ["/auth?mode=login"] },
    })

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
  })

  it("renders signup form when mode is signup", () => {
    render(<AuthPage />, {
      routerProps: { initialEntries: ["/auth?mode=signup"] },
    })

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /create your account/i })
    ).toBeInTheDocument()
  })

  it("defaults to signup for unknown mode", () => {
    render(<AuthPage />, {
      routerProps: { initialEntries: ["/auth?mode=invalid"] },
    })

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
  })
})
