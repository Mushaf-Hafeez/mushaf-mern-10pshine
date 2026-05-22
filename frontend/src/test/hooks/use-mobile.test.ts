import { renderHook, act } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useIsMobile } from "@/hooks/use-mobile"

describe("useIsMobile", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("returns true when viewport is below mobile breakpoint", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it("returns false when viewport is at or above breakpoint", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it("updates when matchMedia change event fires", () => {
    let changeHandler: (() => void) | null = null

    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_event: string, handler: () => void) => {
        changeHandler = handler
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 400,
    })

    act(() => {
      changeHandler?.()
    })

    expect(result.current).toBe(true)
  })
})
