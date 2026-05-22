import { describe, expect, it } from "vitest"

import Features from "@/components/custom/Features"
import { render, screen } from "@/test/utils/test-utils"

describe("Features", () => {
  it("renders section heading and all features", () => {
    render(<Features />)

    expect(screen.getByText("Engineered for Clarity")).toBeInTheDocument()
    expect(screen.getByText("Rich text editing")).toBeInTheDocument()
    expect(screen.getByText("Secure notes")).toBeInTheDocument()
    expect(screen.getByText("Fast search")).toBeInTheDocument()
    expect(screen.getByText("Clean UI")).toBeInTheDocument()
  })
})
