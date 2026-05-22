import { describe, expect, it } from "vitest"

import Spinner from "@/components/custom/Spinner"
import { render, screen } from "@/test/utils/test-utils"

describe("Spinner", () => {
  it("renders loading status", () => {
    render(<Spinner />)
    expect(screen.getByRole("status")).toBeInTheDocument()
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })
})
