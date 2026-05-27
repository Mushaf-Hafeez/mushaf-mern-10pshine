import { renderHook, act } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { ReactNode } from "react"

import { ThemeProvider, useTheme } from "@/components/theme-provider"

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider defaultTheme="light" storageKey="test-theme">
    {children}
  </ThemeProvider>
)

describe("ThemeProvider", () => {
  afterEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    document.documentElement.classList.remove("light", "dark")
  })

  it("provides default theme", () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe("light")
  })

  it("setTheme updates theme and localStorage", () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => {
      result.current.setTheme("dark")
    })

    expect(result.current.theme).toBe("dark")
    expect(localStorage.getItem("test-theme")).toBe("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("throws when useTheme is used outside provider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider"
    )
  })

  it("toggles theme on keyboard shortcut", () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "d", bubbles: true })
      )
    })

    expect(result.current.theme).toBe("dark")
  })

  it("syncs theme from storage event", () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "test-theme",
          newValue: "dark",
          storageArea: localStorage,
        })
      )
    })

    expect(result.current.theme).toBe("dark")
  })

  it("ignores keyboard shortcut inside editable fields", () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    const input = document.createElement("input")
    document.body.appendChild(input)

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "d", bubbles: true })
      )
    })

    expect(result.current.theme).toBe("light")
    input.remove()
  })

  it("ignores keyboard shortcut with modifier keys", () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "d",
          ctrlKey: true,
          bubbles: true,
        })
      )
    })

    expect(result.current.theme).toBe("light")
  })

  it("falls back to default theme when storage value is invalid", () => {
    localStorage.setItem("test-theme", "invalid-theme")
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe("light")
  })

  it("resets to default theme when storage event clears value", () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => {
      result.current.setTheme("dark")
    })

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "test-theme",
          newValue: null,
          storageArea: localStorage,
        })
      )
    })

    expect(result.current.theme).toBe("light")
  })

  it("ignores storage events for other keys", () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "other-key",
          newValue: "dark",
          storageArea: localStorage,
        })
      )
    })

    expect(result.current.theme).toBe("light")
  })
})

describe("ThemeProvider system theme", () => {
  const systemWrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider defaultTheme="system" storageKey="test-theme-system">
      {children}
    </ThemeProvider>
  )

  afterEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove("light", "dark")
    vi.restoreAllMocks()
  })

  it("applies dark class when system prefers dark", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-color-scheme: dark"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    renderHook(() => useTheme(), { wrapper: systemWrapper })
    expect(document.documentElement.classList.contains("dark")).toBe(true)

    act(() => {
      window.matchMedia("(prefers-color-scheme: dark)").dispatchEvent(
        new Event("change")
      )
    })

    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("applies theme without transition helper when disabled", () => {
    const noTransitionWrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider
        defaultTheme="dark"
        storageKey="test-theme-no-transition"
        disableTransitionOnChange={false}
      >
        {children}
      </ThemeProvider>
    )

    renderHook(() => useTheme(), { wrapper: noTransitionWrapper })
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })
})
