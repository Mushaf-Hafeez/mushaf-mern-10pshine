import { afterEach, describe, expect, it, vi } from "vitest"
import { waitFor } from "@testing-library/react"

import Login from "@/components/custom/Login"
import { render, screen } from "@/test/utils/test-utils"
import * as authService from "@/services/auth.service"

vi.mock("@/services/auth.service")
vi.mock("@/services/note.service")
vi.mock("@/services/profile.service")

const mockNavigate = vi.fn()
const mockSetUser = vi.fn()

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
      setUser: mockSetUser,
      clearUser: vi.fn(),
    })
  ),
}))

const validPassword = "Password1!"

describe("Login", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders email and password fields", () => {
    render(<Login />)
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
  })

  it("shows validation errors on empty submit", async () => {
    const { user } = render(<Login />)
    await user.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })

  it("submits successfully and navigates home", async () => {
    vi.mocked(authService.login).mockResolvedValue({
      status: 200,
      data: {
        user: {
          _id: "1",
          name: "Test",
          email: "test@test.com",
          profile_pic: "",
          createdAt: "",
          updatedAt: "",
          __v: 0,
        },
      },
    } as Awaited<ReturnType<typeof authService.login>>)

    const { user } = render(<Login />)

    await user.type(screen.getByLabelText(/email address/i), "test@test.com")
    await user.type(screen.getByLabelText(/^password$/i), validPassword)
    await user.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: "test@test.com",
        password: validPassword,
      })
      expect(mockSetUser).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith("/")
    })
  })

  it("shows backend error on failed login", async () => {
    vi.mocked(authService.login).mockRejectedValue({
      message: "fail",
      response: { data: { message: "Invalid credentials" } },
    })

    const { user } = render(<Login />)

    await user.type(screen.getByLabelText(/email address/i), "test@test.com")
    await user.type(screen.getByLabelText(/^password$/i), validPassword)
    await user.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
    })
  })

  it("shows forgot password link", () => {
    render(<Login />)
    expect(screen.getByRole("link", { name: /forgot password/i })).toHaveAttribute(
      "href",
      "/forgot-password"
    )
  })

  it("toggles password visibility", async () => {
    const { user } = render(<Login />)
    const passwordInput = screen.getByLabelText(/^password$/i)
    expect(passwordInput).toHaveAttribute("type", "password")

    await user.click(passwordInput.parentElement?.querySelector("span")!)
    expect(passwordInput).toHaveAttribute("type", "text")
  })
})
