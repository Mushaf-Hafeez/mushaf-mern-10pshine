import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import Editor from "@/components/custom/Editor"
import { useState } from "react"
import { createNote } from "@/services/note.service"
import { FieldError } from "@/components/ui/field"
import Spinner from "@/components/custom/Spinner"

const CreateNotePage = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [content, setContent] = useState<string>("")
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleSave = async () => {
    setError("")

    if (!content) {
      alert("Please write something")
    }

    setIsSaving(true)

    try {
      const response = await createNote(content)

      if (response.status === 201) {
        setContent("")
        navigate("/user/notes")
      }
    } catch (error: any) {
      console.log("error is: ", error)
      setError(error.response.data.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="min-h-screen w-full bg-neutral-900 pt-30 pb-10 text-white">
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
