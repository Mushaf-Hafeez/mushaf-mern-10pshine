import { afterEach, describe, expect, it, vi } from "vitest"
import { waitFor } from "@testing-library/react"

import SettingsPage from "@/pages/SettingsPage"
import { render, screen } from "@/test/utils/test-utils"
import * as profileService from "@/services/profile.service"

vi.mock("@/services/auth.service")
vi.mock("@/services/note.service")
vi.mock("@/services/profile.service")

const mockSetUser = vi.fn()

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
      setUser: mockSetUser,
      clearUser: vi.fn(),
    })
  ),
}))

vi.mock("@/components/custom/DeleteAccount", () => ({
  default: () => <button type="button">Delete account</button>,
}))

describe("SettingsPage", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders settings sections", () => {
    render(<SettingsPage />, { withSidebar: true })

    expect(screen.getByText("Account Settings")).toBeInTheDocument()
    expect(screen.getByText("Theme Preference")).toBeInTheDocument()
    expect(screen.getByText("Danger Zone")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /delete account/i })).toBeInTheDocument()
  })

  it("updates profile name on submit", async () => {
    vi.mocked(profileService.updateProfile).mockResolvedValue({
      status: 200,
      data: {
        user: {
          _id: "1",
          name: "Updated Name",
          email: "test@test.com",
          profile_pic: "pic.png",
          createdAt: "",
          updatedAt: "",
          __v: 0,
        },
      },
    } as Awaited<ReturnType<typeof profileService.updateProfile>>)

    const { user } = render(<SettingsPage />, { withSidebar: true })

    const nameInput = screen.getByPlaceholderText(/enter your name/i)
    await user.clear(nameInput)
    await user.type(nameInput, "Updated Name")
    await user.click(screen.getByRole("button", { name: /update/i }))

    await waitFor(() => {
      expect(profileService.updateProfile).toHaveBeenCalledWith("Updated Name")
      expect(mockSetUser).toHaveBeenCalled()
    })
  })

  it("shows validation error for short name", async () => {
    const { user } = render(<SettingsPage />, { withSidebar: true })

    const nameInput = screen.getByPlaceholderText(/enter your name/i)
    await user.clear(nameInput)
    await user.type(nameInput, "abc")
    await user.click(screen.getByRole("button", { name: /update/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/name must contain at least 6 characters/i)
      ).toBeInTheDocument()
    })
  })

  it("uploads profile picture", async () => {
    vi.mocked(profileService.updateProfilePic).mockResolvedValue({
      status: 200,
      data: {
        user: {
          _id: "1",
          name: "Test User",
          email: "test@test.com",
          profile_pic: "new-pic.png",
          createdAt: "",
          updatedAt: "",
          __v: 0,
        },
      },
    } as Awaited<ReturnType<typeof profileService.updateProfilePic>>)

    render(<SettingsPage />, { withSidebar: true })

    const file = new File(["img"], "photo.png", { type: "image/png" })
    const input = document.getElementById("image") as HTMLInputElement

    await waitFor(() => {
      expect(input).toBeInTheDocument()
    })

    Object.defineProperty(input, "files", { value: [file] })
    input.dispatchEvent(new Event("change", { bubbles: true }))

    await waitFor(() => {
      expect(profileService.updateProfilePic).toHaveBeenCalled()
      expect(mockSetUser).toHaveBeenCalled()
    })
  })
})
