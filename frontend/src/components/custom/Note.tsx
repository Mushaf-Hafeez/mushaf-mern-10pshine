import dayjs from "dayjs"
import { CheckCircle, Trash2 } from "lucide-react"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const Note = ({ content, createdAt }: { content: string; createdAt: Date }) => {
  const fromNow = dayjs().to(dayjs(new Date(createdAt).toLocaleDateString()))

  return (
    <li
      className="group mb-4 flex h-fit cursor-pointer break-inside-avoid flex-col justify-between gap-4 rounded-2xl bg-neutral-800/30 p-6 outline outline-neutral-800 transition-all duration-200 hover:outline-primary md:px-8"
      onClick={() => console.log("note clicked")}
    >
      <p className="max-w-full text-lg font-semibold transition-all duration-200 group-hover:text-primary md:text-xl">
        {content}
      </p>
      <div className="flex items-center justify-between text-neutral-400">
        <div className="flex items-center gap-2">
          <CheckCircle size={14} />
          <p className="text-[10px]">{fromNow}</p>
        </div>
        <Trash2
          size={20}
          className="transition-all duration-200 hover:text-red-500/70"
          onClick={(e) => {
            e.stopPropagation()
            console.log("note deleted")
          }}
        />
      </div>
    </li>
  )
}

export default Note
