import dayjs from "dayjs"
import { CheckCircle, Trash2 } from "lucide-react"
import relativeTime from "dayjs/plugin/relativeTime"

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
import { deleteNote } from "@/services/note.service"
import { useState } from "react"

dayjs.extend(relativeTime)

interface NoteProp {
  id: string
  content: string
  createdAt: Date
  removeNote: (id: string) => void
}

const Note = ({ id, content, createdAt, removeNote }: NoteProp) => {
  const [open, setOpen] = useState<boolean>(false)
  const fromNow = dayjs().to(dayjs(new Date(createdAt).toLocaleDateString()))

  const handleDelete = async (noteId: string) => {
    try {
      const response = await deleteNote(noteId)

      if (response.status === 200) {
        removeNote(noteId)
        setOpen(false)
      }
    } catch (error) {
      console.log("error is: ", error)
    }
  }

  return (
    <li
      className="group mb-4 flex h-fit cursor-pointer break-inside-avoid flex-col justify-between gap-4 rounded-2xl bg-neutral-800/30 p-6 outline outline-neutral-800 transition-all duration-200 hover:outline-primary md:px-8"
      onClick={() => console.log("note clicked")}
    >
      <div className="markdown-revert">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <div className="flex items-center justify-between text-neutral-400">
        <div className="flex items-center gap-2">
          <CheckCircle size={14} />
          <p className="text-[10px]">{fromNow}</p>
        </div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Trash2
              size={20}
              className="transition-all duration-200 hover:text-red-500/70"
              onClick={(e) => {
                e.stopPropagation()
                console.log("note deleted")
              }}
            />
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-neutral-800">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                note from our servers.
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
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  )
}

export default Note
