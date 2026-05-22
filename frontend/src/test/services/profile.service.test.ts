import { afterEach, describe, expect, it, vi } from "vitest"

import { api } from "@/services/axios"
import {
  getProfile,
  updateProfile,
  updateProfilePic,
} from "@/services/profile.service"

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

describe("profile.service", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("getProfile fetches user profile", async () => {
    const mockResponse = { status: 200, data: { user: {} } }
    vi.mocked(api.get).mockResolvedValue(mockResponse)

    const result = await getProfile()

    expect(api.get).toHaveBeenCalledWith("/profile")
    expect(result).toEqual(mockResponse)
  })

  it("updateProfile puts name", async () => {
    const mockResponse = { status: 200, data: { user: { name: "New" } } }
    vi.mocked(api.put).mockResolvedValue(mockResponse)

    const result = await updateProfile("New Name")

    expect(api.put).toHaveBeenCalledWith("/profile", { name: "New Name" })
    expect(result).toEqual(mockResponse)
  })

  it("updateProfilePic uploads with progress callback", async () => {
    const setProgress = vi.fn()
    const mockResponse = { status: 200, data: { user: {} } }
    const formData = new FormData()

    vi.mocked(api.put).mockImplementation(async (_url, _data, config) => {
      config?.onUploadProgress?.({
        loaded: 50,
        total: 100,
        bytes: 50,
        lengthComputable: true,
      })
      return mockResponse
    })

    const result = await updateProfilePic(formData, setProgress)

    expect(api.put).toHaveBeenCalledWith(
      "/profile/profile-pic",
      formData,
      expect.objectContaining({ onUploadProgress: expect.any(Function) })
    )
    expect(setProgress).toHaveBeenCalledWith(50)
    expect(result).toEqual(mockResponse)
  })

  it("updateProfilePic skips progress when total is missing", async () => {
    const setProgress = vi.fn()
    const formData = new FormData()

    vi.mocked(api.put).mockImplementation(async (_url, _data, config) => {
      config?.onUploadProgress?.({
        loaded: 50,
        bytes: 50,
        lengthComputable: true,
      })
      return { status: 200, data: {} }
    })

    await updateProfilePic(formData, setProgress)
    expect(setProgress).not.toHaveBeenCalled()
  })

  it("rejects on api failure", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("Unauthorized"))
    await expect(getProfile()).rejects.toThrow("Unauthorized")
  })
})
