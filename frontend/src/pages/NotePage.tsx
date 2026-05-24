import { Button } from "@/components/ui/button"
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
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { logger } from "@/lib/logger"
import { deleteNote, getNote } from "@/services/note.service"

import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

const NotePage = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>()
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [error, setError] = useState<string>()

  const navigate = useNavigate()
  const params = useParams()
  const id = params.id

  if (!id) {
    logger.warn({}, "Edit note page opened without note ID")
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleDelete = async (noteId: string) => {
    try {
      const response = await deleteNote(noteId)

      if (response.status === 200) {
        logger.info({ noteId }, "Note deleted successfully")
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

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true)
      try {
        const response = await getNote(id as string)

        if (response.status === 200) {
          setTitle(response.data.note.title)
          setContent(response.data.note.content)
        }
      } catch (error: any) {
        logger.error(
          { error: error.message, noteId: id },
          "Failed to fetch note"
        )
        setError(error.response.data.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNote()
  }, [id])

  return (
    <section className="h-screen w-full bg-card pt-30 pb-10 text-foreground">
      <header className="fixed top-4 left-1/2 z-50 flex w-sm -translate-x-1/2 items-center justify-between gap-4 rounded-full bg-secondary/30 px-6 py-4 outline outline-border backdrop-blur-md sm:w-xl md:w-3xl lg:w-5xl">
        <div className="flex items-center gap-2">
          <Button
            className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80"
            size={"icon"}
            onClick={handleGoBack}
          >
            <ArrowLeft />
          </Button>

          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="bg-card text-foreground transition-all duration-200 hover:bg-secondary"
          >
            <Link
              to={`/notes/edit/${id}`}
              className="flex items-center gap-2 px-4 py-2"
            >
              Edit
            </Link>
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant={"destructive"}
                className="cursor-pointer px-4 py-2"
              >
                Delete
              </Button>
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
                  onClick={() => handleDelete(id)}
                  className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <div className="markdown-revert editor-container mx-auto w-sm rounded-2xl border border-border bg-card/40 p-8 md:w-3xl lg:w-5xl">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1(props) {
              return (
                <h1 className="mb-4 text-4xl font-bold text-foreground">
                  {props.children}
                </h1>
              )
            },
            h2(props) {
              return (
                <h2 className="mb-3 text-3xl font-semibold text-foreground">
                  {props.children}
                </h2>
              )
            },
            h3(props) {
              return (
                <h3 className="mb-3 text-2xl font-medium text-foreground">
                  {props.children}
                </h3>
              )
            },
            p(props) {
              return (
                <p className="mb-4 leading-7 break-words text-foreground">
                  {props.children}
                </p>
              )
            },
            ul(props) {
              return (
                <ul className="mb-4 list-disc space-y-2 pl-6 text-foreground">
                  {props.children}
                </ul>
              )
            },
            ol(props) {
              return (
                <ol className="mb-4 list-decimal space-y-2 pl-6 text-foreground">
                  {props.children}
                </ol>
              )
            },
            li(props) {
              return <li>{props.children}</li>
            },
            blockquote(props) {
              return (
                <blockquote className="mb-4 border-l-4 border-border pl-4 text-muted-foreground italic">
                  {props.children}
                </blockquote>
              )
            },
            code(props) {
              return (
                <code className="rounded bg-card px-1.5 py-1 font-mono text-sm break-words whitespace-pre-wrap text-foreground">
                  {props.children}
                </code>
              )
            },
            pre(props) {
              return (
                <pre className="mb-4 max-w-full overflow-x-auto rounded-xl bg-background p-4">
                  {props.children}
                </pre>
              )
            },
            table(props) {
              return (
                <div className="mb-4 overflow-x-auto rounded-xl border border-border">
                  <table className="w-full border-collapse text-left">
                    {props.children}
                  </table>
                </div>
              )
            },
            thead(props) {
              return (
                <thead className="bg-secondary text-foreground">
                  {props.children}
                </thead>
              )
            },
            tbody(props) {
              return <tbody>{props.children}</tbody>
            },
            tr(props) {
              return (
                <tr className="border-b border-border">{props.children}</tr>
              )
            },
            td(props) {
              return (
                <td className="px-4 py-3 text-foreground">{props.children}</td>
              )
            },
            a(props) {
              return (
                <a
                  href={props.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  {props.children}
                </a>
              )
            },
            hr() {
              return <hr className="my-6 border-border" />
            },
            img(props) {
              return (
                <img
                  src={props.src}
                  alt={props.alt || "image"}
                  className="my-4 max-w-full rounded-xl"
                />
              )
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </section>
  )
}

export default NotePage
