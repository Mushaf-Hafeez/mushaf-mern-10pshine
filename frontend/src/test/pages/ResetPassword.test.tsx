import { afterEach, describe, expect, it, vi } from "vitest"
import { waitFor } from "@testing-library/react"

import ResetPassword from "@/pages/ResetPassword"
import { render, screen } from "@/test/utils/test-utils"
import * as authService from "@/services/auth.service"

vi.mock("@/services/auth.service")
vi.mock("@/services/note.service")
vi.mock("@/services/profile.service")

const mockNavigate = vi.fn()
const mockClearUser = vi.fn()

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useParams: () => ({ token: "reset-token" }),
    useNavigate: () => mockNavigate,
  }
})

vi.mock("@/zustand/useUser", () => ({
  useUser: vi.fn((selector) =>
    selector({
      user: null,
      setUser: vi.fn(),
      clearUser: mockClearUser,
    })
  ),
}))

const validPassword = "Password1!"

describe("ResetPassword", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders password fields", () => {
    render(<ResetPassword />)
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it("validates empty submit", async () => {
    const { user } = render(<ResetPassword />)
    await user.click(screen.getByRole("button", { name: /reset password/i }))

    expect(
      await screen.findByText(/please confirm your password/i)
    ).toBeInTheDocument()
  })

  it("resets password successfully", async () => {
    vi.mocked(authService.resetPassword).mockResolvedValue({
      status: 200,
    } as Awaited<ReturnType<typeof authService.resetPassword>>)

    const { user } = render(<ResetPassword />)

    await user.type(screen.getByLabelText(/^password$/i), validPassword)
    await user.type(screen.getByLabelText(/confirm password/i), validPassword)
    await user.click(screen.getByRole("button", { name: /reset password/i }))

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith(
        "reset-token",
        validPassword,
        validPassword
      )
      expect(mockClearUser).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith("/auth?mode=login")
    })
  })

  it("shows error on failure", async () => {
    vi.mocked(authService.resetPassword).mockRejectedValue({
      message: "fail",
      response: { data: { message: "Invalid token" } },
    })

    const { user } = render(<ResetPassword />)

    await user.type(screen.getByLabelText(/^password$/i), validPassword)
    await user.type(screen.getByLabelText(/confirm password/i), validPassword)
    await user.click(screen.getByRole("button", { name: /reset password/i }))

    await waitFor(() => {
      expect(screen.getByText("Invalid token")).toBeInTheDocument()
    })
  })

  it("toggles password visibility", async () => {
    const { user } = render(<ResetPassword />)
    const password = screen.getByLabelText(/^password$/i)
    await user.click(password.parentElement?.querySelector("span")!)
    expect(password).toHaveAttribute("type", "text")
  })
})
