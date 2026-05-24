import { afterEach, describe, expect, it, vi } from "vitest"
import type { AxiosError, InternalAxiosRequestConfig } from "axios"

import { logger } from "@/lib/logger"
import { api } from "@/services/axios"

vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}))

function getRequestHandler() {
  const handlers = api.interceptors.request.handlers
  const handler = handlers[handlers.length - 1]?.fulfilled
  if (!handler) {
    throw new Error("Request interceptor not found")
  }
  return handler
}

function getResponseHandlers() {
  const handlers = api.interceptors.response.handlers
  const fulfilled = handlers[handlers.length - 1]?.fulfilled
  const rejected = handlers[handlers.length - 1]?.rejected
  if (!fulfilled || !rejected) {
    throw new Error("Response interceptors not found")
  }
  return { fulfilled, rejected }
}

describe("axios api client", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("logs outgoing requests", () => {
    const handler = getRequestHandler()
    const config = {
      method: "post",
      url: "/auth/login",
      data: { email: "a@b.com", password: "secret" },
      headers: { Authorization: "Bearer token" },
    } as InternalAxiosRequestConfig

    const result = handler(config)

    expect(result).toBe(config)
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "post",
        url: "/auth/login",
      }),
      "API Request"
    )
  })

  it("logs successful responses", () => {
    const { fulfilled } = getResponseHandlers()
    const response = {
      status: 200,
      data: { ok: true },
      config: { url: "/notes" },
    }

    const result = fulfilled(response)

    expect(result).toBe(response)
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({ status: 200, url: "/notes" }),
      "API Response"
    )
  })

  it("logs and rejects failed responses", async () => {
    const { rejected } = getResponseHandlers()
    const error = {
      message: "Network Error",
      config: { url: "/notes" },
      response: { status: 500, data: { message: "fail" } },
    } as AxiosError

    await expect(rejected(error)).rejects.toBe(error)
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Network Error",
        status: 500,
        url: "/notes",
      }),
      "API Error"
    )
  })
})
