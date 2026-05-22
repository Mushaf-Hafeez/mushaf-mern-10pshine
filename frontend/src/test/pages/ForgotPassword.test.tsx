import { afterEach, describe, expect, it, vi } from "vitest"
import { waitFor } from "@testing-library/react"

import ForgotPassword from "@/pages/ForgotPassword"
import { render, screen } from "@/test/utils/test-utils"
import * as authService from "@/services/auth.service"

vi.mock("@/services/auth.service")
vi.mock("@/services/note.service")
vi.mock("@/services/profile.service")

const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe("ForgotPassword", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders email field and submit button", () => {
    render(<ForgotPassword />)
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /get reset link/i })).toBeInTheDocument()
  })

  it("shows validation error for empty email", async () => {
    const { user } = render(<ForgotPassword />)
    await user.click(screen.getByRole("button", { name: /get reset link/i }))

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })

  it("shows success message on successful submit", async () => {
    vi.mocked(authService.forgotPassword).mockResolvedValue({
      status: 200,
    } as Awaited<ReturnType<typeof authService.forgotPassword>>)

    const { user } = render(<ForgotPassword />)

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@test.com")
    await user.click(screen.getByRole("button", { name: /get reset link/i }))

    await waitFor(() => {
      expect(screen.getByText(/reset password link has been sent/i)).toBeInTheDocument()
    })
  })

  it("shows error on failure", async () => {
    vi.mocked(authService.forgotPassword).mockRejectedValue({
      message: "fail",
      response: { data: { message: "User not found" } },
    })

    const { user } = render(<ForgotPassword />)

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@test.com")
    await user.click(screen.getByRole("button", { name: /get reset link/i }))

    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument()
    })
  })

  it("navigates back on go back click", async () => {
    const { user } = render(<ForgotPassword />)
    await user.click(screen.getByText(/go back/i))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
