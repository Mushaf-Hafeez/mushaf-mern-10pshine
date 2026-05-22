import { afterEach, describe, expect, it, vi } from "vitest"

import { api } from "@/services/axios"
import {
  checkAuth,
  deleteAccount,
  forgotPassword,
  login,
  logout,
  OTP,
  resetPassword,
  signup,
} from "@/services/auth.service"

vi.mock("@/services/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}))

describe("auth.service", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("login posts credentials", async () => {
    const mockResponse = { status: 200, data: { user: { _id: "1" } } }
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const data = { email: "test@test.com", password: "Password1!" }
    const result = await login(data)

    expect(api.post).toHaveBeenCalledWith("/auth/login", data)
    expect(result).toEqual(mockResponse)
  })

  it("login rejects on error", async () => {
    vi.mocked(api.post).mockRejectedValue(new Error("Invalid credentials"))
    await expect(
      login({ email: "test@test.com", password: "wrong" })
    ).rejects.toThrow("Invalid credentials")
  })

  it("OTP posts signup data", async () => {
    const mockResponse = { status: 200 }
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const data = {
      name: "Test",
      email: "test@test.com",
      password: "Password1!",
      confirmPassword: "Password1!",
    }
    const result = await OTP(data)

    expect(api.post).toHaveBeenCalledWith("/auth/otp", data)
    expect(result).toEqual(mockResponse)
  })

  it("signup posts email and otp", async () => {
    const mockResponse = { status: 201 }
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const result = await signup({ email: "test@test.com", otp: "123456" })

    expect(api.post).toHaveBeenCalledWith("/auth/signup", {
      email: "test@test.com",
      otp: "123456",
    })
    expect(result).toEqual(mockResponse)
  })

  it("checkAuth gets auth status", async () => {
    const mockResponse = { status: 200, data: { user: {} } }
    vi.mocked(api.get).mockResolvedValue(mockResponse)

    const result = await checkAuth()

    expect(api.get).toHaveBeenCalledWith("/auth/check-auth")
    expect(result).toEqual(mockResponse)
  })

  it("forgotPassword puts email", async () => {
    const mockResponse = { status: 200 }
    vi.mocked(api.put).mockResolvedValue(mockResponse)

    const result = await forgotPassword("test@test.com")

    expect(api.put).toHaveBeenCalledWith("/auth/forgot-password", {
      email: "test@test.com",
    })
    expect(result).toEqual(mockResponse)
  })

  it("resetPassword puts token and passwords", async () => {
    const mockResponse = { status: 200 }
    vi.mocked(api.put).mockResolvedValue(mockResponse)

    const result = await resetPassword("token123", "Password1!", "Password1!")

    expect(api.put).toHaveBeenCalledWith("/auth/reset-password", {
      reset_password_token: "token123",
      password: "Password1!",
      confirmPassword: "Password1!",
    })
    expect(result).toEqual(mockResponse)
  })

  it("deleteAccount deletes with password in body", async () => {
    const mockResponse = { status: 200 }
    vi.mocked(api.delete).mockResolvedValue(mockResponse)

    const result = await deleteAccount("Password1!")

    expect(api.delete).toHaveBeenCalledWith("/auth/delete-account", {
      data: { password: "Password1!" },
    })
    expect(result).toEqual(mockResponse)
  })

  it("logout posts to logout endpoint", async () => {
    const mockResponse = { status: 200 }
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const result = await logout()

    expect(api.post).toHaveBeenCalledWith("/auth/logout")
    expect(result).toEqual(mockResponse)
  })
})
