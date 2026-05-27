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

    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument()

    expect(
      screen.getByRole("textbox", { name: /email address/i })
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(/^password$/i, { selector: "input" })
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(/confirm password/i, { selector: "input" })
    ).toBeInTheDocument()
  })

  it("shows validation errors on empty submit", async () => {
    const { user } = render(<Signup />)

    await user.click(
      screen.getByRole("button", { name: /create your account/i })
    )

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
  })

  it("submits OTP request and navigates on success", async () => {
    vi.mocked(authService.OTP).mockResolvedValue({
      status: 200,
    } as Awaited<ReturnType<typeof authService.OTP>>)

    const { user } = render(<Signup />)

    await user.type(screen.getByRole("textbox", { name: /name/i }), "Test User")

    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "test@test.com"
    )

    await user.type(
      screen.getByLabelText(/^password$/i, { selector: "input" }),
      validPassword
    )

    await user.type(
      screen.getByLabelText(/confirm password/i, { selector: "input" }),
      validPassword
    )

    await user.click(
      screen.getByRole("button", { name: /create your account/i })
    )

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

    await user.type(screen.getByRole("textbox", { name: /name/i }), "Test User")

    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "test@test.com"
    )

    await user.type(
      screen.getByLabelText(/^password$/i, { selector: "input" }),
      validPassword
    )

    await user.type(
      screen.getByLabelText(/confirm password/i, { selector: "input" }),
      validPassword
    )

    await user.click(
      screen.getByRole("button", { name: /create your account/i })
    )

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
    })
  })

  it("toggles password visibility", async () => {
    const { user } = render(<Signup />)

    const password = screen.getByLabelText(/^password$/i, {
      selector: "input",
    })

    const toggleButton = screen.getByRole("button", {
      name: /toggle password visibility/i,
    })

    await user.click(toggleButton)

    expect(password).toHaveAttribute("type", "text")
  })

  it("toggles confirm password visibility", async () => {
    const { user } = render(<Signup />)

    const confirm = screen.getByLabelText(/confirm password/i, {
      selector: "input",
    })

    const confirmToggleButton = screen.getByRole("button", {
      name: /toggle confirm password visibility/i,
    })

    await user.click(confirmToggleButton)

    expect(confirm).toHaveAttribute("type", "text")
  })

  it("shows mismatch error when passwords differ", async () => {
    const { user } = render(<Signup />)

    await user.type(screen.getByRole("textbox", { name: /name/i }), "Test User")

    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "test@test.com"
    )

    await user.type(
      screen.getByLabelText(/^password$/i, { selector: "input" }),
      validPassword
    )

    await user.type(
      screen.getByLabelText(/confirm password/i, { selector: "input" }),
      "Password2!"
    )

    await user.click(
      screen.getByRole("button", { name: /create your account/i })
    )

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
    })
  })

  it("shows password strength validation errors", async () => {
    const { user } = render(<Signup />)

    await user.type(screen.getByRole("textbox", { name: /name/i }), "Test User")
    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "test@test.com"
    )
    await user.type(
      screen.getByLabelText(/^password$/i, { selector: "input" }),
      "password"
    )
    await user.type(
      screen.getByLabelText(/confirm password/i, { selector: "input" }),
      "password"
    )

    await user.click(
      screen.getByRole("button", { name: /create your account/i })
    )

    await waitFor(() => {
      expect(
        screen.getByText(/must contain at least one uppercase letter/i)
      ).toBeInTheDocument()
    })
  })
})
