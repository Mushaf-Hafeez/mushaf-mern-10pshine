import { afterEach, describe, expect, it, vi } from "vitest"
import { waitFor, within } from "@testing-library/react"

import DeleteAccount from "@/components/custom/DeleteAccount"
import { render, screen } from "@/test/utils/test-utils"
import * as authService from "@/services/auth.service"

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
      user: {
        _id: "1",
        name: "Test",
        email: "t@t.com",
        profile_pic: "",
        createdAt: "",
        updatedAt: "",
        __v: 0,
      },
      setUser: vi.fn(),
      clearUser: mockClearUser,
    })
  ),
}))

const validPassword = "Password1!"

describe("DeleteAccount", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("opens dialog and validates empty password", async () => {
    const { user } = render(<DeleteAccount />)

    await user.click(screen.getByRole("button", { name: /delete account/i }))
    const dialog = await screen.findByRole("alertdialog")
    await user.click(
      within(dialog).getByRole("button", { name: /delete account/i })
    )

    await waitFor(() => {
      const dialog = screen.getByRole("alertdialog")
      expect(
        within(dialog).getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument()
    })
  })

  it("deletes account on success", async () => {
    vi.mocked(authService.deleteAccount).mockResolvedValue({
      status: 200,
    } as Awaited<ReturnType<typeof authService.deleteAccount>>)

    const { user } = render(<DeleteAccount />)

    await user.click(screen.getByRole("button", { name: /delete account/i }))
    await user.type(
      screen.getByPlaceholderText(/enter your password/i),
      validPassword
    )
    await user.click(screen.getByRole("button", { name: /^delete account$/i }))

    await waitFor(() => {
      expect(authService.deleteAccount).toHaveBeenCalledWith(validPassword)
      expect(mockClearUser).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith("/")
    })
  })

  it("toggles password visibility in dialog", async () => {
    const { user } = render(<DeleteAccount />)
    await user.click(screen.getByRole("button", { name: /delete account/i }))
    const password = screen.getByPlaceholderText(/enter your password/i)

    const toggleButton = screen.getByRole("button", {
      name: /toggle password visibility/i,
    })
    await user.click(toggleButton)
    expect(password).toHaveAttribute("type", "text")
  })

  it("shows backend error on failure", async () => {
    vi.mocked(authService.deleteAccount).mockRejectedValue({
      message: "fail",
      response: { data: { message: "Wrong password" } },
    })

    const { user } = render(<DeleteAccount />)

    await user.click(screen.getByRole("button", { name: /delete account/i }))
    await user.type(
      screen.getByPlaceholderText(/enter your password/i),
      validPassword
    )
    await user.click(screen.getByRole("button", { name: /^delete account$/i }))

    await waitFor(() => {
      expect(screen.getByText("Wrong password")).toBeInTheDocument()
    })
  })
})
