import { useEffect, useState } from "react"
import { Grid2X2, Plus } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Link } from "react-router-dom"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

import Spinner from "@/components/custom/Spinner"
import Note from "@/components/custom/Note"

import { getNotes } from "@/services/note.service"

export interface User {
  _id: string
  name: string
  email: string
  profile_pic: string
  createdAt: Date
  updatedAt: Date
  __v: number
}

interface NoteType {
  _id: string
  content: string
  user: User
  createdAt: Date
  updatedAt: Date
  __v: number
}

const Notes = () => {
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isGrid, setIsGrid] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [initialLoading, setInitialLoading] = useState<boolean>(true)

  const [notes, setNotes] = useState<NoteType[]>([])
  const [error, setError] = useState<string | null>(null)

  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note._id !== id))
  }

  const fetchNotes = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await getNotes(page, 10)

      if (response.status === 200) {
        setNotes((prev) => [...prev, ...response.data.notes])

        setHasMore(response.data.hasMore)

        setPage((prev) => prev + 1)
      }
    } catch (error: any) {
      console.log("error is: ", error)

      setError(error?.response?.data?.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  if (initialLoading) {
    return (
      <section className="flex min-h-screen w-full items-center justify-center bg-neutral-900">
        <Spinner />
      </section>
    )
  }

  return (
    <section className="min-h-screen w-full bg-neutral-900 text-white">
      <div className="sticky top-0 z-10 flex w-full items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-900 px-6 py-4">
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
            className={`cursor-pointer transition-all duration-200 ${
              !isGrid
                ? "bg-neutral-800/30 text-neutral-400 hover:text-white"
                : "hover:bg-primary/80"
            }`}
          >
            <Grid2X2 />
            Grid
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-6">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!error && notes.length === 0 ? (
        <div className="p-6">
          <p>No notes yet.</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={notes.length}
          next={fetchNotes}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          }
          endMessage={
            <p className="pb-2 text-center text-neutral-400">
              All items loaded.
            </p>
          }
        >
          <ul
            className={`p-6 ${
              isGrid ? "columns-1 gap-4 sm:columns-2 md:columns-3" : "space-y-4"
            }`}
          >
            {notes.map((note) => (
              <Note
                key={note._id}
                id={note._id}
                content={note.content}
                createdAt={note.createdAt}
                removeNote={removeNote}
              />
            ))}
          </ul>
        </InfiniteScroll>
      )}
    </section>
  )
}

export default Notes
