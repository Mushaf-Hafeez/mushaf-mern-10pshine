import { describe, expect, it, vi } from "vitest"
import { fireEvent } from "@testing-library/react"

import Editor from "@/components/custom/Editor"
import { render, screen } from "@/test/utils/test-utils"

vi.mock("@mdxeditor/editor", () => ({
  MDXEditor: ({
    markdown,
    onChange,
  }: {
    markdown: string
    onChange: (value: string) => void
  }) => (
    <textarea
      data-testid="mock-editor"
      value={markdown}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
  headingsPlugin: vi.fn(),
  quotePlugin: vi.fn(),
  listsPlugin: vi.fn(),
  linkPlugin: vi.fn(),
  linkDialogPlugin: vi.fn(),
  thematicBreakPlugin: vi.fn(),
  markdownShortcutPlugin: vi.fn(),
  toolbarPlugin: vi.fn(),
  UndoRedo: () => null,
  BoldItalicUnderlineToggles: () => null,
  CreateLink: () => null,
  InsertThematicBreak: () => null,
  ListsToggle: () => null,
  Separator: () => null,
  BlockTypeSelect: () => null,
}))

describe("Editor", () => {
  it("renders mock editor and calls onChange", async () => {
    const onChange = vi.fn()
    const { user } = render(<Editor value="" onChange={onChange} />)

    const editor = screen.getByTestId("mock-editor")
    await user.type(editor, "Hello")

    expect(onChange).toHaveBeenCalled()
  })

  it("normalizes checkbox list syntax on change", () => {
    const onChange = vi.fn()
    render(<Editor value="" onChange={onChange} />)

    const editor = screen.getByTestId("mock-editor")
    fireEvent.change(editor, { target: { value: "- [ ] Task item" } })

    expect(onChange).toHaveBeenCalledWith("- Task item")
  })

  it("returns empty markdown unchanged", () => {
    const onChange = vi.fn()
    render(<Editor value="" onChange={onChange} />)
    expect(screen.getByTestId("mock-editor")).toHaveValue("")
  })

  it("inserts blank line between ul and ol lists", () => {
    const onChange = vi.fn()
    render(<Editor value="" onChange={onChange} />)
    fireEvent.change(screen.getByTestId("mock-editor"), {
      target: {
        value: "- item one\n- item two\n1. ordered one\n2. ordered two",
      },
    })
    const result = onChange.mock.calls.at(-1)?.[0] as string
    expect(result).toContain("- item two\n\n1. ordered one")
  })
})
