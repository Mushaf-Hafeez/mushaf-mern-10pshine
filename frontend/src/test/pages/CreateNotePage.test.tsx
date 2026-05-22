import { afterEach, describe, expect, it, vi } from "vitest"
import { waitFor } from "@testing-library/react"

import CreateNotePage from "@/pages/CreateNotePage"
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
  }
})

describe("CreateNotePage", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders title input, editor, and save button", () => {
    render(<CreateNotePage />)
    expect(screen.getByPlaceholderText(/title here/i)).toBeInTheDocument()
    expect(screen.getByTestId("mock-editor")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument()
  })

  it("creates note and navigates on save", async () => {
    vi.mocked(noteService.createNote).mockResolvedValue({
      status: 201,
      data: { note: { _id: "new-1" } },
    } as Awaited<ReturnType<typeof noteService.createNote>>)

    const { user } = render(<CreateNotePage />)

    await user.type(screen.getByPlaceholderText(/title here/i), "New Title")
    await user.type(screen.getByTestId("mock-editor"), "Note body")
    await user.click(screen.getByRole("button", { name: /save/i }))

    await waitFor(() => {
      expect(noteService.createNote).toHaveBeenCalledWith("New Title", "Note body")
      expect(mockNavigate).toHaveBeenCalledWith("/user/notes")
    })
  })

  it("shows error on create failure", async () => {
    vi.mocked(noteService.createNote).mockRejectedValue({
      message: "fail",
      response: { data: { message: "Could not create" } },
    })

    const { user } = render(<CreateNotePage />)

    await user.click(screen.getByRole("button", { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText("Could not create")).toBeInTheDocument()
    })
  })

  it("navigates back", async () => {
    const { user } = render(<CreateNotePage />)
    await user.click(screen.getAllByRole("button")[0])
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
