import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { waitFor } from "@testing-library/react"

import NotesPage from "@/pages/NotesPage"
import { render, screen } from "@/test/utils/test-utils"
import * as noteService from "@/services/note.service"

vi.mock("@/services/auth.service")
vi.mock("@/services/note.service")
vi.mock("@/services/profile.service")

vi.mock("react-infinite-scroll-component", () => ({
  default: ({
    children,
    next,
    loader,
  }: {
    children: React.ReactNode
    next: () => void
    loader: React.ReactNode
  }) => (
    <div data-testid="infinite-scroll">
      {children}
      <button type="button" onClick={next}>
        Load more
      </button>
      {loader}
    </div>
  ),
}))

const mockNote = {
  _id: "1",
  title: "First Note",
  content: "Content here",
  user: {
    _id: "u1",
    name: "Test",
    email: "t@t.com",
    profile_pic: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
}

describe("NotesPage", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it("shows spinner then notes on load", async () => {
    vi.mocked(noteService.getNotes).mockResolvedValue({
      status: 200,
      data: { notes: [mockNote], hasMore: false },
    } as Awaited<ReturnType<typeof noteService.getNotes>>)

    render(<NotesPage />, { withSidebar: true })

    await waitFor(() => {
      expect(screen.getByText("First Note")).toBeInTheDocument()
    })
  })

  it("shows empty state when no notes", async () => {
    vi.mocked(noteService.getNotes).mockResolvedValue({
      status: 200,
      data: { notes: [], hasMore: false },
    } as Awaited<ReturnType<typeof noteService.getNotes>>)

    render(<NotesPage />, { withSidebar: true })

    await waitFor(() => {
      expect(screen.getByText(/no notes yet/i)).toBeInTheDocument()
    })
  })

  it("shows error on fetch failure", async () => {
    vi.mocked(noteService.getNotes).mockRejectedValue({
      message: "fail",
      response: { data: { message: "Failed to load" } },
    })

    render(<NotesPage />, { withSidebar: true })

    await waitFor(() => {
      expect(screen.getByText("Failed to load")).toBeInTheDocument()
    })
  })

  it("searches notes after debounce", async () => {
    vi.mocked(noteService.getNotes).mockResolvedValue({
      status: 200,
      data: { notes: [], hasMore: false },
    } as Awaited<ReturnType<typeof noteService.getNotes>>)

    vi.mocked(noteService.searchedNotes).mockResolvedValue({
      status: 200,
      data: { notes: [mockNote], hasMore: false },
    } as Awaited<ReturnType<typeof noteService.searchedNotes>>)

    const { user } = render(<NotesPage />, { withSidebar: true })

    await waitFor(() => {
      expect(screen.getByText(/no notes yet/i)).toBeInTheDocument()
    })

    await user.type(screen.getByPlaceholderText(/search notes/i), "hello")
    vi.advanceTimersByTime(500)

    await waitFor(() => {
      expect(noteService.searchedNotes).toHaveBeenCalledWith("hello", 1, 10)
      expect(screen.getByText("First Note")).toBeInTheDocument()
    })
  })

  it("toggles grid layout", async () => {
    vi.mocked(noteService.getNotes).mockResolvedValue({
      status: 200,
      data: { notes: [mockNote], hasMore: false },
    } as Awaited<ReturnType<typeof noteService.getNotes>>)

    const { user } = render(<NotesPage />, { withSidebar: true })

    await waitFor(() => {
      expect(screen.getByText("First Note")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /grid/i }))
    expect(screen.getByRole("list").className).toContain("grid")
  })
})
