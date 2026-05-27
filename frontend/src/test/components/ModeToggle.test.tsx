import { beforeEach, describe, expect, it, vi } from "vitest"

import ModeToggle from "@/components/custom/ModeToggle"
import { render, screen } from "@/test/utils/test-utils"

const mockSetTheme = vi.fn()
let mockTheme: "light" | "dark" = "light"

vi.mock("@/components/theme-provider", async () => {
  const actual = await vi.importActual<typeof import("@/components/theme-provider")>(
    "@/components/theme-provider"
  )
  return {
    ...actual,
    useTheme: () => ({
      theme: mockTheme,
      setTheme: mockSetTheme,
    }),
  }
})

describe("ModeToggle", () => {
  beforeEach(() => {
    mockTheme = "light"
    mockSetTheme.mockClear()
  })

  it("renders theme toggle switch", () => {
    render(<ModeToggle />)
    expect(screen.getByRole("switch", { name: /toggle theme/i })).toBeInTheDocument()
  })

  it("calls setTheme with dark when checked", async () => {
    const { user } = render(<ModeToggle />)
    await user.click(screen.getByRole("switch", { name: /toggle theme/i }))
    expect(mockSetTheme).toHaveBeenCalledWith("dark")
  })
  it("calls setTheme with light when toggled off from dark", async () => {
    mockTheme = "dark"
    const { user } = render(<ModeToggle />)
    await user.click(screen.getByRole("switch", { name: /toggle theme/i }))
    expect(mockSetTheme).toHaveBeenCalledWith("light")
  })
})
