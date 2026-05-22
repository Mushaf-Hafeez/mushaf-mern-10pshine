import { describe, expect, it } from "vitest"

import Hero from "@/components/custom/Hero"
import { render, screen } from "@/test/utils/test-utils"

describe("Hero", () => {
  it("renders headline and get started link", () => {
    render(<Hero />)

    expect(screen.getByText(/Your thoughts/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /get started/i })).toHaveAttribute(
      "href",
      "/auth?mode=signup"
    )
  })
})
