import { afterEach, describe, expect, it, vi } from "vitest"

import AppSidebar from "@/components/custom/AppSidebar"
import { render, screen } from "@/test/utils/test-utils"

vi.mock("@/zustand/useUser", () => ({
  useUser: vi.fn((selector) =>
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
  ),
}))

describe("AppSidebar", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders navigation links and user info", () => {
    render(<AppSidebar />, { withSidebar: true })

    expect(screen.getByRole("link", { name: /noteflow/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /notes/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /profile/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument()
    expect(screen.getByText("Test User")).toBeInTheDocument()
    expect(screen.getByText("test@test.com")).toBeInTheDocument()
  })
})
