import dayjs from "dayjs"
import { CheckCircle, Edit2, Trash2 } from "lucide-react"
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

import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { deleteNote } from "@/services/note.service"
import { useState } from "react"
import { Link } from "react-router-dom"

dayjs.extend(relativeTime)

interface NoteProp {
  id: string
  title: string
  content: string
  createdAt: Date
  removeNote: (id: string) => void
}

const Note = ({ id, title, content, createdAt, removeNote }: NoteProp) => {
  const [open, setOpen] = useState<boolean>(false)
  const fromNow = dayjs().to(dayjs(new Date(createdAt).toLocaleDateString()))

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
    <li className="group mb-4 flex h-fit cursor-pointer break-inside-avoid flex-col justify-between gap-4 rounded-2xl bg-neutral-800/30 p-6 outline outline-neutral-800 transition-all duration-200 hover:outline-primary md:px-8">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="markdown-revert">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {content}
        </ReactMarkdown>
      </div>
      <div className="flex items-center justify-between text-neutral-400">
        <div className="flex items-center gap-2">
          <CheckCircle size={14} />
          <p className="text-[10px]">{fromNow}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={`/notes/edit/${id}`}
            className="transition-all duration-200 hover:text-white"
          >
            <Edit2 size={20} />
          </Link>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Trash2
                size={20}
                // className="transition-all duration-200 hover:text-red-500/70"
                className="transition-all duration-200 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              />
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-neutral-800">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-neutral-400">
                  This action cannot be undone. This will permanently delete
                  your note from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="border-0 bg-neutral-800">
                <AlertDialogCancel className="cursor-pointer ring-0 hover:text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(id)}
                  variant={"destructive"}
                  className="cursor-pointer"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </li>
  )
}

export default Note
