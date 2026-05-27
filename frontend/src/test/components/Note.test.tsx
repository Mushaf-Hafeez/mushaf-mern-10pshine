import { afterEach, describe, expect, it, vi } from "vitest"
import { waitFor, within } from "@testing-library/react"

import Note from "@/components/custom/Note"
import { render, screen } from "@/test/utils/test-utils"
import * as noteService from "@/services/note.service"

vi.mock("@/services/auth.service")
vi.mock("@/services/note.service")
vi.mock("@/services/profile.service")

const mockNavigate = vi.fn()
const removeNote = vi.fn()

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
      clearUser: vi.fn(),
    })
  ),
}))

const defaultProps = {
  id: "note-1",
  title: "Test Note",
  content: "Short **markdown** content for reading.",
  createdAt: new Date("2024-06-01"),
  removeNote,
}

describe("Note", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders title and reading time", () => {
    render(<Note {...defaultProps} />)
    expect(screen.getByText("Test Note")).toBeInTheDocument()
    expect(screen.getByText(/sec read/i)).toBeInTheDocument()
  })

  it("navigates to note page on card click", async () => {
    const { user } = render(<Note {...defaultProps} />)

    const link = screen.getByRole("link", { name: /test note/i })

    expect(link).toHaveAttribute("href", "/notes/note-1")
  })

  it("deletes note on confirmation", async () => {
    vi.mocked(noteService.deleteNote).mockResolvedValue({
      status: 200,
    } as Awaited<ReturnType<typeof noteService.deleteNote>>)

    const { user } = render(<Note {...defaultProps} />)

    await user.click(screen.getByRole("button", { expanded: false }))
    await user.click(screen.getByRole("button", { name: "Delete" }))
    const dialog = await screen.findByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    await waitFor(() => {
      expect(noteService.deleteNote).toHaveBeenCalledWith("note-1")
      expect(removeNote).toHaveBeenCalledWith("note-1")
    })
  })

  it("handles delete failure gracefully", async () => {
    vi.mocked(noteService.deleteNote).mockRejectedValue(new Error("Failed"))

    const { user } = render(<Note {...defaultProps} />)

    await user.click(screen.getByRole("button", { expanded: false }))
    await user.click(screen.getByRole("button", { name: "Delete" }))
    const dialog = await screen.findByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    await waitFor(() => {
      expect(noteService.deleteNote).toHaveBeenCalled()
      expect(removeNote).not.toHaveBeenCalled()
    })
  })

  it("shows hour read for long content", () => {
    const longContent = new Array(15000).fill("word").join(" ")
    render(<Note {...defaultProps} content={longContent} />)
    expect(screen.getByText(/hr read/i)).toBeInTheDocument()
  })

  it("shows minute read for medium content", () => {
    const mediumContent = new Array(500).fill("word").join(" ")
    render(<Note {...defaultProps} content={mediumContent} />)
    expect(screen.getByText(/min read/i)).toBeInTheDocument()
  })

  it("renders rich markdown without images", () => {
    const content = `# H1\n\n## H2\n\n- bullet\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n![img](https://x.com/i.png)`
    render(<Note {...defaultProps} content={content} />)
    expect(screen.getByText("H1")).toBeInTheDocument()
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })
})
