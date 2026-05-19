import dayjs from "dayjs"
import { CheckCircle, Edit2, EllipsisVertical, Trash2 } from "lucide-react"
import relativeTime from "dayjs/plugin/relativeTime"
import { logger } from "@/lib/logger"

import remarkGfm from "remark-gfm"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { deleteNote } from "@/services/note.service"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"

dayjs.extend(relativeTime)

interface NoteProp {
  id: string
  title: string
  content: string
  createdAt: Date
  removeNote: (id: string) => void
}

const Note = ({
  id,
  title = "Heading",
  content,
  createdAt,
  removeNote,
}: NoteProp) => {
  const [open, setOpen] = useState<boolean>(false)

  const navigate = useNavigate()

  const fromNow = dayjs().to(dayjs(createdAt))

  const averageWordsPerMinute = 200
  const averageWordsPerSecond = averageWordsPerMinute / 60

  const textOnlyContent = content
    .replace(/[#_*~`>\-\[\]\(\)]/g, "")
    .replace(/\n/g, " ")

  const wordCount = textOnlyContent.split(/\s+/).filter(Boolean).length

  const totalSeconds = Math.ceil(wordCount / averageWordsPerSecond)

  let readingTimeText = ""

  if (totalSeconds < 60) {
    readingTimeText = `${totalSeconds} sec read`
  } else if (totalSeconds < 3600) {
    const minutes = Math.ceil(totalSeconds / 60)
    readingTimeText = `${minutes} min read`
  } else {
    const hours = Math.ceil(totalSeconds / 3600)
    readingTimeText = `${hours} hr read`
  }

  const goToNotePage = (id: string) => {
    navigate(`/notes/${id}`)
  }

  const handleDelete = async (noteId: string) => {
    try {
      const response = await deleteNote(noteId)

      if (response.status === 200) {
        logger.info({ noteId }, "Note deleted successfully")

        removeNote(noteId)
        setOpen(false)
      }
    } catch (error) {
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          noteId,
        },
        "Failed to delete note"
      )
    }
  }

  return (
    <li
      onClick={() => goToNotePage(id)}
      className="group flex h-87.5 w-full min-w-0 cursor-pointer break-inside-avoid flex-col justify-between gap-4 overflow-hidden rounded-2xl bg-secondary/30 p-6 outline outline-border transition-all duration-200 hover:outline-primary md:px-8"
    >
      <div className="flex w-full items-start justify-between gap-2">
        <h2 className="line-clamp-2 min-w-0 flex-1 text-2xl font-semibold wrap-break-word text-foreground">
          {title}
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size={"icon"}
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 cursor-pointer bg-card text-muted-foreground transition-all duration-200 hover:text-foreground"
            >
              <EllipsisVertical size={20} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-30 border-border bg-card! text-foreground"
          >
            <DropdownMenuGroup className="space-y-2 p-1">
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded text-foreground! hover:bg-secondary focus:bg-secondary"
              >
                <Link
                  to={`/notes/edit/${id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 p-2"
                >
                  <Edit2 size={18} />
                  Edit
                </Link>
              </DropdownMenuItem>

              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex w-full cursor-pointer items-center gap-2 rounded p-2 text-sm text-red-400 transition-all duration-200 hover:bg-secondary"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="border-border bg-card text-foreground">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Note?</AlertDialogTitle>

                    <AlertDialogDescription className="text-muted-foreground">
                      This action cannot be undone. This will permanently delete
                      your note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="border-0 bg-card">
                    <AlertDialogCancel className="cursor-pointer border-border bg-card text-foreground hover:bg-secondary">
                      Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(id)
                      }}
                      className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="markdown-revert min-w-0 flex-1 overflow-hidden wrap-break-word">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            p(props) {
              return (
                <p className="mb-2 line-clamp-4 overflow-hidden text-ellipsis">
                  {props.children}
                </p>
              )
            },

            h1(props) {
              return (
                <h1 className="line-clamp-2 text-xl font-bold">
                  {props.children}
                </h1>
              )
            },

            h2(props) {
              return (
                <h2 className="line-clamp-2 text-lg font-semibold">
                  {props.children}
                </h2>
              )
            },

            h3(props) {
              return (
                <h3 className="line-clamp-2 text-base font-medium">
                  {props.children}
                </h3>
              )
            },

            ul(props) {
              return (
                <ul className="line-clamp-5 list-disc overflow-hidden pl-5">
                  {props.children}
                </ul>
              )
            },

            ol(props) {
              return (
                <ol className="line-clamp-5 list-decimal overflow-hidden pl-5">
                  {props.children}
                </ol>
              )
            },

            li(props) {
              return <li className="truncate">{props.children}</li>
            },

            code(props) {
              return (
                <code className="rounded bg-card px-1 py-0.5 text-sm break-words whitespace-pre-wrap">
                  {props.children}
                </code>
              )
            },

            pre(props) {
              return (
                <pre className="line-clamp-4 max-w-full overflow-hidden rounded-lg bg-card p-4">
                  {props.children}
                </pre>
              )
            },

            table(props) {
              return (
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full overflow-hidden text-sm">
                    {props.children}
                  </table>
                </div>
              )
            },

            img() {
              return null
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle size={14} />
          <p>{fromNow}</p>
        </div>
        <p>{readingTimeText}</p>
      </div>
    </li>
  )
}

export default Note
