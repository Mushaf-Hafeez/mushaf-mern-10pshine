import { afterEach, describe, expect, it, vi } from "vitest"
import { waitFor } from "@testing-library/react"

import NotePage from "@/pages/NotePage"
import { render, screen } from "@/test/utils/test-utils"
import * as noteService from "@/services/note.service"

vi.mock("@/services/auth.service")
vi.mock("@/services/note.service")
vi.mock("@/services/profile.service")

const mockNavigate = vi.fn()
const mockUseParams = vi.fn(() => ({ id: "note-1" }))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  }
})

describe("NotePage", () => {
  afterEach(() => {
    vi.clearAllMocks()
    mockUseParams.mockReturnValue({ id: "note-1" })
  })

  it("handles missing note id in route params", async () => {
    mockUseParams.mockReturnValue({})
    vi.mocked(noteService.getNote).mockResolvedValue({
      status: 200,
      data: { note: { title: "T", content: "c" } },
    } as Awaited<ReturnType<typeof noteService.getNote>>)

    render(<NotePage />)

    await waitFor(() => {
      expect(noteService.getNote).toHaveBeenCalled()
    })
  })

  it("loads and displays note content", async () => {
    vi.mocked(noteService.getNote).mockResolvedValue({
      status: 200,
      data: {
        note: {
          title: "My Note",
          content: "# Hello World",
        },
      },
    } as Awaited<ReturnType<typeof noteService.getNote>>)

    render(<NotePage />)

    await waitFor(() => {
      expect(screen.getByText("My Note")).toBeInTheDocument()
      expect(screen.getByText("Hello World")).toBeInTheDocument()
    })
  })

  it("shows error when fetch fails", async () => {
    vi.mocked(noteService.getNote).mockRejectedValue({
      message: "fail",
      response: { data: { message: "Note not found" } },
    })

    render(<NotePage />)

    await waitFor(() => {
      expect(noteService.getNote).toHaveBeenCalledWith("note-1")
    })
  })

  it("handles delete failure without crashing", async () => {
    vi.mocked(noteService.getNote).mockResolvedValue({
      status: 200,
      data: { note: { title: "Delete Me", content: "body" } },
    } as Awaited<ReturnType<typeof noteService.getNote>>)

    vi.mocked(noteService.deleteNote).mockRejectedValue(new Error("delete failed"))

    const { user } = render(<NotePage />)

    await waitFor(() => {
      expect(screen.getByText("Delete Me")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /delete/i }))
    await user.click(screen.getByRole("button", { name: /^delete$/i }))

    await waitFor(() => {
      expect(noteService.deleteNote).toHaveBeenCalledWith("note-1")
    })
  })

  it("navigates back on back button click", async () => {
    vi.mocked(noteService.getNote).mockResolvedValue({
      status: 200,
      data: { note: { title: "T", content: "c" } },
    } as Awaited<ReturnType<typeof noteService.getNote>>)

    const { user } = render(<NotePage />)

    await waitFor(() => {
      expect(screen.getByText("T")).toBeInTheDocument()
    })

    await user.click(screen.getAllByRole("button")[0])
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it("deletes note from dialog", async () => {
    vi.mocked(noteService.getNote).mockResolvedValue({
      status: 200,
      data: { note: { title: "Delete Me", content: "body" } },
    } as Awaited<ReturnType<typeof noteService.getNote>>)

    vi.mocked(noteService.deleteNote).mockResolvedValue({
      status: 200,
    } as Awaited<ReturnType<typeof noteService.deleteNote>>)

    const { user } = render(<NotePage />)

    await waitFor(() => {
      expect(screen.getByText("Delete Me")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /delete/i }))
    await user.click(screen.getByRole("button", { name: /^delete$/i }))

    await waitFor(() => {
      expect(noteService.deleteNote).toHaveBeenCalledWith("note-1")
    })
  })

  it("renders markdown elements in note view", async () => {
    const content = `# Title

## Subtitle

### Section

Paragraph text.

- bullet

1. ordered

> blockquote

\`inline\`

\`\`\`
code block
\`\`\`

| H1 | H2 |
|----|----|
| a  | b  |

---

[link](https://example.com)

![photo](https://example.com/p.png)
`

    vi.mocked(noteService.getNote).mockResolvedValue({
      status: 200,
      data: { note: { title: "Rich", content } },
    } as Awaited<ReturnType<typeof noteService.getNote>>)

    render(<NotePage />)

    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument()
      expect(screen.getByText("Subtitle")).toBeInTheDocument()
      expect(screen.getByText("blockquote")).toBeInTheDocument()
      expect(screen.getByRole("link", { name: "link" })).toBeInTheDocument()
      expect(screen.getByRole("img")).toBeInTheDocument()
    })
  })
})
