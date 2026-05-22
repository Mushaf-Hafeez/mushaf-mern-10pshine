import { afterEach, describe, expect, it, vi } from "vitest"
import { waitFor } from "@testing-library/react"

import Signup from "@/components/custom/Signup"
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

vi.mock("@/zustand/useUser", () => ({
  useUser: vi.fn((selector) =>
    selector({
      user: null,
      setUser: vi.fn(),
      clearUser: vi.fn(),
    })
  ),
}))

const validPassword = "Password1!"

describe("Signup", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders all signup fields", () => {
    render(<Signup />)
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it("shows validation errors on empty submit", async () => {
    const { user } = render(<Signup />)
    await user.click(screen.getByRole("button", { name: /create your account/i }))

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
  })

  it("submits OTP request and navigates on success", async () => {
    vi.mocked(authService.OTP).mockResolvedValue({ status: 200 } as Awaited<
      ReturnType<typeof authService.OTP>
    >)

    const { user } = render(<Signup />)

    await user.type(screen.getByLabelText(/^name$/i), "Test User")
    await user.type(screen.getByLabelText(/email address/i), "test@test.com")
    await user.type(screen.getByLabelText(/^password$/i), validPassword)
    await user.type(screen.getByLabelText(/confirm password/i), validPassword)
    await user.click(screen.getByRole("button", { name: /create your account/i }))

    await waitFor(() => {
      expect(authService.OTP).toHaveBeenCalled()
      expect(localStorage.getItem("otp-email")).toBe("test@test.com")
      expect(mockNavigate).toHaveBeenCalledWith("/otp-verification")
    })
  })

  it("shows error on OTP failure", async () => {
    vi.mocked(authService.OTP).mockRejectedValue({
      message: "fail",
      response: { data: { message: "Email already exists" } },
    })

    const { user } = render(<Signup />)

    await user.type(screen.getByLabelText(/^name$/i), "Test User")
    await user.type(screen.getByLabelText(/email address/i), "test@test.com")
    await user.type(screen.getByLabelText(/^password$/i), validPassword)
    await user.type(screen.getByLabelText(/confirm password/i), validPassword)
    await user.click(screen.getByRole("button", { name: /create your account/i }))

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument()
    })
  })

  it("toggles password visibility", async () => {
    const { user } = render(<Signup />)
    const password = screen.getByLabelText(/^password$/i)
    await user.click(password.parentElement?.querySelector("span")!)
    expect(password).toHaveAttribute("type", "text")
  })

  it("toggles confirm password visibility", async () => {
    const { user } = render(<Signup />)
    const confirm = screen.getByLabelText(/confirm password/i)
    await user.click(confirm.parentElement?.querySelector("span")!)
    expect(confirm).toHaveAttribute("type", "text")
  })

  it("shows mismatch error when passwords differ", async () => {
    const { user } = render(<Signup />)
    await user.type(screen.getByLabelText(/^name$/i), "Test User")
    await user.type(screen.getByLabelText(/email address/i), "test@test.com")
    await user.type(screen.getByLabelText(/^password$/i), validPassword)
    await user.type(screen.getByLabelText(/confirm password/i), "Password2!")
    await user.click(screen.getByRole("button", { name: /create your account/i }))
    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
    })
  })
})
