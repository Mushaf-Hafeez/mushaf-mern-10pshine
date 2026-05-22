import { describe, expect, it } from "vitest"

import Footer from "@/components/custom/Footer"
import { render, screen } from "@/test/utils/test-utils"

describe("Footer", () => {
  it("renders brand and link sections", () => {
    render(<Footer />)

    expect(screen.getByText("NoteFlow")).toBeInTheDocument()
    expect(screen.getByText("Product")).toBeInTheDocument()
    expect(screen.getByText("Features")).toBeInTheDocument()
    expect(screen.getByText("Terms of Service")).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })

  it("renders clickable footer links", async () => {
    const { user } = render(<Footer />)
    await user.click(screen.getByRole("link", { name: "Features" }))
    await user.click(screen.getByRole("link", { name: "About Us" }))
    await user.click(screen.getByRole("link", { name: "Terms of Service" }))
  })
})
