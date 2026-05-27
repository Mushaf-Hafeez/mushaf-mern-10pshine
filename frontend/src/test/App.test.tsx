import { afterEach, describe, expect, it, vi } from "vitest"
import { waitFor } from "@testing-library/react"

vi.mock("@/pages/LandingPage", () => ({
  default: () => <div>Your thoughts</div>,
}))
vi.mock("@/pages/ErrorPage", () => ({
  default: () => <div>404 Page not found.</div>,
}))
vi.mock("@/pages/AuthPage", () => ({ default: () => <div>Auth</div> }))
vi.mock("@/pages/OTPVerification", () => ({ default: () => <div>OTP</div> }))
vi.mock("@/pages/ForgotPassword", () => ({ default: () => <div>Forgot</div> }))
vi.mock("@/pages/ResetPassword", () => ({ default: () => <div>Reset</div> }))
vi.mock("@/pages/NotesPage", () => ({ default: () => <div>Notes</div> }))
vi.mock("@/pages/Layout", () => ({ default: () => <div>Layout</div> }))
vi.mock("@/pages/ProfilePage", () => ({ default: () => <div>Profile</div> }))
vi.mock("@/pages/SettingsPage", () => ({ default: () => <div>Settings</div> }))
vi.mock("@/pages/NotePage", () => ({ default: () => <div>Note</div> }))
vi.mock("@/pages/CreateNotePage", () => ({ default: () => <div>Create</div> }))
vi.mock("@/pages/EditNotePage", () => ({ default: () => <div>Edit</div> }))

import App from "@/App"
import { render, screen } from "@/test/utils/test-utils"
import * as authService from "@/services/auth.service"

vi.mock("lenis/react", () => ({
  ReactLenis: () => null,
}))

vi.mock("@/services/auth.service")
vi.mock("@/services/note.service")
vi.mock("@/services/profile.service")

const mockSetUser = vi.fn()
const mockClearUser = vi.fn()

vi.mock("@/zustand/useUser", () => ({
  useUser: (selector: (state: {
    setUser: typeof mockSetUser
    clearUser: typeof mockClearUser
  }) => unknown) =>
    selector({
      setUser: mockSetUser,
      clearUser: mockClearUser,
    }),
}))

function renderApp(initialEntry = "/") {
  return render(<App />, {
    routerProps: { initialEntries: [initialEntry] },
  })
}

describe("App", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders landing page at root", async () => {
    vi.mocked(authService.checkAuth).mockRejectedValue(new Error("no session"))

    renderApp("/")

    await waitFor(() => {
      expect(screen.getByText(/Your thoughts/i)).toBeInTheDocument()
    })
  })

  it("sets user when checkAuth succeeds", async () => {
    vi.mocked(authService.checkAuth).mockResolvedValue({
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
    } as Awaited<ReturnType<typeof authService.checkAuth>>)

    renderApp("/")

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(
        expect.objectContaining({ email: "test@test.com" })
      )
    })
  })

  it("clears user when checkAuth fails", async () => {
    vi.mocked(authService.checkAuth).mockRejectedValue(new Error("unauthorized"))

    renderApp("/")

    await waitFor(() => {
      expect(mockClearUser).toHaveBeenCalled()
    })
  })

  it("does not set user when checkAuth returns non-200", async () => {
    vi.mocked(authService.checkAuth).mockResolvedValue({
      status: 401,
      data: {},
    } as Awaited<ReturnType<typeof authService.checkAuth>>)

    renderApp("/")

    await waitFor(() => {
      expect(authService.checkAuth).toHaveBeenCalled()
    })

    expect(mockSetUser).not.toHaveBeenCalled()
    expect(mockClearUser).not.toHaveBeenCalled()
  })

  it("renders error page for unknown routes", async () => {
    vi.mocked(authService.checkAuth).mockRejectedValue(new Error("no session"))

    renderApp("/unknown-route")

    await waitFor(() => {
      expect(screen.getByText(/page not found/i)).toBeInTheDocument()
    })
  })
})
