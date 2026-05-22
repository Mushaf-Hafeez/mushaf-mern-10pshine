import { afterEach, describe, expect, it, vi } from "vitest"
import { waitFor } from "@testing-library/react"

import ProfilePage from "@/pages/ProfilePage"
import { render, screen } from "@/test/utils/test-utils"
import * as authService from "@/services/auth.service"
import * as profileService from "@/services/profile.service"

vi.mock("@/services/auth.service")
vi.mock("@/services/note.service")
vi.mock("@/services/profile.service")

const mockNavigate = vi.fn()
const mockClearUser = vi.fn()

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
      clearUser: mockClearUser,
    })
  ),
}))

const mockUser = {
  _id: "1",
  name: "Test User",
  email: "test@test.com",
  profile_pic: "pic.png",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date(),
  __v: 0,
}

describe("ProfilePage", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("loads and displays profile", async () => {
    vi.mocked(profileService.getProfile).mockResolvedValue({
      status: 200,
      data: { user: mockUser },
    } as Awaited<ReturnType<typeof profileService.getProfile>>)

    render(<ProfilePage />, { withSidebar: true })

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument()
      expect(screen.getByText("test@test.com")).toBeInTheDocument()
    })
  })

  it("shows error when profile fetch fails", async () => {
    vi.mocked(profileService.getProfile).mockRejectedValue({
      message: "fail",
      response: { data: { message: "Unauthorized" } },
    })

    render(<ProfilePage />, { withSidebar: true })

    await waitFor(() => {
      expect(screen.getByText("Unauthorized")).toBeInTheDocument()
    })
  })

  it("logs out on confirmation", async () => {
    vi.mocked(profileService.getProfile).mockResolvedValue({
      status: 200,
      data: { user: mockUser },
    } as Awaited<ReturnType<typeof profileService.getProfile>>)

    vi.mocked(authService.logout).mockResolvedValue({
      status: 200,
    } as Awaited<ReturnType<typeof authService.logout>>)

    const { user } = render(<ProfilePage />, { withSidebar: true })

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /logout/i }))
    await user.click(screen.getByRole("button", { name: /^logout$/i }))

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled()
      expect(mockClearUser).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith("/")
    })
  })
})
