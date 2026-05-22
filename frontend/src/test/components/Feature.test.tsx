import { describe, expect, it } from "vitest"
import { PencilLine } from "lucide-react"

import Feature from "@/components/custom/Feature"
import { render, screen } from "@/test/utils/test-utils"

describe("Feature", () => {
  it("renders title and description", () => {
    render(
      <Feature
        icon={PencilLine}
        title="Rich text editing"
        description="Full Markdown support."
      />
    )

    expect(screen.getByText("Rich text editing")).toBeInTheDocument()
    expect(screen.getByText("Full Markdown support.")).toBeInTheDocument()
  })
})
