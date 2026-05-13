import "@mdxeditor/editor/style.css"

import {
  MDXEditor,
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  linkPlugin,
  linkDialogPlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertThematicBreak,
  ListsToggle,
  toolbarPlugin,
  Separator,
  BlockTypeSelect,
} from "@mdxeditor/editor"

import type { MDXEditorMethods } from "@mdxeditor/editor"
import { useRef } from "react"

type EditorProps = {
  value: string
  onChange: (value: string) => void
}

/**
 * Normalizes markdown:
 * 1. Converts task lists into plain bullet lists
 * 2. Prevents list merging issues between ul and ol
 */
const normalizeMarkdown = (markdown: string): string => {
  if (!markdown) return markdown

  const lines = markdown.split("\n")
  const normalized: string[] = []

  let lastLineWasListItem = false
  let lastListType: "ul" | "ol" | null = null

  for (const line of lines) {
    const trimmedLine = line.trim()

    let currentListType: "ul" | "ol" | null = null

    /**
     * Convert task list items into normal bullet lists
     * - [ ] item → - item
     * - [x] item → - item
     */
    if (/^\s*[*+-]\s+\[[ xX]\]\s+/.test(line)) {
      const cleanedLine = line.replace(/^\s*[*+-]\s+\[[ xX]\]\s+/, "- ")

      normalized.push(cleanedLine)

      lastLineWasListItem = true
      lastListType = "ul"

      continue
    }

    // unordered list
    if (/^[*+-]\s+/.test(trimmedLine)) {
      currentListType = "ul"
    }
    // ordered list
    else if (/^\d+\.\s+/.test(trimmedLine)) {
      currentListType = "ol"
    }

    // insert blank line between different list types
    if (
      lastLineWasListItem &&
      currentListType &&
      lastListType &&
      currentListType !== lastListType
    ) {
      if (normalized[normalized.length - 1] !== "") {
        normalized.push("")
      }
    }

    normalized.push(line)

    lastLineWasListItem = currentListType !== null

    if (currentListType) {
      lastListType = currentListType
    }

    if (trimmedLine === "") {
      lastLineWasListItem = false
    }
  }

  return normalized.join("\n")
}

const Editor = ({ value, onChange }: EditorProps) => {
  const editorRef = useRef<MDXEditorMethods>(null)

  const handleChange = (newMarkdown: string) => {
    const normalized = normalizeMarkdown(newMarkdown)
    onChange(normalized)
  }

  return (
    <div className="editor-container mx-auto w-sm rounded-2xl border border-neutral-800 bg-neutral-900/40 md:w-3xl lg:w-5xl">
      <MDXEditor
        ref={editorRef}
        markdown={value}
        onChange={handleChange}
        placeholder="type your content here..."
        suppressHtmlProcessing
        className="dark-theme-editor"
        plugins={[
          headingsPlugin(),
          quotePlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),

          toolbarPlugin({
            toolbarClassName: "editor-toolbar-sticky",
            toolbarContents: () => (
              <>
                <UndoRedo />

                <Separator />

                <BoldItalicUnderlineToggles />

                <Separator />

                <BlockTypeSelect />

                <Separator />

                <ListsToggle />

                <Separator />

                <CreateLink />
                <InsertThematicBreak />
              </>
            ),
          }),
        ]}
      />
    </div>
  )
}

export default Editor
