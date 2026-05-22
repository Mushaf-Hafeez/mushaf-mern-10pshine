import { describe, expect, it } from "vitest"

import CTA from "@/components/custom/CTA"
import { render, screen } from "@/test/utils/test-utils"

describe("CTA", () => {
  it("renders call to action with signup link", () => {
    render(<CTA />)

    expect(
      screen.getByText(/Ready to begin your focus journey/i)
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /start for free/i })).toHaveAttribute(
      "href",
      "/auth?mode=signup"
    )
  })
})
