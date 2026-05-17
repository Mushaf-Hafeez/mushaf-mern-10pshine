import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { logger } from "@/lib/logger"

import { Button } from "@/components/ui/button"
import Editor from "@/components/custom/Editor"
import { useEffect, useState } from "react"
import { getNote, updateNote } from "@/services/note.service"
import { FieldError } from "@/components/ui/field"
import Spinner from "@/components/custom/Spinner"

const EditNotePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [content, setContent] = useState<string>("")
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id

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
      const response = await updateNote(id as string, content)

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
    <section className="h-screen w-full bg-neutral-900 pt-30 pb-10 text-white">
      {/* create note header */}
      <header className="fixed top-4 left-1/2 z-50 flex w-sm -translate-x-1/2 items-center justify-between rounded-full bg-neutral-800/30 px-6 py-4 outline outline-neutral-800 backdrop-blur-md sm:w-xl md:w-3xl lg:w-5xl">
        <Button
          className="cursor-pointer bg-neutral-700"
          size={"icon"}
          onClick={handleGoBack}
        >
          <ArrowLeft />
        </Button>
        <div className="flex items-center gap-2">
          {error && <FieldError>{error}</FieldError>}

          <Button
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
