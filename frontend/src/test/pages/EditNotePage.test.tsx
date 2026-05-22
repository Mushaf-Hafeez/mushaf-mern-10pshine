import { afterEach, describe, expect, it, vi } from "vitest"
import { waitFor } from "@testing-library/react"

import EditNotePage from "@/pages/EditNotePage"
import { render, screen } from "@/test/utils/test-utils"
import * as noteService from "@/services/note.service"

vi.mock("@/services/auth.service")
vi.mock("@/services/note.service")
vi.mock("@/services/profile.service")

vi.mock("@/components/custom/Editor", () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string
    onChange: (v: string) => void
  }) => (
    <textarea
      data-testid="mock-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "note-1" }),
  }
})

describe("EditNotePage", () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it("loads note into editor", async () => {
    vi.mocked(noteService.getNote).mockResolvedValue({
      status: 200,
      data: {
        note: { title: "Edit Title", content: "Existing content" },
      },
    } as Awaited<ReturnType<typeof noteService.getNote>>)

    render(<EditNotePage />)

    await waitFor(() => {
      expect(screen.getByDisplayValue("Edit Title")).toBeInTheDocument()
      expect(screen.getByDisplayValue("Existing content")).toBeInTheDocument()
    })
  })

  it("alerts when saving empty content", async () => {
    vi.mocked(noteService.getNote).mockResolvedValue({
      status: 200,
      data: { note: { title: "T", content: "" } },
    } as Awaited<ReturnType<typeof noteService.getNote>>)

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {})

    const { user } = render(<EditNotePage />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /save changes/i }))
    expect(alertSpy).toHaveBeenCalledWith("Please write something")
  })

  it("updates note on save", async () => {
    vi.mocked(noteService.getNote).mockResolvedValue({
      status: 200,
      data: { note: { title: "T", content: "Body" } },
    } as Awaited<ReturnType<typeof noteService.getNote>>)

    vi.mocked(noteService.updateNote).mockResolvedValue({
      status: 200,
    } as Awaited<ReturnType<typeof noteService.updateNote>>)

    const { user } = render(<EditNotePage />)

    await waitFor(() => {
      expect(screen.getByDisplayValue("Body")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /save changes/i }))

    await waitFor(() => {
      expect(noteService.updateNote).toHaveBeenCalledWith("note-1", "T", "Body")
      expect(mockNavigate).toHaveBeenCalledWith("/user/notes")
    })
  })

  it("shows fetch error", async () => {
    vi.mocked(noteService.getNote).mockRejectedValue({
      message: "fail",
      response: { data: { message: "Not found" } },
    })

    render(<EditNotePage />)

    await waitFor(() => {
      expect(screen.getByText("Not found")).toBeInTheDocument()
    })
  })
})
