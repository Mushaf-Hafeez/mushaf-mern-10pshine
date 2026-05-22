import { afterEach, describe, expect, it, vi } from "vitest"

import Navbar from "@/components/custom/Navbar"
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

describe("Navbar", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders login links when user is not authenticated", () => {
    vi.mocked(useUser).mockImplementation((selector) =>
      selector({ user: null, setUser: vi.fn(), clearUser: vi.fn() })
    )

    render(<Navbar />)

    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /get started/i })).toBeInTheDocument()
  })

  it("renders notes link and avatar when authenticated", async () => {
    vi.mocked(useUser).mockImplementation((selector) =>
      selector({
        user: {
          _id: "1",
          name: "Test User",
          email: "test@test.com",
          profile_pic: "pic.png",
          createdAt: "",
          updatedAt: "",
          __v: 0,
        },
        setUser: vi.fn(),
        clearUser: vi.fn(),
      })
    )

    const { user } = render(<Navbar />)

    expect(screen.getByRole("link", { name: /notes/i })).toBeInTheDocument()
    await user.click(screen.getByText("CN"))
    expect(mockNavigate).toHaveBeenCalledWith("/user/profile")
  })
})
