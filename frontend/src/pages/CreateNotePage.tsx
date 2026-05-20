import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { logger } from "@/lib/logger"

import { Button } from "@/components/ui/button"
import Editor from "@/components/custom/Editor"
import { useState, type ChangeEvent } from "react"
import { createNote } from "@/services/note.service"
import { FieldError } from "@/components/ui/field"
import Spinner from "@/components/custom/Spinner"
import { Input } from "@/components/ui/input"

const CreateNotePage = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleSave = async () => {
    setError("")
    setIsSaving(true)

    try {
      const response = await createNote(title, content)

      if (response.status === 201) {
        logger.info(
          { noteId: response.data.note._id },
          "Note created successfully"
        )
        setContent("")
        navigate("/user/notes")
      }
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to create note")
      setError(error.response.data.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="h-screen w-full bg-card pt-30 pb-10 text-foreground">
      {/* header */}
      <header className="fixed top-4 left-1/2 z-50 flex w-sm -translate-x-1/2 items-center justify-between gap-4 rounded-full bg-secondary/30 px-6 py-4 outline outline-border backdrop-blur-md sm:w-xl md:w-3xl lg:w-5xl">
        <Button
          className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80"
          size={"icon"}
          onClick={handleGoBack}
        >
          <ArrowLeft />
        </Button>

        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Title here..."
          className="border-none bg-transparent text-lg font-semibold text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
        />

        <div className="flex items-center gap-2">
          {error && <FieldError>{error}</FieldError>}

          <Button
            className="flex cursor-pointer items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving && <Spinner />}
            Save
          </Button>
        </div>
      </header>

      {/* Editor */}
      <Editor value={content} onChange={setContent} />
    </section>
  )
}

export default CreateNotePage
