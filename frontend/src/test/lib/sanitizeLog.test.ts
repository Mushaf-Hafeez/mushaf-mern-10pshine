import { describe, expect, it } from "vitest"

import { sanitizeLogData } from "@/lib/sanitizeLog"

describe("sanitizeLogData", () => {
  it("returns non-object data unchanged", () => {
    expect(sanitizeLogData(null)).toBe(null)
    expect(sanitizeLogData("hello")).toBe("hello")
    expect(sanitizeLogData(42)).toBe(42)
  })

  it("redacts sensitive keys", () => {
    const result = sanitizeLogData({
      email: "user@test.com",
      password: "secret123",
      token: "abc",
      otp: "123456",
    })

    expect(result).toEqual({
      email: "user@test.com",
      password: "[REDACTED]",
      token: "[REDACTED]",
      otp: "[REDACTED]",
    })
  })

  it("does not mutate the original object", () => {
    const data = { password: "secret" }
    sanitizeLogData(data)
    expect(data.password).toBe("secret")
  })

  it("handles objects without sensitive keys", () => {
    expect(sanitizeLogData({ name: "Test" })).toEqual({ name: "Test" })
  })
})
