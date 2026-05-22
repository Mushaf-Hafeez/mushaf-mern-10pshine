import type { ReactNode } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { waitFor } from "@testing-library/react"

import OTPVerification from "@/pages/OTPVerification"
import { render, screen } from "@/test/utils/test-utils"
import * as authService from "@/services/auth.service"

vi.mock("@/services/auth.service")
vi.mock("@/services/note.service")
vi.mock("@/services/profile.service")

vi.mock("@/components/ui/input-otp", () => ({
  InputOTP: ({
    value,
    onChange,
    maxLength,
  }: {
    value: string
    onChange: (value: string) => void
    maxLength: number
  }) => (
    <input
      data-testid="otp-input"
      aria-label="OTP"
      value={value}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
  InputOTPGroup: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  InputOTPSlot: () => null,
}))

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
  useUser: (selector: (state: {
    user: null
    setUser: typeof mockSetUser
    clearUser: () => void
  }) => unknown) =>
    selector({
      user: null,
      setUser: mockSetUser,
      clearUser: vi.fn(),
    }),
}))

describe("OTPVerification", () => {
  beforeEach(() => {
    localStorage.setItem("otp-email", "test@test.com")
  })

  afterEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it("redirects when email is missing from storage", async () => {
    localStorage.removeItem("otp-email")
    render(<OTPVerification />)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/auth?mode=signup", {
        state: { message: "Please start signup again" },
      })
    })
  })

  it("renders OTP form when email exists", async () => {
    render(<OTPVerification />)

    await waitFor(() => {
      expect(screen.getByText(/OTP Verification/i)).toBeInTheDocument()
      expect(screen.getByText(/test@test.com/i)).toBeInTheDocument()
    })
  })

  it("verifies OTP and navigates home on success", async () => {
    vi.mocked(authService.signup).mockResolvedValue({
      status: 201,
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
    } as Awaited<ReturnType<typeof authService.signup>>)

    const { user } = render(<OTPVerification />)

    await waitFor(() => {
      expect(screen.getByText(/test@test.com/i)).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText("OTP"), "123456")
    await user.click(screen.getByRole("button", { name: /verify account/i }))

    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith({
        email: "test@test.com",
        otp: expect.any(String),
      })
      expect(mockSetUser).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith("/")
    })
  })

  it("shows error on verification failure", async () => {
    vi.mocked(authService.signup).mockRejectedValue({
      message: "fail",
    })

    const { user } = render(<OTPVerification />)

    await waitFor(() => {
      expect(screen.getByText(/test@test.com/i)).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText("OTP"), "123456")
    await user.click(screen.getByRole("button", { name: /verify account/i }))

    await waitFor(() => {
      expect(screen.getByText(/please signup first/i)).toBeInTheDocument()
    })
  })

  it("resends OTP on click", async () => {
    vi.mocked(authService.OTP).mockResolvedValue({
      status: 200,
    } as Awaited<ReturnType<typeof authService.OTP>>)

    const { user } = render(<OTPVerification />)

    await waitFor(() => {
      expect(screen.getByText(/resend otp/i)).toBeInTheDocument()
    })

    await user.click(screen.getByText(/resend otp/i))

    await waitFor(() => {
      expect(authService.OTP).toHaveBeenCalled()
      expect(screen.getByText(/otp has been sent/i)).toBeInTheDocument()
    })
  })
})
