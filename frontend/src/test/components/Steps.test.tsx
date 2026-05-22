import { describe, expect, it } from "vitest"

import Steps from "@/components/custom/Steps"
import { render, screen } from "@/test/utils/test-utils"

describe("Steps", () => {
  it("renders all steps from constants", () => {
    render(<Steps />)

    expect(screen.getByText("Three steps to mastery")).toBeInTheDocument()
    expect(screen.getByText("Sign up")).toBeInTheDocument()
    expect(screen.getByText("Create notes")).toBeInTheDocument()
    expect(screen.getByText("Stay organized")).toBeInTheDocument()
  })
})
