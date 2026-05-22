import { afterEach, describe, expect, it } from "vitest"

import { useUser } from "@/zustand/useUser"

const mockUser = {
  _id: "1",
  name: "Test User",
  email: "test@test.com",
  profile_pic: "pic.png",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-02",
  __v: 0,
}

describe("useUser store", () => {
  afterEach(() => {
    useUser.setState({ user: null })
  })

  it("has null user initially", () => {
    expect(useUser.getState().user).toBeNull()
  })

  it("setUser updates user state", () => {
    useUser.getState().setUser(mockUser)
    expect(useUser.getState().user).toEqual(mockUser)
  })

  it("clearUser resets user to null", () => {
    useUser.getState().setUser(mockUser)
    useUser.getState().clearUser()
    expect(useUser.getState().user).toBeNull()
  })
})
