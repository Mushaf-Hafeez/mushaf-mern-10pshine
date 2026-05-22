import { afterEach, describe, expect, it, vi } from "vitest"

import ProtectedRoute from "@/components/custom/ProtectedRoute"
import { render, screen } from "@/test/utils/test-utils"

const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock("@/zustand/useUser", () => ({
  useUser: vi.fn(),
}))

import { useUser } from "@/zustand/useUser"

describe("ProtectedRoute", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders children when user is authenticated", () => {
    vi.mocked(useUser).mockImplementation((selector) =>
      selector({
        user: {
          _id: "1",
          name: "Test",
          email: "test@test.com",
          profile_pic: "",
          createdAt: "",
          updatedAt: "",
          __v: 0,
        },
        setUser: vi.fn(),
        clearUser: vi.fn(),
      })
    )

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText("Protected Content")).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it("redirects when user is not authenticated", () => {
    vi.mocked(useUser).mockImplementation((selector) =>
      selector({
        user: null,
        setUser: vi.fn(),
        clearUser: vi.fn(),
      })
    )

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(mockNavigate).toHaveBeenCalledWith("/auth?mode=login")
  })
})
