import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { logger } from "@/lib/logger"

import { Button } from "@/components/ui/button"
import Editor from "@/components/custom/Editor"
import { useEffect, useState, type ChangeEvent } from "react"
import { getNote, updateNote } from "@/services/note.service"
import { FieldError } from "@/components/ui/field"
import Spinner from "@/components/custom/Spinner"
import { Input } from "@/components/ui/input"

const EditNotePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  // Warn if note ID is missing
  if (!id) {
    logger.warn({}, "Edit note page opened without note ID")
  }

  const handleSaveChanges = async () => {
    setError("")

    if (!content) {
      alert("Please write something")
      return
    }

    setIsUpdating(true)

    try {
      // change the function here
      const response = await updateNote(id as string, title, content)

      if (response.status === 200) {
        logger.info({ noteId: id }, "Note updated successfully")
        navigate("/user/notes")
      }
    } catch (error: any) {
      logger.error(
        { error: error.message, noteId: id },
        "Failed to update note"
      )
      setError(error.response.data.message)
    } finally {
      setIsUpdating(false)
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
      {/* create note header */}
      <header className="fixed top-4 left-1/2 z-50 flex w-sm -translate-x-1/2 items-center justify-between gap-4 rounded-full bg-secondary/30 px-4 py-3 outline outline-border backdrop-blur-md sm:w-xl md:w-3xl lg:w-5xl">
        {/* Go Back */}
        <Button
          type="button"
          onClick={handleGoBack}
          className="flex items-center justify-center bg-transparent text-foreground hover:bg-secondary"
          size="icon"
        >
          <ArrowLeft size={18} />
        </Button>

        {/* Title */}
        <Input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="flex-1 border-none bg-transparent text-lg font-semibold text-foreground focus-visible:ring-0"
          placeholder="Note title..."
        />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {error && <FieldError>{error}</FieldError>}

          <Button
            type="button"
            className="flex cursor-pointer items-center gap-2"
            onClick={handleSaveChanges}
            disabled={isUpdating}
          >
            {isUpdating && <Spinner />}
            Save Changes
          </Button>
        </div>
      </header>

      {/* Editor */}
      {isLoading ? (
        <Spinner />
      ) : (
        <Editor value={content} onChange={setContent} />
      )}
    </section>
  )
}

export default EditNotePage
