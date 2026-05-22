import { afterEach, describe, expect, it, vi } from "vitest"

import { api } from "@/services/axios"
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  searchedNotes,
  updateNote,
} from "@/services/note.service"

vi.mock("@/services/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}))

describe("note.service", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("getNotes fetches paginated notes", async () => {
    const mockResponse = { status: 200, data: { notes: [], hasMore: false } }
    vi.mocked(api.get).mockResolvedValue(mockResponse)

    const result = await getNotes(1, 10)

    expect(api.get).toHaveBeenCalledWith("/notes?page=1&limit=10")
    expect(result).toEqual(mockResponse)
  })

  it("searchedNotes fetches search results", async () => {
    const mockResponse = { status: 200, data: { notes: [] } }
    vi.mocked(api.get).mockResolvedValue(mockResponse)

    const result = await searchedNotes("hello", 2, 5)

    expect(api.get).toHaveBeenCalledWith("/notes/search?q=hello&page=2&limit=5")
    expect(result).toEqual(mockResponse)
  })

  it("getNote fetches a single note", async () => {
    const mockResponse = { status: 200, data: { note: {} } }
    vi.mocked(api.get).mockResolvedValue(mockResponse)

    const result = await getNote("note-id")

    expect(api.get).toHaveBeenCalledWith("/notes/note-id")
    expect(result).toEqual(mockResponse)
  })

  it("createNote posts title and content", async () => {
    const mockResponse = { status: 201, data: { note: { _id: "1" } } }
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const result = await createNote("Title", "Content")

    expect(api.post).toHaveBeenCalledWith("/notes", {
      title: "Title",
      content: "Content",
    })
    expect(result).toEqual(mockResponse)
  })

  it("updateNote puts note data", async () => {
    const mockResponse = { status: 200 }
    vi.mocked(api.put).mockResolvedValue(mockResponse)

    const result = await updateNote("note-id", "New Title", "New Content")

    expect(api.put).toHaveBeenCalledWith("/notes/note-id", {
      title: "New Title",
      content: "New Content",
    })
    expect(result).toEqual(mockResponse)
  })

  it("deleteNote deletes by id", async () => {
    const mockResponse = { status: 200 }
    vi.mocked(api.delete).mockResolvedValue(mockResponse)

    const result = await deleteNote("note-id")

    expect(api.delete).toHaveBeenCalledWith("/notes/note-id")
    expect(result).toEqual(mockResponse)
  })

  it("rejects when api call fails", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("Network error"))
    await expect(getNotes(1, 10)).rejects.toThrow("Network error")
  })
})
