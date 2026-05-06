import { useEffect, useState } from "react"
import { Grid2X2, Plus } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/custom/Spinner"
import Note from "@/components/custom/Note"

import { getNotes } from "@/services/note.service"
import { Link } from "react-router-dom"

interface User {
  _id: string
  name: string
  email: string
  profile_pic: string
  createdAt: Date
  updatedAt: Date
  __v: number
}

interface Note {
  _id: string
  content: string
  user: User
  createdAt: Date
  updatedAt: Date
  __v: number
}

const Notes = () => {
  const [isGrid, setIsGrid] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [notes, setNotes] = useState<Note[] | null>()
  const [error, setError] = useState<string | null>(null)

  const removeNote = (id: string) => {
    const filteredNotes = notes?.filter((note) => note._id !== id)
    setNotes(filteredNotes)
  }

  useEffect(() => {
    const fetchNotes = async () => {
      setError(null)
      setIsLoading(true)
      try {
        const response = await getNotes()

        if (response.status === 200) {
          setNotes(response.data.notes)
        }
      } catch (error: any) {
        console.log("error is: ", error)
        setError(error.response.data.message || "Something went wrong.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotes()
  }, [])

  return (
    <section className="min-h-screen w-full overflow-y-auto bg-neutral-900 text-white">
      <div className="flex w-full items-center justify-between gap-2 border-b border-neutral-800 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            size={"icon-lg"}
            className="cursor-pointer bg-transparent transition-all duration-200 hover:bg-neutral-800"
            asChild
          >
            <SidebarTrigger />
          </Button>

          <h2 className="text-lg font-medium">My Notes</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to={"/notes/create"}>
              <Plus />
              Create Note
            </Link>
          </Button>
          <Button
            variant={isGrid ? "default" : "outline"}
            onClick={() => setIsGrid((prev) => !prev)}
            className={`cursor-pointer transition-all duration-200 ${!isGrid ? "bg-neutral-800/30 text-neutral-400 hover:text-white" : "hover:bg-primary/80"} `}
          >
            <Grid2X2 />
            Grid
          </Button>
        </div>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul
          className={`space-y-4 p-6 ${isGrid && "columns-2 gap-4 md:columns-3 lg:columns-4"}`}
        >
          {notes && notes.length > 0
            ? notes.map((note) => {
                return (
                  <Note
                    key={note._id}
                    id={note._id}
                    content={note.content}
                    createdAt={note.createdAt}
                    removeNote={removeNote}
                  />
                )
              })
            : "No notes yet."}
        </ul>
      )}
    </section>
  )
}

export default Notes
