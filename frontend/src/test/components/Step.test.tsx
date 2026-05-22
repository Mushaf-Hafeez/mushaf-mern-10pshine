import { describe, expect, it } from "vitest"

import Step from "@/components/custom/Step"
import { render, screen } from "@/test/utils/test-utils"

describe("Step", () => {
  it("renders step number, title, and description", () => {
    render(
      <Step
        step="01"
        title="Sign up"
        description="Join the collective in seconds."
      />
    )

    expect(screen.getByText("01")).toBeInTheDocument()
    expect(screen.getByText("Sign up")).toBeInTheDocument()
    expect(
      screen.getByText("Join the collective in seconds.")
    ).toBeInTheDocument()
  })
})
